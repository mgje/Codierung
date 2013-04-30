Codierung
=========

Interaktive Experiment zur Huffman-Codierung von Texten und 
der Lauflängen Codierung von Bildern.

[Demonstration der Experiment](http://mgje.github.com/ZahlenMauer/)

Um erste Erfahrungen zu [CoffeeScript](http://coffeescript.org/) (sehr 
effiziente Sprache für JavaScript Programmierung) zu sammeln, erstellte 
ich im Rahmen eines 90 Minuten Projektes diese einfache Webanwendung. 

Aus einer Liste von Zahlen wird jeweils die Summe der direkten
Nachbarn gebildet und auf einer höheren Ebene ausgegeben.

Installation
============
- Archiv herunterladen (zip)
- Zip-Datei auspacken
- die Datei [index.html](public/index.html) im Verzeichnis public 
in einem Browser öffnen

Entwicklung
===========
Die Ereignissteurung der interaktiven Experimente wurde mit Hilfe von coffeeScript programmiert und nach JavaScript
compiliert.

Für die graphische Ausgabe werden die folgenden Bibliotheken verwendet:
- Bootstrap (Navigation / Knöpfe)
- d3 (Baum)
- jQuery (Tooltip)

Das Experiment zur Huffman-Codierung verwendet die Bibliothek [huffman JS](https://github.com/wilkerlucio/huffman_js)
von [Wilker Lúcio](https://github.com/wilkerlucio)

CoffeeScript ermöglicht es kompakte und übersichtliche Programme zu erstellen.
Weitere Informationen zum Arbeiten mit CoffeeScript finden sich unter:
[http://coffeescript.org/](http://coffeescript.org/)

Mögliche Weiterentwicklung:

- LZW Codierung

