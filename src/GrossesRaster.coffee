
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
		#{createCodeBlock(j,@col-1).join ''} 
		</div>
		"""
defineStyle = () ->
	@element.style.width = "#{@col*52}px"
	@element.style.height= "#{@row*52}px"

updateCell = (i,s) ->
	el = document.getElementById i
	inp = el.getElementsByClassName("numberInput")[0]
	inp.value = s

handleronChange = (e) ->
	#el = e.srcElement
	el = e.target
	sudoku.socket.emit "updateClick", {
      index: el.parentElement.id,
      value: el.value
    }

sudoku = 
	row: 9
	col: 9
	createGrid: createCodeRows
	defStyle: defineStyle
	
sudoku.element = document.getElementById "code"
sudoku.element.innerHTML= sudoku.createGrid().join ''
sudoku.defStyle()

sudoku.element.addEventListener "change", handleronChange, false
