/**
 * JACKALS - Jaidan's Awesome Cool Kick Ass Local Service
 * https://github.com/ja1dan/JACKALS
 * build.js
 * Copyright (c) Jaidan 2022-
**/

// IMPORTS
import { execSync } from 'child_process'
import * as express from 'express'
import { existsSync, readdirSync, readFileSync } from 'fs'
import { createServer } from 'https'
import {
  extractBundleInfo,
  localIP,
  log,
  logError,
  yellow,
  generatePlist,
  signFile
} from './utils/utils'

// define express
const app = express()
const port = 5555

// cleanup function (removes build files)
const cleanup = () =>
  execSync(`rm -rf *_tmp_extract ${__dirname}/../build`, { stdio: 'ignore' })
// declare working directory (where the build files will be stored)
let workingDir = `${__dirname}/../build`
// declare the ipa file path, and filter out the .keep file
let files = readdirSync(`${__dirname}/../IPAs`)
let filteredFiles = files.filter((val) => {
  return val.endsWith('.ipa')
})
// start our webpage where the IPAs will go
let html = `<!DOCTYPE html>
<html>
<head>
    <title>JACKALS</title>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <link rel='apple-touch-icon' href='./img/logo.png'>
	<link rel='icon' href='./img/logo.png'>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            min-height: 90%;
        }
        html {
            height: 100%;
        }
        a {
            font-size: 20px;
        }
        div#bottom {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
        }
    </style>
</head>
<body>
    <h1>JACKALS</h1>
    <h2>Apps</h2>
    <ul>
`

// clean up build folder, just in case last run didn't exit cleanly
cleanup()

Promise.all(
  filteredFiles.map(async (file) => {
    // start timer
    let start = performance.now()
    // filter out name from IPA path
    let name = file.split('.ipa')[0]
    // sign the IPA
    await signFile(file, name)
    // get the bundleID from Info.plist
    let bundleID = await extractBundleInfo(file)
    // generate plist manifest
    generatePlist(localIP, bundleID, name)
    // host signed IPA
    app.get(`/signed-ipas/${name.replace(' ', '-')}.ipa`, (req, res) => {
      res.status(200).sendFile(
        `${workingDir}/Signed-IPAs/signed-${name.replace(' ', '-')}.ipa`
      )
    })
    // host manifest
    app.get(`/manifests/${name.replace(' ', '-')}.plist`, (req, res) => {
      res.status(200).sendFile(`${workingDir}/manifests/${name.replace(' ', '-')}.plist`)
    })
    // add to html
    html += `       <li>
            <a href='itms-services://?action=download-manifest&url=https://192.168.1.232:5555/manifests/${name.replace(' ', '-')}.plist'>${name}</a>
        </li>
`
    log(`Signed ${yellow(name)} in ${yellow(Math.round((performance.now() - start) / 1000).toString())} seconds.`)
  })
).then(() => {
  // finish off html
  html += `   </ul>
    <div id='bottom'>
        <center><p>jaidan's awesome cool kick ass local service<br>2022</p></center>
    </div>
</body>
</html>`
  // host html
  app.get('/', (req, res) => {
    res.send(html)
  })
  // host logo
  app.get('/img/logo.png', (req, res) => {
    if (existsSync(`${__dirname}/../Server-Files/logo.png`)) {
      res.status(200).sendFile(`${__dirname}/../Server-Files/logo.png`)
    } else {
      res.status(404)
    }
  })
  // log number of signed apps
  console.log('-----------------')
  log(`Successfully signed ${yellow(filteredFiles.length.toString())} applications.`)
  // fetch keys (for https)
  if (!existsSync(`${__dirname}/Server-Files/cert.pem`)) {
    logError(`Could not start server; missing ${yellow("Server-Files/cert.pem")}. See ${yellow("README.md")} for more info.`)
    cleanup()
    process.exit(1)
  }
  if (!existsSync(`${__dirname}/Server-Files/key.pem`)) {
    logError(`Could not start server; missing ${yellow("Server-Files/key.pem")}. See ${yellow("README.md")} for more info.`)
    cleanup()
    process.exit(1)
  }
  let privateKey = readFileSync(`${__dirname}/Server-Files/key.pem`)
  let certificate = readFileSync(`${__dirname}/Server-Files/cert.pem`)
  let credentials = { key: privateKey, cert: certificate }
  // start server
  createServer(credentials, app).listen(port, () => {
    log(`Listening -> ${yellow("https://" + localIP + ":" + port)}`)
  })
})

process.on('SIGINT', function() {
  console.log('')
  log('Cleaning up...')
  cleanup()
  process.exit()
})
