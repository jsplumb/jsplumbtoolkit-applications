const g = require('./gatlight')
const childProcess = require('child_process')
const p = require('../package.json')
const c = require('./common')

function build(base, app, lib) {

    const libs = lib === c.VANILLA ? [ c.VANILLA, c.TS, c.ES5, c.ES6 ] : [lib]

    libs.forEach(l => {
        const appDir = `./${base}/${app}`,
            libDir = `${appDir}/${l}`

        if (g.exists(libDir)) {
            try {
                childProcess.execSync("npm run build", {cwd: libDir, env: process.env, stdio: 'inherit'})
                console.log(`Built app in ${libDir}`)
            } catch (e) {
                console.log(`Could not build app in ${libDir}`)
            }
        } else {
            //console.log(`${libDir} not found`)
        }
    })
}


const lib = process.argv[2]

g.ls(`./${c.APP_ROOT}`).forEach(d => {

    if (lib == null) {
        console.log(`Building all libs for app ${d}`)
        p.libs.forEach(lib => {
            build(c.APP_ROOT, d, lib)
        })
    } else {
        build(c.APP_ROOT, d, lib)
    }

})

g.ls(`./${c.FEATURE_DEMO_ROOT}`).forEach(d => {

    if (lib == null) {
        console.log(`Building all libs for app ${d}`)
        p.libs.forEach(lib => {
            build(c.FEATURE_DEMO_ROOT, d, lib)
        })
    } else {
        build(c.FEATURE_DEMO_ROOT, d, lib)
    }

})
