
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
	@element.style.width = "#{@col*12}px"
	@element.style.height= "#{@row*12}px"

updateCell = (i,s) ->
	el = document.getElementById i
	inp = el.getElementsByClassName("numberInput")[0]
	inp.value = s

handleronChange = (e) ->
	el = e.target
	st = el.className
	id = parseInt el.parentElement.id
	if st == "innerBox null"
		el.className = "innerBox eins"
		@matrix[id] = 1
	
	if st =="innerBox eins"
		el.className = "innerBox null"
		@matrix[id] = 0
	false

createRandomMatrix = ->
	for y in [0...@row]
		for x in [0...@col]
			d = Math.random()
			z = Math.floor(2*d)
			@matrix[y*@col+x]= z
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

decodeRLE = ->
	@col = @code.shift()
	@matrix = []
	farb = 0
	for c in @code
		for i in [0...c]
			@matrix.push(farb)				
		if farb == 0 then farb = 1 else farb = 0
	@row = Math.floor @matrix.length/@col
	# Angefangene Zeile
	if @row != Math.round @matrix.length/@col
		@row +=1

# Ausertung des Formularfeldes
evaluateInput = (form) ->
	input = form.value
	zm = []	
	for z in input.split ',' 
		zm.push parseInt z
	@code = zm
	grid.decRLE()
	grid.element.innerHTML = grid.createGrid().join ''
	grid.defgridborder()
	grid.updateMat()

outCode = ->
	s = grid.enRLE()
	pre = document.getElementById "codeout"
	pre.innerHTML = s


grid = 
	row: 50
	col: 50
	matrix: []
	code: []
	createGrid: createCodeRows
	defgridborder: defineStyle
	createMat: createRandomMatrix
	updateMat: updateMatrix
	enRLE: encodeRLE
	evalinp: evaluateInput
	decRLE: decodeRLE
	outCodeToForm: outCode
	
grid.element = document.getElementById "code"
grid.element.innerHTML= grid.createGrid().join ''
grid.defgridborder()

grid.element.addEventListener "click", handleronChange, false
grid.createMat()
grid.updateMat()
grid.enRLE()


# Events an Formular binden 
# Enter
document.forms[0].onkeypress = (e) ->
	if !e
		e = window.event
	if e.keyCode ==13
		grid.evalinp e.target
		false
# Click Decode
bt = document.forms[0].button
bt.onclick = (e) ->
 	grid.evalinp e.target.form[0]	
 	false


# Click Encode
bt2 = document.forms[1].button
bt2.onclick = (e) ->
 	grid.outCodeToForm()
 	false
