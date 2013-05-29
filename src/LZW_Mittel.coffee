

# LZW-compress a string
enc_lzw = (s) ->
	@dict = {}
	data = (s + "").split ""
	out = []
	outchar = []
	phrase = data[0]
	code = 8
	for i in [1...data.length]
    	currChar=data[i]
    	if @dict[phrase + currChar] != undefined 
            phrase += currChar
        else
        	if phrase.length>1 then  out.push @dict[phrase] else out.push @farbNr[phrase]
        	@dict[phrase + currChar] = code
        	code++
        	phrase=currChar
    # Anzahl Code Elemente
    @anzCode = code
    if phrase.length > 1 then out.push @dict[phrase] else out.push @farbNr[phrase]
    
    elformat = document.getElementById("selectCodeFormat")
	if elformat.value == "Zeichen"
		for i in [0...out.length]
			outchar[i] = String.fromCharCode out[i]+97
		outchar.join ""
	else if elformat.value == "Zahlen Code"
		out.join ","
	else
		for i in [0...out.length]
			outchar[i] = out[i].toString(2)
		outchar.join ","
 
# Decompress an LZW-encoded string
dec_lzw = (s) ->
	dict = {}
	data = (s + "").split ","
	currChar = @farbCode[parseInt data[0]]
	oldPhrase = currChar
	out = [currChar]
	code = 8

	for i in [1...data.length]
        currCode = data[i]
        if currCode < 8
        	phrase = @farbCode[parseInt currCode]
        else
        	if dict[currCode] then phrase=dict[currCode] else phrase = oldPhrase + currChar
        
        out.push phrase
        currChar = phrase.charAt 0
        dict[code] = oldPhrase + currChar
        code++
        oldPhrase = phrase
    
    out.join ""

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
	<table class="table table-bordered table-striped span4">
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
         <td><b>PIXEL</b></td>
         <td><b>WERT</b></td>
        </tr>
    
    #{createRowCodeTable().join ""}
	</tbody>
	</table>	
	"""

encodeLZW = ->
	@code = @col.toString()+","
	@code += @encode_lzw @matrix.join ""
	clearAllChilds "LZW_Table"
	el = document.getElementById "LZW_Table"
	el.innerHTML = createCodeTable()	
	@code

encodeBIT = ->
	@code = @col.toString()
	s = ""
	for pixel in @matrix
		s += pixel
	@code +=","+s

# Encoding
enc = ->
	el = document.getElementById("selectCode")
	if el.value == "Bitmap Codierung"
		@enBIT()
	else
		@enLZW()

decodeLZW = ->
	elformat = document.getElementById "selectCodeFormat"
	tmpc = @code.split "," 
	if elformat.value == "Zeichen"
		col = parseInt tmpc[0]
		tmp = @decode_lzw tmpc[1]
	else
		col = parseInt tmpc.shift()
		tmp = @decode_lzw tmpc.join ","
	if col > @maxcol
		alert "Es können nicht #{col} Pixel pro Zeile dargestellt werden. Die maximale Anzahl Pixel beträgt #{@maxcol} "
	else
		@col = col
		@matrix = []

		for c in tmp.split ""
			if (c of @farbTab)
				@matrix.push(c)				

		@row = Math.floor @matrix.length/@col
		# Angefangene Zeile
		if @row != Math.round @matrix.length/@col
			@row +=1
	false

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
				@matrix.push(c)				

		@row = Math.floor @matrix.length/@col
		# Angefangene Zeile
		if @row != Math.round @matrix.length/@col
			@row +=1
	false

dec = ->
	el = document.getElementById("selectCode")
	if el.value == "Bitmap Codierung"
		@decBIT()
	else
		@decLZW()

# Clone the Figure
makeclone = () ->
	len = @code.length
	tmpc = @code.split ","
	col = parseInt tmpc[0]
	str = tmpc[1]+tmpc[1]
	@code = col.toString()+ "," + str
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
		for y in [0...@row]
			for x in [0...@col]
				arr[y*(@col+1)+x] = @matrix[y*@col+x]
			arr[y*(@col+1)+@col] = 0
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
	else
		@code = inp.join ","
	
	@decode()
	@buildFromCode()

bfromcode = () ->
	# @decode()
	clearAllChilds "code"
	@element.innerHTML = grid.createGrid().join ''
	@defgridborder()
	@updateMat()
	wout "rowcol","#{@col} x #{@row} |         #{@col} Spalten / #{@row} Zeilen"
	false

outCode = ->
	@code = @encode()
	(document.getElementById "rle_code").value = @code
	# wout "rle_code",@code

#Event Handler
handleronChange = (e) ->
	el = e.target
	st = el.className
	if st == "smallBox cell"
		id = parseInt el.id
		el=el.firstElementChild
	else
		id = parseInt el.parentElement.id
	grid.matrix[id] = grid.farb
	el.className = "innerBox #{grid.farbTab[grid.farb]}"
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
	farb: "P"
	anzFarb: 8
	matrix: []
	code: ""
	createGrid: createCodeRows
	defgridborder: defineStyle
	createMat: createRandomMatrix
	updateMat: updateMatrix
	enLZW: encodeLZW
	enBIT: encodeBIT
	encode: enc
	evalinp: evaluateInput
	encode_lzw: enc_lzw
	decode_lzw: dec_lzw
	decLZW: decodeLZW
	decBIT:	decodeBIT
	decode: dec
	outCodeToForm: outCode
	addcol: addcolumn
	mincol: mincolumn
	clone: makeclone
	buildFromCode: bfromcode


grid.farbTab =
	"W" : "weiss"
	"R" : "rot"
	"P" : "hellrosa"
	"N" : "braun"
	"B" : "blau"
	"G" : "gelb"
	"S" : "schwarz"
	"U" : "gruen"

grid.farbCode =
	0 : "W"
	1 :	"R"
	2 : "P"
	3 :	"N"
	4 :	"B"
	5 : "G"
	6 : "S"
	7 : "U"
	
grid.farbNr =
	"W" : 0
	"R" : 1
	"P" : 2
	"N" : 3
	"B" : 4
	"G" : 5
	"S" : 6
	"U"	: 7

grid.element = document.getElementById "code"
grid.element.innerHTML= grid.createGrid().join ""
grid.defgridborder()
selectFarb grid.farb



grid.element.addEventListener "click",handleronChange,false
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
	if el.value == "Bitmap Codierung"
		elformat.className = "span2 hide"
	else
		elformat.className = "span2"
	grid.outCodeToForm()
	false

elformat = document.getElementById "selectCodeFormat"
elformat.onchange = (e) ->
	grid.outCodeToForm()
	false


