import express from 'express'
import http from 'http'
import * as socket from 'socket.io'
import { join } from 'path'
import { getPortPromise } from 'portfinder'
import { utils } from '../classes/TSBot.js'
import { log } from '../utils/log.js'
import { Vec3 } from 'vec3'
const app = express()
const serv = new http.Server(app)
const io = new socket.Server(serv)
const dirname = import.meta.url.replace('file:///', '')

export default async function initServer (): Promise<void> {
  // @ts-expect-error
  initServer.postChat = postChat
  // @ts-expect-error
  initServer.updatePos = updatePos
  // @ts-expect-error
  initServer.updateTime = updateTime

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

  function postChat (msg: string) {
    io.emit('post', msg)
  }

  function updatePos (pos: Vec3) {
    io.emit('pos', pos)
  }

  function updateTime (time: number) {
    io.emit('time', time)
  }
}