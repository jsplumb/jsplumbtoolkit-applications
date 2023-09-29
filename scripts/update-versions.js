const g = require('./gatlight')
const p = require('../package.json')
const c = require('./common')

console.log(process.cwd())

function _one(base, app, lib) {
    const libs = lib === c.VANILLA ? [ c.VANILLA, c.ES5, c.ES6, c.TS] : [lib]

    libs.forEach(l => {
        try {
            const pkgLoc = `${process.cwd()}/${base}/${app}/${l}/package.json`
            const pkg = require(pkgLoc)
            const deps = {}
            for (let k in pkg.dependencies) {
                if (k.indexOf("@jsplumbtoolkit") === 0) {
                    deps[k] = `^${p.version}`
                } else {
                    deps[k] = pkg.dependencies[k]
                }
            }

            pkg.version = p.version

            pkg.dependencies = deps

            g.write(pkgLoc, JSON.stringify(pkg, 4, 4))
        }
        catch (e) {
            // not found - not fatal
        }
    })
}

g.ls(`./${c.APP_ROOT}`).forEach(d => {

    p.libs.forEach(lib => {
        _one(c.APP_ROOT, d, lib)
    })

})

g.ls(`./${c.FEATURE_DEMO_ROOT}`).forEach(d => {

    p.libs.forEach(lib => {
        _one(c.FEATURE_DEMO_ROOT, d, lib)
    })

})
