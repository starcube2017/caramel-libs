function CaramelMan(name)
{
		
		var caramelMan = this;
		
		caramelMan.name = name;
		
		caramelMan.actionRightHand = actionRightHand;
		
		caramelMan.actionLeftHand = actionLeftHand;
		
		caramelMan.actionDoubleHand = actionDoubleHand;
		
		caramelMan.actionRightFoot = actionRightFoot;
		
		caramelMan.actionLeftFoot = actionLeftFoot;
		
		caramelMan.rotation = rotation;
		
		caramelMan.walk = walk;
		
		caramelMan.convertToJsonText = convertToJsonText;
		
		caramelMan.setX = setX;
		
		caramelMan.setY = setY;
		
		caramelMan.setZ = setZ;
		
		caramelMan.setRY = setRY;
		
		initCaramelMan(caramelMan);
	
		
		function createCube(w,h,d)
		{
		
			var skin = new THREE.MeshPhongMaterial();	
			var cubeGeometry = new THREE.BoxGeometry(w, h, d);
			var cubeMaterial = new THREE.MeshBasicMaterial({color:0x009e60});
			
			
			var skinTexture = THREE.ImageUtils.loadTexture("libs/assets/textures/skin.jpg",{},function(){
					renderer.render(scene,camera);
			});	
				
			skin.map = skinTexture;
			
			var cube = new THREE.Mesh(cubeGeometry, skin);
			cube.castShadow = true;
			
			return cube;
		}
	
		
		function initCaramelMan(caramelMan){
		
			caramelMan.head = setHead();
		
			caramelMan.body = setBody(caramelMan.head);
		
			caramelMan.leftHand = setLeftHand(caramelMan.body);
			
			caramelMan.rightHand = setRightHand(caramelMan.body);
			
			caramelMan.leftFoot = setLeftFoot(caramelMan.body);
			
			caramelMan.rightFoot = setRightFoot(caramelMan.body);
			
			//caramelMan.beginControl = beginControl();
			
			caramelMan.display = setDisplay(caramelMan.head,caramelMan.body,caramelMan.leftHand,caramelMan.rightHand,caramelMan.leftFoot,caramelMan.rightFoot);}
				
			caramelMan.x = caramelMan.display.position.x;
			
			caramelMan.y = caramelMan.display.position.y;
			
			caramelMan.z = caramelMan.display.position.z;
			
			caramelMan.ry = caramelMan.display.rotation.y;
			
		function setHead(){
			
			var face = new THREE.MeshPhongMaterial();	
			var skin = new THREE.MeshPhongMaterial();	
			var faceTexture = THREE.ImageUtils.loadTexture("libs/assets/textures/face.jpg",{},function(){
				renderer.render(scene,camera);
			});
				face.map = faceTexture;
				
			var skinTexture = THREE.ImageUtils.loadTexture("libs/assets/textures/skin.jpg",{},function(){
				renderer.render(scene,camera);
			});	
			
				skin.map = skinTexture;
			var matArray = [];
			matArray.push(skin);
			matArray.push(face);
			matArray.push(skin);
			matArray.push(skin);
			matArray.push(skin);
			matArray.push(skin);
			var headMaterial = new THREE.MeshFaceMaterial(matArray);
				headGeom = new THREE.CubeGeometry(0.4,0.4,0.4);
				
			var head = new THREE.Mesh(headGeom,headMaterial);
			return head;
		}
		
		function setBody(head){
		
			var body = createCube(0.6,0.8,0.6);
				body.name = "body";
				body.position.set(head.position.x,head.position.y - 0.6,head.position.z);
			
			return body;
		}
		
		function setLeftHand(body)
		{
			var leftHand = createCube(0.2,0.8,0.2);
				leftHand.name = "leftHand";
				leftHand.position.set(body.position.x,body.position.y,body.position.z - 0.4);
				
			return leftHand;
		}
		
		function setRightHand(body)
		{
			var rightHand = createCube(0.2,0.8,0.2);
				rightHand.name = "rightHand";
				rightHand.position.set(body.position.x,body.position.y,body.position.z + 0.4);
				
			return rightHand;
		}
		
		function setLeftFoot(body)
		{
			var leftFoot = createCube(0.2,0.8,0.2);
				leftFoot.name = "leftFoot";
				leftFoot.position.set(body.position.x,body.position.y - 0.7,body.position.z - 0.25);
				
			return leftFoot;
		}
		
		function setRightFoot(body)
		{
			var rightFoot = createCube(0.2,0.8,0.2);
				rightFoot.name = "rightFoot";
				rightFoot.position.set(body.position.x,body.position.y - 0.7,body.position.z + 0.1);
				
			return rightFoot;
		}
		
		function setDisplay(head,body,leftHand,rightHand,leftFoot,rightFoot){
			
			var display = new THREE.Object3D();
			display.name = caramelMan.name;
			display.add(head);
			display.add(body);
			display.add(rightHand);
			display.add(leftHand);
			display.add(leftFoot);
			display.add(rightFoot);
			
			return display;
		}
		function setX(x){
			caramelMan.display.position.x = x;
		}
		
		function setY(y){
			caramelMan.display.position.y = y;
		}
		
		function setZ(z){
			caramelMan.display.position.z = z;
		}
		
		function setRY(ry){
			caramelMan.display.rotation.y = ry;
		}

	// 動作action
		function actionClockwiseRightHand(){
			if(caramelMan.rightHand.rotation.z >= -0.5 * Math.PI)
			{
				caramelMan.rightHand.rotation.z -= 0.01 * Math.PI;
				
			}else
			{
				actionCounterClockwiseRightHand();
				return;
			}
			requestAnimationFrame(actionClockwiseRightHand);
			renderer.render(scene, camera);
			
		}
		
		function actionCounterClockwiseRightHand(){
			if(caramelMan.rightHand.rotation.z <= 0.2 * Math.PI)
			{
				caramelMan.rightHand.rotation.z += 0.01 * Math.PI;
				
			}else
			{
				actionClockwiseRightHand();
				return;
			}
			requestAnimationFrame(actionCounterClockwiseRightHand);
			renderer.render(scene, camera);
		}
		function actionRightHand(){
			caramelMan.rightHand.rotation.z = -0.01 * Math.PI;
			actionClockwiseRightHand();
			
			
		}
		
		
		function actionClockwiseLeftHand(){
			if(caramelMan.leftHand.rotation.z >= -0.5 * Math.PI)
			{
				caramelMan.leftHand.rotation.z -= 0.01 * Math.PI;
				
			}else
			{
				actionCounterClockwiseLeftHand();
				return;
			}
			requestAnimationFrame(actionClockwiseLeftHand);
			renderer.render(scene, camera);
			
		}
		
		function actionCounterClockwiseLeftHand(){
			if(caramelMan.leftHand.rotation.z <= 0.2 * Math.PI)
			{
				caramelMan.leftHand.rotation.z += 0.01 * Math.PI;
				
			}else
			{
				actionClockwiseLeftHand();
				return;
			}
			requestAnimationFrame(actionCounterClockwiseLeftHand);
			renderer.render(scene, camera);
		}
		function actionLeftHand(){
			caramelMan.leftHand.rotation.z = -0.01 * Math.PI;
			actionClockwiseLeftHand();
			
		}
		function actionDoubleHand()
		{
			actionLeftHand();
			actionRightHand();
		}
		
		function actionClockwiseRightFoot(){
			if(caramelMan.rightFoot.rotation.z >= -0.3 * Math.PI)
			{
				caramelMan.rightFoot.rotation.z -= 0.01 * Math.PI;
				
			}else
			{
				actionCounterClockwiseRightFoot();
				return;
			}
			requestAnimationFrame(actionClockwiseRightFoot);
			renderer.render(scene, camera);
			
		}
		
		function actionCounterClockwiseRightFoot(){
			if(caramelMan.rightFoot.rotation.z <= 0.3 * Math.PI)
			{
				caramelMan.rightFoot.rotation.z += 0.01 * Math.PI;
				
			}else
			{
				actionClockwiseRightFoot();
				return;
			}
			requestAnimationFrame(actionCounterClockwiseRightFoot);
			renderer.render(scene, camera);
		}
		function actionRightFoot(){
			caramelMan.rightFoot.rotation.z = -0.01 * Math.PI;
			actionClockwiseRightFoot();
			
		}
		
		function actionClockwiseLeftFoot(){
			if(caramelMan.leftFoot.rotation.z >= -0.3 * Math.PI)
			{
				caramelMan.leftFoot.rotation.z -= 0.01 * Math.PI;
				
			}else
			{
				actionCounterClockwiseLeftFoot();
				return;
			}
			requestAnimationFrame(actionClockwiseLeftFoot);
			renderer.render(scene, camera);
			
		}
		
		function actionCounterClockwiseLeftFoot(){
			if(caramelMan.leftFoot.rotation.z <= 0.3 * Math.PI)
			{
				caramelMan.leftFoot.rotation.z += 0.01 * Math.PI;
				
			}else
			{
				actionClockwiseLeftFoot();
				return;
			}
			requestAnimationFrame(actionCounterClockwiseLeftFoot);
			renderer.render(scene, camera);
		}
		function actionLeftFoot(){
			caramelMan.leftFoot.rotation.z = -0.01 * Math.PI;
			actionCounterClockwiseLeftFoot();
			
		}
		function walk(){
			actionDoubleHand();
			actionLeftFoot();
			actionRightFoot();
		}
		
		
		
		function rotation(){
			caramelMan.display.rotation.y += 0.01 * Math.PI;
			
			requestAnimationFrame(rotation);
			renderer.render(scene, camera);
		}
		
		function convertToJsonText(){
			var text = '{"' +caramelMan.name + '" : ' +
			'{ "x":"' +caramelMan.x+ '" , "y":"'+caramelMan.y+'" , "z":"'+caramelMan.z+'" , "name":"'+caramelMan.name+'", "ry":"'+caramelMan.ry+'"} }';
			return text;
		}
		

		//事件
		//$(document).keydown(beginControl);
		
}