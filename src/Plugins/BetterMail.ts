/**
 * @file BetterMail
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Mailgun
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {CreatePlugin} from "@pomegranate/plugin-tools";
import Bluebird from 'bluebird'
import MailComposer from 'nodemailer/lib/mail-composer'
import Mailgun from 'mailgun-js'

export class BetterMail {
  sendMail: any
  senderName: string
  mg: Mailgun.Mailgun
  senderAddress: string
  sender: any
  constructor(options, sendMail){
    this.sendMail = sendMail
    this.mg = Mailgun({apiKey: options.apiKey, domain: options.domain})
    this.senderName = options.senderName
    this.senderAddress = options.senderAddress
    this.sender = Bluebird.promisifyAll(this.mg.messages());
  }

  compose(data: any){
    let opts = {
      from: {name: this.senderName, address: this.senderAddress},
      to: data.address,
      subject: data.subject,
      text: data.text,
      html: data.html
    }

    let mc: any = new MailComposer(opts)

    return new Promise((resolve, reject) => {
      mc.compile().build((err, message) => {
        if(err){
          reject(err)
        }
        resolve(message)
      })
    })
  }

  send(payload){
    return this.compose(payload)
      .then((composedEmail) => {
        if(this.sendMail){

          return this.sender.sendMimeAsync({
            to: payload.address,
            message: composedEmail.toString()
          })
        }

        console.log(payload)
        console.log('**********************************************************');
        console.log(payload.text);
        console.log('**********************************************************');
        return true


      })
  }
}

class MailerCache{
  senders: Map<string, any>
  constructor(){
    this.senders = new Map()
  }

  add(key, item){
    this.senders.set(key, item)
  }
  use(key){
    return this.senders.get(key)
  }
}

export const BetterMailPlugin = CreatePlugin('anything')
  .configuration({
    name: 'BetterMail',
    injectableParam: 'BetterMail',
  })
  .variables({
    accounts: [
      {
        param: 'tnm',
        apiKey: 'asdfghjkls',
        domain: 'example.com',
        senderName: '',
        senderAddress: ''
      }
    ],
    sendMail: true
  })
  .hooks({
    load: async (Injector, PluginVariables, PluginFiles, PluginLogger,PluginLateError, RabbitMQ, PluginStore) => {
      let mc = new MailerCache()
      let sendMail = PluginVariables.sendMail
      if(!sendMail){
        PluginLogger.warn('BetterMail is running in dev mode, emails will not be sent.')
      }

      PluginVariables.accounts.reduce((acc, item) => {
        mc.add(item.param, new BetterMail(item, sendMail))
        return acc
      }, mc)

      return mc
    },
    start: (BetterMail, PluginLogger) => {
      PluginLogger.warn(BetterMail)
    }
  })