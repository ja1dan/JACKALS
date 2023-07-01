"use strict";
/**
 * JACKALS - Jaidan's Awesome Cool Kick Ass Local Service
 * https://github.com/ja1dan/JACKALS
 * utils/ip.ts
 * Copyright (c) Jaidan 2022-
 **/
exports.__esModule = true;
exports.localIP = void 0;
// credits to this stackoverflow answer: https://stackoverflow.com/a/8440736
// modified to fit this project's needs
// IMPORTS
var os_1 = require("os");
var nets = (0, os_1.networkInterfaces)();
var results = Object.create(null);
for (var _i = 0, _a = Object.keys(nets); _i < _a.length; _i++) {
    var name_1 = _a[_i];
    if (nets[name_1] != undefined) {
        for (var _b = 0, _c = nets[name_1]; _b < _c.length; _b++) {
            var net = _c[_b];
            var familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
            if (net.family === familyV4Value && !net.internal) {
                if (!results[name_1]) {
                    results[name_1] = [];
                }
                results[name_1].push(net.address);
            }
        }
    }
}
var localIP = results['en0'][0];
exports.localIP = localIP;
