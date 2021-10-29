import { existsSync, readFileSync, writeFileSync } from 'fs'
import { error, log } from '../utils/log.js'

export default class TSConfig {
  public config: Configuration

  init (): void {
    try {
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
          },
          reconnect: {
            'on-kick': 'false',
            timeout: '5000'
          }
        },
        log: {
          clear: 'true'
        }
      }, null, 2))

      this.resetConfig()
    } catch (err) {
      error(err)
    }
  }

  private assignConfig (): void {
    try {
      this.config = JSON.parse(readFileSync('config.json').toString())
    } catch (err) {
      error(err)
    }
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
    reconnect: {
      'on-kick': string,
      timeout: string
    }
  }
  log: {
    clear: string
  }
}
