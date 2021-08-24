import TSBot from '../../classes/TSBot.js';
import { log } from '../../utils/log.js';

export const event = {
  name: 'message',
  once: false,
  execute: (tsbot: TSBot, message: string) => {
    log(message)
  }
}
