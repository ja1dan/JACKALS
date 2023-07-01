/**
 * JACKALS - Jaidan's Awesome Cool Kick Ass Local Service
 * https://github.com/ja1dan/JACKALS
 * utils/bundle.ts
 * Copyright (c) Jaidan 2022-
 **/

// IMPORTS
import { execSync } from 'child_process'
import { readdirSync, readFileSync } from 'fs'
import { parse } from 'simple-plist/dist/parse'
import { logError } from './logging'

// declare working directory
let workingDir = `${__dirname}/../../build`

const addSlashes = (str: string) => str.replace(' ', '\\ ')

/**
 * Extract bundle info from an IPA file.
 * @param {string} file name of the IPA file
 * @returns {string} bundle ID of the IPA
 */
const extractBundleInfo = async (file: string) => {
  try {
    // get name of IPA from filename
    let name = file.split('.ipa')[0]
    // create temporary directory and extract IPA contents
    execSync(
      `mkdir -p ${workingDir}/${name}_tmp_extract && unzip ${workingDir}/Signed-IPAs/signed-${file.replace(' ', '-')} -d ${workingDir}/${addSlashes(name)}_tmp_extract`,
      { stdio: 'ignore' }
    )
    // find .app file
    let appDir = readdirSync(`${workingDir}/${name}_tmp_extract/Payload`)
      .filter((fn) => fn.endsWith('.app'))[0]
    // read the plist file
    let plistFileRaw = readFileSync(
      `${workingDir}/${name}_tmp_extract/Payload/${appDir}/Info.plist`
    )
    // parse plist file
    let info = parse(plistFileRaw)
    // remove tmp directory
    execSync(`rm -rf ${workingDir}/${addSlashes(name)}_tmp_extract`, {
      stdio: 'ignore',
    })
    // return bundle ID
    return info["CFBundleIdentifier"]
  } catch (e) {
    logError(`Could not extract bundle info from ${file}. (${e})`)
  }
}

export { extractBundleInfo }
