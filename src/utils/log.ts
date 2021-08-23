import colors from './colors.js'

function log (message: string) {
  console.log(` > ${colors.fg_blue}LOG${colors.reset} | ${message}`)
}

function error (error: Error) {
  console.log(` > ${colors.fg_red}ERROR${colors.reset} | ${error.message}`)
}

export {
  log,
  error
}
