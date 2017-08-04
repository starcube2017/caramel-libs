function ServerRoom(player){
	
	var serverRoom = this;
	
	serverRoom.player = player;
	
	serverRoom.isConnect = false;
	
	serverRoom.stopHeartbeat = stopHeartbeat;
	
	serverRoom.connect = connect;
	
	serverRoom.addChara = addChara;
	
	serverRoom.charaChat = charaChat;
	
	serverRoom.start = start;
	
	serverRoom.chara = [];
	
	serverRoom.command = {"heartbeat":"HEARTBEAT","addChara":"ADD_CHARA","start":"START","moveChara":"MOVE_CHARA","charaChat":"CHARA_CHAT"};
	
	serverRoom.convertCommandToJsonText = convertCommandToJsonText;

	
	function init(){
		
		//serverRoom.heartbeat = setInterval(serverRoom.connect,2000);
		serverRoom.serverRoomEvent = new EventTarget();
		
		serverRoom.serverRoomEvent.addEvent("refreshChara",refreshChara);
		
		serverRoom.serverRoomEvent.addEvent("initChara",initChara);
	}
	
	function stopHeartbeat()
	{
		clearInterval(serverRoom.heartbeat);
		
	}
	function connect(){
		
		$.post("http://localhost",serverRoom.command.heartbeat,function(data){
			
			
		})
	}
	function convertCommandToJsonText(str){
		
		var text = '{"command" : "'+str+'"}';
		return text;
	}
	function charaChat(content,divId){
		var commandJsonText = serverRoom.convertCommandToJsonText(serverRoom.command.charaChat);
		var charaJsonText = player.convertToJsonText();
		var chatContent = '{"chatContent" : "'+content+'"}';
		
		var dataCommand = chatContent.slice(0,-1) + "," + commandJsonText.slice(1,-1) + "," + player.convertToJsonText().slice(1,-1) + "}"
		//var t = eval("(" + dataCommand + ")");
		
		$.ajax({
			type: 'POST',
			url: "http://localhost/CHARA_CHAT",
			data: dataCommand,
			success: function(data){
				$("#" + divId).html(data);	
				lct = document.getElementById('chatBox');
				lct.scrollTop=Math.max(0,lct.scrollHeight-lct.offsetHeight);
			},
			sync: false
		});
		
	}
	function addChara(chara){
		var commandJsonText = serverRoom.convertCommandToJsonText(serverRoom.command.addChara);
		var charaJsonText = chara.convertToJsonText();
		
		var dataCommand = commandJsonText.slice(0,-1) + "," + chara.convertToJsonText().slice(1,-1) + "}"
		//var t = eval("(" + dataCommand + ")");
		
		$.ajax({
			type: 'POST',
			url: "http://localhost/ADD_CHARA",
			data: dataCommand,
			success: function(data){
					var data = data.slice(1,-1);
					var xmldom = parseXml(data),
						x = xmldom.documentElement.childNodes;
					for(i=0;i<=x.length;i++)
					{
						chara = xml2json(x[i]);
						revise = '{"' + chara.slice(chara.indexOf('"')+1,-2) + '}';
						chara = eval("(" + revise + ")");
						
						for(n in chara)
							serverRoom.chara.push(chara[n]);
						
					}					
						
					
				
			},
			sync: false
		});
		
	}
	function start(){
		var commandJsonText = serverRoom.convertCommandToJsonText(serverRoom.command.start);
		
		$.post("http://localhost:8000/START",commandJsonText,function(d){
					var data = d.split("@@")[0];
						data = data.slice(1,-1);
					var xmldom = parseXml(data),
						x = xmldom.documentElement.childNodes;
						serverRoom.chara = []
					for(i=0;i<x.length;i++)
					{
						chara = xml2json(x[i]);
						revise = '{"' + chara.slice(chara.indexOf('"')+1,-2) + '}';
						chara = eval("(" + revise + ")");
						for(n in chara)
							serverRoom.chara.push(chara[n]);
					}		

					$("#" + "chatBox").html(d.split('@@')[1]);
					lct = document.getElementById('chatBox');
					lct.scrollTop=Math.max(0,lct.scrollHeight-lct.offsetHeight);
					serverRoom.serverRoomEvent.fireEvent({type:"initChara"});	
		});
	
	}
	function initChara(data){
		if(serverRoom.chara != null)
		{
			for(name in serverRoom.chara)
			{
				var temp = scene.getObjectByName(serverRoom.chara[name].name)
				if(temp)			
				{
					temp.position.x = serverRoom.chara[name].x;
					temp.position.y = serverRoom.chara[name].y;
					temp.position.z = serverRoom.chara[name].z;
					temp.rotation.y = serverRoom.chara[name].ry;
					temp.name = serverRoom.chara[name].name;
					
					if(temp.name == player.name)
					{
						player.display = temp;
						player.x = temp.position.x;
						player.y = temp.position.y;
						player.z = temp.position.z;
						player.ry = temp.rotation.y;
					}
				
				}else
				{
					var caramelMan = new CaramelMan();
					caramelMan.display.position.x = serverRoom.chara[name].x;
					caramelMan.display.position.y = serverRoom.chara[name].y;
					caramelMan.display.position.z = serverRoom.chara[name].z;
					caramelMan.display.rotation.y = serverRoom.chara[name].ry;
					caramelMan.display.name = serverRoom.chara[name].name;
					caramelMan.name = serverRoom.chara[name].name;
					scene.add(caramelMan.display);
					caramelMan.walk();
				}
				
				
			
			}
		}
		
		
	}
	function beginControl(e)
		{
			var step = parseInt(1);
			caramelMan = player;
			caramelMan.x = parseInt(caramelMan.x);
			caramelMan.y = parseInt(caramelMan.y);
			caramelMan.ry = parseFloat(caramelMan.ry);
			if(event.keyCode == 38)
			{
				caramelMan.ry = -4.5 * Math.PI;
				caramelMan.y += step;
				caramelMan.x -= step;
				
				
			var commandJsonText = serverRoom.convertCommandToJsonText(serverRoom.command.moveChara);
			var charaJsonText = caramelMan.convertToJsonText();
		
			var dataCommand = commandJsonText.slice(0,-1) + "," + caramelMan.convertToJsonText().slice(1,-1) + "}";
			
			$.post("http://localhost/MOVE_CHARA",dataCommand,function(data){
					var data = data.slice(1,-1);
					var xmldom = parseXml(data),
						x = xmldom.documentElement.childNodes;
					serverRoom.chara = [];	
					for(i=0;i<x.length;i++)
					{
						chara = xml2json(x[i]);
						revise = '{"' + chara.slice(chara.indexOf('"')+1,-2) + '}';
						chara = eval("(" + revise + ")");
						for(n in chara)
							serverRoom.chara.push(chara[n]);
					}		

					serverRoom.serverRoomEvent.fireEvent({type:"initChara"});	
			});
				
			}
			else if(event.keyCode == 37)
			{
				caramelMan.ry = 0 * Math.PI;
				caramelMan.x -= step;
				
			var commandJsonText = serverRoom.convertCommandToJsonText(serverRoom.command.moveChara);
			var charaJsonText = caramelMan.convertToJsonText();
		
			var dataCommand = commandJsonText.slice(0,-1) + "," + caramelMan.convertToJsonText().slice(1,-1) + "}";
			
			$.post("http://localhost/MOVE_CHARA",dataCommand,function(data){
					var data = data.slice(1,-1);
					var xmldom = parseXml(data),
						x = xmldom.documentElement.childNodes;
					serverRoom.chara = [];	
					for(i=0;i<x.length;i++)
					{
						chara = xml2json(x[i]);
						revise = '{"' + chara.slice(chara.indexOf('"')+1,-2) + '}';
						chara = eval("(" + revise + ")");
						for(n in chara)
							serverRoom.chara.push(chara[n]);
					}		

					serverRoom.serverRoomEvent.fireEvent({type:"initChara"});	
			});
				
			}
			else if(event.keyCode == 39)
			{
				caramelMan.ry = 9 * Math.PI;
				caramelMan.x += step;
				
			var commandJsonText = serverRoom.convertCommandToJsonText(serverRoom.command.moveChara);
			var charaJsonText = caramelMan.convertToJsonText();
		
			var dataCommand = commandJsonText.slice(0,-1) + "," + caramelMan.convertToJsonText().slice(1,-1) + "}";
			
			$.post("http://localhost/MOVE_CHARA",dataCommand,function(data){
					var data = data.slice(1,-1);
					var xmldom = parseXml(data),
						x = xmldom.documentElement.childNodes;
					serverRoom.chara = [];	
					for(i=0;i<x.length;i++)
					{
						chara = xml2json(x[i]);
						revise = '{"' + chara.slice(chara.indexOf('"')+1,-2) + '}';
						chara = eval("(" + revise + ")");
						for(n in chara)
							serverRoom.chara.push(chara[n]);
					}		

					serverRoom.serverRoomEvent.fireEvent({type:"initChara"});	
			});
				
			}
			else if(event.keyCode == 40)
			{
				caramelMan.ry = 4.5 * Math.PI;
				caramelMan.y -= step;
				caramelMan.x += step;
				
			var commandJsonText = serverRoom.convertCommandToJsonText(serverRoom.command.moveChara);
			var charaJsonText = caramelMan.convertToJsonText();
		
			var dataCommand = commandJsonText.slice(0,-1) + "," + caramelMan.convertToJsonText().slice(1,-1) + "}";
			
			$.post("http://localhost/MOVE_CHARA",dataCommand,function(data){
					var data = data.slice(1,-1);
					var xmldom = parseXml(data),
						x = xmldom.documentElement.childNodes;
					serverRoom.chara = [];	
					for(i=0;i<x.length;i++)
					{
						chara = xml2json(x[i]);
						revise = '{"' + chara.slice(chara.indexOf('"')+1,-2) + '}';
						chara = eval("(" + revise + ")");
						for(n in chara)
							serverRoom.chara.push(chara[n]);
					}		

					serverRoom.serverRoomEvent.fireEvent({type:"initChara"});	
			});
				
			}
			
		
			
			
			
		}
	function refreshChara(data){
		if(serverRoom.chara != null)
		{
			var cha = null;
			for(t in data.chara)
			{
				cha = data.chara[t];
				var chara = scene.getObjectByName(cha.name);
				chara.position.x = cha.x;
				chara.position.y = cha.y;
				chara.positionz = cha.z;
			}
			//serverRoom.chara.forEach(function(obj,index){
			//	if(obj.name == cha.name)
			//	{
			//		obj.x = cha.x;
			//		obj.y = cha.y;
			//		obj.z = cha.z;
			//	}
			//});
			
			
			renderer.render(scene,camera);
		}
	}
	
	function parseXml(xml) {
	   var dom = null;
	   if (window.DOMParser) {
		  try { 
			 dom = (new DOMParser()).parseFromString(xml, "text/xml"); 
		  } 
		  catch (e) { dom = null; }
	   }
	   else if (window.ActiveXObject) {
		  try {
			 dom = new ActiveXObject('Microsoft.XMLDOM');
			 dom.async = false;
			 if (!dom.loadXML(xml)) // parse error ..
				window.alert(dom.parseError.reason + dom.parseError.srcText);
		  } 
		  catch (e) { dom = null; }
	   }
	   else
		  alert("oops");
	   return dom;
	}
	
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
	init();
	$(document).keydown(beginControl);
}
