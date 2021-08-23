import colors from './colors.js'

function log (message: string): void {
  console.log(` > ${colors.fg_blue}LOG${colors.reset} | ${message}`)
}

function error (error: Error): void {
  console.log(` > ${colors.fg_red}ERROR${colors.reset} | ${error.message}`)
}

export {
  log,
  error
}
