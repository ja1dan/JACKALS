/**
 * JACKALS - Jaidan's Awesome Cool Kick Ass Local Service
 * https://github.com/ja1dan/JACKALS
 * utils/sign.js
 * Copyright (c) Jaidan 2022-
 **/

// IMPORTS
const cp = require('child_process')

// declare working directory
let workingDir = `${__dirname}/../build`

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
const signFile = async (file, name) => {
    // log that we're signing the file
	console.log(`[*] Signing ${name}...`)
    // sign the IPA and output it to build/signed-ipas
	await cp.execSync(
		`mkdir -p ${workingDir}/signed-ipas && ${__dirname}/../cert-files/zsign -k ${__dirname}/../cert-files/cert.p12 -p $(cat ${__dirname}/../cert-files/pass.txt) -m ${__dirname}/../cert-files/cert.mobileprovision -b '${makeBundleID()}' -o ${workingDir}/signed-ipas/signed-${name}.ipa ${__dirname}/../ipas/${file}`,
		{ stdio: 'ignore' }
	)
}

module.exports = { signFile }
