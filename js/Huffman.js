// Generated by CoffeeScript 2.1.0
(function() {
  //DOM Help Functions
  var appendNode, bt, buildTree, cBits, clearAllChilds, dASCII, dASCIIBitString, dHuffman, dHuffmanBitString, dec, eASCII, eHuffman, el, enc, gHTMLbin, huff, sInput, wout;

  wout = function(eid, output) {
    var e, t;
    e = clearAllChilds(eid);
    t = document.createTextNode(output);
    e.appendChild(t);
    return false;
  };

  clearAllChilds = function(id) {
    var e;
    e = document.getElementById(id);
    while (e.hasChildNodes()) {
      e.removeChild(e.lastChild);
    }
    return e;
  };

  // Rekursive update of two trees
  appendNode = function(inode, onode, name) {
    var child, entry, i, l, len;
    if (typeof inode !== "string") {
      entry = {
        name: name,
        children: []
      };
      onode.push(entry);
      i = 0;
      for (l = 0, len = inode.length; l < len; l++) {
        child = inode[l];
        appendNode(child, entry.children, i.toString());
        i = i + 1;
      }
      return false;
    } else {
      entry = {
        name: name + ":" + inode
      };
      if (typeof onode !== "undefined") {
        onode.push(entry);
      }
      return false;
    }
  };

  //  Begin Tree
  buildTree = function() {
    var diagonal, e, h, json, link, node, nodes, tjson, tree, vis, w;
    e = clearAllChilds("chart");
    tjson = [];
    appendNode(this.treeEncoded, tjson, "Huffman Baum     ");
    json = tjson[0];
    w = 780;
    h = 780;
    tree = d3.layout.tree().size([h, w - 360]);
    diagonal = d3.svg.diagonal().projection(function(d) {
      return [d.y, d.x];
    });
    vis = d3.select("#chart").append("svg").attr("width", w).attr("height", h).append("g").attr("transform", "translate(30, 10)");
    nodes = tree.nodes(json);
    link = vis.selectAll("path.link").data(tree.links(nodes)).enter().append("path").attr("class", "link").attr("d", diagonal);
    node = vis.selectAll("g.node").data(nodes).enter().append("g").attr("class", "node").attr("transform", function(d) {
      return `translate (${d.y},${d.x})`;
    });
    node.append("circle").attr("r", 7.4);
    node.append("text").attr("dx", -4).attr("dy", 5).attr("text-anchor", "start").text(function(d) {
      if (d.name[0] !== "H") {
        return d.name[0];
      }
    });
    return node.append("text").attr("dx", 11).attr("dy", 5).attr("text-anchor", "start").text(function(d) {
      if (d.name[1] === ":") {
        return d.name[2];
      } else {
        return "";
      }
    });
  };

  //  End Tree

  // Behaviour Form Change
  sInput = function(form) {
    this.txt = form.value;
    this.encode();
    return false;
  };

  // Decode binary codes
  dec = function() {
    var el;
    el = document.getElementById("selectCode");
    if (el.value === "ASCII Codierung") {
      this.decodeASCII();
    } else {
      this.decodeHuffman();
    }
    wout("decodeout", this.dectxt);
    return false;
  };

  dHuffman = function() {
    //@huffman = Huffman.treeFromText @txt
    return this.dectxt = this.decodeHuffmanBitString(this.encbin);
  };

  dASCII = function() {
    return this.dectxt = this.decodeASCIIBitString(this.encbin);
  };

  cBits = function() {
    var c, l, len, ref, tmp;
    tmp = 0;
    ref = this.encbin;
    for (l = 0, len = ref.length; l < len; l++) {
      c = ref[l];
      if (c === "1" || c === "0") {
        tmp += 1;
      }
    }
    return tmp + " Bits";
  };

  enc = function() {
    var e, el, el2;
    el = document.getElementById("selectCode");
    if (el.value === "ASCII Codierung") {
      this.encodeASCII();
      e = clearAllChilds("chart");
      //wout "encodeout",@encbin
      el2 = document.getElementById("encodeout");
      el2.innerHTML = this.encHTMLbin;
    } else {
      this.encodeHuffman();
      //wout "encodeout",@encHTMLbin
      el2 = document.getElementById("encodeout");
      el2.innerHTML = this.encHTMLbin;
    }
    wout("Bits", this.countBits());
    $(".Hcode").tooltip();
    return false;
  };

  dHuffmanBitString = function(tbin) {
    var b, c, e, f, g, h, i, l, ref;
    i = "";
    b = this.huffman.root;
    f = tbin.split("");
    e = f.length;
    for (g = l = 0, ref = e; 0 <= ref ? l < ref : l > ref; g = 0 <= ref ? ++l : --l) {
      h = f[g];
      if (h === "0") {
        c = "left";
      } else {
        c = "right";
      }
      b = b[c];
      if (b.isLeaf()) {
        i += b.value;
        b = this.huffman.root;
      }
    }
    return i;
  };

  gHTMLbin = function(tbin) {
    var b, c, cl, e, f, g, h, i, l, pos, ref, s;
    i = `<div class='Hcode even' rel='tooltip' data-placement='top' title=' ${this.txt[0]} '>`;
    b = this.huffman.root;
    f = tbin.split("");
    e = f.length;
    pos = 0;
    for (g = l = 0, ref = e; 0 <= ref ? l < ref : l > ref; g = 0 <= ref ? ++l : --l) {
      h = f[g];
      if (h === "0") {
        c = "left";
      } else {
        c = "right";
      }
      i += h;
      b = b[c];
      if (b.isLeaf()) {
        pos += 1; //Next Character
        if (pos % 2 === 0) {
          cl = "Hcode even";
        } else {
          cl = "Hcode odd";
        }
        i += `</div><div class='${cl}' rel='tooltip' data-placement='top' title=' ${this.txt[pos]} '>`;
        b = this.huffman.root; // reset to root
      }
    }
    
    //remove last div Element
    s = `<div class='${cl}' rel='tooltip' data-placement='top' title=' ${this.txt[pos]} '>`;
    i = i.substring(0, i.length - s.length);
    i += "</div>";
    return i;
  };

  dASCIIBitString = function(tbin) {
    var c, code, k, l, len, s, z;
    code = tbin.match(/.{1,8}/g); // create 8Bit Blocks
    s = "";
    for (l = 0, len = code.length; l < len; l++) {
      c = code[l];
      k = parseInt(c, 2);
      z = String.fromCharCode(k);
      s += z;
    }
    return s;
  };

  eHuffman = function() {
    this.huffman = Huffman.treeFromText(this.txt);
    this.enctxt = this.huffman.encode(this.txt);
    this.encbin = this.huffman.stringToBitString(this.enctxt);
    this.encHTMLbin = this.genEncHTMLbin(this.encbin);
    this.treeEncoded = this.huffman.encodeTree();
    this.genTree();
    return false;
  };

  eASCII = function() {
    var c, cl, encArray, i, j, l, len, len1, m, n, o, ref, ref1, s, ts, z;
    this.enctxt = this.txt;
    encArray = [];
    ref = this.enctxt;
    for (l = 0, len = ref.length; l < len; l++) {
      c = ref[l];
      encArray.push(c.charCodeAt());
    }
    this.encbin = "";
    this.encHTMLbin = `<div id='huffmanCode' ><div class='Hcode even' rel='tooltip' data-placement='top' title=' ${this.txt[0]}  '>`;
    j = 1;
    for (m = 0, len1 = encArray.length; m < len1; m++) {
      z = encArray[m];
      s = z.toString(2);
      n = 8 - s.length;
      if (n > 0) {
        for (i = o = 0, ref1 = n; 0 <= ref1 ? o < ref1 : o > ref1; i = 0 <= ref1 ? ++o : --o) {
          this.encbin += "0";
          this.encHTMLbin += "0";
        }
      }
      if (j % 2 === 0) {
        cl = "Hcode even";
      } else {
        cl = "Hcode odd";
      }
      this.encbin += s;
      this.encHTMLbin += s;
      this.encHTMLbin += `</div><div class='${cl}' rel='tooltip' data-placement='top' title=' ${this.txt[j]} '>`;
      j += 1;
    }
    //remove last div Element
    ts = `<div class='${cl}' rel='tooltip' data-placement='top' title=' ${this.txt[j]} '>`;
    this.encHTMLbin = this.encHTMLbin.substring(0, this.encHTMLbin.length - ts.length);
    this.encHTMLbin += "</div></div>";
    return false;
  };

  
  // Huffman Object
  huff = {
    txt: "", // Plain Text input
    dectxt: "", // Decoded Text 
    enctxt: "", // Encoded Text with 01
    encbin: "", // Encoded Text huffan Compressed
    encHTMLbin: "", // Encoded HTML huffan Compressed
    huffman: "", // huffman Object from lib
    treeEncoded: "", // Treerepresentation
    setInput: sInput, //Methods
    encodeASCII: eASCII,
    encodeHuffman: eHuffman,
    encode: enc,
    countBits: cBits,
    decode: dec,
    decodeASCII: dASCII,
    decodeHuffman: dHuffman,
    decodeHuffmanBitString: dHuffmanBitString,
    genEncHTMLbin: gHTMLbin,
    decodeASCIIBitString: dASCIIBitString,
    writeOut: wout,
    genTree: buildTree
  };

  // Events an Formular binden 
  // Enter Encode
  document.forms[0].onkeypress = function(e) {
    if (!e) {
      e = window.event;
    }
    if (e.keyCode === 13) {
      huff.setInput(e.target);
      return false;
    }
  };

  // Click Encode
  bt = document.forms[0].button;

  bt.onclick = function(e) {
    huff.setInput(e.target.form[0]);
    return false;
  };

  // Click Decode
  bt = document.forms[1].button;

  bt.onclick = function(e) {
    huff.decode();
    return false;
  };

  // Click Encode
  // bt2 = document.forms[1].button
  // bt2.onclick = (e) ->
  //  	huff.setInput e.target.form[0]
  //  	false

  // Change Mode
  el = document.getElementById("selectCode");

  el.onchange = function(e) {
    if (huff.enctxt !== "") {
      huff.encode();
    }
    return false;
  };

}).call(this);