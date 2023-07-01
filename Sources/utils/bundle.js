"use strict";
/**
 * JACKALS - Jaidan's Awesome Cool Kick Ass Local Service
 * https://github.com/ja1dan/JACKALS
 * utils/bundle.ts
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
exports.extractBundleInfo = void 0;
// IMPORTS
var child_process_1 = require("child_process");
var fs_1 = require("fs");
var parse_1 = require("simple-plist/dist/parse");
var logging_1 = require("./logging");
// declare working directory
var workingDir = "".concat(__dirname, "/../../build");
var addSlashes = function (str) { return str.replace(' ', '\\ '); };
/**
 * Extract bundle info from an IPA file.
 * @param {string} file name of the IPA file
 * @returns {string} bundle ID of the IPA
 */
var extractBundleInfo = function (file) { return __awaiter(void 0, void 0, void 0, function () {
    var name_1, appDir, plistFileRaw, info;
    return __generator(this, function (_a) {
        try {
            name_1 = file.split('.ipa')[0];
            // create temporary directory and extract IPA contents
            (0, child_process_1.execSync)("mkdir -p ".concat(workingDir, "/").concat(name_1, "_tmp_extract && unzip ").concat(workingDir, "/Signed-IPAs/signed-").concat(file.replace(' ', '-'), " -d ").concat(workingDir, "/").concat(addSlashes(name_1), "_tmp_extract"), { stdio: 'ignore' });
            appDir = (0, fs_1.readdirSync)("".concat(workingDir, "/").concat(name_1, "_tmp_extract/Payload"))
                .filter(function (fn) { return fn.endsWith('.app'); })[0];
            plistFileRaw = (0, fs_1.readFileSync)("".concat(workingDir, "/").concat(name_1, "_tmp_extract/Payload/").concat(appDir, "/Info.plist"));
            info = (0, parse_1.parse)(plistFileRaw);
            // remove tmp directory
            (0, child_process_1.execSync)("rm -rf ".concat(workingDir, "/").concat(addSlashes(name_1), "_tmp_extract"), {
                stdio: 'ignore'
            });
            // return bundle ID
            return [2 /*return*/, info["CFBundleIdentifier"]];
        }
        catch (e) {
            (0, logging_1.logError)("Could not extract bundle info from ".concat(file, ". (").concat(e, ")"));
        }
        return [2 /*return*/];
    });
}); };
exports.extractBundleInfo = extractBundleInfo;
