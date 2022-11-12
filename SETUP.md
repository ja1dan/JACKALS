# Setup

## Dependencies
You can install the node dependencies of this project by running `npm i`.

## Certificate files setup
1. Clone https://github.com/zhlynn/zsign to a separate folder and follow the compilation instructions in that README for your specific OS
2. Place the compiled `zsign` binary in the `cert-files/` folder of this repository
3. Place mobile provision file in `cert-files/` with the filename `cert.mobileprovision`
4. Place certificate `p12` file in `cert-files/` with the filename `cert.p12`
5. If your certificate has a password, make a text file called `pass.txt` with the password in it and place it in `cert-files/`
6. Otherwise, make the text file but keep it empty and move it to `cert-files/`

## Server files setup
1. Install `mkcert` using brew, apt, or your preferred package manager
2. Run `mkcert -install` to create a local CA
3. Run `mkcert {IP ADDRESS YOU WANT TO ACCESS THE PAGE WITH}`
4. Move the file that ends with `-key.pem` to `server-files/` with the name `key.pem`
5. Move the remaining file that ends with `.pem` to `server-files/` with the name `cert.pem`
6. Optionally, you can put a logo file in `server-files/` with the name `logo.png`. This image will be the icon of your apps while they are installing.

Since Apple has severely cracked down on installing 3rd party apps, you need to trust your CA on your device in order for your device to even *download* the IPA. You can do this by doing the following:
1. Run `mkcert -CAROOT`
2. Go to the directory that is outputted
3. Upload the `rootCA.pem` file to the device(s) that you are trying to install your signed apps on
4. Install and trust the certificate
5. Go to Settings/About/Certificate Trust Settings
6. Under `Enable Full Trust For Root Certificates`, enable the toggle that starts with `mkcert`

## IPAs
The hard part is finally over. The server is entirely set up to sign apps and install them on your device. The last step is to pick the apps that you're signing! Apps that you want to sign should be placed in the `ipas/` folder, **with their filenames being `{displayname}.ipa`**.