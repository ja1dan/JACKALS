"use strict";
/**
 * JACKALS - Jaidan's Awesome Cool Kick Ass Local Service
 * https://github.com/ja1dan/JACKALS
 * utils/plist.ts
 * Copyright (c) Jaidan 2022-
 **/
exports.__esModule = true;
exports.generatePlist = void 0;
// IMPORTS
var child_process_1 = require("child_process");
var fs_1 = require("fs");
var utils_1 = require("./utils");
/**
 * Generate plist manifest to install a signed IPA file.
 * @param {string} localIP local IP of the device running JACKALS
 * @param {string} bundleID bundleID of the app to be installed
 * @param {string} name name of the app to be installed
 */
var generatePlist = function (localIP, bundleID, name) {
    try {
        // create folder for manifests (if we haven't already)
        (0, child_process_1.execSync)("mkdir -p ".concat(__dirname, "/../../build/manifests"), { stdio: 'ignore' });
        // create plist raw
        var plistRaw = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">\n<plist version=\"1.0\">\n<dict>\n\t<key>items</key>\n\t<array>\n\t\t<dict>\n\t\t\t<key>assets</key>\n\t\t\t<array>\n\t\t\t\t<dict>\n\t\t\t\t\t<key>kind</key>\n\t\t\t\t\t<string>software-package</string>\n\t\t\t\t\t<key>url</key>\n\t\t\t\t\t<string>https://".concat(localIP, ":5555/Signed-IPAs/").concat(name.replace(' ', '-'), ".ipa</string>\n\t\t\t\t</dict>\n\t\t\t\t<dict>\n\t\t\t\t\t<key>kind</key>\n\t\t\t\t\t<string>display-image</string>\n\t\t\t\t\t<key>url</key>\n\t\t\t\t\t<string>https://").concat(localIP, ":5555/img/logo.png</string>\n\t\t\t\t</dict>\n\t\t\t\t<dict>\n\t\t\t\t\t<key>kind</key>\n\t\t\t\t\t<string>full-size-image</string>\n\t\t\t\t\t<key>url</key>\n\t\t\t\t\t<string>https://").concat(localIP, ":5555/img/logo.png</string>\n\t\t\t\t</dict>\n\t\t\t</array>\n\t\t\t<key>metadata</key>\n\t\t\t<dict>\n\t\t\t\t<key>bundle-identifier</key>\n\t\t\t\t<string>").concat(bundleID, "</string>\n\t\t\t\t<key>bundle-version</key>\n\t\t\t\t<string>1</string>\n\t\t\t\t<key>kind</key>\n\t\t\t\t<string>software</string>\n\t\t\t\t<key>title</key>\n\t\t\t\t<string>").concat(name, "</string>\n\t\t\t</dict>\n\t\t</dict>\n\t</array>\n</dict>\n</plist>\n");
        // write plist to file
        (0, fs_1.writeFileSync)("".concat(__dirname, "/../../build/manifests/").concat(name.replace(' ', '-'), ".plist"), plistRaw);
    }
    catch (e) {
        (0, utils_1.logError)("Could not generate plist manifest for ".concat(name, ". (").concat(e, ")"));
    }
};
exports.generatePlist = generatePlist;
