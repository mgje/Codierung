// Generated by CoffeeScript 1.6.2
(function() {
  var createCodeBlock, createCodeRows, defineStyle, handleronChange, sudoku, updateCell;

  createCodeBlock = function(k, n) {
    var i, _i, _results;

    _results = [];
    for (i = _i = 0; 0 <= n ? _i <= n : _i >= n; i = 0 <= n ? ++_i : --_i) {
      _results.push("<div id=\"" + (k * sudoku.col + i) + "\" class=\"smallBox cell\">\n	<div class=\"innerBox null\"></div>\n</div>");
    }
    return _results;
  };

  createCodeRows = function() {
    var j, _i, _ref, _results;

    _results = [];
    for (j = _i = 0, _ref = this.row - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; j = 0 <= _ref ? ++_i : --_i) {
      _results.push("<div class=\"row\">\n" + (createCodeBlock(j, this.col - 1).join("")) + " \n</div>");
    }
    return _results;
  };

  defineStyle = function() {
    this.element.style.width = "" + (this.col * 22) + "px";
    return this.element.style.height = "" + (this.row * 22) + "px";
  };

  updateCell = function(i, s) {
    var el, inp;

    el = document.getElementById(i);
    inp = el.getElementsByClassName("numberInput")[0];
    return inp.value = s;
  };

  handleronChange = function(e) {
    var el, st;

    el = e.target;
    st = el.className;
    if (st === "innerBox null") {
      el.className = "innerBox eins";
    }
    if (st === "innerBox eins") {
      el.className = "innerBox null";
    }
    return false;
  };

  sudoku = {
    row: 20,
    col: 36,
    createGrid: createCodeRows,
    defStyle: defineStyle
  };

  sudoku.element = document.getElementById("code");

  sudoku.element.innerHTML = sudoku.createGrid().join('');

  sudoku.defStyle();

  sudoku.element.addEventListener("click", handleronChange, false);

}).call(this);
