const cp = require('child_process');
const express = require('express');
const fs = require('fs');
const https = require('https');
const { extractBundleInfo, localIP, generatePlist, signFile } = require('./utils/utils.js')

const app = express();
const port = 5555;

const cleanup = () => cp.execSync(`rm -rf *_tmp_extract ${__dirname}/build`, { stdio: 'ignore' });

let workingDir = `${__dirname}/build`
let files = fs.readdirSync(`${__dirname}/ipas`);
let filteredFiles = files.filter((val) => { return val.endsWith('.ipa')})
let html = `<!DOCTYPE html>
<html>
<head>
    <title>JACKALS</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="apple-touch-icon" href="./img/jackal.png">
	<link rel="icon" href="./img/jackal.png">
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

cleanup()

Promise.all(filteredFiles.map(async file => {
    let name = file.split('.ipa')[0]
    await signFile(file, name)
    let bundleID = await extractBundleInfo(file)
    generatePlist(localIP, bundleID, name)
    app.get(`/signed-ipas/${name}.ipa`, (req, res) => {
        res.status(200).sendFile(`${workingDir}/signed-ipas/signed-${name}.ipa`)
    })

    app.get(`/manifests/${name}.plist`, (req, res) => {
        res.status(200).sendFile(`${workingDir}/manifests/${name}.plist`)
    })

    html += `       <li>
            <a href="itms-services://?action=download-manifest&url=https://192.168.1.232:5555/manifests/${name}.plist">${name}</a>
        </li>
`
})).then(() => {
    html += `   </ul>
    <div id="bottom">
        <center><p>jaidan's awesome cool kick ass local service<br>2022</p></center>
    </div>
</body>
</html>`;
    app.get('/', (req, res) => {
        res.send(html)
    })
    app.get('/img/jackal.png', (req, res) => {
        res.status(200).sendFile(`${__dirname}/server-files/jackal.png`)
    })
    console.log(`-----------------\n[*] Successfully signed ${filteredFiles.length} applications.`);
    let privateKey = fs.readFileSync(`${__dirname}/server-files/key.pem`)
    let certificate = fs.readFileSync(`${__dirname}/server-files/cert.pem`)
    let credentials = { key: privateKey, cert: certificate }
    https.createServer(credentials, app).listen(port, () => {
        console.log('[*] Listening -> https://' + localIP + ':' + port)
    })
})

process.on('SIGINT', function () {
    cleanup()
    process.exit()
})