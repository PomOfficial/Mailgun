/**
 * @file index
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Dispatch
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */


import {CreatePlugin} from "@pomegranate/plugin-tools";
import {BetterMailPlugin} from "./Plugins/BetterMail";
import {MailTemplatePlugin} from "./Plugins/MailTemplates";


export const Plugin = CreatePlugin('application')
  .configuration({name: 'Mailgun'})
  .applicationPlugins([
    BetterMailPlugin,
    MailTemplatePlugin
  ])
