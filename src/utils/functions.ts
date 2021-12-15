import fetch from 'node-fetch'
import { readFileSync } from 'fs'
import { log } from './log.js'

async function sleep (ms: number): Promise<void> {
  return await new Promise(resolve => setTimeout(resolve, ms))
}

async function rndName (): Promise<string> {
  return JSON.parse(await (await fetch('https://apis.kahoot.it/namerator')).text()).name
}

async function newUpdate (): Promise<void> {
  const res = JSON.parse(await (await fetch('https://api.github.com/repos/amoraschi/AFKBot/releases')).text())
  const pkg = JSON.parse(readFileSync('./package.json').toString())
  if (parseInt(res[0].tag_name.replace(/\./g, '')) > parseInt(pkg.version.replace(/\./g, ''))) {
    log(`Found new version: ${res[0].tag_name as string} (https://github.com/amoraschi/AFKBot/releases/latest)
    You can download it directly here: https://github.com/amoraschi/AFKBot/releases/latest/download/AFKBot.zip`)
  }
}

export {
  sleep,
  rndName,
  newUpdate
}
