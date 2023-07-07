var score = 0
var gl
var ctx
var minutes = 1
var seconds = 0
var gameStarted = false
var gameEnded = false

var scoreCanvasWidth = 0
var scoreCanvasHeight = 0
// Key pressed flags
var upArrowPressed = false
var downArrowPressed = false
var leftArrowPressed = false
var rightArrowPressed = false
// Mobile device flag and variables
var mobileDevice = false
var swipeHorizontalN = 0
var swipeVerticalN = 0
// Used coordinates
var circlePos = {x: 0, y: 0}
var cubesPos = []

// GUI helpers and controller
var dr =  5.0 * Math.PI/180.0;
var controls = {
  camera: 1,
  cameraSpeed: 0.1,
  near : 1,
  far : 100,
  D : 5.0,
  theta : 1.57,
  phi  : 1.57,
  fovy : 40.0,
  cubesNumber: 10,
  myTransparency : 1
}

// Function to render a generic object
function RenderObject(gl, program, opt, data){
    var positionBuffer = gl.createBuffer();
    let arr = new Float32Array(data.positions)
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Put the positions in the buffer
    //setGeometry(gl);
    gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW);

    // Create a buffer for normals
    var normalsBuffer = gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER mormalsBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
    // Put the normals in the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.normals), gl.STATIC_DRAW);

    var texcoordBuffer = null;
    // provide texture coordinates
    if(data.texture){
      texcoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
      // Set Texcoords
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.texcoords), gl.STATIC_DRAW);
    }
    

    var modelMatrix = m4.identity()

    if(data.modelMatrix){
        modelMatrix = data.modelMatrix
    } else {
        // translate
        if(data.translate)
            modelMatrix = m4.translate(modelMatrix, data.offsetX, data.offsetY, data.offsetZ)
        // rotate
        if(data.rotate){
            modelMatrix = m4.xRotate(modelMatrix, data.rotX)
            modelMatrix = m4.yRotate(modelMatrix, data.rotY)
            modelMatrix = m4.zRotate(modelMatrix, data.rotZ)
        }
        // scale
        if(data.scale) 
            modelMatrix = m4.scale(modelMatrix, data.scaleX, data.scaleY, data.scaleZ, modelMatrix)
    }
    
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "u_model" ), false, modelMatrix);

    if(data.texture) gl.bindTexture(gl.TEXTURE_2D, data.texture);
    
    gl.uniform3fv(gl.getUniformLocation(program, "diffuse" ), data.diffuse);
    gl.uniform3fv(gl.getUniformLocation(program, "ambient" ), data.ambient); 
    gl.uniform3fv(gl.getUniformLocation(program, "specular"), data.specular);	
    gl.uniform3fv(gl.getUniformLocation(program, "emissive"), data.emissive);


    // gl.uniform3fv(gl.getUniformLocation(program, "u_lightDirection" ), [xxx]);
    gl.uniform3fv(gl.getUniformLocation(program, "u_ambientLight" ), opt.ambientLight);
    gl.uniform3fv(gl.getUniformLocation(program, "u_colorLight" ), opt.colorLight);


    gl.uniform1f(gl.getUniformLocation(program, "shininess"), data.shininess);
    gl.uniform1f(gl.getUniformLocation(program, "opacity"), data.opacity);

    // Turn on the position attribute
    gl.enableVertexAttribArray(opt.positionLocation);
    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 3;          // 3 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(opt.positionLocation, size, type, normalize, stride, offset);

    // Turn on the normal attribute
    gl.enableVertexAttribArray(opt.normalLocation);
    // Bind the normal buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
    gl.vertexAttribPointer(opt.normalLocation, size, type, normalize, stride, offset);

    if(data.texture){
        // Turn on the texcord attribute
        gl.enableVertexAttribArray(opt.texcoordLocation);
        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        size = 2;          // 2 components per iteration
        gl.vertexAttribPointer(opt.texcoordLocation, size, type, normalize, stride, offset);
    }
   
    // Draw the geometry.
    gl.drawArrays(gl.TRIANGLES, 0, arr.length/3);
}

function define_gui(){
    var gui = new dat.GUI();
    gui.add(controls,"camera").min(1).max(3).step(1).onChange(() => {
        if(controls.camera == 1){
            $('#scoreCanvas').hide()
        } else {
            $('#scoreCanvas').show()
            stopGame()
        }
    });
    gui.add(controls,"cameraSpeed").min(0.1).max(1).step(0.1);
    gui.add(controls,"near").min(1).max(10).step(1);
    gui.add(controls,"far").min(1).max(100).step(1);
    gui.add(controls,"D").min(0).max(50).step(1);
    gui.add(controls,"theta").min(0).max(6.28).step(dr);
    gui.add(controls,"phi").min(0).max(3.14).step(dr);
    gui.add(controls,"fovy").min(10).max(120).step(5);
    gui.add(controls,"cubesNumber").min(0).max(50).step(1).onChange(() => {
        cubesPos = []
        RandomizeCubes()
    });
    gui.add(controls,"myTransparency").min(0).max(1).step(0.1);
}

function getRandomCoord(){
    let randX = Math.floor(Math.random() * (groundSize-20)) - groundSize/2 + 10;
    let randY = Math.floor(Math.random() * (groundSize-20)) - groundSize/2 + 10;
    // do not collide with existent circle
    while(randX == circlePos.x && randY == circlePos.y){
        randX = Math.floor(Math.random() * (groundSize-20)) - groundSize/2 + 10;
        randY = Math.floor(Math.random() * (groundSize-20)) - groundSize/2 + 10;
    }
    // do not collide with existent iron cubes
    for(let pos of cubesPos){
        while(randX == pos.x && randY == pos.y){
            randX = Math.floor(Math.random() * (groundSize-20)) - groundSize/2 + 10;
            randY = Math.floor(Math.random() * (groundSize-20)) - groundSize/2 + 10;
        } 
    }
    while(randX == me.offsetX && randY == me.offsetY){
        randX = Math.floor(Math.random() * (groundSize-20)) - groundSize/2 + 10;
        randY = Math.floor(Math.random() * (groundSize-20)) - groundSize/2 + 10;
    }
    return{
        x: randX,
        y: randY
    }
}

function addScore(){
    score += 100
    refreshScore()
}

function subtractScore(){
    score -= 50
    refreshScore()
}

function refreshScore(){
    ctx.clearRect(0, 0, scoreCanvasWidth, scoreCanvasHeight);
    ctx.font = "30px Verdana";

    if(controls.camera != 3){
        // Create gradient
        var gradient = ctx.createLinearGradient(0, 0, scoreCanvasWidth/2+100, 0);
        gradient.addColorStop("0", "magenta");
        gradient.addColorStop("0.5", "blue");
        gradient.addColorStop("1.0", "red");
    
        // Fill with gradient
        ctx.strokeStyle = gradient;
    } else {
        ctx.strokeStyle = "yellow";
    }
    

    // Fill with gradient
    ctx.strokeStyle = gradient;
    ctx.strokeText("Score: " + score, scoreCanvasWidth/100, 50);
    drawTime()
}

function pad(num) {
    var s = "0" + num;
    return s.substring(s.length-2);
}

function drawTime(){
    ctx.font = "50px Verdana";

    if(controls.camera != 3){
        // Create gradient
        var gradient = ctx.createLinearGradient(scoreCanvasWidth/2- scoreCanvasWidth/110, 0, scoreCanvasWidth/2+100, 0);
        gradient.addColorStop("0", "magenta");
        gradient.addColorStop("0.5", "blue");
        gradient.addColorStop("1.0", "red");
    
        // Fill with gradient
        ctx.strokeStyle = gradient;
    } else {
        ctx.strokeStyle = "yellow";
    }
   
    let y = 60
    let x = scoreCanvasWidth/15
    if(mobileDevice) y = 100
    if(mobileDevice) x = scoreCanvasWidth/6
    ctx.strokeText(`${pad(minutes)}' ${pad(seconds)}''`, scoreCanvasWidth/2-x, y);
}

function updateTime(){
    if(seconds > 0 || minutes > 0){
        if(seconds == 0){
            minutes--;
            seconds = 59
        } else {
            seconds--
        }
        drawTime()
    } else {
        clearInterval(interval)
        gameEnded = true
    }
}

var interval;

function startGame(){
    interval = window.setInterval(function(){
        updateTime()
    }, 1000)
}

function stopGame(){
    clearInterval(interval)
    score = 0
    minutes = 1
    seconds = 0
    gameStarted = false
    gameEnded = false
}

