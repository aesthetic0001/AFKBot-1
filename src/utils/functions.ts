import fetch from 'node-fetch'

async function sleep (ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function rndName (): Promise<string> {
  return JSON.parse(await (await fetch('https://apis.kahoot.it/namerator')).text()).name
}

export {
  sleep,
  rndName
}
