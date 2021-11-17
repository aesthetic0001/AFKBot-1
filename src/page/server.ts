import express from 'express'
import http from 'http'
import * as socket from 'socket.io'
import { join } from 'path'
import { getPortPromise } from 'portfinder'
import { utils } from '../classes/TSBot.js'
import { log } from '../utils/log.js'
const app = express()
const serv = new http.Server(app)
const io = new socket.Server(serv)
const dirname = import.meta.url.replace('file:///', '')

async function initServer (): Promise<void> {
  const port = await getPortPromise()
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.get('/', (_, res) => {
    res.sendFile('index.html', { root: join(dirname, '..') })
  })

  io.on('connection', (socket) => {
    socket.on('msg', (msg: string) => {
      utils.sendChat(msg)
    })
  })

  serv.listen(port, () => {
    log(`Chat server started on https://localhost:${port}`)
  })
}

const servUtils = {
  emitEvent: (event: string, ...args: any[]): void => {
    io.emit(event, ...args)
  }
}

export {
  initServer,
  servUtils
}
