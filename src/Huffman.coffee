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
			i = i + 1
		false
	else
		entry =
			name: name+":"+inode

		if typeof onode != "undefined"
			onode.push entry
		
		false


#  Begin Tree
buildTree = ->
	e = clearAllChilds "chart"
	tjson = []
	appendNode @treeEncoded,tjson,"Huffman Baum     "
	json = tjson[0]

	w = 780
	h = 780

	tree = d3.layout.tree().size [h, w - 360]

	diagonal = d3.svg.diagonal().projection (d)->
		[d.y, d.x]

	vis = d3.select("#chart").append("svg")
	    .attr("width", w)
	    .attr("height", h)
	    .append("g")
	    .attr("transform", "translate(30, 10)")

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
	    .attr("r", 7.4)
	  
	node.append("text")
	      .attr("dx",-4)
	      .attr("dy", 5)
	      .attr("text-anchor", "start")
	      .text( (d) ->
	      	if d.name[0] != "H"
	      		d.name[0]
	      )
	node.append("text")
	      .attr("dx", 11)
	      .attr("dy", 5)
	      .attr("text-anchor", "start")
	      .text( (d) ->
	      	if d.name[1]==":"
	      		d.name[2]
	      	else
	      		""
	      )

#  End Tree


sInput = (form) ->
	@txt = form.value
	@encode()
	false

dec = ->
	el = document.getElementById("selectCode")
	if el.value == "ASCII Codierung"
		@decodeASCII()
	else
		@decodeHuffman()

	wout "decodeout",@dectxt
	false

dHuffman = ->
	#@huffman = Huffman.treeFromText @txt
	@dectxt = @decodeHuffmanBitString @encbin
	

dASCII = ->
	@dectxt = @decodeASCIIBitString @encbin

enc = ->
	el = document.getElementById("selectCode")
	if el.value == "ASCII Codierung"
		@encodeASCII()
		e = clearAllChilds "chart"
	else
		@encodeHuffman()

	wout "encodeout",@encbin
	false

dHuffmanBitString = (tbin) ->
    i = "";
    b = @huffman.root;
    f = tbin.split ""
    e = f.length
    for g in [0...e]
        h = f[g]
        if h == "0" then c = "left" else c = "right"
        b = b[c];
        if b.isLeaf() 
            i += b.value;
            b = @huffman.root
    i

dASCIIBitString = (tbin) ->
	code = tbin.split(" ")
	s= ""
	for c in code
		k = parseInt c,2 
		z = String.fromCharCode k 
		s +=z
	s


eHuffman = ->
	@huffman = Huffman.treeFromText @txt
	@enctxt = @huffman.encode @txt
	@encbin = @huffman.stringToBitString @enctxt
	#console.log @enctxt
	#console.log @encbin
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
	dectxt: ""
	enctxt: ""
	encbin: ""
	huffman: ""
	treeEncoded: ""
	setInput: sInput
	encodeASCII: eASCII
	encodeHuffman: eHuffman
	encode: enc
	decode: dec
	decodeASCII: dASCII
	decodeHuffman: dHuffman
	decodeHuffmanBitString: dHuffmanBitString
	decodeASCIIBitString: dASCIIBitString
	writeOut: wout
	genTree: buildTree


# Events an Formular binden 
# Enter Encode
document.forms[0].onkeypress = (e) ->
	if !e
		e = window.event
	if e.keyCode ==13
		huff.setInput e.target
		false
# Click Encode
bt = document.forms[0].button
bt.onclick = (e) ->
 	huff.setInput e.target.form[0]	
 	false


# Click Decode
bt = document.forms[1].button
bt.onclick = (e) ->
 	huff.decode()	
 	false



# Click Encode
# bt2 = document.forms[1].button
# bt2.onclick = (e) ->
#  	huff.setInput e.target.form[0]
#  	false

# Change Mode
el = document.getElementById("selectCode")
el.onchange = (e) ->
	if huff.enctxt != ""
		huff.encode()
	false


