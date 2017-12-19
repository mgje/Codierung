

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

# Create Grid
createCodeBlock = (k,n) ->
	for i in [0..n]
		"""
		<div id="#{k*grid.col+i}" class="smallBox cell">
			<div class="innerBox null"></div>
		</div>
		"""
createCodeRows = () ->
	for j in [0..@row-1]
		"""
		<div class="zeile">
		#{createCodeBlock(j,@col-1).join ""} 
		</div>
		"""
addinnerEvents = ->
	for y in [0...@row]
		for x in [0...@col]
			id = y*@col+x
			e = document.getElementById id
			e.addEventListener "mousedown",handleronChange,false
			false

defineStyle = () ->
	@element.style.width = "#{@col*@size}px"
	@element.style.height= "#{@row*@size}px"

updateCell = (i,s) ->
	el = document.getElementById i
	inp = el.getElementsByClassName("numberInput")[0]
	inp.value = s

createRandomMatrix = ->
	for y in [0...@row]
		for x in [0...@col]
			d = Math.random()
			z = Math.floor(@anzFarb*d)
			@matrix[y*@col+x]= @farbCode[z]
	wout "rowcol","#{@col} x #{@row} |         #{@col} Spalten / #{@row} Zeilen"		
	false

updateMatrix = ->
	for y in [0...@row]
		for x in [0...@col]
			id = y*@col+x
			e = (document.getElementById id).getElementsByTagName "div"
			e[0].className = "innerBox #{@farbTab[@matrix[id]]}"

#Code Table
createRowCodeTable = ->
	keys =[]
	for k of grid.dict
		keys.push k
	keys.sort()
	for key in keys
		"""
		<tr>
		  <td>#{key}</td>
		  <td>#{grid.dict[key]}</td>
		<tr>
		"""

createCodeTable = ->
	"""
	<table class="table table-bordered table-striped">
	<thead>
	<th>
	LZW Tabelle
	</th>
	<th>
	Anzahl Codes: #{grid.anzCode}
	</th>
	</thead>
	<tbody class="">
	   <tr>
		 <td><b>PIXEL FARBE</b></td>
		 <td><b>WERT</b></td>
		</tr>
	
	#{createRowCodeTable().join ""}
	</tbody>
	</table>	
	"""



encodeBIT = ->
	# Bits berechnen
	@bits = @matrix.length * 3 +8
	@outputParameters()
	@code = @col.toString()
	s = ""
	for pixel in @matrix
		s += pixel
	@code +=","+s

encodeL = ->
	@bits = 8
	@code = @col.toString()
	s = ""
	farbe = @matrix[0]
	z = 0
	for pixel in @matrix
		if pixel == farbe
			z = z+1
		else
			s+=z.toString()+farbe
			if z < 256
				@bits += 11
			else
				@bits += 19
			z = 1
			farbe = pixel
	s+=z.toString()+farbe
	if z < 256
		@bits += 11
	else
		@bits += 19
	@outputParameters()
	@code +=","+s

# Encoding
enc = ->
	el = document.getElementById("selectCode")
	if el.value == "Bitmap Codierung"
		@enBIT()
	else
		@enL()


decodeBIT = ->
	tmpc = @code.split ","
	col = parseInt tmpc[0]
	if col > @maxcol
		alert "Es können nicht #{col} Pixel pro Zeile dargestellt werden. Die maximale Anzahl Pixel beträgt #{@maxcol} "
	else
		@col = col
		@matrix = []
		for c in tmpc[1].split ""
			if (c of @farbTab)
				@matrix.push c

		@bits = tmpc[1].length * 3 +8
		@outputParameters()

		@row = Math.floor @matrix.length/@col
		# Angefangene Zeile
		if @row != @matrix.length/@col
			@row +=1
	false

decodeL = ->
	tmpc = @code.split ","
	col = parseInt tmpc[0]
	if col > @maxcol
		alert "Es können nicht #{col} Pixel pro Zeile dargestellt werden. Die maximale Anzahl Pixel beträgt #{@maxcol} "
	else
		@col = col
		@matrix = []
		@bits = 8
		tmp2 = tmpc[1].match /\d+\D/g
		for c in tmp2
			sz = c.match /\d+/
			z = parseInt sz
			if z < 256
				@bits += 11
			else
				@bits += 19
			f = c.match /\D/ 
			if (f of @farbTab)
				for j in [0...z]
					@matrix.push f[0]

		@outputParameters()

		@row = Math.floor @matrix.length/@col
		# Angefangene Zeile
		if @row != @matrix.length/@col
			@row +=1
	false

dec = ->
	el = document.getElementById("selectCode")
	if el.value == "Bitmap Codierung"
		@decBIT()
	else
		@decL()

# Clone the Figure
makeclone = () ->
	el = document.getElementById("selectCode")
	tmpc = @code.split ","
	if el.value == "Bitmap Codierung" or el.value == "Lauflängen Codierung" 
		#len = @code.length
		col = tmpc[0]
		str = tmpc[1]+tmpc[1]
	else if el.value == "LZW Codierung"
		col = tmpc.shift()
		#copy = tmpc[..]
		tmpc=tmpc.concat tmpc
		str = tmpc.join ","
	else
		alert "not implemented"
	@code = col+ "," + str
	@decode()
	@buildFromCode()
	false

#Sub Column
mincolumn = () ->
	if @col > 2
		arr = []
		arr.length = (@col-1)*@row
		for y in [0...@row]
			for x in [0...@col-1]
				arr[y*(@col-1)+x] = @matrix[y*@col+x]
		@col = @col - 1
		@matrix = arr
		@outCodeToForm()
		@buildFromCode()

# Add Column
addcolumn = () ->
	if @col < @maxcol
		arr = []
		arr.length = (@col+1)*@row
		for y in [0...@row-1]
			for x in [0...@col]
				arr[y*(@col+1)+x] = @matrix[y*@col+x]
			arr[y*(@col+1)+@col] = @farb
		# Danger last line could be partital filled
		# Fill up last line
		for x in [0...@col]
			tmp = @matrix[(@row-1)*@col+x]
			if tmp == undefined
				tmp = @farb
			arr[(@row-1)*(@col+1)+x] = tmp
		arr[(@row-1)*(@col+1)+@col] = @farb
		@col = @col + 1
		@matrix = arr
		@outCodeToForm()
		@buildFromCode()

# Ausertung des Formularfeldes
evaluateInput = (form) ->
	input = form.value
	el = document.getElementById "selectCode"
	zm = []	
	inp = input.split ","
	if el.value == "Bitmap Codierung"
		zm.push parseInt inp[0]
		zm.push inp[1]
		@code = zm.join ","
	else if el.value == "Lauflängen Codierung"
		zm.push parseInt inp[0]
		zm.push inp[1]
		@code = zm.join ","
	else
		alert "not Implemented"
	
	@decode()
	@buildFromCode()

bfromcode = () ->
	# @decode()
	clearAllChilds "code"
	@element.innerHTML = grid.createGrid().join ''
	@defgridborder()
	@updateMat()
	@outputParameters()
	@registerEvents()
	false

outParamet = () ->
	wout "rowcol","#{@col} x #{@row} |         #{@col} Spalten / #{@row} Zeilen | #{@bits} Bits"
	false

outCode = ->
	@code = @encode()
	(document.getElementById "rle_code").value = @code
	# wout "rle_code",@code

#Event Handler
window.handleronChange = (e) ->
	el = e.target
	st = el.className
	if st == "smallBox cell"
		id = parseInt el.id
		el=el.firstElementChild
	else
		id = parseInt el.parentElement.id
	grid.matrix[id] = grid.farb
	el.className = "innerBox #{grid.farbTab[grid.farb]}"
	e.stopPropagation()
	false

selectFarb = (i) ->
	fel = document.getElementById "f"+i
	fel.className += " btn-primary" if fel?
	false

deselectFarb = (i) ->
	fel = document.getElementById "f"+grid.farbNr[i]
	fel.className = "btn btn-small" if fel?
	false

handlerColorChage = (e) ->
	el = e.target
	if (el.id.indexOf "f") == 0
		st = el.id.split "f"
	else
		st = el.parentElement.id.split "f"

	snr = st[st.length-1]
	nr = parseInt snr
	if nr >= 0
		deselectFarb grid.farb
		selectFarb nr
		grid.farb = grid.farbCode[nr]

grid = 
	row: 20
	col: 22
	maxcol: 22
	size: 28
	farb: "S"
	anzFarb: 2
	bits: 0
	matrix: []
	code: ""
	createGrid: createCodeRows
	defgridborder: defineStyle
	createMat: createRandomMatrix
	updateMat: updateMatrix
	registerEvents: addinnerEvents
	enBIT: encodeBIT
	enL: encodeL
	encode: enc
	evalinp: evaluateInput
	decBIT:	decodeBIT
	decL: decodeL
	decode: dec
	outCodeToForm: outCode
	outputParameters: outParamet
	addcol: addcolumn
	mincol: mincolumn
	clone: makeclone
	buildFromCode: bfromcode


grid.farbTab =
	"W" : "weiss"
	"S" : "schwarz"

grid.farbCode =
	0 : "W"
	6 : "S"
	
grid.farbNr =
	"W" : 0
	"S" : 6


grid.element = document.getElementById "code"
grid.element.innerHTML= grid.createGrid().join ""
grid.defgridborder()
selectFarb grid.farb


#grid.element.addEventListener "mousedown",handleronChange,false
#Random Start
#grid.createMat()
#grid.updateMat()
#grid.encode()

# Start with Mario
grid.evalinp document.getElementById "rle_code"

btf = document.getElementById "selectColor"
btf.addEventListener "click",handlerColorChage,false


# Events an Formular binden 
# Enter
document.forms[0].onkeypress = (e) ->
	if !e
		e = window.event
	if e.keyCode ==13
		grid.evalinp e.target
		false
# Click Decode
bt = document.getElementById "btn_decode"
bt.onclick = (e) ->
	grid.evalinp document.getElementById "rle_code"
	false

# Click Encode
bt2 = document.getElementById "btn_encode"
bt2.onclick = (e) ->
	grid.outCodeToForm()
	false

# Plus Spalte
bt3 = document.getElementById "btn_addcol"
bt3.onclick = (e) ->
	grid.addcol()
	false

# Plus Spalte
bt4 = document.getElementById "btn_mincol"
bt4.onclick = (e) ->
	grid.mincol()
	false

# Klonen
bt4 = document.getElementById "btn_clone"
bt4.onclick = (e) ->
	grid.clone()
	false 	

# Change Mode
el = document.getElementById "selectCode"
el.onchange = (e) ->
	elformat = document.getElementById "selectCodeFormat"
	elLZWTable = document.getElementById "LZW_Table"
	if el.value == "Bitmap Codierung"
		elformat.className = "span2 hide"
		elLZWTable.className = "hide"
	else if el.value == "LZW Codierung"
		elformat.className = "span2"
		elLZWTable.className = "span5"
	else
		elformat.className = "span2 hide"
		elLZWTable.className = "hide"

	grid.outCodeToForm()
	false

elformat = document.getElementById "selectCodeFormat"
elformat.onchange = (e) ->
	grid.outCodeToForm()
	false


