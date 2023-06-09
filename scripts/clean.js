const g = require('./gatlight')
const p = require('../package.json')

const cleaners = {
    "angular":(dir) => {
        g.rmdir(`${dir}/.angular`)
        g.rmdir(`${dir}/node_modules/@jsplumbtoolkit`)
    },
    "vue2":(dir) => {
        g.rmdir(`${dir}/node_modules/.vite`)
        g.rmdir(`${dir}/node_modules/@jsplumbtoolkit`)
    },
    "vue3":(dir) => {
        g.rmdir(`${dir}/node_modules/.vite`)
        g.rmdir(`${dir}/node_modules/@jsplumbtoolkit`)
    },
    "vanilla":(dir) => {
        g.rmdir(`${dir}/node_modules/@jsplumbtoolkit`)
    },
    "react":(dir) => {
        g.rmdir(`${dir}/node_modules/.cache`)
        g.rmdir(`${dir}/node_modules/@jsplumbtoolkit`)
    },
    "svelte":(dir) => {
        g.rmdir(`${dir}/node_modules/@jsplumbtoolkit`)
    }
}

function clean(app, lib) {
    const appDir = `./apps/${app}`,
        libDir = `${appDir}/${lib}`

    if(g.exists(libDir)) {
        try {
            cleaners[lib](libDir)
            console.log(`  Cleaned ${libDir}`)
        } catch (e) {
            console.log(`Could not clean ${libDir}`)
        }
    } else {
        console.log(`${libDir} not found`)
    }
}

const lib = process.argv[2]

g.ls("./apps").forEach(d => {

    if (lib == null) {
        console.log(`Cleaning all libs for app ${d}`)
        p.libs.forEach(lib => {
            clean(d, lib)
        })
    } else {
        clean(d, lib)
    }

})
