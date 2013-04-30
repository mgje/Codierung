// Generated by CoffeeScript 1.6.2
(function() {
  var addcolumn, bfromcode, bt, bt2, bt3, bt4, clearAllChilds, createCodeBlock, createCodeRows, createRandomMatrix, dec, decodeBIT, decodeRLE, defineStyle, el, enc, encodeBIT, encodeRLE, evaluateInput, grid, handleronChange, makeclone, mincolumn, outCode, updateCell, updateMatrix, wout;

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
        z = Math.floor(2 * d);
        this.matrix[y * this.col + x] = z;
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
          if (this.matrix[id] === 0) {
            e[0].className = "innerBox null";
          }
          if (this.matrix[id] === 1) {
            _results1.push(e[0].className = "innerBox eins");
          } else {
            _results1.push(void 0);
          }
        }
        return _results1;
      }).call(this));
    }
    return _results;
  };

  encodeRLE = function() {
    var farbe, pixel, z, _i, _len, _ref;

    this.code = [];
    this.code.push(this.col);
    farbe = 0;
    z = 0;
    _ref = this.matrix;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      pixel = _ref[_i];
      if (pixel === farbe) {
        z = z + 1;
      } else {
        this.code.push(z);
        z = 1;
        if (farbe === 0) {
          farbe = 1;
        } else {
          farbe = 0;
        }
      }
    }
    this.code.push(z);
    return this.code.join();
  };

  encodeBIT = function() {
    var pixel, _i, _len, _ref;

    this.code = [];
    this.code.push(this.col);
    _ref = this.matrix;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      pixel = _ref[_i];
      this.code.push(pixel);
    }
    return this.code.join();
  };

  enc = function() {
    var el;

    el = document.getElementById("selectCode");
    if (el.value === "Bitmap Codierung") {
      return this.enBIT();
    } else {
      return this.enRLE();
    }
  };

  decodeRLE = function() {
    var c, col, farb, i, _i, _j, _len, _ref;

    col = this.code.shift();
    if (col > this.maxcol) {
      alert("Es können nicht " + col + " Pixel pro Zeile dargestellt werden. Die maximale Anzahl Pixel beträgt " + this.maxcol + " ");
    } else {
      this.col = col;
      this.matrix = [];
      farb = 0;
      _ref = this.code;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        for (i = _j = 0; 0 <= c ? _j < c : _j > c; i = 0 <= c ? ++_j : --_j) {
          this.matrix.push(farb);
        }
        if (farb === 0) {
          farb = 1;
        } else {
          farb = 0;
        }
      }
      this.row = Math.floor(this.matrix.length / this.col);
      if (this.row !== Math.round(this.matrix.length / this.col)) {
        this.row += 1;
      }
    }
    this.code.unshift(col);
    return false;
  };

  decodeBIT = function() {
    var c, col, _i, _len, _ref;

    col = this.code.shift();
    if (col > this.maxcol) {
      alert("Es können nicht " + col + " Pixel pro Zeile dargestellt werden. Die maximale Anzahl Pixel beträgt " + this.maxcol + " ");
    } else {
      this.col = col;
      this.matrix = [];
      _ref = this.code;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        if (c === 0 || c === 1) {
          this.matrix.push(c);
        }
      }
      this.row = Math.floor(this.matrix.length / this.col);
      if (this.row !== Math.round(this.matrix.length / this.col)) {
        this.row += 1;
      }
    }
    this.code.unshift(col);
    return false;
  };

  dec = function() {
    var el;

    el = document.getElementById("selectCode");
    if (el.value === "Bitmap Codierung") {
      return this.decBIT();
    } else {
      return this.decRLE();
    }
  };

  makeclone = function() {
    var b, col, len;

    len = this.code.length;
    col = this.code.shift();
    b = [].concat(this.code);
    if (len % 2 === 0) {
      b.push(0);
    }
    b = b.concat(this.code);
    this.code = b;
    this.code.unshift(col);
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
    var input, z, zm, _i, _len, _ref;

    input = form.value;
    zm = [];
    _ref = input.split(',');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      z = _ref[_i];
      zm.push(parseInt(z));
    }
    this.code = zm;
    return this.buildFromCode();
  };

  bfromcode = function() {
    this.decode();
    clearAllChilds("code");
    this.element.innerHTML = grid.createGrid().join('');
    this.defgridborder();
    this.updateMat();
    wout("rowcol", "" + this.col + " x " + this.row + " |         " + this.col + " Spalten / " + this.row + " Zeilen");
    return false;
  };

  outCode = function() {
    var tmps;

    tmps = this.encode();
    (document.getElementById("rle_code")).value = tmps;
    return wout("rle_code", tmps);
  };

  handleronChange = function(e) {
    var el, id, st;

    el = e.target;
    st = el.className;
    id = parseInt(el.parentElement.id);
    if (st === "innerBox null") {
      el.className = "innerBox eins";
      grid.matrix[id] = 1;
    }
    if (st === "innerBox eins") {
      el.className = "innerBox null";
      grid.matrix[id] = 0;
    }
    return false;
  };

  grid = {
    row: 20,
    col: 22,
    maxcol: 22,
    size: 28,
    matrix: [],
    code: [],
    createGrid: createCodeRows,
    defgridborder: defineStyle,
    createMat: createRandomMatrix,
    updateMat: updateMatrix,
    enRLE: encodeRLE,
    enBIT: encodeBIT,
    encode: enc,
    evalinp: evaluateInput,
    decRLE: decodeRLE,
    decBIT: decodeBIT,
    decode: dec,
    outCodeToForm: outCode,
    addcol: addcolumn,
    mincol: mincolumn,
    clone: makeclone,
    buildFromCode: bfromcode
  };

  grid.element = document.getElementById("code");

  grid.element.innerHTML = grid.createGrid().join('');

  grid.defgridborder();

  grid.element.addEventListener("click", handleronChange, false);

  grid.createMat();

  grid.updateMat();

  grid.encode();

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
    grid.outCodeToForm();
    return false;
  };

}).call(this);
