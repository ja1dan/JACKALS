"use strict";
/**
 * JACKALS - Jaidan's Awesome Cool Kick Ass Local Service
 * https://github.com/ja1dan/JACKALS
 * utils/ip.ts
 * Copyright (c) Jaidan 2022-
 **/
exports.__esModule = true;
exports.logError = exports.log = void 0;
/**
 * Make text green.
 * @param {string} tg String to make green
 * @returns {string} Green string
 */
var green = function (tg) { return "\u001B[32m".concat(tg, "\u001B[0m"); };
/**
 * Make text gray.
 * @param {string} tg String to make gray
 * @returns {string} Gray string
 */
var gray = function (tg) { return "\u001B[90m".concat(tg, "\u001B[0m"); };
/**
 * Make text red.
 * @param {string} tr String to make red
 * @returns {string} Red string
 */
var red = function (tr) { return "\u001B[31m".concat(tr, "\u001B[0m"); };
/**
 * Log information.
 * @param {str} text String to log
 */
var log = function (text) { return console.log("".concat(gray('[')).concat(green('*')).concat(gray(']'), " ").concat(text)); };
exports.log = log;
/**
 * Log an error.
 * @param {str} text String to log
 */
var logError = function (text) { return console.log("".concat(gray('[')).concat(red('!')).concat(gray(']'), " ERROR: ").concat(text)); };
exports.logError = logError;
