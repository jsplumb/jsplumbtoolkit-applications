import {
    EVENT_NODE_UPDATED,
    EVENT_EDGE_REMOVED,
    EVENT_EDGE_ADDED,
    EVENT_NODE_ADDED,
    JsPlumbToolkit, Edge,
    EVENT_DATA_LOAD_START,
    EVENT_DATA_LOAD_END
} from "@jsplumbtoolkit/browser-ui"

import { ImageProcessorNode, ImageProcessorPort } from './definitions'

/**
 * This is the processor for the image pipeline. It listens to various events on the Toolkit and either runs the whole
 * pipeline or just some node and its descendants, as necessary.
 */
export class Processor {

    toolkit:JsPlumbToolkit
    model:any
    onComplete:(value:unknown) => unknown
    onError:Function
    _loading = false

    constructor(toolkit:JsPlumbToolkit, model:any, onComplete:(value:unknown) => unknown, onError:Function) {

        this.toolkit = toolkit
        this.model = model
        this.onComplete = onComplete
        this.onError = onError

        // set loading flag at load start so we dont run until loading is finished
        this.toolkit.bind(EVENT_DATA_LOAD_START, () => this._loading = true)
        // at load end, run the processor, with `force` - assume all vertices dirty.
        this.toolkit.bind(EVENT_DATA_LOAD_END, () => {
            this._loading = false
            // and run the processor
            this.run(true)
        })

        /**
         * When a new node gets added (outside of a load), mark the node dirty. The next time the processor is run and this new node
         * has any connections, it will be executed.
         */
        this.toolkit.bind(EVENT_NODE_ADDED, (p:{node:ImageProcessorNode}) => {
            this._markDirty(p.node)
        })

        /**
         * For all updates except left/top updates (coming from a drag), run the processor on change.
         */
        this.toolkit.bind(EVENT_NODE_UPDATED, (p:{vertex:ImageProcessorNode, updates:Record<string, any>}) => {
            // ignore node positioning updates
            if (!p.updates.left) {
                this._markDirty(p.vertex)

            }
        })
        /**
         * When an edge is added, find the target of the edge, set its value from the source, and mark it for processing. Then run the processor.
         */
        this.toolkit.bind(EVENT_EDGE_ADDED, (p:{edge:Edge}) => {
            const edge = p.edge
            ;(edge.target as ImageProcessorPort).getParent().data[edge.target.id] = (edge.source as ImageProcessorPort).getParent().data[edge.source.id]
            ;(edge.target as ImageProcessorPort).getParent().dirty = true
            this.run()
        })

        /**
         * When an edge is removed, find the target of the edge and remove the value that the previous edge was supplying, then mark the target node
         * for processing and run the processor.
         */
        this.toolkit.bind(EVENT_EDGE_REMOVED, (p:{edge:Edge}) => {
            const edge = p.edge
            ;(edge.target as ImageProcessorPort).getParent().data[edge.target.id] = null
            ;(edge.target as ImageProcessorPort).getParent().dirty = true
            this.run()
        })

    }

    /**
     * Run the processor, and invoke the onComplete handler afterwards.
     * @param force
     */
    async run(force?:boolean) {

        try {
            this.execute(force).then(this.onComplete)
        } catch (e) {
            this.onError(e)
        }

    }

    /**
     * For a given node, mark everything downstream for processing.
     * @param obj
     * @param touched
     * @private
     */
    private _clearDownstream(obj:ImageProcessorNode, touched:Record<string, boolean> = {}) {
        if (!touched[obj.id]) {
            touched[obj.id] = true
            obj.dirty = true
            const outputs = obj.getPorts().filter(p => p.data.output === true)
            outputs.forEach(output => {
                output.edges.forEach(edge => {
                    (edge.target as ImageProcessorPort).getParent().data[edge.target.id] = null
                    ;(edge.target as ImageProcessorPort).getParent().dirty = true

                    this._clearDownstream((edge.target as ImageProcessorPort).getParent(), touched)
                })
            })
        }
    }

    /**
     * Mark a node for processing: clear everything downstream, compute the node, and if a value was returned, propagate to children.
     * @param obj
     * @private
     */
    private async _markDirty(obj:ImageProcessorNode) {
        this._clearDownstream(obj)
        const modelObject = this.model.nodeTypes[obj.type]
        const result = await modelObject.compute(obj)
        if (result) {
            obj.dirty = false
            const outputs = obj.getPorts().filter(p => p.data.output === true)
            outputs.forEach(output => {
                output.edges.forEach(edge => {
                    (edge.target as ImageProcessorPort).getParent().data[edge.target.id] = (edge.source as ImageProcessorPort).getParent().data[edge.source.id]
                    ;(edge.target as ImageProcessorPort).getParent().dirty = true
                })
            })
        }

        this.run()
    }

    /**
     * Run the processor.
     * @param force
     */
    private async execute(force?:boolean) {

        return new Promise((resolve, reject) => {

            const queue:Array<ImageProcessorNode> = []
            const unprocessed = this.toolkit.getNodes().slice() as Array<ImageProcessorNode>
            const processed:Record<string, ImageProcessorNode> = {}

            if (force) {
                unprocessed.forEach(up => up.dirty = true)
            }

            const _onePass = async () => {

                let cleanRun = true
                if (unprocessed.length === 0) {
                    resolve(true)
                } else {

                    queue.length = 0
                    queue.push(...unprocessed)
                    unprocessed.length = 0

                    for (let i = 0; i < queue.length; i++) {
                        const candidate = queue[i]
                        const modelObject = this.model.nodeTypes[candidate.type]
                        if (candidate.dirty) {

                            const result = await modelObject.compute(candidate)
                            const outputs = candidate.getPorts().filter(p => p.data.output === true)

                            if (result) {
                                processed[candidate.id] = candidate
                                cleanRun = false
                                candidate.dirty = false

                                outputs.forEach(output => {
                                    output.edges.forEach(edge => {
                                        (edge.target as ImageProcessorPort).getParent().data[edge.target.id] = (edge.source as ImageProcessorPort).getParent().data[edge.source.id]
                                        ;(edge.target as ImageProcessorPort).getParent().dirty = true
                                    })
                                })

                            } else {
                                unprocessed.push(candidate)
                                this._clearDownstream(candidate)
                            }
                        }

                    }
                }

                if (cleanRun) {
                    resolve(true)
                } else {
                    await _onePass()
                }
            };

            _onePass()
        })
    }
}


