import express from 'express'
import { dirname, join } from 'path'
import { log } from '../utils/log.js'
const app = express()
const port = 8080
const directory = dirname(new URL(import.meta.url).pathname).slice(1, dirname(new URL(import.meta.url).pathname).length)

export default class TSServer {
  init = (): void => {
    const listener = app.listen(port, () => {
      // @ts-expect-error
      log(`WebServer hosted in https://${listener.address().address}:${listener.address().port}`)
      this.get()
    })
  }

  get (): void {
    app.use(express.static(join(directory, 'public')))
    app.get('/', (_, res) => {
      res.sendFile(join(directory, 'public/html', 'index.html'))
    })
  }
}
