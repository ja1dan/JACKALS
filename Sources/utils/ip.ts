/**
 * JACKALS - Jaidan's Awesome Cool Kick Ass Local Service
 * https://github.com/ja1dan/JACKALS
 * utils/ip.ts
 * Copyright (c) Jaidan 2022-
 **/

// credits to this stackoverflow answer: https://stackoverflow.com/a/8440736
// modified to fit this project's needs

// IMPORTS
import { networkInterfaces } from 'os'

const nets = networkInterfaces()
const results = Object.create(null)

for (const name of Object.keys(nets)) {
  if (nets[name] != undefined) {
    for (const net of nets[name]) {
      const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
      if (net.family === familyV4Value && !net.internal) {
        if (!results[name]) {
          results[name] = []
        }
        results[name].push(net.address)
      }
    }
  }
}

const localIP = results['en0'][0]

export { localIP }
