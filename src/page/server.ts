import express from 'express'
import http from 'http'
import * as socket from 'socket.io'
import { join } from 'path'
import { getPortPromise } from 'portfinder'
import { utils } from '../classes/TSBot.js'
import { log } from '../utils/log.js'
import TSConfig from '../classes/TSConfig.js'
import open from 'open'
const app = express()
const serv = new http.Server(app)
const io = new socket.Server(serv)
const dirname = import.meta.url.replace('file:///', '')

async function initServer (config: TSConfig): Promise<void> {
  const port = await getPortPromise()
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.get('/', (_, res) => {
    res.sendFile('index.html', { root: join(dirname, '..') })
  })

  io.on('connection', (socket) => {
    socket.on('msg', (msg: string) => {
      if (msg.startsWith(config.config.page['commands-prefix'])) return handleCommand(msg)
      utils.sendChat(msg)
    })
  })

  serv.listen(port, async () => {
    log(`Chat server started on http://localhost:${port}`)
    if (config.config.page['auto-open'] === 'true') await open(`http://localhost:${port}`)
  })
}

function handleCommand (msg: string): void {
  const command = {
    cmd: msg.split(' ')[0],
    content: msg.split(' ').slice(1).join(' ')
  }

  utils.emitBotEvent(command.cmd, command)
}

const servUtils = {
  emitEvent: (event: string, ...args: any[]): void => { io.emit(event, ...args) }
}

export {
  initServer,
  servUtils
}
