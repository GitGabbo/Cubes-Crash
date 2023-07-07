var car_obj = []

var car_names = ["car", "wheels-pair", "wheels-pair"]

var carSpeed = 0.05
var gripY = 0.9; 
var carFacing = 0
var wPressed = false
var sPressed = false
var aPressed = false
var dPressed = false
var spacePressed = false;
var steering = 0;
var steeringSpeed = 0.015; 
var returnSteeringSpeed = 0.93; 
var maxAcceleration = 0.05;
var gripX = 0.2;
var driftGripX = 0.8;
var driftDecelerationStart = 1;
var driftDeceleration = 1;
var gripY = 0.9;
var gripZ = 1.0;
var anteriorWheelsRotation = 0;
var posteriorWheelsRotation = 0;
var px = 0;
var py = 0;
var pz = 0;
var grip = 0.8;
var wheelRadius = 0.173

var carModelMatrix=m4.identity()

function InitCar(gl){
    let i = 0;
    for(let name of car_names){
        car_obj[i] = {}
        car_obj[i].mesh = new Array()
        car_obj[i].mesh.sourceMesh = "data/objects/" + name + ".obj"
        LoadMesh(gl, car_obj[i]);
        car_obj[i].posX = 0;
        car_obj[i].posY = 0;
        car_obj[i].posZ = 0.38;
        car_obj[i].velX = 0;
        car_obj[i].velY = 0;
        car_obj[i].velZ = 0;
        car_obj[i].rotX = 0;
        car_obj[i].rotY = 0;
        car_obj[i].rotZ = 0;
        car_obj[i].scaleX = 1;
        car_obj[i].scaleY = 1;
        car_obj[i].scaleZ = 1;
        i++;
    }
        
    console.log(car_obj[0])

    car_obj[1].scaleX = 0.55
    car_obj[1].scaleY = 0.55
    car_obj[1].scaleZ = 0.55
    car_obj[1].offsetZ = -0.2
    car_obj[1].offsetY = -0.65
    car_obj[1].offsetX = 0
    car_obj[1].rotZ = 180 * Math.PI / 180;
    car_obj[2].scaleX = 0.55
    car_obj[2].scaleY = 0.55
    car_obj[2].scaleZ = 0.55
    car_obj[2].offsetZ = -0.2
    car_obj[2].offsetY = 0.55
    car_obj[2].offsetX = 0
    car_obj[2].rotZ = 180 * Math.PI / 180;
}

function CarDoStep(){
  // computiamo l'evolversi della macchina
 
  var vxm, vym, vzm; // velocita' in spazio macchina

  // da vel frame mondo a vel frame macchina
  var cosf = Math.cos(-carFacing);
  var sinf = Math.sin(-carFacing);
  vxm = +cosf*car_obj[0].velX - sinf*car_obj[0].velY;
  vzm = car_obj[0].velZ;
  vym = +sinf*car_obj[0].velX + cosf*car_obj[0].velY;
 
  // gestione dello sterzo
  if (aPressed){
    if(mobileDevice) steering+=steeringSpeed * swipeHorizontalN;
    else steering+=steeringSpeed;
  } 
  if (dPressed){
    if(mobileDevice)  steering+=steeringSpeed * swipeHorizontalN;
    else steering-=steeringSpeed;
  }
  steering*=returnSteeringSpeed; // ritorno a volante fermo

  car_obj[1].rotZ = steering
 
  // accelerazione in avanti
  if (wPressed){
    if(mobileDevice) vym-=maxAcceleration * swipeVerticalN;
    else vym-=maxAcceleration;
  }  
  // accelerazione indietro
  if (sPressed){
    if(mobileDevice) vym-=maxAcceleration * swipeVerticalN;
    else vym+=maxAcceleration;
  } 
 
  // attriti (semplificando)
  if(spacePressed) {
    vxm*=driftGripX
    vym*=driftDeceleration
    vxm*=driftDeceleration
    driftDeceleration *= 0.997
  }
  else{
    vxm*=gripX;
    driftDeceleration = driftDecelerationStart
  }  

  vzm*=gripZ;
  vym*=gripY;

  // l'orientamento della macchina segue quello dello sterzo
  // (a seconda della velocita' sulla z)
  carFacing = carFacing - (vym*grip)*steering;
 
  car_obj[0].rotZ = carFacing

  // rotazione mozzo ruote (a seconda della velocita' sulla z)
  var da ; //delta angolo
  da=(180.0*vym)/(Math.PI*6);
  anteriorWheelsRotation+=da;
  car_obj[1].rotX = -anteriorWheelsRotation
  car_obj[2].rotX = anteriorWheelsRotation

  // ritorno a vel coord mondo
  car_obj[0].velX = +cosf*vxm + sinf*vym;
  car_obj[0].velZ = vzm;
  car_obj[0].velY = -sinf*vxm + cosf*vym;
  
  // posizione = posizione + velocita * delta t (ma e' delta t costante)
  car_obj[0].posX += car_obj[0].velX;
  car_obj[0].posY += car_obj[0].velY;
  car_obj[0].posZ += car_obj[0].velZ;

}

function RenderCar(gl, program, opt){
  let objIndex = 0; 
  for(let obj of car_obj){
    let lastVertex = 0;
    for(let i = 1; i < obj.mesh.materials.length; i++){

      let lastVertexIndex = lastVertex + obj.mesh.materials[i].triangles.length * 3 * 3

      let posArray = obj.positions.slice(lastVertex, lastVertexIndex)
      let normArray = obj.normals.slice(lastVertex, lastVertexIndex)
      let texArray = obj.texcoords.slice(lastVertex, lastVertexIndex)

      var modelMatrix=m4.identity()
      if(objIndex == 0){
        carModelMatrix = m4.identity()
        carModelMatrix = m4.translate(carModelMatrix, obj.posX, obj.posY, obj.posZ)
        carModelMatrix = m4.yRotate(carModelMatrix, obj.rotY)
        carModelMatrix = m4.zRotate(carModelMatrix, carFacing)
      } else {
        modelMatrix = m4.copy(carModelMatrix)
        modelMatrix = m4.translate(modelMatrix, obj.offsetX , obj.offsetY, obj.offsetZ)
        modelMatrix = m4.zRotate(modelMatrix, obj.rotZ)
        modelMatrix = m4.xRotate(modelMatrix, obj.rotX)
        modelMatrix = m4.scale(modelMatrix, obj.scaleX, obj.scaleY, obj.scaleZ, modelMatrix)
      }
      
      let data = {}
      data.positions = posArray
      data.normals = normArray
      data.texcoords = texArray
      data.modelMatrix = objIndex == 0 ? carModelMatrix : modelMatrix
      data.diffuse = obj.diffuse[i]
      data.ambient = obj.ambient[i]
      data.specular = obj.specular[i]
      data.emissive = obj.emissive[i]
      data.shininess = obj.shininess[i]
      data.opacity = obj.opacity[i]
      // data.texture = obj.texture

      RenderObject(gl, program, opt, data)
      
      lastVertex = lastVertexIndex 
    }
    objIndex ++;
  }
}