// Generated by CoffeeScript 2.1.0
(function() {
  //DOM Help Functions
  var addcolumn, addinnerEvents, bfromcode, bt, bt2, bt3, bt4, btf, clearAllChilds, createCodeBlock, createCodeRows, createCodeTable, createRandomMatrix, createRowCodeTable, dec, decodeBIT, decodeL, defineStyle, deselectFarb, el, enc, encodeBIT, encodeL, evaluateInput, grid, handlerColorChage, makeclone, mincolumn, outCode, outParamet, selectFarb, updateCell, updateMatrix, wout;

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

  // Create Grid
  createCodeBlock = function(k, n) {
    var i, l, ref, results;
    results = [];
    for (i = l = 0, ref = n; 0 <= ref ? l <= ref : l >= ref; i = 0 <= ref ? ++l : --l) {
      results.push(`<div id="${k * grid.col + i}" class="smallBox cell">\n	<div class="innerBox null"></div>\n</div>`);
    }
    return results;
  };

  createCodeRows = function() {
    var j, l, ref, results;
    results = [];
    for (j = l = 0, ref = this.row - 1; 0 <= ref ? l <= ref : l >= ref; j = 0 <= ref ? ++l : --l) {
      results.push(`<div class="zeile">\n${createCodeBlock(j, this.col - 1).join("")} \n</div>`);
    }
    return results;
  };

  addinnerEvents = function() {
    var e, id, l, ref, results, x, y;
    results = [];
    for (y = l = 0, ref = this.row; 0 <= ref ? l < ref : l > ref; y = 0 <= ref ? ++l : --l) {
      results.push((function() {
        var m, ref1, results1;
        results1 = [];
        for (x = m = 0, ref1 = this.col; 0 <= ref1 ? m < ref1 : m > ref1; x = 0 <= ref1 ? ++m : --m) {
          id = y * this.col + x;
          e = document.getElementById(id);
          e.addEventListener("mousedown", handleronChange, false);
          results1.push(false);
        }
        return results1;
      }).call(this));
    }
    return results;
  };

  defineStyle = function() {
    this.element.style.width = `${this.col * this.size}px`;
    return this.element.style.height = `${this.row * this.size}px`;
  };

  updateCell = function(i, s) {
    var el, inp;
    el = document.getElementById(i);
    inp = el.getElementsByClassName("numberInput")[0];
    return inp.value = s;
  };

  createRandomMatrix = function() {
    var d, l, m, ref, ref1, x, y, z;
    for (y = l = 0, ref = this.row; 0 <= ref ? l < ref : l > ref; y = 0 <= ref ? ++l : --l) {
      for (x = m = 0, ref1 = this.col; 0 <= ref1 ? m < ref1 : m > ref1; x = 0 <= ref1 ? ++m : --m) {
        d = Math.random();
        z = Math.floor(this.anzFarb * d);
        this.matrix[y * this.col + x] = this.farbCode[z];
      }
    }
    wout("rowcol", `${this.col} x ${this.row} |         ${this.col} Spalten / ${this.row} Zeilen`);
    return false;
  };

  updateMatrix = function() {
    var e, id, l, ref, results, x, y;
    results = [];
    for (y = l = 0, ref = this.row; 0 <= ref ? l < ref : l > ref; y = 0 <= ref ? ++l : --l) {
      results.push((function() {
        var m, ref1, results1;
        results1 = [];
        for (x = m = 0, ref1 = this.col; 0 <= ref1 ? m < ref1 : m > ref1; x = 0 <= ref1 ? ++m : --m) {
          id = y * this.col + x;
          e = (document.getElementById(id)).getElementsByTagName("div");
          results1.push(e[0].className = `innerBox ${this.farbTab[this.matrix[id]]}`);
        }
        return results1;
      }).call(this));
    }
    return results;
  };

  //Code Table
  createRowCodeTable = function() {
    var k, key, keys, l, len, results;
    keys = [];
    for (k in grid.dict) {
      keys.push(k);
    }
    keys.sort();
    results = [];
    for (l = 0, len = keys.length; l < len; l++) {
      key = keys[l];
      results.push(`<tr>\n  <td>${key}</td>\n  <td>${grid.dict[key]}</td>\n<tr>`);
    }
    return results;
  };

  createCodeTable = function() {
    return `<table class="table table-bordered table-striped">\n<thead>\n<th>\nLZW Tabelle\n</th>\n<th>\nAnzahl Codes: ${grid.anzCode}\n</th>\n</thead>\n<tbody class="">\n   <tr>\n	 <td><b>PIXEL FARBE</b></td>\n	 <td><b>WERT</b></td>\n	</tr>\n\n${createRowCodeTable().join("")}\n</tbody>\n</table>	`;
  };

  encodeBIT = function() {
    var count, l, len, pixel, ref, s;
    // Bits berechnen
    this.bits = this.matrix.length;
    this.outputParameters();
    this.code = this.col.toString();
    s = "";
    count = 0;
    ref = this.matrix;
    for (l = 0, len = ref.length; l < len; l++) {
      pixel = ref[l];
      if (count % this.col === 0) {
        s += "\n";
      }
      s += pixel;
      count += 1;
    }
    return this.code += "," + s;
  };

  encodeL = function() {
    var count, farbe, l, len, pixel, ref, s, z;
    this.bits = 0;
    this.code = this.col.toString();
    s = "";
    farbe = this.matrix[0];
    z = 0;
    count = 0;
    ref = this.matrix;
    for (l = 0, len = ref.length; l < len; l++) {
      pixel = ref[l];
      if (pixel === farbe) {
        z += 1;
        if (count % this.col === 0 && z > 1) {
          z -= 1;
          s += z.toString() + farbe;
          s += "\n";
          if (z < 256) {
            this.bits += 11;
          } else {
            this.bits += 19;
          }
          z = 1;
        }
      } else {
        s += z.toString() + farbe;
        if (z < 256) {
          this.bits += 11;
        } else {
          this.bits += 19;
        }
        z = 1;
        farbe = pixel;
      }
      count += 1;
    }
    
    //letzte Zeile
    s += z.toString() + farbe;
    if (z < 256) {
      this.bits += 11;
    } else {
      this.bits += 19;
    }
    this.outputParameters();
    return this.code += ",\n" + s;
  };

  // Encoding
  enc = function() {
    var el;
    el = document.getElementById("selectCode");
    if (el.value === "Bitmap Codierung") {
      return this.enBIT();
    } else {
      return this.enL();
    }
  };

  decodeBIT = function() {
    var c, col, l, len, ref, tmpc;
    tmpc = this.code.split(",");
    col = parseInt(tmpc[0]);
    if (col > this.maxcol) {
      alert(`Es können nicht ${col} Pixel pro Zeile dargestellt werden. Die maximale Anzahl Pixel beträgt ${this.maxcol} `);
    } else {
      this.col = col;
      this.matrix = [];
      ref = tmpc[1].split("");
      for (l = 0, len = ref.length; l < len; l++) {
        c = ref[l];
        if (c in this.farbTab) {
          this.matrix.push(c);
        }
      }
      this.bits = tmpc[1].length + 8;
      this.outputParameters();
      this.row = Math.floor(this.matrix.length / this.col);
      // Angefangene Zeile
      if (this.row !== this.matrix.length / this.col) {
        this.row += 1;
      }
    }
    return false;
  };

  decodeL = function() {
    var c, col, f, j, l, len, m, ref, sz, tmp2, tmpc, z;
    tmpc = this.code.split(",");
    col = parseInt(tmpc[0]);
    if (col > this.maxcol) {
      alert(`Es können nicht ${col} Pixel pro Zeile dargestellt werden. Die maximale Anzahl Pixel beträgt ${this.maxcol} `);
    } else {
      this.col = col;
      this.matrix = [];
      this.bits = 8;
      tmp2 = tmpc[1].match(/\d+\D/g);
      for (l = 0, len = tmp2.length; l < len; l++) {
        c = tmp2[l];
        sz = c.match(/\d+/);
        z = parseInt(sz);
        if (z < 256) {
          this.bits += 9;
        } else {
          this.bits += 17;
        }
        f = c.match(/\D/);
        if (f in this.farbTab) {
          for (j = m = 0, ref = z; 0 <= ref ? m < ref : m > ref; j = 0 <= ref ? ++m : --m) {
            this.matrix.push(f[0]);
          }
        }
      }
      this.outputParameters();
      this.row = Math.floor(this.matrix.length / this.col);
      // Angefangene Zeile
      if (this.row !== this.matrix.length / this.col) {
        this.row += 1;
      }
    }
    return false;
  };

  dec = function() {
    var el;
    el = document.getElementById("selectCode");
    if (el.value === "Bitmap Codierung") {
      return this.decBIT();
    } else {
      return this.decL();
    }
  };

  // Clone the Figure
  makeclone = function() {
    var col, el, str, tmpc;
    el = document.getElementById("selectCode");
    tmpc = this.code.split(",");
    if (el.value === "Bitmap Codierung" || el.value === "Lauflängen Codierung") {
      
      //len = @code.length
      col = tmpc[0];
      str = tmpc[1] + tmpc[1];
    } else {
      alert("not implemented");
    }
    this.code = col + "," + str;
    this.decode();
    this.buildFromCode();
    return false;
  };

  //Sub Column
  mincolumn = function() {
    var arr, l, m, ref, ref1, x, y;
    if (this.col > 2) {
      arr = [];
      arr.length = (this.col - 1) * this.row;
      for (y = l = 0, ref = this.row; 0 <= ref ? l < ref : l > ref; y = 0 <= ref ? ++l : --l) {
        for (x = m = 0, ref1 = this.col - 1; 0 <= ref1 ? m < ref1 : m > ref1; x = 0 <= ref1 ? ++m : --m) {
          arr[y * (this.col - 1) + x] = this.matrix[y * this.col + x];
        }
      }
      this.col = this.col - 1;
      this.matrix = arr;
      this.outCodeToForm();
      return this.buildFromCode();
    }
  };

  // Add Column
  addcolumn = function() {
    var arr, l, m, o, ref, ref1, ref2, tmp, x, y;
    if (this.col < this.maxcol) {
      arr = [];
      arr.length = (this.col + 1) * this.row;
      for (y = l = 0, ref = this.row - 1; 0 <= ref ? l < ref : l > ref; y = 0 <= ref ? ++l : --l) {
        for (x = m = 0, ref1 = this.col; 0 <= ref1 ? m < ref1 : m > ref1; x = 0 <= ref1 ? ++m : --m) {
          arr[y * (this.col + 1) + x] = this.matrix[y * this.col + x];
        }
        arr[y * (this.col + 1) + this.col] = this.farb;
      }
      // Danger last line could be partital filled
      // Fill up last line
      for (x = o = 0, ref2 = this.col; 0 <= ref2 ? o < ref2 : o > ref2; x = 0 <= ref2 ? ++o : --o) {
        tmp = this.matrix[(this.row - 1) * this.col + x];
        if (tmp === void 0) {
          tmp = this.farb;
        }
        arr[(this.row - 1) * (this.col + 1) + x] = tmp;
      }
      arr[(this.row - 1) * (this.col + 1) + this.col] = this.farb;
      this.col = this.col + 1;
      this.matrix = arr;
      this.outCodeToForm();
      return this.buildFromCode();
    }
  };

  // Ausertung des Formularfeldes
  evaluateInput = function(form) {
    var el, inp, input, zm;
    input = form.value;
    el = document.getElementById("selectCode");
    zm = [];
    inp = input.split(",");
    if (el.value === "Bitmap Codierung") {
      zm.push(parseInt(inp[0]));
      zm.push(inp[1]);
      this.code = zm.join(",");
    } else if (el.value === "Lauflängen Codierung") {
      zm.push(parseInt(inp[0]));
      zm.push(inp[1]);
      this.code = zm.join(",");
    } else {
      alert("not Implemented");
    }
    this.decode();
    return this.buildFromCode();
  };

  bfromcode = function() {
    // @decode()
    clearAllChilds("code");
    this.element.innerHTML = grid.createGrid().join('');
    this.defgridborder();
    this.updateMat();
    this.outputParameters();
    this.registerEvents();
    return false;
  };

  outParamet = function() {
    wout("rowcol", `${this.col} x ${this.row} |         ${this.col} Spalten / ${this.row} Zeilen | ${this.bits} Bits`);
    return false;
  };

  outCode = function() {
    this.code = this.encode();
    return (document.getElementById("rle_code")).value = this.code;
  };

  // wout "rle_code",@code

  //Event Handler
  window.handleronChange = function(e) {
    var el, id, st;
    el = e.target;
    st = el.className;
    if (st === "smallBox cell") {
      id = parseInt(el.id);
      el = el.firstElementChild;
    } else {
      id = parseInt(el.parentElement.id);
    }
    grid.matrix[id] = grid.farb;
    el.className = `innerBox ${grid.farbTab[grid.farb]}`;
    e.stopPropagation();
    return false;
  };

  selectFarb = function(i) {
    var fel;
    fel = document.getElementById("f" + i);
    if (fel != null) {
      fel.className += " btn-primary";
    }
    return false;
  };

  deselectFarb = function(i) {
    var fel;
    fel = document.getElementById("f" + grid.farbNr[i]);
    if (fel != null) {
      fel.className = "btn btn-small";
    }
    return false;
  };

  handlerColorChage = function(e) {
    var el, nr, snr, st;
    el = e.target;
    if ((el.id.indexOf("f")) === 0) {
      st = el.id.split("f");
    } else {
      st = el.parentElement.id.split("f");
    }
    snr = st[st.length - 1];
    nr = parseInt(snr);
    if (nr >= 0) {
      deselectFarb(grid.farb);
      selectFarb(nr);
      return grid.farb = grid.farbCode[nr];
    }
  };

  grid = {
    row: 20,
    col: 22,
    maxcol: 22,
    size: 28,
    farb: "S",
    anzFarb: 2,
    bits: 0,
    matrix: [],
    code: "",
    createGrid: createCodeRows,
    defgridborder: defineStyle,
    createMat: createRandomMatrix,
    updateMat: updateMatrix,
    registerEvents: addinnerEvents,
    enBIT: encodeBIT,
    enL: encodeL,
    encode: enc,
    evalinp: evaluateInput,
    decBIT: decodeBIT,
    decL: decodeL,
    decode: dec,
    outCodeToForm: outCode,
    outputParameters: outParamet,
    addcol: addcolumn,
    mincol: mincolumn,
    clone: makeclone,
    buildFromCode: bfromcode
  };

  grid.farbTab = {
    "W": "weiss",
    "S": "schwarz"
  };

  grid.farbCode = {
    0: "W",
    1: "S"
  };

  grid.farbNr = {
    "W": 0,
    "S": 1
  };

  grid.element = document.getElementById("code");

  grid.element.innerHTML = grid.createGrid().join("");

  grid.defgridborder();

  selectFarb(grid.farb);

  //grid.element.addEventListener "mousedown",handleronChange,false
  //Random Start
  //grid.createMat()
  //grid.updateMat()
  //grid.encode()

  // Start with Mario
  grid.evalinp(document.getElementById("rle_code"));

  btf = document.getElementById("selectColor");

  btf.addEventListener("click", handlerColorChage, false);

  // Events an Formular binden 
  // Enter
  document.forms[0].onkeypress = function(e) {
    if (!e) {
      return e = window.event;
    }
  };

  //if e.keyCode ==13
  //	grid.evalinp e.target
  //	false
  // Click Decode
  bt = document.getElementById("btn_decode");

  bt.onclick = function(e) {
    grid.evalinp(document.getElementById("rle_code"));
    return false;
  };

  // Click Encode
  bt2 = document.getElementById("btn_encode");

  bt2.onclick = function(e) {
    grid.outCodeToForm();
    return false;
  };

  // Plus Spalte
  bt3 = document.getElementById("btn_addcol");

  bt3.onclick = function(e) {
    grid.addcol();
    return false;
  };

  // Plus Spalte
  bt4 = document.getElementById("btn_mincol");

  bt4.onclick = function(e) {
    grid.mincol();
    return false;
  };

  // Klonen
  bt4 = document.getElementById("btn_clone");

  bt4.onclick = function(e) {
    grid.clone();
    return false;
  };

  
  // Change Mode
  el = document.getElementById("selectCode");

  el.onchange = function(e) {
    var elLZWTable, elformat;
    elformat = document.getElementById("selectCodeFormat");
    elLZWTable = document.getElementById("LZW_Table");
    if (el.value === "Bitmap Codierung") {
      elformat.className = "span2 hide";
      elLZWTable.className = "hide";
    } else if (el.value === "LZW Codierung") {
      elformat.className = "span2";
      elLZWTable.className = "span5";
    } else {
      elformat.className = "span2 hide";
      elLZWTable.className = "hide";
    }
    grid.outCodeToForm();
    return false;
  };

  //elformat = document.getElementById "selectCodeFormat"
//elformat.onchange = (e) ->
//	grid.outCodeToForm()
//	false

}).call(this);
