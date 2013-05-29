// Generated by CoffeeScript 1.6.2
(function() {
  var addcolumn, bfromcode, bt, bt2, bt3, bt4, btf, clearAllChilds, createCodeBlock, createCodeRows, createCodeTable, createRandomMatrix, createRowCodeTable, dec, dec_lzw, decodeBIT, decodeLZW, defineStyle, deselectFarb, el, elformat, enc, enc_lzw, encodeBIT, encodeLZW, evaluateInput, grid, handlerColorChage, handleronChange, makeclone, mincolumn, outCode, selectFarb, updateCell, updateMatrix, wout;

  enc_lzw = function(s) {
    var code, currChar, data, elformat, i, out, outchar, phrase, _i, _j, _k, _ref, _ref1, _ref2;

    this.dict = {};
    data = (s + "").split("");
    out = [];
    outchar = [];
    phrase = data[0];
    code = 8;
    for (i = _i = 1, _ref = data.length; 1 <= _ref ? _i < _ref : _i > _ref; i = 1 <= _ref ? ++_i : --_i) {
      currChar = data[i];
      if (this.dict[phrase + currChar] !== void 0) {
        phrase += currChar;
      } else {
        if (phrase.length > 1) {
          out.push(this.dict[phrase]);
        } else {
          out.push(this.farbNr[phrase]);
        }
        this.dict[phrase + currChar] = code;
        code++;
        phrase = currChar;
      }
    }
    this.anzCode = code;
    if (phrase.length > 1) {
      out.push(this.dict[phrase]);
    } else {
      out.push(this.farbNr[phrase]);
    }
    elformat = document.getElementById("selectCodeFormat");
    if (elformat.value === "Zeichen") {
      for (i = _j = 0, _ref1 = out.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
        outchar[i] = String.fromCharCode(out[i] + 97);
      }
      return outchar.join("");
    } else if (elformat.value === "Zahlen Code") {
      return out.join(",");
    } else {
      for (i = _k = 0, _ref2 = out.length; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; i = 0 <= _ref2 ? ++_k : --_k) {
        outchar[i] = out[i].toString(2);
      }
      return outchar.join(",");
    }
  };

  dec_lzw = function(s) {
    var code, currChar, currCode, data, dict, i, oldPhrase, out, phrase, _i, _ref;

    dict = {};
    data = (s + "").split(",");
    currChar = this.farbCode[parseInt(data[0])];
    oldPhrase = currChar;
    out = [currChar];
    code = 8;
    for (i = _i = 1, _ref = data.length; 1 <= _ref ? _i < _ref : _i > _ref; i = 1 <= _ref ? ++_i : --_i) {
      currCode = data[i];
      if (currCode < 8) {
        phrase = this.farbCode[parseInt(currCode)];
      } else {
        if (dict[currCode]) {
          phrase = dict[currCode];
        } else {
          phrase = oldPhrase + currChar;
        }
      }
      out.push(phrase);
      currChar = phrase.charAt(0);
      dict[code] = oldPhrase + currChar;
      code++;
      oldPhrase = phrase;
    }
    return out.join("");
  };

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

  createCodeBlock = function(k, n) {
    var i, _i, _results;

    _results = [];
    for (i = _i = 0; 0 <= n ? _i <= n : _i >= n; i = 0 <= n ? ++_i : --_i) {
      _results.push("<div id=\"" + (k * grid.col + i) + "\" class=\"smallBox cell\">\n	<div class=\"innerBox null\"></div>\n</div>");
    }
    return _results;
  };

  createCodeRows = function() {
    var j, _i, _ref, _results;

    _results = [];
    for (j = _i = 0, _ref = this.row - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; j = 0 <= _ref ? ++_i : --_i) {
      _results.push("<div class=\"zeile\">\n" + (createCodeBlock(j, this.col - 1).join("")) + " \n</div>");
    }
    return _results;
  };

  defineStyle = function() {
    this.element.style.width = "" + (this.col * this.size) + "px";
    return this.element.style.height = "" + (this.row * this.size) + "px";
  };

  updateCell = function(i, s) {
    var el, inp;

    el = document.getElementById(i);
    inp = el.getElementsByClassName("numberInput")[0];
    return inp.value = s;
  };

  createRandomMatrix = function() {
    var d, x, y, z, _i, _j, _ref, _ref1;

    for (y = _i = 0, _ref = this.row; 0 <= _ref ? _i < _ref : _i > _ref; y = 0 <= _ref ? ++_i : --_i) {
      for (x = _j = 0, _ref1 = this.col; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; x = 0 <= _ref1 ? ++_j : --_j) {
        d = Math.random();
        z = Math.floor(this.anzFarb * d);
        this.matrix[y * this.col + x] = this.farbCode[z];
      }
    }
    wout("rowcol", "" + this.col + " x " + this.row + " |         " + this.col + " Spalten / " + this.row + " Zeilen");
    return false;
  };

  updateMatrix = function() {
    var e, id, x, y, _i, _ref, _results;

    _results = [];
    for (y = _i = 0, _ref = this.row; 0 <= _ref ? _i < _ref : _i > _ref; y = 0 <= _ref ? ++_i : --_i) {
      _results.push((function() {
        var _j, _ref1, _results1;

        _results1 = [];
        for (x = _j = 0, _ref1 = this.col; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; x = 0 <= _ref1 ? ++_j : --_j) {
          id = y * this.col + x;
          e = (document.getElementById(id)).getElementsByTagName("div");
          _results1.push(e[0].className = "innerBox " + this.farbTab[this.matrix[id]]);
        }
        return _results1;
      }).call(this));
    }
    return _results;
  };

  createRowCodeTable = function() {
    var k, key, keys, _i, _len, _results;

    keys = [];
    for (k in grid.dict) {
      keys.push(k);
    }
    keys.sort();
    _results = [];
    for (_i = 0, _len = keys.length; _i < _len; _i++) {
      key = keys[_i];
      _results.push("<tr>\n  <td>" + key + "</td>\n  <td>" + grid.dict[key] + "</td>\n<tr>");
    }
    return _results;
  };

  createCodeTable = function() {
    return "<table class=\"table table-bordered table-striped span4\">\n<thead>\n<th>\n    LZW Tabelle\n    </th>\n    <th>\n    Anzahl Codes: " + grid.anzCode + "\n    </th>\n    </thead>\n    <tbody class=\"\">\n       <tr>\n         <td><b>PIXEL</b></td>\n         <td><b>WERT</b></td>\n        </tr>\n    \n    " + (createRowCodeTable().join("")) + "\n</tbody>\n</table>	";
  };

  encodeLZW = function() {
    var el;

    this.code = this.col.toString() + ",";
    this.code += this.encode_lzw(this.matrix.join(""));
    clearAllChilds("LZW_Table");
    el = document.getElementById("LZW_Table");
    el.innerHTML = createCodeTable();
    return this.code;
  };

  encodeBIT = function() {
    var pixel, s, _i, _len, _ref;

    this.code = this.col.toString();
    s = "";
    _ref = this.matrix;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      pixel = _ref[_i];
      s += pixel;
    }
    return this.code += "," + s;
  };

  enc = function() {
    var el;

    el = document.getElementById("selectCode");
    if (el.value === "Bitmap Codierung") {
      return this.enBIT();
    } else {
      return this.enLZW();
    }
  };

  decodeLZW = function() {
    var c, col, elformat, tmp, tmpc, _i, _len, _ref;

    elformat = document.getElementById("selectCodeFormat");
    tmpc = this.code.split(",");
    if (elformat.value === "Zeichen") {
      col = parseInt(tmpc[0]);
      tmp = this.decode_lzw(tmpc[1]);
    } else {
      col = parseInt(tmpc.shift());
      tmp = this.decode_lzw(tmpc.join(","));
    }
    if (col > this.maxcol) {
      alert("Es können nicht " + col + " Pixel pro Zeile dargestellt werden. Die maximale Anzahl Pixel beträgt " + this.maxcol + " ");
    } else {
      this.col = col;
      this.matrix = [];
      _ref = tmp.split("");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        if (c in this.farbTab) {
          this.matrix.push(c);
        }
      }
      this.row = Math.floor(this.matrix.length / this.col);
      if (this.row !== Math.round(this.matrix.length / this.col)) {
        this.row += 1;
      }
    }
    return false;
  };

  decodeBIT = function() {
    var c, col, tmpc, _i, _len, _ref;

    tmpc = this.code.split(",");
    col = parseInt(tmpc[0]);
    if (col > this.maxcol) {
      alert("Es können nicht " + col + " Pixel pro Zeile dargestellt werden. Die maximale Anzahl Pixel beträgt " + this.maxcol + " ");
    } else {
      this.col = col;
      this.matrix = [];
      _ref = tmpc[1].split("");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        if (c in this.farbTab) {
          this.matrix.push(c);
        }
      }
      this.row = Math.floor(this.matrix.length / this.col);
      if (this.row !== Math.round(this.matrix.length / this.col)) {
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
      return this.decLZW();
    }
  };

  makeclone = function() {
    var col, len, str, tmpc;

    len = this.code.length;
    tmpc = this.code.split(",");
    col = parseInt(tmpc[0]);
    str = tmpc[1] + tmpc[1];
    this.code = col.toString() + "," + str;
    this.decode();
    this.buildFromCode();
    return false;
  };

  mincolumn = function() {
    var arr, x, y, _i, _j, _ref, _ref1;

    if (this.col > 2) {
      arr = [];
      arr.length = (this.col - 1) * this.row;
      for (y = _i = 0, _ref = this.row; 0 <= _ref ? _i < _ref : _i > _ref; y = 0 <= _ref ? ++_i : --_i) {
        for (x = _j = 0, _ref1 = this.col - 1; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; x = 0 <= _ref1 ? ++_j : --_j) {
          arr[y * (this.col - 1) + x] = this.matrix[y * this.col + x];
        }
      }
      this.col = this.col - 1;
      this.matrix = arr;
      this.outCodeToForm();
      return this.buildFromCode();
    }
  };

  addcolumn = function() {
    var arr, x, y, _i, _j, _ref, _ref1;

    if (this.col < this.maxcol) {
      arr = [];
      arr.length = (this.col + 1) * this.row;
      for (y = _i = 0, _ref = this.row; 0 <= _ref ? _i < _ref : _i > _ref; y = 0 <= _ref ? ++_i : --_i) {
        for (x = _j = 0, _ref1 = this.col; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; x = 0 <= _ref1 ? ++_j : --_j) {
          arr[y * (this.col + 1) + x] = this.matrix[y * this.col + x];
        }
        arr[y * (this.col + 1) + this.col] = 0;
      }
      this.col = this.col + 1;
      this.matrix = arr;
      this.outCodeToForm();
      return this.buildFromCode();
    }
  };

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
    } else {
      this.code = inp.join(",");
    }
    this.decode();
    return this.buildFromCode();
  };

  bfromcode = function() {
    clearAllChilds("code");
    this.element.innerHTML = grid.createGrid().join('');
    this.defgridborder();
    this.updateMat();
    wout("rowcol", "" + this.col + " x " + this.row + " |         " + this.col + " Spalten / " + this.row + " Zeilen");
    return false;
  };

  outCode = function() {
    this.code = this.encode();
    return (document.getElementById("rle_code")).value = this.code;
  };

  handleronChange = function(e) {
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
    el.className = "innerBox " + grid.farbTab[grid.farb];
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
    farb: "P",
    anzFarb: 8,
    matrix: [],
    code: "",
    createGrid: createCodeRows,
    defgridborder: defineStyle,
    createMat: createRandomMatrix,
    updateMat: updateMatrix,
    enLZW: encodeLZW,
    enBIT: encodeBIT,
    encode: enc,
    evalinp: evaluateInput,
    encode_lzw: enc_lzw,
    decode_lzw: dec_lzw,
    decLZW: decodeLZW,
    decBIT: decodeBIT,
    decode: dec,
    outCodeToForm: outCode,
    addcol: addcolumn,
    mincol: mincolumn,
    clone: makeclone,
    buildFromCode: bfromcode
  };

  grid.farbTab = {
    "W": "weiss",
    "R": "rot",
    "P": "hellrosa",
    "N": "braun",
    "B": "blau",
    "G": "gelb",
    "S": "schwarz",
    "U": "gruen"
  };

  grid.farbCode = {
    0: "W",
    1: "R",
    2: "P",
    3: "N",
    4: "B",
    5: "G",
    6: "S",
    7: "U"
  };

  grid.farbNr = {
    "W": 0,
    "R": 1,
    "P": 2,
    "N": 3,
    "B": 4,
    "G": 5,
    "S": 6,
    "U": 7
  };

  grid.element = document.getElementById("code");

  grid.element.innerHTML = grid.createGrid().join("");

  grid.defgridborder();

  selectFarb(grid.farb);

  grid.element.addEventListener("click", handleronChange, false);

  grid.evalinp(document.getElementById("rle_code"));

  btf = document.getElementById("selectColor");

  btf.addEventListener("click", handlerColorChage, false);

  document.forms[0].onkeypress = function(e) {
    if (!e) {
      e = window.event;
    }
    if (e.keyCode === 13) {
      grid.evalinp(e.target);
      return false;
    }
  };

  bt = document.getElementById("btn_decode");

  bt.onclick = function(e) {
    grid.evalinp(document.getElementById("rle_code"));
    return false;
  };

  bt2 = document.getElementById("btn_encode");

  bt2.onclick = function(e) {
    grid.outCodeToForm();
    return false;
  };

  bt3 = document.getElementById("btn_addcol");

  bt3.onclick = function(e) {
    grid.addcol();
    return false;
  };

  bt4 = document.getElementById("btn_mincol");

  bt4.onclick = function(e) {
    grid.mincol();
    return false;
  };

  bt4 = document.getElementById("btn_clone");

  bt4.onclick = function(e) {
    grid.clone();
    return false;
  };

  el = document.getElementById("selectCode");

  el.onchange = function(e) {
    var elformat;

    elformat = document.getElementById("selectCodeFormat");
    if (el.value === "Bitmap Codierung") {
      elformat.className = "span2 hide";
    } else {
      elformat.className = "span2";
    }
    grid.outCodeToForm();
    return false;
  };

  elformat = document.getElementById("selectCodeFormat");

  elformat.onchange = function(e) {
    grid.outCodeToForm();
    return false;
  };

}).call(this);
