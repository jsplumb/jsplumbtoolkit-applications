/**
 * This is just a collection of utility methods used by the jsPlumb Toolkit demos to get random datasets for
 * demo purposes.
 */
(function () {

    window.jsPlumbToolkitDemoSupport = {
        // return a random hierarchy that contains at least 10 nodes (if possible. if maxDepth * maxBreadth is less
        // than 10, though, then we use that value for our desired amount). The hierarchy also contains positioning
        // information for use with an absolute layout, but most layouts ignore these values.
        randomHierarchy: function (maxDepth, maxBreadth, maxWidth, maxHeight) {
            maxDepth = maxDepth || 6;
            maxBreadth = maxBreadth || 3;
            maxWidth = maxWidth || 600;
            maxHeight = maxHeight || 400;
            var l = 0, t = 0;
            if (maxBreadth < 1) maxBreadth = 1;

            var _do = function () {
                    var h = [ ], c = 0, pad = 80,
                        _node = function (depth) {
                            c++;
                            var id = "w" + c, name = "" + c,
                                childCount = Math.floor(Math.random() * maxBreadth) + 1,
                                wh = jsPlumbToolkitDemoSupport.randomSize(80, 60),
                                n = { id: id, name: name, w: wh[0], h: wh[1], left:l, top:t },
                                children = [];

                            l += wh[0] + pad;
                            if (l > maxWidth) {
                                l = 0;
                                t += wh[1] + pad;
                            }

                            if (depth < maxDepth) {
                                for (var i = 0; i < childCount; i++) {
                                    children.push(_node(depth + 1));
                                }
                            }

                            h.unshift([n, children]);
                            return id;
                        };
                    _node(0);
                    return h;
                },
                _h = null;

            var maxNodesDesired = Math.min(maxDepth * maxBreadth, 10);
            while ((_h = _do()).length < maxNodesDesired);

            var out = { nodes: [], edges: [] };
            for (var i = 0; i < _h.length; i++) {
                out.nodes.push(_h[i][0]);
                for (var j = 0; j < _h[i][1].length; j++) {
                    out.edges.push({source: _h[i][0].id, target: _h[i][1][j], data:{id:jsPlumbUtil.uuid().slice(25)}});
                }
            }

            return out;
        },

        // randomizes the two given dimensions by up to +/- 20%
        randomSize: function (refWidth, refHeight, factor) {
            factor = factor || 0.3;
            var rx = Math.floor(factor - (Math.random() * (factor * 2 * refWidth))),
                ry = Math.floor(factor - (Math.random() * (factor * 2 * refHeight)));

            return [ refWidth + rx, refHeight + ry ];
        },

        // gets a random position within the given bounds
        randomLocation : function(w, h) {
            return [
                Math.floor(Math.random() * w),
                Math.floor(Math.random() * h)
            ];
        },

        randomNode: function (name) {
            var wh = jsPlumbToolkitDemoSupport.randomSize(80, 60),
                xy = jsPlumbToolkitDemoSupport.randomLocation(800, 600),
                id = jsPlumbUtil.uuid(),
                name = name || id.substring(0, 3);

            return { id: id, name: name, w: wh[0], h: wh[1], left:xy[0], top:xy[1] };
        },

        randomGraph:function(minimum, maximum) {
            var nodeCount = minimum + Math.floor(Math.random() * (maximum - minimum));
            var maybe = function() { return (Math.random() >= 0.5); };
            var data = { nodes:[], edges:[] }, edgeCache = {}, edgeCount = 0;
            for (var i = 0; i < nodeCount; i++) {
                var sourceId = "" + (i+1);
                data.nodes.push({id:sourceId, name:sourceId});
                for (var j = 0; j < nodeCount; j++) {
                    if (i != j) {
                        var targetId = "" + (j+1),
                            key = sourceId +"_"+ targetId,
                            keyInv = targetId +"_"+ sourceId;

                        if (edgeCount < (nodeCount * 2) && !edgeCache[key] && !edgeCache[keyInv] && maybe()) {
                            var directed = maybe();
                            data.edges.push({
                                source:sourceId,
                                target: targetId,
                                directed:directed,
                                data:{type:directed? null : "bidirectional" }
                            });
                            edgeCache[key] = true;
                            edgeCache[keyInv] = true;
                            edgeCount++;
                        }
                    }
                }
            }
            return data;
        }
    };

})();