const cp = require("child_process");
const express = require("express");
const fs = require("fs");
const plist = require("simple-plist");
const https = require("https");
const { networkInterfaces } = require("os");

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        const familyV4Value = typeof net.family === "string" ? "IPv4" : 4;
        if (net.family === familyV4Value && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}

const localIP = results["en0"][0];
const app = express();
const port = 5555;

let workingDir = `${__dirname}/build`
let html =
    "<!DOCTYPE html>\n<html>\n<head>\n\t<title>Signer</title>\n</head>\n<body>\n\t<h1>Signer</h1>\n\t<ul>\n";
let files = fs.readdirSync(`${__dirname}/ipas`);
let num = 0;

cp.execSync(`rm -rf *_tmp_extract ${__dirname}/build`, { stdio: "ignore" });

const makeBundleID = () => `com.${Math.floor(Math.random() * 900 + 100)}.${Math.floor(Math.random() * 9000 + 1000)}`

const extractBundleInfo = async (file) => {
    let name = file.split(".ipa")[0];
    await cp.execSync(
        `mkdir -p ${workingDir}/${name}_tmp_extract && unzip ${workingDir}/signed-ipas/signed-${file} -d ${workingDir}/${name}_tmp_extract`,
        { stdio: "ignore" }
    );
    let appDir = fs
        .readdirSync(`${workingDir}/${name}_tmp_extract/Payload`)
        .filter((fn) => fn.endsWith(".app"))[0];
    let plistFileRaw = fs.readFileSync(
        `${workingDir}/${name}_tmp_extract/Payload/${appDir}/Info.plist`
    );
    let info = plist.parse(plistFileRaw);
    await cp.execSync(`rm -rf ${workingDir}/${name}_tmp_extract`, {
        stdio: "ignore",
    });
    return [info.CFBundleIdentifier, info.CFBundleName];
};

const signFile = async (file, name) => {
    console.log(`[*] Signing ${name}...`);
    await cp.execSync(`mkdir -p ${workingDir}/manifests`, { stdio: "ignore" });
    await cp.execSync(
        `mkdir -p ${workingDir}/signed-ipas && ${__dirname}/cert-files/zsign -k ${__dirname}/cert-files/cert.p12 -p $(cat ${__dirname}/cert-files/pass.txt) -m ${__dirname}/cert-files/cert.mobileprovision -b '${makeBundleID()}' -o ${workingDir}/signed-ipas/signed-${name}.ipa ${__dirname}/ipas/${file}`,
        { stdio: "ignore" }
    );
};

const generatePlist = (bundleID, name) => {
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
					<string>https://${localIP}:5555/signed-ipas/${name}.ipa</string>
				</dict>
				<dict>
					<key>kind</key>
					<string>display-image</string>
					<key>url</key>
					<string>https://jailbreaks.app/img/Jailbreaks.png</string>
				</dict>
				<dict>
					<key>kind</key>
					<string>full-size-image</string>
					<key>url</key>
					<string>https://jailbreaks.app/img/Jailbreaks.png</string>
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
`;
    fs.writeFileSync(`${__dirname}/build/manifests/${name}.plist`, plistRaw);
};

Promise.all(files.filter((val) => {return val.endsWith('.ipa')}).map(async file => {
    num++
    let name = file.split('.ipa')[0]
    await signFile(file, name)
    let [bundleID, appName] = await extractBundleInfo(file)
    generatePlist(bundleID, name)
    app.get(`/signed-ipas/${name}.ipa`, (req, res) => {
        res.status(200).sendFile(`${workingDir}/signed-ipas/signed-${name}.ipa`)
    })

    app.get(`/manifests/${name}.plist`, (req, res) => {
        res.status(200).sendFile(`${workingDir}/manifests/${name}.plist`)
    })

    html += `\t\t<li><a href="itms-services://?action=download-manifest&url=https://192.168.1.232:5555/manifests/${name}.plist">${name}</a></li>\n`
})).then(() => {
    html += "\t</ul>\n</body>\n</html>";
    app.get("/", (req, res) => {
        res.send(html)
    })
    console.log(`-----------------\n[*] Successfully signed ${num} applications.`);
    console.log('[*] Creating server...')
    let privateKey = fs.readFileSync(`${__dirname}/server-files/key.pem`)
    let certificate = fs.readFileSync(`${__dirname}/server-files/cert.pem`)
    let credentials = { key: privateKey, cert: certificate }
    https.createServer(credentials, app).listen(port, () => {
        console.log("[*] Listening -> https://" + localIP + ":" + port)
    })
})

process.on("SIGINT", function () {
    cp.execSync(`rm -rf *_tmp_extract ${__dirname}/build`, { stdio: "ignore" });
    process.exit()
})