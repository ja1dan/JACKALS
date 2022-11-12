/**
 * JACKALS - Jaidan's Awesome Cool Kick Ass Local Service
 * https://github.com/ja1dan/JACKALS
 * utils/utils.js
 * Copyright (c) Jaidan 2022-
 **/

// IMPORTS
const { extractBundleInfo } = require('./bundle')
const { localIP } = require('./ip')
const { generatePlist } = require('./plist')
const { signFile } = require('./sign')

module.exports = {
	extractBundleInfo,
	localIP,
	generatePlist,
	signFile,
}
