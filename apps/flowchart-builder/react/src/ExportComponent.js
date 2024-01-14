import React from "react"

import { SvgExporterUI, ImageExporterUI } from "@jsplumbtoolkit/browser-ui"

/**
 * Offers functionality to export the UI as SVG, PNG or JPG.
 * @param surfaceRef
 * @param shapeLibrary
 */
export default function ExportComponent({surfaceRef, shapeLibrary}) {

    function exportSVG() {
        new SvgExporterUI(surfaceRef.current, shapeLibrary).export({})
    }

    function exportPNG() {
        // show an image export ui, which will default tp PNG.  `dimensions` is optional - if not supplied the resulting PNG
        // will have the same size as the content.
        new ImageExporterUI(surfaceRef.current, shapeLibrary).export({dimensions:[
                { width:3000}, { width:1200}, {width:800}
            ]})
    }

    function exportJPG() {
        // show an image export ui targeting a JPG output. Here we show an alternative to providing a list of dimensions - we just mandate the
        // width we want for the output. Again, this is optional. You don't need to provide this or `dimensions`. See note above.
        new ImageExporterUI(surfaceRef.current, shapeLibrary).export({type:"image/jpeg", width:3000})
    }

    return <div className="jtk-export">
                <span>Export:</span>
                <a href="#" id="exportSvg" onClick={() => exportSVG()}>SVG</a>
                <a href="#" id="exportPng" onClick={() => exportPNG()}>PNG</a>
                <a href="#" id="exportJpg" onClick={() => exportJPG()}>JPG</a>
            </div>

}
