/**
 * Base datatype, defined for convenience.
 * @public
 */
import {LabelOverlay} from "@jsplumbtoolkit/browser-ui"
import {
    CLASS_SCHEMA_RELATIONSHIP_CARDINALITY,
    DATATYPE_DATE,
    DATATYPE_INTEGER,
    DATATYPE_VARCHAR, N_TO_M, N_TO_M_NAME,
    ONE_TO_N,
    ONE_TO_N_NAME,
    ONE_TO_ONE,
    ONE_TO_ONE_NAME, PROPERTY_CARDINALITY
} from "./constants"

/**
 * Default supported datatypes
 * @public
 */
export const datatypes = [
    { id:DATATYPE_VARCHAR, description:"Character data"},
    { id:DATATYPE_INTEGER, description:"An integer"},
    { id:DATATYPE_DATE, description:"A date"}
]

/**
 * Default edge cardinalities.
 * @public
 */
export const cardinalities = [
    { id:ONE_TO_ONE, name:ONE_TO_ONE_NAME, labels:["1", "1"] },
    { id:ONE_TO_N, name:ONE_TO_N_NAME, labels:["1", "N"] },
    { id:N_TO_M, name:N_TO_M_NAME, labels:["N", "M"] }
]

//
// Create a set of edge mappings from the `cardinalities` array in definitions.ts. For each cardinality declared we
// add a mapping for the specific value, which has an overlay at each end showing the cardinality values.
// `cardinalityMappings` is passed to the render call, and the surface uses it to decide which overlays to show
// on a given edge.
//
export const cardinalityMappings = {}
cardinalities.forEach(c => {
    cardinalityMappings[c.id] = {
        overlays:[
            { type:LabelOverlay.type, options:{ label:c.labels[0], location:0.1, cssClass:CLASS_SCHEMA_RELATIONSHIP_CARDINALITY }},
            { type:LabelOverlay.type, options:{ label:c.labels[1], location:0.9, cssClass:CLASS_SCHEMA_RELATIONSHIP_CARDINALITY }}
        ]
    }
})

//
// Setup edge mappings. You can map multiple properties; here we map the cardinality mappings from above to the
// `cardinality` property of each edge's data.
//
export const edgeMappings = [
    {
        property:PROPERTY_CARDINALITY,
        mappings:cardinalityMappings
    }
]

