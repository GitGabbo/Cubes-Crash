"use strict";

let mainContainer = document.getElementById("mainContainer")



function CheckStartGame(){
  if(!gameStarted && controls.camera > 1){
    startGame()
    gameStarted = true
  } 
}

function EventsHandler(){

  function mousemove(e){
    controls.theta -= e.movementX*0.005
    controls.phi -= e.movementY*0.005
  }

  // Handle keyboard pressed keys
  window.addEventListener('keydown', e => {
    if(e.key === "w"){
      wPressed = true;
      CheckStartGame()   
    }
    if(e.key === "s"){
      sPressed = true;
      CheckStartGame()   
    }
    if(e.key === "a"){
      aPressed = true;
      CheckStartGame()   
    }
    if(e.key === "d"){
      dPressed = true;
      CheckStartGame()  
    }
    if(e.key == " "){
      spacePressed = true
    }
    if(e.key == "ArrowLeft"){
      leftArrowPressed = true
    }
    if(e.key == "ArrowRight"){
      rightArrowPressed = true
    }
    if(e.key == "ArrowUp"){
      upArrowPressed = true
    }
    if(e.key == "ArrowDown"){
      downArrowPressed = true
    }
  }, true);

  // On mouse left click
  mainContainer.addEventListener('mousedown', e => {
    // Handle mouse movement: rotate camera
    mainContainer.addEventListener('mousemove', mousemove, true);
  })

  // On mouse left click release
  mainContainer.addEventListener('mouseup', e => {
    // remove handler
    mainContainer.removeEventListener('mousemove', mousemove, true);
  })
  
  mainContainer.addEventListener('wheel', e=> {
    controls.D += e.deltaY*0.01
  })

  // Handle keyboard released keys
  window.addEventListener('keyup', e => {
    if(e.key === "w"){
      wPressed = false;   
    }
    if(e.key === "s"){
      sPressed = false;   
    }
    if(e.key === "a"){
      aPressed = false;   
    }
    if(e.key === "d"){
      dPressed = false;   
    }
    if(e.key == " "){
      spacePressed = false
    }
    if(e.key == "ArrowLeft"){
      leftArrowPressed = false
    }
    if(e.key == "ArrowRight"){
      rightArrowPressed = false
    }
    if(e.key == "ArrowUp"){
      upArrowPressed = false
    }
    if(e.key == "ArrowDown"){
      downArrowPressed = false
    }
  }, true);
}

function TouchEventsHandler(){

  let xTouch = 0
  let yTouch = 0
  let horizontalDelta = 0
  let verticalDelta = 0

  let scoreCanvas = document.getElementById("scoreCanvas")
  let canvas = document.getElementById("canvas")

  function onTouchStart(e){
    // Screen coordinates
    xTouch = e.targetTouches[0].screenX
    yTouch = e.targetTouches[0].screenY
    // Adjust gamepad positions
    $('#gamepad-img').css("display", "block")
    $('#gamepad-img').css("left", xTouch - 80)
    $('#gamepad-img').css("top", yTouch - 160)
    $('#gamepad-thumb').css("display", "block")
    $('#gamepad-thumb').css("left", xTouch - 27)
    $('#gamepad-thumb').css("top", yTouch - 110)
    // Start the game if not started
    CheckStartGame()
  }

  function onTouchMove(e){
    // Calculate swipe directions
    horizontalDelta = xTouch - e.targetTouches[0].screenX
    verticalDelta = yTouch - e.targetTouches[0].screenY
    // Limit swipes
    horizontalDelta = Math.abs(horizontalDelta) > 50 ? Math.sign(horizontalDelta)*50 : horizontalDelta;   
    verticalDelta = Math.abs(verticalDelta) > 50 ? Math.sign(verticalDelta)*50 : verticalDelta;  
    // Normalize swipes
    swipeHorizontalN = horizontalDelta/50
    swipeVerticalN = verticalDelta/50 
    // Adjust gamepad position
    $('#gamepad-thumb').css("left", xTouch - 27 - horizontalDelta)
    $('#gamepad-thumb').css("top", yTouch - 110 - verticalDelta)
    // Handle swipes
    TouchMovements()
  }

  function onTouchEnd(e){
    // Hide gamepad and set everything to 0
    $('#gamepad-img').css("display", "none")
    $('#gamepad-thumb').css("display", "none")
    horizontalDelta = 0
    verticalDelta = 0
    xTouch = 0
    yTouch = 0
    swipeHorizontalN = 0
    swipeVerticalN = 0
    // Handle null movement
    TouchMovements()
  }

  scoreCanvas.addEventListener('touchstart', onTouchStart, true);
  scoreCanvas.addEventListener('touchend', onTouchEnd, true);
  scoreCanvas.addEventListener('touchmove', onTouchMove, true);

  canvas.addEventListener('touchstart', onTouchStart, true);
  canvas.addEventListener('touchmove', onTouchMove, true);
  canvas.addEventListener('touchend', onTouchEnd, true);

  // Handle drift button
  $('#drift-button').on("touchstart", e => {
    spacePressed = true
  })

  $('#drift-button').on("touchend", e => {
    spacePressed = false
  })

  // Set correct key flags based on swipes directions
  function TouchMovements(){
    if(horizontalDelta < -10 && horizontalDelta != 0){
      dPressed = true
      aPressed = false
    } else if (horizontalDelta > 10 && horizontalDelta != 0){
      dPressed = false
      aPressed = true
    } else {
      dPressed = false
      aPressed = false
    }

    if(verticalDelta > 10 && verticalDelta != 0){
      wPressed = true
      sPressed = false
    } else if (verticalDelta < -10 && verticalDelta != 0){
      wPressed = false
      sPressed = true
    } else {
      wPressed = false
      sPressed = false
    }

  }
}

function createXYQuadVertices() {
  var xOffset = 0;
  var yOffset = 0;
  var size = 1;
  return {
    position: {
      numComponents: 2,
      data: [
        xOffset + -1 * size, yOffset + -1 * size,
        xOffset +  1 * size, yOffset + -1 * size,
        xOffset + -1 * size, yOffset +  1 * size,
        xOffset +  1 * size, yOffset +  1 * size,
      ],
    },
    normal: [
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
    ],
    texcoord: [
      0, 0,
      1, 0,
      0, 1,
      1, 1,
    ],
    indices: [ 0, 1, 2, 2, 1, 3 ],
  };
}

function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.getElementById("canvas");
  var scoreCanvas = document.getElementById("scoreCanvas");
  gl = canvas.getContext("webgl");
  ctx = scoreCanvas.getContext("2d");
  if (!gl) {
    return;
  }
  if(!ctx){
    return;
  }

  define_gui();

  // Set canvases
  var canvasWidth = $('#canvas').width()
  var canvasHeight =  $('#canvas').height()
  scoreCanvasWidth = $('#scoreCanvas').width()
  scoreCanvasHeight =  $('#scoreCanvas').height()

  canvas.width = canvasWidth
  canvas.height = canvasHeight
  scoreCanvas.width = scoreCanvasWidth
  scoreCanvas.height = scoreCanvasHeight
  var aspect = canvasWidth / canvasHeight;

  // Initialize objects
  InitCar(gl)
  InitGround(gl)
  InitCircle(gl)
  InitCubes(gl)
  InitMe(gl)
  InitWall(gl)

  // setup GLSL programs
  var program = webglUtils.createProgramFromScripts(gl, ["3d-vertex-shader", "3d-fragment-shader"]);
  var skyboxProgramInfo = webglUtils.createProgramInfo( gl, ["skybox-vertex-shader", "skybox-fragment-shader"]);

  // Skybox data and setup
  const skyboxArray = createXYQuadVertices.apply(null,  Array.prototype.slice.call(arguments, 1));
  const quadBufferInfo = webglUtils.createBufferInfoFromArrays(gl, skyboxArray);
  const texture = gl.createTexture();

  gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
  
  const faceInfos = [
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
      url: 'data/skybox/pos-x.png',
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
      url: 'data/skybox/neg-x.png',
    },
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
      url: 'data/skybox/pos-y.png',
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
      url: 'data/skybox/neg-y.png',
    },
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
      url: 'data/skybox/pos-z.png',
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
      url: 'data/skybox/neg-z.png',
    },
  ]; 
  
  faceInfos.forEach((faceInfo) => {
    const {target, url} = faceInfo;

    // Upload the canvas to the cubemap face.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 512;
    const height = 512;
    const format = gl.RGBA;
    const type = gl.UNSIGNED_BYTE;

    // setup each face so it's immediately renderable
    gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);

    // Asynchronously load an image
    const image = new Image();
    image.src = url;
    image.addEventListener('load', function() {
      // Now that the image has loaded make copy it to the texture.
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
      gl.texImage2D(target, level, internalFormat, format, type, image);
      gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    });
  });

  gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

  gl.useProgram(program);

  // look up where the vertex data needs to go.
  var positionLocation = gl.getAttribLocation(program, "a_position");
  var normalLocation = gl.getAttribLocation(program, "a_normal");
  var texcoordLocation = gl.getAttribLocation(program, "a_texcoord");

  var up = [0, 0, 1];

  var matrixLocation = gl.getUniformLocation(program, "u_world");
  var textureLocation = gl.getUniformLocation(program, "diffuseMap");
  var viewMatrixLocation = gl.getUniformLocation(program, "u_view");
  var projectionMatrixLocation = gl.getUniformLocation(program, "u_projection");
  var lightWorldDirectionLocation = gl.getUniformLocation(program, "u_lightDirection");
  var viewWorldPositionLocation = gl.getUniformLocation(program, "u_viewWorldPosition");
        
  // set the light position
  gl.uniform3fv(lightWorldDirectionLocation, m4.normalize([-1, 2, 2]));
  // Tell the shader to use texture unit 0 for diffuseMap
  gl.uniform1i(textureLocation, 0);

  function degToRad(d) {
    return d * Math.PI / 180;
  }

  // Get the starting time.
  var then = 0;
  
  var ambientLight=[0.1,0.1,0.1];
  var colorLight=[1.0,1.0,1.0];

  let options = {
    positionLocation: positionLocation,
    normalLocation: normalLocation,
    texcoordLocation: texcoordLocation,
    textureLocation: textureLocation,
    ambientLight: ambientLight,
    colorLight: colorLight,
  }

  // Draw the scene.
  function drawScene(time) {
    // convert to seconds
    time *= 0.001;
    // Subtract the previous time from the current time
    var deltaTime = time - then;
    // Remember the current time for the next frame.
    then = time;

    // Compute the camera's matrix using look at.
    let cameraIndex = controls.camera-1
    var cameraMatrix = m4.lookAt(cameras[cameraIndex], targets[cameraIndex], up);
  
    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);
    var projectionMatrix = m4.perspective(degToRad(controls.fovy), aspect, controls.near, controls.far);

    // Rendering skybox
    var viewDirectionMatrix = m4.copy(viewMatrix);
    viewDirectionMatrix[12] = 0;
    viewDirectionMatrix[13] = 0;
    viewDirectionMatrix[14] = 0;

    var viewDirectionProjectionMatrix = m4.multiply(projectionMatrix, viewDirectionMatrix);
    var viewDirectionProjectionInverseMatrix = m4.inverse(viewDirectionProjectionMatrix);

    gl.useProgram(skyboxProgramInfo.program);
    // depthFunc: function that compares incoming pixel depth to the current depth buffer value
    // gl.LEQUAL: pass if the incoming value is less than or equal to the depth buffer value
    gl.depthFunc(gl.LEQUAL);

    webglUtils.setBuffersAndAttributes(gl, skyboxProgramInfo, quadBufferInfo);
    webglUtils.setUniforms(skyboxProgramInfo, {
      u_viewDirectionProjectionInverse: viewDirectionProjectionInverseMatrix,
      u_skybox: texture,
    });
    webglUtils.drawBufferInfo(gl, quadBufferInfo);


    // Rendering game
    gl.useProgram(program);
    // gl.LESS: pass if the incoming value is less than the depth buffer value
    gl.depthFunc(gl.LESS);
    // enable alpha blending
    gl.enable(gl.BLEND); 
    // blendFunc: defines which function is used for blending pixel arithmetic
    // gl.SRC_ALPHA: multiplies all colors by the source alpha value.
    // gl.ONE_MINUS_SRC_ALPHA: multiplies all colors by 1 minus the source alpha value
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, canvasWidth, canvasHeight);

    gl.enable(gl.DEPTH_TEST);

    // If camera is 1 then it's free camera mode, move it
    if(controls.camera <= 1) MoveCamera()
    // Else it's game mode, move car
    else CarDoStep()

    // Update camera
    SetCamera()

    // Get some uniforms
    gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
    gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);

    // set the camera/view position
    gl.uniform3fv(viewWorldPositionLocation, cameras[cameraIndex]);

    // Set the matrix.
    var matrix = m4.identity();
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    // Render Objects
    RenderCar(gl, program, options)
    RenderCircle(gl, program, options)
    RenderGround(gl, program, options)
    RenderCubes(gl, program, options)
    RenderWall(gl, program, options)
    RenderMe(gl, program, options)

    // Refresh score
    refreshScore()

    requestAnimationFrame(drawScene);
  }

  requestAnimationFrame(drawScene);

}


$(document).ready(() => {
  // Mobile main screen adjustments
  if ($(window).width() < 800) {
    $('main').css('padding', '0.5em')
    $('#play-button').css('margin', '0.5em')
    $('#freeCamParagraph').html("Fai <b>swipe</b> sullo schermo per muovere la camera nello spazio. Aiutati con i comandi in alto a destra come <i>Theta</i> e <i>Phi</i> per ruotere la camera e <i>D</i> per modificare la distanza della camera.")
    $('#gameParagraph').html("Fai <b>swipe</b> sullo schermo per muovere la macchina. La velocità in tutte le direzioni è dipendente da quanto è lungo il tuo swipe!<br>Schiva i cubi ed entra nei semicerchi per ottenere punti, ma attento a non sbatterci contro! Hai 1 minuto di tempo per battere il tuo record personale.")
  }
  // On Play click
  $('#play-button').click(() => {
    $('main').hide()
    $('body').css("font-family", "serif");
    $('body').css("letter-spacing", "0px");
    $('#mainContainer').show()
    $('#canvas').show()
    EventsHandler()
    if ($(window).width() < 800) {
      $('#drift-button').show()
      $('body').css("overflow", "hidden")
      TouchEventsHandler()  
      mobileDevice = true
    }
    main();
  })
})