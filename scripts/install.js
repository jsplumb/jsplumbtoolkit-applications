const g = require('./gatlight')
const c = require('child_process')
const p = require('../package.json')

function install(app, lib) {
    const appDir = `./apps/${app}`,
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
}


const lib = process.argv[2]

g.ls("./apps").forEach(d => {

    if (lib == null) {
        console.log(`Installing dependencies for all libs for app ${d}`)
        p.libs.forEach(lib => {
            install(d, lib)
        })
    } else {
        install(d, lib)
    }

})
