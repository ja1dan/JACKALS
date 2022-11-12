const cp = require('child_process')

let workingDir = `${__dirname}/../build`

const makeBundleID = () => `com.${Math.floor(Math.random() * 900 + 100)}.${Math.floor(Math.random() * 9000 + 1000)}`

const signFile = async (file, name) => {
    console.log(`[*] Signing ${name}...`);
    await cp.execSync(`mkdir -p ${workingDir}/manifests`, { stdio: 'ignore' });
    await cp.execSync(
        `mkdir -p ${workingDir}/signed-ipas && ${__dirname}/../cert-files/zsign -k ${__dirname}/../cert-files/cert.p12 -p $(cat ${__dirname}/../cert-files/pass.txt) -m ${__dirname}/../cert-files/cert.mobileprovision -b '${makeBundleID()}' -o ${workingDir}/signed-ipas/signed-${name}.ipa ${__dirname}/../ipas/${file}`,
        { stdio: 'ignore' }
    );
};

module.exports = { signFile}