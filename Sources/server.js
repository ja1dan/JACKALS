"use strict";
/**
 * JACKALS - Jaidan's Awesome Cool Kick Ass Local Service
 * https://github.com/ja1dan/JACKALS
 * build.js
 * Copyright (c) Jaidan 2022-
**/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
// IMPORTS
var child_process_1 = require("child_process");
var express = require("express");
var fs_1 = require("fs");
var https_1 = require("https");
var utils_1 = require("./utils/utils");
// define express
var app = express();
var port = 5555;
// cleanup function (removes build files)
var cleanup = function () {
    return (0, child_process_1.execSync)("rm -rf *_tmp_extract ".concat(__dirname, "/../build"), { stdio: 'ignore' });
};
// declare working directory (where the build files will be stored)
var workingDir = "".concat(__dirname, "/../build");
// declare the ipa file path, and filter out the .keep file
var files = (0, fs_1.readdirSync)("".concat(__dirname, "/../IPAs"));
var filteredFiles = files.filter(function (val) {
    return val.endsWith('.ipa');
});
// start our webpage where the IPAs will go
var html = "<!DOCTYPE html>\n<html>\n<head>\n    <title>JACKALS</title>\n    <meta name='viewport' content='width=device-width, initial-scale=1'>\n    <link rel='apple-touch-icon' href='./img/logo.png'>\n\t<link rel='icon' href='./img/logo.png'>\n    <style>\n        body {\n            font-family: -apple-system, BlinkMacSystemFont, sans-serif;\n            min-height: 90%;\n        }\n        html {\n            height: 100%;\n        }\n        a {\n            font-size: 20px;\n        }\n        div#bottom {\n            position: fixed;\n            bottom: 0;\n            left: 0;\n            right: 0;\n        }\n    </style>\n</head>\n<body>\n    <h1>JACKALS</h1>\n    <h2>Apps</h2>\n    <ul>\n";
// clean up build folder, just in case last run didn't exit cleanly
cleanup();
Promise.all(filteredFiles.map(function (file) { return __awaiter(void 0, void 0, void 0, function () {
    var start, name, bundleID;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                start = performance.now();
                name = file.split('.ipa')[0];
                // sign the IPA
                return [4 /*yield*/, (0, utils_1.signFile)(file, name)
                    // get the bundleID from Info.plist
                ];
            case 1:
                // sign the IPA
                _a.sent();
                return [4 /*yield*/, (0, utils_1.extractBundleInfo)(file)
                    // generate plist manifest
                ];
            case 2:
                bundleID = _a.sent();
                // generate plist manifest
                (0, utils_1.generatePlist)(utils_1.localIP, bundleID, name);
                // host signed IPA
                app.get("/signed-ipas/".concat(name.replace(' ', '-'), ".ipa"), function (req, res) {
                    res.status(200).sendFile("".concat(workingDir, "/Signed-IPAs/signed-").concat(name.replace(' ', '-'), ".ipa"));
                });
                // host manifest
                app.get("/manifests/".concat(name.replace(' ', '-'), ".plist"), function (req, res) {
                    res.status(200).sendFile("".concat(workingDir, "/manifests/").concat(name.replace(' ', '-'), ".plist"));
                });
                // add to html
                html += "       <li>\n            <a href='itms-services://?action=download-manifest&url=https://192.168.1.232:5555/manifests/".concat(name.replace(' ', '-'), ".plist'>").concat(name, "</a>\n        </li>\n");
                (0, utils_1.log)("Signed ".concat(name, " in ").concat(Math.round((performance.now() - start) / 1000), " seconds."));
                return [2 /*return*/];
        }
    });
}); })).then(function () {
    // finish off html
    html += "   </ul>\n    <div id='bottom'>\n        <center><p>jaidan's awesome cool kick ass local service<br>2022</p></center>\n    </div>\n</body>\n</html>";
    // host html
    app.get('/', function (req, res) {
        res.send(html);
    });
    // host logo
    app.get('/img/logo.png', function (req, res) {
        if ((0, fs_1.existsSync)("".concat(__dirname, "/../Server-Files/logo.png"))) {
            res.status(200).sendFile("".concat(__dirname, "/../Server-Files/logo.png"));
        }
        else {
            res.status(404);
        }
    });
    // log number of signed apps
    console.log('-----------------');
    (0, utils_1.log)("Successfully signed ".concat(filteredFiles.length, " applications."));
    // fetch keys (for https)
    if (!(0, fs_1.existsSync)("".concat(__dirname, "/Server-Files/cert.pem"))) {
        (0, utils_1.logError)('Could not start server; missing Server-Files/cert.pem. See README.md for more info.');
        cleanup();
        process.exit(1);
    }
    if (!(0, fs_1.existsSync)("".concat(__dirname, "/Server-Files/key.pem"))) {
        (0, utils_1.logError)('Could not start server; missing Server-Files/key.pem. See README.md for more info.');
        cleanup();
        process.exit(1);
    }
    var privateKey = (0, fs_1.readFileSync)("".concat(__dirname, "/Server-Files/key.pem"));
    var certificate = (0, fs_1.readFileSync)("".concat(__dirname, "/Server-Files/cert.pem"));
    var credentials = { key: privateKey, cert: certificate };
    // start server
    (0, https_1.createServer)(credentials, app).listen(port, function () {
        (0, utils_1.log)('Listening -> https://' + utils_1.localIP + ':' + port);
    });
});
process.on('SIGINT', function () {
    console.log('');
    (0, utils_1.log)('Cleaning up...');
    cleanup();
    process.exit();
});
