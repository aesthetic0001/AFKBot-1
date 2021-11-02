import express from 'express'
import { join } from 'path'
import { getPortPromise } from 'portfinder'
import { log } from '../utils/log.js'
const app = express()
const dirname = import.meta.url.replace('file:///', '')

export default async function initServer () {
  const port = await getPortPromise()
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.listen(port, () => {
    console.log(log(`Chat server started on https://localhost:${port}`))
  })

  app.get('/', (_, res) => {
    res.sendFile('index.html', {
      root: join(dirname, '..')
    })
  })

  app.post('/send', (req, _) => {
    console.log(req.body)
  })
}
