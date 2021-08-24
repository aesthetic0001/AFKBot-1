import { existsSync, readFileSync, writeFileSync } from 'fs'
import { log } from '../utils/log.js'

export default class TSConfig {
  public config: Configuration

  init (): void {
    if (existsSync('config.json')) {
      this.assignConfig()
      return
    }

    writeFileSync('config.json', JSON.stringify({
      minecraft: {
        account: {
          username: 'Bot',
          password: ''
        },
        server: {
          host: 'localhost',
          port: ''
        }
      }
    }, null, 2))

    this.resetConfig()
  }

  private assignConfig (): void {
    this.config = JSON.parse(readFileSync('config.json').toString())
  }

  private resetConfig (): void {
    log('Config file created, please fill it and restart the program')
    process.exit(0)
  }
}

interface Configuration {
  minecraft: {
    account: {
      username: string
      password: string
    }
    server: {
      host: string
      port: string
    }
  }
}
