/**
 * JACKALS - Jaidan's Awesome Cool Kick Ass Local Service
 * https://github.com/ja1dan/JACKALS
 * utils/sign.ts
 * Copyright (c) Jaidan 2022-
 **/

// IMPORTS
import { execSync } from 'child_process'
import { existsSync } from 'fs'
import { log, logError, yellow } from './utils'

// declare working directory
let workingDir = `${__dirname}/../../build`

const addSlashes = (str: string) => str.replace(' ', '\\ ')

/**
 * Generate a random bundleID (to prevent blacklisting).
 * @returns {string} a random bundle ID, with the format of com.<random 3 digits>.<random 4 digits>
 */
const makeBundleID = () =>
  `com.${Math.floor(Math.random() * 900 + 100)}.${Math.floor(Math.random() * 9000 + 1000)}`

/**
 * Sign an IPA file.
 * @param {string} file IPA file name
 * @param {string} name name of app to sign
 */
const signFile = async (file: string, name: string) => {
  // check if necessary files exist
  if (!existsSync(`${__dirname}/../../Cert-Files/zsign`)) {
    logError('zsign not found. Please place zsign in the Cert-Files directory.')
    process.exit(1)
  }
  if (!existsSync(`${__dirname}/../../Cert-Files/cert.mobileprovision`)) {
    logError('MobileProvision file not found. Please see README.md.')
    process.exit(1)
  }
  if (!existsSync(`${__dirname}/../../Cert-Files/cert.p12`)) {
    logError('Certificate file not found. Please see README.md.')
    process.exit(1)
  }
  if (!existsSync(`${__dirname}/../../Cert-Files/pass.txt`)) {
    logError('Certificate password file not found. Please see README.md.')
    process.exit(1)
  }
  try {
    // log that we're signing the file
    log(`Signing ${name}...`)
    // sign the IPA and output it to build/Signed-IPAs
    execSync(
      `mkdir -p ${workingDir}/Signed-IPAs && ${__dirname}/../../Cert-Files/zsign -k ${__dirname}/../../Cert-Files/cert.p12 -p $(cat ${__dirname}/../../Cert-Files/pass.txt) -m ${__dirname}/../../Cert-Files/cert.mobileprovision -b '${makeBundleID()}' -o ${workingDir}/Signed-IPAs/signed-${name.replace(' ', '-')}.ipa ${__dirname}/../../IPAs/${addSlashes(file)}`,
      { stdio: 'ignore' }
    )
  } catch (e) {
    logError(`Could not sign ${yellow(name)}. (${e})`)
  }
}

export { signFile }
