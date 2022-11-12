const cp = require('child_process')
const fs = require('fs')
const plist = require('simple-plist')

let workingDir = `${__dirname}/../build`

const extractBundleInfo = async (file) => {
    let name = file.split(".ipa")[0];
    await cp.execSync(
        `mkdir -p ${workingDir}/${name}_tmp_extract && unzip ${workingDir}/signed-ipas/signed-${file} -d ${workingDir}/${name}_tmp_extract`,
        { stdio: 'ignore' }
    );
    let appDir = fs
        .readdirSync(`${workingDir}/${name}_tmp_extract/Payload`)
        .filter((fn) => fn.endsWith(".app"))[0];
    let plistFileRaw = fs.readFileSync(
        `${workingDir}/${name}_tmp_extract/Payload/${appDir}/Info.plist`
    );
    let info = plist.parse(plistFileRaw);
    await cp.execSync(`rm -rf ${workingDir}/${name}_tmp_extract`, {
        stdio: 'ignore',
    });
    return info.CFBundleIdentifier;
};

module.exports = { extractBundleInfo }