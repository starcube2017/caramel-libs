var http = require('http'),
	url = require('url'),
	fs = require('fs'),
	DOMParser = require('xmldom').DOMParser;
	
var server = http.createServer((req, res) => {
	var	urlArr = url.parse(req.url);
	
	//console.log(urlArr.pathname);
	if(urlArr.pathname.split(".")[1] == "html" || urlArr.pathname.split(".")[1] == "js")
	{
		var content = fs.readFileSync(__dirname + urlArr.pathname,"utf8");
		res.end(content);
		
	}
	else if(urlArr.pathname.split(".")[1] == "ico")
	{
			
	
		//res.end();
	}	
	else if(urlArr.pathname.split(".")[1] == "jpg")
	{	
		//console.log(urlArr.pathname.split(".")[1]);
		res.setHeader("Content-Type","image/jpeg");
		var content = fs.readFileSync(__dirname + urlArr.pathname,"binary");
		res.writeHead(200,"Ok");
		res.write(content,"binary");
		res.end();
	}
	else
	{
		
		

		
	}		
	
});

server.on('connection',(socket) => {
	
			socket.on('data',(data) => {
				try{
				var param = data.toString().split("\n");
					param = param[param.length - 1];
				
				if(param != undefined)
				{
					//console.log(param);
					var convertData = eval("(" + param + ")");		
					
								
					if(convertData.command == "ADD_CHARA")
					{	
						//console.log(__dirname + "\\charas.xml");
						var chara = jsonTxtTojson(convertData);
						
						
						//chara.rabbit.x = 15;
						//console.log(chara);
						//replaceChara(chara);
						addChara(chara);
						
						var charaXml = fs.readFileSync(__dirname + "\\charas.xml","utf8");
						//console.log(charaXml.toString());
						socket.end("'" +charaXml.toString() + "'","utf8");
					}				
					else if(convertData.command == "START")
					{
						var charaXml = fs.readFileSync(__dirname + "\\charas.xml","utf8");
						var chatXml = fs.readFileSync(__dirname + "\\chat.xml","utf8");
						
						socket.end("'" +charaXml.toString() + "'" + "@@" + chatXml,"utf8");
					}
					else if(convertData.command == "MOVE_CHARA")
					{
						var chara = jsonTxtTojson(convertData);
						replaceChara(chara);
						var charaXml = fs.readFileSync(__dirname + "\\charas.xml","utf8");
						socket.end("'" +charaXml.toString() + "'","utf8");
					}
					else if(convertData.command == "CHARA_CHAT")
					{
						var chara = jsonTxtTojson(convertData);
						
						//console.log(convertData.chatContent);
						var cName = "";
						for(c in chara)
						{
							cName = c;
						}
						addChat(cName + ":" + convertData.chatContent);
						
						var chatXml = fs.readFileSync(__dirname + "\\chat.xml","utf8");
						socket.end(chatXml.toString(),"utf8");
					}
				}	
				}catch(e){
					socket.end();
				}	
			});	

		});
server.on('clientError', (err, socket) => {
	//socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(8000);
function jsonTxtTojson(txt)
{
	for(cName in txt)
	{
		if(cName != "command")
		{
			//console.log(txt[cName]);
			var obj = txt[cName];
			chara = '{"' +cName + '" : {';
			for(c in obj)
			{
				//console.log(c);
				//console.log(obj[c]);
				chara = chara +
				'"'+c+'":"' +obj[c]+ '" ,';
									
			}
				chara = chara.slice(0,-1);
				chara = chara + "} }";
				//chara = '"' + chara + '"';
				//console.log(chara);
				chara = eval("(" + chara + ")");
		}	
	}		
	return chara;					
}
function addChat(chat){
	var rawFile = fs.readFileSync(__dirname + "\\chat.xml","utf8");
		xmlObj = parseXml(rawFile.toString());
		
	var chatXml = fs.readFileSync(__dirname + "\\chat.xml","utf8");	
		
			
	fs.writeFileSync(__dirname + "\\chat.xml",chatXml.toString() + "<br>" +chat);	
	
}
function addChara(chara){
	var rawFile = fs.readFileSync(__dirname + "\\charas.xml","utf8");
		xmlObj = parseXml(rawFile.toString()),
		charaName = "";
		
		for(cName in chara)
		{
			charaName = cName;
		}
		
    var charaNode = xmlObj.getElementsByTagName(charaName)[0];
	//console.log(charaNode);
	if(charaNode == undefined)
	{
		
		var xmlChara = json2xml(chara),
		    xmlCharaObj = parseXml(xmlChara);
			
			//console.log(xmlCharaObj);
			
			xmlObj.documentElement.appendChild(xmlCharaObj);
			fs.writeFileSync(__dirname + "\\charas.xml",xmlObj.toString());
	}
	

	//var nodes = xpath(xmlObj,"//" + charaName);	
	//console.log(nodes[0].localName + ": " + nodes[0].firstChild);
	//console.log("node: " + nodes[0].toString());
}
function replaceChara(chara){
	var rawFile = fs.readFileSync(__dirname + "\\charas.xml","utf8");
		xmlObj = parseXml(rawFile.toString()),
		charaName = "";
		
	for(cName in chara)
	{
		charaName = cName;
	}
		
    var charaNode = xmlObj.getElementsByTagName(charaName)[0];
	
	if(charaNode != undefined)
	{
		x = xmlObj.documentElement;
		
		x.replaceChild(parseXml(json2xml(chara)),charaNode);
		
		//console.log(xml2json(x));
		xmlObj.documentElement = x;
		fs.writeFileSync(__dirname + "\\charas.xml",xmlObj.toString());
	}
	
}
function parseXml(xml) {
   var dom = null;
   dom = new DOMParser().parseFromString(xml); 
   return dom;
}

function xml2json(xml, tab) {
   var X = {
      toObj: function(xml) {
         var o = {};
         if (xml.nodeType==1) {   // element node ..
            if (xml.attributes.length)   // element with attributes  ..
               for (var i=0; i<xml.attributes.length; i++)
                  o["@"+xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue||"").toString();
            if (xml.firstChild) { // element has child nodes ..
               var textChild=0, cdataChild=0, hasElementChild=false;
               for (var n=xml.firstChild; n; n=n.nextSibling) {
                  if (n.nodeType==1) hasElementChild = true;
                  else if (n.nodeType==3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
                  else if (n.nodeType==4) cdataChild++; // cdata section node
               }
               if (hasElementChild) {
                  if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
                     X.removeWhite(xml);
                     for (var n=xml.firstChild; n; n=n.nextSibling) {
                        if (n.nodeType == 3)  // text node
                           o["#text"] = X.escape(n.nodeValue);
                        else if (n.nodeType == 4)  // cdata node
                           o["#cdata"] = X.escape(n.nodeValue);
                        else if (o[n.nodeName]) {  // multiple occurence of element ..
                           if (o[n.nodeName] instanceof Array)
                              o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
                           else
                              o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
                        }
                        else  // first occurence of element..
                           o[n.nodeName] = X.toObj(n);
                     }
                  }
                  else { // mixed content
                     if (!xml.attributes.length)
                        o = X.escape(X.innerXml(xml));
                     else
                        o["#text"] = X.escape(X.innerXml(xml));
                  }
               }
               else if (textChild) { // pure text
                  if (!xml.attributes.length)
                     o = X.escape(X.innerXml(xml));
                  else
                     o["#text"] = X.escape(X.innerXml(xml));
               }
               else if (cdataChild) { // cdata
                  if (cdataChild > 1)
                     o = X.escape(X.innerXml(xml));
                  else
                     for (var n=xml.firstChild; n; n=n.nextSibling)
                        o["#cdata"] = X.escape(n.nodeValue);
               }
            }
            if (!xml.attributes.length && !xml.firstChild) o = null;
         }
         else if (xml.nodeType==9) { // document.node
            o = X.toObj(xml.documentElement);
         }
         else
            alert("unhandled node type: " + xml.nodeType);
         return o;
      },
      toJson: function(o, name, ind) {
         var json = name ? ("\""+name+"\"") : "";
         if (o instanceof Array) {
            for (var i=0,n=o.length; i<n; i++)
               o[i] = X.toJson(o[i], "", ind+"\t");
            json += (name?":[":"[") + (o.length > 1 ? ("\n"+ind+"\t"+o.join(",\n"+ind+"\t")+"\n"+ind) : o.join("")) + "]";
         }
         else if (o == null)
            json += (name&&":") + "null";
         else if (typeof(o) == "object") {
            var arr = [];
            for (var m in o)
               arr[arr.length] = X.toJson(o[m], m, ind+"\t");
            json += (name?":{":"{") + (arr.length > 1 ? ("\n"+ind+"\t"+arr.join(",\n"+ind+"\t")+"\n"+ind) : arr.join("")) + "}";
         }
         else if (typeof(o) == "string")
            json += (name&&":") + "\"" + o.toString() + "\"";
         else
            json += (name&&":") + o.toString();
         return json;
      },
      innerXml: function(node) {
         var s = ""
         if ("innerHTML" in node)
            s = node.innerHTML;
         else {
            var asXml = function(n) {
               var s = "";
               if (n.nodeType == 1) {
                  s += "<" + n.nodeName;
                  for (var i=0; i<n.attributes.length;i++)
                     s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue||"").toString() + "\"";
                  if (n.firstChild) {
                     s += ">";
                     for (var c=n.firstChild; c; c=c.nextSibling)
                        s += asXml(c);
                     s += "</"+n.nodeName+">";
                  }
                  else
                     s += "/>";
               }
               else if (n.nodeType == 3)
                  s += n.nodeValue;
               else if (n.nodeType == 4)
                  s += "<![CDATA[" + n.nodeValue + "]]>";
               return s;
            };
            for (var c=node.firstChild; c; c=c.nextSibling)
               s += asXml(c);
         }
         return s;
      },
      escape: function(txt) {
         return txt.replace(/[\\]/g, "\\\\")
                   .replace(/[\"]/g, '\\"')
                   .replace(/[\n]/g, '\\n')
                   .replace(/[\r]/g, '\\r');
      },
      removeWhite: function(e) {
         e.normalize();
         for (var n = e.firstChild; n; ) {
            if (n.nodeType == 3) {  // text node
               if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
                  var nxt = n.nextSibling;
                  e.removeChild(n);
                  n = nxt;
               }
               else
                  n = n.nextSibling;
            }
            else if (n.nodeType == 1) {  // element node
               X.removeWhite(n);
               n = n.nextSibling;
            }
            else                      // any other node
               n = n.nextSibling;
         }
         return e;
      }
   };
   if (xml.nodeType == 9) // document node
      xml = xml.documentElement;
   var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
   return "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
}

function json2xml(o, tab) {
   var toXml = function(v, name, ind) {
      var xml = "";
      if (v instanceof Array) {
         for (var i=0, n=v.length; i<n; i++)
            xml += ind + toXml(v[i], name, ind+"\t") + "\n";
      }
      else if (typeof(v) == "object") {
         var hasChild = false;
         xml += ind + "<" + name;
         for (var m in v) {
            if (m.charAt(0) == "@")
               xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
            else
               hasChild = true;
         }
         xml += hasChild ? ">" : "/>";
         if (hasChild) {
            for (var m in v) {
               if (m == "#text")
                  xml += v[m];
               else if (m == "#cdata")
                  xml += "<![CDATA[" + v[m] + "]]>";
               else if (m.charAt(0) != "@")
                  xml += toXml(v[m], m, ind+"\t");
            }
            xml += (xml.charAt(xml.length-1)=="\n"?ind:"") + "</" + name + ">";
         }
      }
      else {
         xml += ind + "<" + name + ">" + v.toString() +  "</" + name + ">";
      }
      return xml;
   }, xml="";
   for (var m in o)
      xml += toXml(o[m], m, "");
   return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
}
