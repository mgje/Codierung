#DOM Help Functions
wout = (eid,output)->
	e = clearAllChilds eid
	t = document.createTextNode output
	e.appendChild t
	false

clearAllChilds = (id)->
	e = document.getElementById id
	while e.hasChildNodes()
		e.removeChild e.lastChild
	e

# Array ausgeben
outArray = (tA) ->
	divE = document.createElement "div"
	for e in tA
		d = document.createElement "div"
		s = "ID: #{e[0]} | Wert: #{e[1]}"
		t = document.createTextNode s
		d.appendChild t
		divE.appendChild d

	divTestArray = document.getElementById "TestArray"
	divTestArray.appendChild divE
	false

outText = (txt) ->
	divE = document.createElement "div"
	s = "****   #{txt}    *****"
	t = document.createTextNode s
	divE.appendChild t
	divTestArray = document.getElementById "TestArray"
	divTestArray.appendChild divE

frequencySorter = (a, b) -> if a[1] > b[1] then 1 else (if a[1] < b[1] then -1 else 0)

# Array mit 2 Komponenten erzeugen (id und Zufallswert)
###n = 10
range = 5
tA = []
for i in [0..n]
	r = Math.floor Math.random()*range
	z = [i,r]
	tA.push z
	false###
tA = []
tA.push [0,3]
tA.push [1,1]
tA.push [2,4]
tA.push [3,2]
tA.push [4,3]
tA.push [5,2]
tA.push [6,3]
tA.push [7,4]
tA.push [8,3]
tA.push [9,1]
tA.push [10,3]



outText "Generiertes Array"
outArray tA

tsort = tA.sort(frequencySorter)
outText "Sortiertes Array"
outArray tsort




false
