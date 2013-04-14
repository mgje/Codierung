
createCodeBlock = (k,n) ->
	for i in [0..n]
		"""
		<div id="#{k*sudoku.col+i}" class="smallBox cell">
			<div class="innerBox null"></div>
		</div>
		"""
createCodeRows = () ->
	for j in [0..@row-1]
		"""
		<div class="row">
		#{createCodeBlock(j,@col-1).join ""} 
		</div>
		"""
defineStyle = () ->
	@element.style.width = "#{@col*24}px"
	@element.style.height= "#{@row*24}px"

updateCell = (i,s) ->
	el = document.getElementById i
	inp = el.getElementsByClassName("numberInput")[0]
	inp.value = s

handleronChange = (e) ->
	el = e.target
	st = el.className
	if st == "innerBox null"
		el.className = "innerBox eins"
	
	if st =="innerBox eins"
		el.className = "innerBox null"
	false
	

sudoku = 
	row: 20
	col: 36
	createGrid: createCodeRows
	defStyle: defineStyle
	
sudoku.element = document.getElementById "code"
sudoku.element.innerHTML= sudoku.createGrid().join ''
sudoku.defStyle()

sudoku.element.addEventListener "click", handleronChange, false
