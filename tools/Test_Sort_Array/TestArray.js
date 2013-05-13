// Output in Console
var showArray = function(x) {
  var _i,_len,s;
  for (_i = 0, _len = x.length; _i < _len; _i++) {
    s = "Element: "+x[_i][0]+" Preis: "+x[_i][1]
    console.log(s);
  }
}
// Elemente nach dem Preis sortieren (2. Komponente)
var preisSorter = function(a, b) {
    //return a[1] > b[1] ? 1 : (a[1] < b[1] ? -1 : 0);
    return a[1] > b[1] ? 1 : 
            (a[1] < b[1] ? -1 : 
                (a[0] > b[0] ? 1 : -1));
}
// Array mit Elmenten (id,preis) erzeugen
var A = [];
A.push([1, 4]);
A.push([2, 4]);
A.push([3, 2]);
A.push([4, 2]);
A.push([5, 1]);
A.push([6, 1]);
A.push([7, 2]);
A.push([8, 1]);
A.push([9, 1]);
A.push([10, 1]);
A.push([11, 1]);

A.sort(preisSorter);

showArray(A);
