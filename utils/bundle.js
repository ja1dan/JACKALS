/**
 * JACKALS - Jaidan's Awesome Cool Kick Ass Local Service
 * https://github.com/ja1dan/JACKALS
 * utils/bundle.js
 * Copyright (c) Jaidan 2022-
 **/

// IMPORTS
const cp = require('child_process')
const fs = require('fs')
const plist = require('simple-plist')
const { logError } = require('./logging')

// declare working directory
let workingDir = `${__dirname}/../build`

const addSlashes = (str) => str.replace(' ', '\\ ')

/**
 * Extract bundle info from an IPA file.
 * @param {string} file name of the IPA file
 * @returns {string} bundle ID of the IPA
 */
const extractBundleInfo = async (file) => {
    try {
		// get name of IPA from filename
		let name = file.split('.ipa')[0]
		// create temporary directory and extract IPA contents
		await cp.execSync(
			`mkdir -p ${workingDir}/${name}_tmp_extract && unzip ${workingDir}/signed-ipas/signed-${file.replace(' ', '-')} -d ${workingDir}/${addSlashes(name)}_tmp_extract`,
			{ stdio: 'ignore' }
		)
		// find .app file
		let appDir = fs
			.readdirSync(`${workingDir}/${name}_tmp_extract/Payload`)
			.filter((fn) => fn.endsWith('.app'))[0]
		// read the plist file
		let plistFileRaw = fs.readFileSync(
			`${workingDir}/${name}_tmp_extract/Payload/${appDir}/Info.plist`
		)
		// parse plist file
		let info = plist.parse(plistFileRaw)
		// remove tmp directory
		await cp.execSync(`rm -rf ${workingDir}/${addSlashes(name)}_tmp_extract`, {
			stdio: 'ignore',
		})
		// return bundle ID
		return info.CFBundleIdentifier
	} catch (e) {
        logError(`Could not extract bundle info from ${file}. (${e})`)
    }
}

module.exports = { extractBundleInfo }
