<template>
    <div ref="container">
        <div class="jtk-orgchart-inspector" v-if="current != null">
            <h1>{{current.data.name}}</h1>
            <h2>{{current.data.title}}</h2>
            <h5 v-if="reports.length > 0">Reports:</h5>
            <a v-for="r in reports" :key="r.id" class="jtk-orgchart-inspector-person" href="#" :data-id="r.data.id" @click="selectPerson(r)">
                <img :src="getImage(r)" :alt="r.data.name"/>
                <div>
                    {{r.data.name}}
                    <span>{{r.data.title}}</span>
                </div>
            </a>
            <h5 v-if="manager != null">Reports to:</h5>
            <a v-if="manager != null" class="jtk-orgchart-inspector-person" href="#" :data-id="manager.data.id" @click="selectPerson(manager)">
                <img :src="getImage(manager)" :alt="manager.data.name"/>
                <div>
                    {{manager.data.name}}
                    <span>{{manager.data.title}}</span>
                </div>
            </a>
        </div>
    </div>
</template>
<script>

    import Vue from "vue"
    import {getSurface} from "@jsplumbtoolkit/browser-ui-vue2";
    import { Inspector } from "@jsplumbtoolkit/browser-ui"

    function retrieveDirectReports(person){
        return person.getSourceEdges().map(e => e.target)
    }

    function getManager(person) {
        return person.getTargetEdges().map(e => e.source)[0]
    }

    export default {
        data:() => {
            return {
                current:null,
                reports:[],
                manager:null,
                inspector:null

            }
        },
        methods:{
          getImage:function(p) {
              return `/avatars/${p.data.img}`
          }
        },
        props:{
            surfaceId:String,
            selectPerson:Function
        },
        mounted() {
            getSurface(this.surfaceId, (surface) => {

                // create an inspector. give it the container element
                // and the surface and functions to use to render an
                // empty container (no selection) and to render an editor.
                // here we toggle `currentType` and let the template draw what
                // it needs to.
                this.inspector = new Inspector({
                    container:this.$refs.container,
                    surface,
                    renderEmptyContainer:() => {
                        this.reports.length = 0
                        this.manager = null
                    },
                    refresh:(obj, cb) => {
                        this.current = obj
                        this.reports = retrieveDirectReports(obj)
                        this.manager = getManager(obj)
                        Vue.nextTick(cb)
                    }
                })

            })
        }
    }
</script>
