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
			z = Math.floor(2*d)
			@matrix[y*@col+x]= z
	wout "rowcol","#{@col} x #{@row} |         #{@col} Spalten / #{@row} Zeilen"		
	false

updateMatrix = ->
	for y in [0...@row]
		for x in [0...@col]
			id = y*@col+x
			e = (document.getElementById id).getElementsByTagName "div"
			if @matrix[id] == 0
				e[0].className = "innerBox null"
			if @matrix[id] == 1
				e[0].className = "innerBox eins"

encodeRLE = ->
	@code =[]
	@code.push @col
	farbe = 0
	z = 0 # Begin with Black
	for pixel in @matrix
		if pixel == farbe
			z = z+1
		else
			@code.push z
			z = 1
			if farbe == 0 then farbe = 1 else farbe = 0
	@code.push z				 
	@code.join()

encodeBIT = ->
	@code =[]
	@code.push @col
	for pixel in @matrix
		@code.push pixel
					 
	@code.join()

enc = ->
	el = document.getElementById("selectCode")
	if el.value == "Bitmap Codierung"
		@enBIT()
	else
		@enRLE()

decodeRLE = ->
	col = @code.shift()
	if col > @maxcol
		alert "Es können nicht #{col} Pixel pro Zeile dargestellt werden. Die maximale Anzahl Pixel beträgt #{@maxcol} "
	else
		@col = col
		@matrix = []
		farb = 0
		for c in @code
			for i in [0...c]
				@matrix.push(farb)				
			if farb == 0 then farb = 1 else farb = 0
		@row = Math.floor @matrix.length/@col
		# Angefangene Zeile
		if @row != @matrix.length/@col
			@row +=1
	@code.unshift(col)
	false

decodeBIT = ->
	col = @code.shift()
	if col > @maxcol
		alert "Es können nicht #{col} Pixel pro Zeile dargestellt werden. Die maximale Anzahl Pixel beträgt #{@maxcol} "
	else
		@col = col
		@matrix = []
		for c in @code
			if c==0 or c==1
				@matrix.push(c)				

		@row = Math.floor @matrix.length/@col
		# Angefangene Zeile
		if @row != @matrix.length/@col
			@row +=1
	@code.unshift(col)
	false

dec = ->
	el = document.getElementById("selectCode")
	if el.value == "Bitmap Codierung"
		@decBIT()
	else
		@decRLE()

# Clone the Figure
makeclone = () ->
	len = @code.length
	col = @code.shift()
	b = [].concat @code
	if len % 2 == 0
		b.push(0)
	b = b.concat @code
	@code = b
	@code.unshift(col)
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
	zm = []	
	for z in input.split ',' 
		zm.push parseInt z
	@code = zm
	@buildFromCode()

bfromcode = () ->
	@decode()
	clearAllChilds "code"
	@element.innerHTML = grid.createGrid().join ''
	@defgridborder()
	@updateMat()
	wout "rowcol","#{@col} x #{@row} |         #{@col} Spalten / #{@row} Zeilen"
	false

outCode = ->
	tmps = @encode()
	(document.getElementById "rle_code").value = tmps
	wout "rle_code",tmps

#Event Handler
handleronChange = (e) ->
	el = e.target
	st = el.className
	id = parseInt el.parentElement.id
	if st == "innerBox null"
		el.className = "innerBox eins"
		grid.matrix[id] = 1
	
	if st =="innerBox eins"
		el.className = "innerBox null"
		grid.matrix[id] = 0
	false

grid = 
	row: 20
	col: 22
	maxcol: 22
	size: 28
	matrix: []
	code: []
	createGrid: createCodeRows
	defgridborder: defineStyle
	createMat: createRandomMatrix
	updateMat: updateMatrix
	enRLE: encodeRLE
	enBIT: encodeBIT
	encode: enc
	evalinp: evaluateInput
	decRLE: decodeRLE
	decBIT:	decodeBIT
	decode: dec
	outCodeToForm: outCode
	addcol: addcolumn
	mincol: mincolumn
	clone: makeclone
	buildFromCode: bfromcode
	
grid.element = document.getElementById "code"
grid.element.innerHTML= grid.createGrid().join ''
grid.defgridborder()

grid.element.addEventListener "click", handleronChange, false
grid.createMat()
grid.updateMat()
grid.encode()


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
el = document.getElementById("selectCode")
el.onchange = (e) ->
	grid.outCodeToForm()
	false