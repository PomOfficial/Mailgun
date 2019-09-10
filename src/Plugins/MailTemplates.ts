/**
 * @file MailTemplates
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Mailgun
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {CreatePlugin} from "@pomegranate/plugin-tools";
import Bluebird from 'bluebird'
import {compose, filter, first, difference, keys, isEmpty, reduce} from 'lodash/fp'
import {compileFile} from 'pug'

const filterJsIndex = compose(first, filter((i: any) => i.filename === 'index.js'))
const filterPugIndex = compose(first, filter((i: any) => i.filename === 'index.pug'))
const validJs = compose(isEmpty, difference(['expects', 'subject', 'body']), keys)

const templateCache = new Map<string, any>()

class templateBuilder {
  pugCompiler: any
  expects: string[]
  generateSubject: (templateData: any) => string
  generateBody: (templateData: any) => string

  constructor(pugPath: string, transformers: any) {
    this.pugCompiler = compileFile(pugPath)
    this.expects = transformers.expects
    this.generateSubject = transformers.subject
    this.generateBody = transformers.body
  }

  compile(payload) {
    let templateData = payload.templateData
    let diff = difference(this.expects, keys(templateData))
    let valid = isEmpty(diff)
    if (!valid) {
      throw new Error(`templateBuilder missing required properties: ${diff.join(',')}`)
    }
    if(!payload.address){
      throw new Error('payload is missing address prop.')
    }
    return {
      address: payload.address,
      subject: this.generateSubject(templateData),
      text: this.generateBody(templateData),
      html: this.pugCompiler(templateData)
    }
  }
}

class MailTemplate {

  address: string
  subject: string
  text: string
  html: string

  constructor(payload: any){
    let template = templateCache.get(payload.template)
    let generated = template.compile(payload)
    this.address = generated.address
    this.subject = generated.subject
    this.text = generated.text
    this.html = generated.html
  }
}

export const MailTemplatePlugin = CreatePlugin('anything')
  .configuration({
    name: 'MailTemplates',
    injectableParam: 'MailTemplate',
  })
  .directories(['templates', 'helpers', 'mixins'])
  .variables({})
  .hooks({
    load: async (PluginFiles) => {
      let pf = PluginFiles('templates')
      let files = await pf.fileList({directories: true})
      let rawTemplateData = await Bluebird.map(files, async (f: any) => {
        let templateFiles = await pf.ctors.fileList(f.path)()

        let tJS = filterJsIndex(templateFiles)
        let tPug = filterPugIndex(templateFiles)
        if (!tJS) {
          throw new Error('Mail Templates require an index.js file in their directory')
        }
        if (!tPug) {
          throw new Error('Mail Templates require an index.pug file in their directory')
        }

        let transformers = require(tJS.path)
        if (!validJs(transformers)) {
          throw new Error('template index file must export expects, subject and body properties.')
        }

        // return transformers
        return [f.filename,transformers, tPug.path]

      })

      reduce((acc, [key, transformers, pugPath]) => {
        // console.log(key)
        // console.log(transformers)
        // console.log(pugPath)
        acc.set(key, new templateBuilder(pugPath, transformers))
        return acc
      }, templateCache, rawTemplateData)
      // console.log(rawTemplateData)
      return MailTemplate
    }

  })