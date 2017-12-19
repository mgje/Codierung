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
		.attr("transform", (d) -> "translate (#{d.y},#{d.x})")

	node.append("circle")
		.attr("r", 7.4)
	  
	node.append("text")
		.attr("dx",-4)
		.attr("dy", 5)
		.attr("text-anchor", "start")
		.text( (d) -> if d.name[0] != "H"
				d.name[0])
	node.append("text")
		.attr("dx", 11)
		.attr("dy", 5)
		.attr("text-anchor", "start")
		.text( (d) -> if d.name[1]==":"
			d.name[2]
		else
			""
		)
#  End Tree

# Behaviour Form Change
sInput = (form) ->
	@txt = form.value
	@encode()
	false

# Decode binary codes
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

cBits = ->
	tmp = 0
	for c in @encbin
		if c == "1" or c == "0" then tmp +=1
	tmp+" Bits"

enc = ->
	el = document.getElementById "selectCode" 
	if el.value == "ASCII Codierung"
		@encodeASCII()
		e = clearAllChilds "chart"
		#wout "encodeout",@encbin
		el2 = document.getElementById "encodeout"
		el2.innerHTML = @encHTMLbin
	else
		@encodeHuffman()
		#wout "encodeout",@encHTMLbin
		el2 = document.getElementById "encodeout"
		el2.innerHTML = @encHTMLbin

	wout "Bits",@countBits()
	$(".Hcode").tooltip()
	false

dHuffmanBitString = (tbin) ->
    i = "";
    b = @huffman.root
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

gHTMLbin = (tbin) ->
	i = "<div class='Hcode even' rel='tooltip' data-placement='top' title=' #{@txt[0]} '>"
	b = @huffman.root
	f = tbin.split ""
	e = f.length
	pos = 0
	for g in [0...e]
		h = f[g]
		if h == "0" then c = "left" else c = "right"
		i += h
		b = b[c]; # next Position on Tree
		if b.isLeaf()
			pos += 1  #Next Character
			if pos%2 == 0 then cl = "Hcode even" else cl = "Hcode odd"
			i += "</div><div class='#{cl}' rel='tooltip' data-placement='top' title=' #{@txt[pos]} '>"
			b = @huffman.root # reset to root

	#remove last div Element
	s= "<div class='#{cl}' rel='tooltip' data-placement='top' title=' #{@txt[pos]} '>"
	i = i.substring(0, i.length - s.length)
	i+= "</div>"
	i

dASCIIBitString = (tbin) ->
	
	code = tbin.match /.{1,8}/g  # create 8Bit Blocks
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
	@encHTMLbin = @genEncHTMLbin @encbin
	@treeEncoded = @huffman.encodeTree()
	@genTree()
	false

eASCII = ->
	@enctxt = @txt
	encArray = []
	for c in @enctxt
		encArray.push c.charCodeAt()

	@encbin = ""
	
	@encHTMLbin = "<div id='huffmanCode' ><div class='Hcode even' rel='tooltip' data-placement='top' title=' #{@txt[0]}  '>"
	j = 1
	for z in encArray
		s = z.toString(2)
		n = 8-s.length
		if n > 0
			for i in [0...n]
				@encbin += "0"
				@encHTMLbin += "0"
		
		if j%2 == 0 then cl = "Hcode even" else cl = "Hcode odd"
		@encbin += s
		@encHTMLbin += s
		@encHTMLbin += "</div><div class='#{cl}' rel='tooltip' data-placement='top' title=' #{@txt[j]} '>"
		j += 1
	#remove last div Element
	ts= "<div class='#{cl}' rel='tooltip' data-placement='top' title=' #{@txt[j]} '>"
	@encHTMLbin = @encHTMLbin.substring(0, @encHTMLbin.length - ts.length)
	@encHTMLbin += "</div></div>"	
	false
	
# Huffman Object
huff =
	txt: ""			# Plain Text input
	dectxt: ""		# Decoded Text 
	enctxt: ""		# Encoded Text with 01
	encbin: ""		# Encoded Text huffan Compressed
	encHTMLbin: ""  # Encoded HTML huffan Compressed
	huffman: ""		# huffman Object from lib
	treeEncoded: "" # Treerepresentation
	setInput: sInput          #Methods
	encodeASCII: eASCII
	encodeHuffman: eHuffman
	encode: enc
	countBits: cBits
	decode: dec
	decodeASCII: dASCII
	decodeHuffman: dHuffman
	decodeHuffmanBitString: dHuffmanBitString
	genEncHTMLbin: gHTMLbin
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






