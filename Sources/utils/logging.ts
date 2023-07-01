/**
 * JACKALS - Jaidan's Awesome Cool Kick Ass Local Service
 * https://github.com/ja1dan/JACKALS
 * utils/ip.ts
 * Copyright (c) Jaidan 2022-
 **/

// IMPORTS
import * as c from 'colorette'
import pino from 'pino';
import pretty from 'pino-pretty';

const stream = pretty({
  colorize: true,

  messageFormat: "\x1B[37m{msg}"
})
const logger = pino(stream)

// Reset
let reset = "\x1B[37m"

/**
 * Make text gray.
 * @param {string} text String to make gray
 * @returns {string} Gray string
 */
let gray = (text: string) => {
  return c.gray(text) + reset
}

/**
 * Make text yellow.
 * @param {string} text String to make yellow
 * @returns {string} Yellow string
 */
let yellow = (text: string) => {
  return c.yellow(text) + reset
}

/**
 * Make text blue.
 * @param {string} text String to make blue
 * @returns {string} Blue string
 */
let blue = (text: string) => {
  return c.blue(text) + reset
}

/**
 * Make text bold.
 * @param {string} text String to make bold
 * @returns {string} Bold string
 */
let bold = (text: string) => {
  return c.bold(text) + reset
}

/**
 * Log information.
 * @param {str} text String to log
 */
const log = (text: string) => logger.info(text)
/**
 * Log an error.
 * @param {str} text String to log
 */
const logError = (text: string) => logger.error(text)

export {
  log,
  logError,
  gray,
  yellow,
  blue,
  bold
}
