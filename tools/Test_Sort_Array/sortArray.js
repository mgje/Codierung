// Generated by CoffeeScript 1.6.2
(function() {
  var clearAllChilds, frequencySorter, outArray, outText, tA, tsort, wout;

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

  outArray = function(tA) {
    var d, divE, divTestArray, e, s, t, _i, _len;

    divE = document.createElement("div");
    for (_i = 0, _len = tA.length; _i < _len; _i++) {
      e = tA[_i];
      d = document.createElement("div");
      s = "ID: " + e[0] + " | Wert: " + e[1];
      t = document.createTextNode(s);
      d.appendChild(t);
      divE.appendChild(d);
    }
    divTestArray = document.getElementById("TestArray");
    divTestArray.appendChild(divE);
    return false;
  };

  outText = function(txt) {
    var divE, divTestArray, s, t;

    divE = document.createElement("div");
    s = "****   " + txt + "    *****";
    t = document.createTextNode(s);
    divE.appendChild(t);
    divTestArray = document.getElementById("TestArray");
    return divTestArray.appendChild(divE);
  };

  frequencySorter = function(a, b) {
    if (a[1] > b[1]) {
      return 1;
    } else {
      if (a[1] < b[1]) {
        return -1;
      } else {
        return 0;
      }
    }
  };

  /*n = 10
  range = 5
  tA = []
  for i in [0..n]
  	r = Math.floor Math.random()*range
  	z = [i,r]
  	tA.push z
  	false
  */


  tA = [];

  tA.push([0, 3]);

  tA.push([1, 1]);

  tA.push([2, 4]);

  tA.push([3, 2]);

  tA.push([4, 3]);

  tA.push([5, 2]);

  tA.push([6, 3]);

  tA.push([7, 4]);

  tA.push([8, 3]);

  tA.push([9, 1]);

  tA.push([10, 3]);

  outText("Generiertes Array");

  outArray(tA);

  tsort = tA.sort(frequencySorter);

  outText("Sortiertes Array");

  outArray(tsort);

  false;

}).call(this);
