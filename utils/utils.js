const { extractBundleInfo } = require('./bundle')
const { localIP } = require('./ip')
const { generatePlist } = require('./plist')
const { signFile } = require('./sign')

module.exports = {
    extractBundleInfo, localIP, generatePlist, signFile
}