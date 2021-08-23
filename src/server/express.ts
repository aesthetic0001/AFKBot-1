import express from 'express'
import { dirname, join } from 'path'
import { log } from '../utils/log.js'
const app = express()
const port = 8080
const __dirname = dirname(new URL(import.meta.url).pathname).slice(1, dirname(new URL(import.meta.url).pathname).length)

export default class TSServer {
  init = (): void => {
    const listener = app.listen(port, () => {
      // @ts-ignore
      log(`WebServer hosted in https://${listener.address().address}:${listener.address().port}`)
      this.get()
    })
  }

  get (): void {
    app.use(express.static(join(__dirname, 'public')))
    app.get('/', (_, res) => {
      res.sendFile(join(__dirname, 'public/html', 'index.html'))
    })
  }
}
