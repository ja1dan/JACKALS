"use strict";
/**
 * JACKALS - Jaidan's Awesome Cool Kick Ass Local Service
 * https://github.com/ja1dan/JACKALS
 * utils/utils.ts
 * Copyright (c) Jaidan 2022-
 **/
exports.__esModule = true;
exports.signFile = exports.generatePlist = exports.logError = exports.log = exports.localIP = exports.extractBundleInfo = void 0;
// IMPORTS
var bundle_1 = require("./bundle");
exports.extractBundleInfo = bundle_1.extractBundleInfo;
var ip_1 = require("./ip");
exports.localIP = ip_1.localIP;
var logging_1 = require("./logging");
exports.log = logging_1.log;
exports.logError = logging_1.logError;
var plist_1 = require("./plist");
exports.generatePlist = plist_1.generatePlist;
var sign_1 = require("./sign");
exports.signFile = sign_1.signFile;
