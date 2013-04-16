
# Rekursive update of two trees
appendNode = (inode, onode, name) ->
	if typeof inode != "string"
		entry =
			name: name
			children: []
		onode.push entry
		i = 0
		for child in inode
			appendNode child,entry.children,i.toString()
			console.log i
			i = i + 1
		false
	else
		entry =
			name: name
			children: [{"name": inode}]

		if typeof onode != "undefined"
			onode.push entry
		
		false


#  Begin Tree
buildTree = ->
	e = document.getElementById "chart"
	e.innerHTML = ""
	tjson = []
	appendNode @treeEncoded,tjson,"Huffman Baum     "
	json = tjson[0]

	w = 780
	h = 600

	tree = d3.layout.tree().size [h, w - 350]

	diagonal = d3.svg.diagonal().projection (d)->
		[d.y, d.x]

	vis = d3.select("#chart").append("svg")
	    .attr("width", w)
	    .attr("height", h)
	    .append("g")
	    .attr("transform", "translate(110, 0)")

	nodes = tree.nodes json

	link = vis.selectAll("path.link")
	      .data(tree.links(nodes))
	      .enter().append("path")
	      .attr("class", "link")
	      .attr("d", diagonal)

	node = vis.selectAll("g.node")
	      .data(nodes)
	       .enter().append("g")
	      .attr("class", "node")
	      .attr("transform", (d) ->
	      	"translate (#{d.y},#{d.x})"
	      )

	node.append("circle")
	      .attr("r", 6.4)
	  
	node.append("text")
	      .attr("dx", (d) ->
	      	if d.children then 4 else 10
	      )
	      .attr("dy", 4)
	      .attr("text-anchor", (d) ->
	      	if d.children then "end" else "start"
	      )
	      .text( (d) ->
	      	d.name
	      )

#  End Tree

sInput = (form) ->
	@txt = form.value
	e = document.getElementById "outtext"
	e.innerHTML = @txt
	@encode()
	false

enc = ->
	el = document.getElementById("selectCode")
	if el.value == "ASCII Codierung"
		@encodeASCII()
	else
		@encodeHuffman()

	@writeOut()

wout = ->
	e = document.getElementById "decodeout"
	e.innerHTML = @encbin


eHuffman = ->
	@huffman = Huffman.treeFromText @txt
	@enctxt = @huffman.encode @txt
	encArray = []
	for c in @enctxt
		encArray.push c.charCodeAt()

	@encbin = ""
	for z in encArray
		@encbin += z.toString(2)


	@treeEncoded = @huffman.encodeTree()
	@genTree()
	false
	

eASCII = ->
	@enctxt = @txt
	encArray = []
	for c in @enctxt
		encArray.push c.charCodeAt()

	@encbin = ""
	for z in encArray
		s = z.toString(2)
		n = 8-s.length
		if n > 0
			for i in [0...n]
				@encbin += "0"
		@encbin += s+" "
	

huff =
	txt: ""
	enctxt: ""
	encbin: ""
	huffman: ""
	treeEncoded: ""
	setInput : sInput
	encodeASCII : eASCII
	encodeHuffman : eHuffman
	encode: enc
	writeOut: wout
	genTree: buildTree


# Events an Formular binden 
# Enter
document.forms[0].onkeypress = (e) ->
	if !e
		e = window.event
	if e.keyCode ==13
		huff.setInput e.target
		false
# Click Decode
bt = document.forms[0].button
bt.onclick = (e) ->
 	huff.setInput e.target.form[0]	
 	false


# Click Encode
# bt2 = document.forms[1].button
# bt2.onclick = (e) ->
#  	huff.setInput e.target.form[0]
#  	false

# Change Mode
el = document.getElementById("selectCode")
el.onchange = (e) ->
	huff.encode()
	false


