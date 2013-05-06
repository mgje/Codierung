 /**
 * Copyright (c) 2010 Wilker Lúcio
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* Version 0.9.1 
 Modification by Martin Guggisberg 
 using a safe sort to generate identical Huffman Trees in all Browsers*/
var Huffman;
Huffman = {treeFromText: function(b) {
        var a;
        a = new Huffman.TreeBuilder(b);
        return a.build()
    }};
Huffman.CoreHelpers = {isArray: function(a) {
        return !!(a && a.constructor === Array)
    },lpad: function(a, b) {
        b = b || 8;
        while (a.length < b) {
            a = "0" + a
        }
        return a
    }};
Huffman.Tree = function(a) {
    this.root = a;
    this.root = this.root || new Huffman.Tree.Node();
    return this
};
Huffman.Tree.prototype.encode = function(a) {
    return this.bitStringToString(this.encodeBitString(a))
};
Huffman.Tree.prototype.decode = function(j) {
    var g, f, e, a, c, i, h, b;
    a = this.stringToBitString(j);
    i = "";
    b = this.root;
    f = a.split("");
    for (g = 0, e = f.length; g < e; g++) {
        h = f[g];
        c = h === "0" ? "left" : "right";
        b = b[c];
        if (b.isLeaf()) {
            i += b.value;
            b = this.root
        }
    }
    return i
};
Huffman.Tree.prototype.encodeBitString = function(f) {
    var c, b, a, d, e;
    e = "";
    b = f.split("");
    for (c = 0, a = b.length; c < a; c++) {
        d = b[c];
        e += this.bitValue(d)
    }
    return e
};
Huffman.Tree.prototype.bitStringToString = function(a) {
    var d, b, f, c, e;
    e = 8 - a.length % 8;
    for (c = 0; (0 <= e ? c < e : c > e); (0 <= e ? c += 1 : c -= 1)) {
        a += "0"
    }
    f = (function() {
        d = [];
        b = a.length;
        for (c = 0; (0 <= b ? c < b : c > b); c += 8) {
            d.push(String.fromCharCode(parseInt(a.substr(c, 8), 2)))
        }
        return d
    })();
    return f.join("") + e.toString()
};
Huffman.Tree.prototype.stringToBitString = function(c) {
    var e, d, b, a, f, h, g;
    g = c.split("");
    h = parseInt(g.pop());
    g = (function() {
        e = [];
        b = g;
        for (d = 0, a = b.length; d < a; d++) {
            f = b[d];
            e.push(Huffman.CoreHelpers.lpad(f.charCodeAt(0).toString(2)))
        }
        return e
    })();
    g = g.join("");
    return g.substr(0, g.length - h)
};
Huffman.Tree.prototype.bitValue = function(b) {
    var a;
    if (!((typeof (a = this.leafCache) !== "undefined" && a !== null))) {
        this.generateLeafCache()
    }
    return this.leafCache[b]
};
Huffman.Tree.prototype.generateLeafCache = function(a, b) {
    this.leafCache = (typeof this.leafCache !== "undefined" && this.leafCache !== null) ? this.leafCache : {};
    a = a || this.root;
    b = b || "";
    if (a.isLeaf()) {
        return (this.leafCache[a.value] = b)
    } else {
        this.generateLeafCache(a.left, b + "0");
        return this.generateLeafCache(a.right, b + "1")
    }
};
Huffman.Tree.prototype.encodeTree = function() {
    return this.root.encode()
};
Huffman.Tree.decodeTree = function(a) {
    return new Huffman.Tree(Huffman.Tree.parseNode(a))
};
Huffman.Tree.parseNode = function(b) {
    var a;
    a = new Huffman.Tree.Node();
    if (Huffman.CoreHelpers.isArray(b)) {
        a.left = Huffman.Tree.parseNode(b[0]);
        a.right = Huffman.Tree.parseNode(b[1])
    } else {
        a.value = b
    }
    return a
};
Huffman.Tree.Node = function() {
    this.left = (this.right = (this.value = null));
    return this
};
Huffman.Tree.Node.prototype.isLeaf = function() {
    return (this.left === this.right) && (this.right === null)
};
Huffman.Tree.Node.prototype.encode = function() {
    return this.value ? this.value : [this.left.encode(), this.right.encode()]
};
var __hasProp = Object.prototype.hasOwnProperty;
Huffman.TreeBuilder = function(a) {
    this.text = a;
    return this
};
Huffman.TreeBuilder.prototype.build = function() {
    var a, b;
    b = this.buildFrequencyTable();
    a = this.combineTable(b);
    return Huffman.Tree.decodeTree(this.compressCombinedTable(a))
};
Huffman.TreeBuilder.prototype.buildFrequencyTable = function() {
    var d, c, b, a, e, h, f, g;
    g = {};
    c = this.text.split("");
    for (d = 0, b = c.length; d < b; d++) {
        e = c[d];
        g[e] = (typeof g[e] !== "undefined" && g[e] !== null) ? g[e] : 0;
        g[e] += 1
    }
    f = [];
    a = g;
    for (e in a) {
        if (!__hasProp.call(a, e)) {
            continue
        }
        h = a[e];
        f.push([h, e])
    }
    f.sort(this.frequencySorter);
    return f
};
Huffman.TreeBuilder.prototype.frequencySorter = function(d, c) {
    // Looking on two components !!!
    return [d[0],d[1]] > [c[0],c[1]] ? 1 : -1
    //return d[0] != c[0] ? d[0]-c[0] : d[1] < c[1]
    //return d[0] != c[0] ? d[0]-c[0] : (typeof d[1] == "string" && typeof c[1] == "string" ? d[1].charCodeAt(0)-c[1].charCodeAt(0) :0)
    // return d[0] > c[0] ? 1 : (d[0] < c[0] ? -1 : 0)
};
Huffman.TreeBuilder.prototype.combineTable = function(b) {
    var c, a;
    while (b.length > 1) {
        c = b.shift();
        a = b.shift();
        b.push([c[0] + a[0], [c, a]]);
        b.sort(this.frequencySorter)
    }
    return b[0]
};
Huffman.TreeBuilder.prototype.compressCombinedTable = function(a) {
    var b;
    b = a[1];
    return Huffman.CoreHelpers.isArray(b) ? [this.compressCombinedTable(b[0]), this.compressCombinedTable(b[1])] : b
};
