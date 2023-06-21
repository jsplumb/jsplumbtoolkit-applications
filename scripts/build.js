const g = require('./gatlight')
const c = require('child_process')
const p = require('../package.json')

function build(app, lib) {
    const appDir = `./apps/${app}`,
        libDir = `${appDir}/${lib}`

    if (g.exists(libDir)) {
        try {
            c.execSync("npm run build", {cwd: libDir, env: process.env, stdio: 'inherit'})
            console.log(`Built app in ${libDir}`)
        } catch (e) {
            console.log(`Could not build app in ${libDir}`)
        }
    } else {
        console.log(`${libDir} not found`)
    }
}


const lib = process.argv[2]

g.ls("./apps").forEach(d => {

    if (lib == null) {
        console.log(`Building all libs for app ${d}`)
        p.libs.forEach(lib => {
            build(d, lib)
        })
    } else {
        build(d, lib)
    }

})
