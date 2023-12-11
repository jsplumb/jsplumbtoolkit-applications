const g = require('./gatlight')
const p = require('../package.json')
const c = require('./common')

const cleaners = {
    [c.ANGULAR]:(dir) => {
        g.rmdir(`${dir}/.angular`)
        g.rmdir(`${dir}/node_modules/@jsplumbtoolkit`)
    },
    [c.VUE2]:(dir) => {
        g.rmdir(`${dir}/node_modules/.vite`)
        g.rmdir(`${dir}/node_modules/@jsplumbtoolkit`)
    },
    [c.VUE3]:(dir) => {
        g.rmdir(`${dir}/node_modules/.vite`)
        g.rmdir(`${dir}/node_modules/@jsplumbtoolkit`)
    },
    [c.VANILLA]:(dir) => {
        g.rmdir(`${dir}/node_modules`)
    },
    [c.REACT]:(dir) => {
        g.rmdir(`${dir}/node_modules/.cache`)
        g.rmdir(`${dir}/node_modules/@jsplumbtoolkit`)
    },
    [c.NEXTJS]:(dir) => {
        g.rmdir(`${dir}/node_modules/.next`)
        g.rmdir(`${dir}/node_modules/@jsplumbtoolkit`)
    },
    [c.SVELTE]:(dir) => {
        g.rmdir(`${dir}/node_modules/@jsplumbtoolkit`)
        g.rmdir(`${dir}/dist`)
    },
    [c.SVELTE_KIT]:(dir) => {
        g.rmdir(`${dir}/node_modules/.svelte-kit`)
        g.rmdir(`${dir}/node_modules/@jsplumbtoolkit`)
    },
    [c.ES5]:(dir) => {
        g.rmdir(`${dir}/node_modules`)
        g.rm(`${dir}/package-lock.json`)
    },
    [c.ES6]:(dir) => {
        g.rmdir(`${dir}/node_modules`)
        g.rmdir(`${dir}/_build`)
        g.rm(`${dir}/package-lock.json`)
    },
    [c.TS]:(dir) => {
        g.rmdir(`${dir}/node_modules`)
        g.rmdir(`${dir}/_build`)
        g.rm(`${dir}/package-lock.json`)
    }
}

function clean(prefix, app, lib) {

    const libs = lib === c.VANILLA ? [ c.VANILLA, c.TS, c.ES5, c.ES6 ] : [lib]

    libs.forEach(l => {
        const appDir = `./${prefix}/${app}`,
            libDir = `${appDir}/${l}`

        if(g.exists(libDir)) {
            try {
                cleaners[l](libDir)
                console.log(`  Cleaned ${libDir}`)
            } catch (e) {
                console.log(`Could not clean ${libDir}`)
            }
        } else {
            //console.log(`[ ${libDir} ] not found. Not fatal. Just a fact.`)
        }
    })
}

const lib = process.argv[2]

g.ls(`./${c.APP_ROOT}`).forEach(d => {

    if (lib == null) {
        console.log(`Cleaning all libs for app ${d}`)
        p.libs.forEach(lib => {
            clean(c.APP_ROOT, d, lib)
        })
    } else {
        clean(c.APP_ROOT, d, lib)
    }

})

g.ls(`./${c.FEATURE_DEMO_ROOT}`).forEach(d => {

    if (lib == null) {
        console.log(`Cleaning feature demonstration ${d}`)
        p.libs.forEach(lib => {
            clean(c.FEATURE_DEMO_ROOT, d, lib)
        })
    } else {
        clean(c.FEATURE_DEMO_ROOT, d, lib)
    }

})
