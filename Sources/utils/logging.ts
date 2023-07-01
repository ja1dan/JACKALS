/**
 * JACKALS - Jaidan's Awesome Cool Kick Ass Local Service
 * https://github.com/ja1dan/JACKALS
 * utils/ip.ts
 * Copyright (c) Jaidan 2022-
 **/

/**
 * Make text green.
 * @param {string} tg String to make green
 * @returns {string} Green string
 */
let green = (tg: string) => `\x1b[32m${tg}\x1b[0m`

/**
 * Make text gray.
 * @param {string} tg String to make gray
 * @returns {string} Gray string
 */
let gray = (tg: string) => `\x1b[90m${tg}\x1b[0m`

/**
 * Make text red.
 * @param {string} tr String to make red
 * @returns {string} Red string
 */
let red = (tr: string) => `\x1b[31m${tr}\x1b[0m`

/**
 * Log information.
 * @param {str} text String to log
 */
const log = (text: string) => console.log(`${gray('[')}${green('*')}${gray(']')} ${text}`)
/**
 * Log an error.
 * @param {str} text String to log
 */
const logError = (text: string) => console.log(`${gray('[')}${red('!')}${gray(']')} ERROR: ${text}`)

export {
  log,
  logError
}
