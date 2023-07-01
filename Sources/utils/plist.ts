/**
 * JACKALS - Jaidan's Awesome Cool Kick Ass Local Service
 * https://github.com/ja1dan/JACKALS
 * utils/plist.ts
 * Copyright (c) Jaidan 2022-
 **/

// IMPORTS
import { execSync } from 'child_process'
import { writeFileSync } from 'fs'
import { logError, yellow } from './utils'

/**
 * Generate plist manifest to install a signed IPA file.
 * @param {string} localIP local IP of the device running JACKALS
 * @param {string} bundleID bundleID of the app to be installed
 * @param {string} name name of the app to be installed
 */
const generatePlist = (localIP: string, bundleID: string, name: string) => {
  try {
    // create folder for manifests (if we haven't already)
    execSync(`mkdir -p ${__dirname}/../../build/manifests`, { stdio: 'ignore' })
    // create plist raw
    let plistRaw = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>items</key>
	<array>
		<dict>
			<key>assets</key>
			<array>
				<dict>
					<key>kind</key>
					<string>software-package</string>
					<key>url</key>
					<string>https://${localIP}:5555/Signed-IPAs/${name.replace(' ', '-')}.ipa</string>
				</dict>
				<dict>
					<key>kind</key>
					<string>display-image</string>
					<key>url</key>
					<string>https://${localIP}:5555/img/logo.png</string>
				</dict>
				<dict>
					<key>kind</key>
					<string>full-size-image</string>
					<key>url</key>
					<string>https://${localIP}:5555/img/logo.png</string>
				</dict>
			</array>
			<key>metadata</key>
			<dict>
				<key>bundle-identifier</key>
				<string>${bundleID}</string>
				<key>bundle-version</key>
				<string>1</string>
				<key>kind</key>
				<string>software</string>
				<key>title</key>
				<string>${name}</string>
			</dict>
		</dict>
	</array>
</dict>
</plist>
`
    // write plist to file
    writeFileSync(`${__dirname}/../../build/manifests/${name.replace(' ', '-')}.plist`, plistRaw)
  } catch (e) {
    logError(`Could not generate plist manifest for ${yellow(name)}. (${e})`)
  }
}

export { generatePlist }
