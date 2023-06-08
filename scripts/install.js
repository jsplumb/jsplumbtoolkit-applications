const g = require('./gatlight')
const c = require('child_process')

function doInstall(lib) {

    g.ls("./apps").forEach(d => {
        const appDir = `./apps/${d}`,
            libDir = `${appDir}/${lib}`

        if (g.exists(libDir)) {
            try {
                c.execSync("npm i", {cwd: libDir, env: process.env, stdio: 'inherit'})
                console.log(`Installed dependencies in ${libDir}`)
            } catch (e) {
                console.log(`Could not install dependencies in ${libDir}`)
            }
        } else {
            console.log(`${libDir} not found`)
        }
    })
}

exports.doInstall = doInstall;

doInstall(process.argv[2])
