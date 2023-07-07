var circle = {}
circle.mesh = new Array()
circle.mesh.sourceMesh = "data/objects/circle.obj"
var circleColorIndex = 0

var centerOffset = 0.85

let circleData = {}

function InitCircle(gl){
    LoadMesh(gl, circle)
    circle.offsetZ = 0.5;
    RandomizeCircle()

    circleData.positions = circle.positions
    circleData.normals = circle.normals
    circleData.texcoords = circle.texcoords
    circleData.translate = true
    circleData.offsetX = circle.offsetX
    circleData.offsetY = circle.offsetY
    circleData.offsetZ = circle.offsetZ 
    circleData.scale = true
    circleData.scaleX = 2
    circleData.scaleY = 2
    circleData.scaleZ = 2
    circleData.diffuse = circle.diffuse[circleColorIndex]
    circleData.ambient = circle.ambient[circleColorIndex]
    circleData.specular = circle.specular[circleColorIndex]
    circleData.emissive = circle.emissive[circleColorIndex]
    circleData.shininess = circle.shininess[circleColorIndex]
    circleData.opacity = circle.opacity[circleColorIndex]
    circleData.texture = circle.texture
}

function RandomizeCircle(){
    circleColorIndex = Math.floor(Math.random() * (circle.diffuse.length - 1)) + 1;
    let pos = getRandomCoord()
    circle.offsetX = pos.x;
    circle.offsetY = pos.y;
    circleData.offsetX = circle.offsetX
    circleData.offsetY = circle.offsetY
    circleData.diffuse = circle.diffuse[circleColorIndex]
    circleData.ambient = circle.ambient[circleColorIndex]
    circleData.specular = circle.specular[circleColorIndex]
    circleData.emissive = circle.emissive[circleColorIndex]
    circleData.shininess = circle.shininess[circleColorIndex]
    circleData.opacity = circle.opacity[circleColorIndex]
}

function RenderCircle(gl, program, opt){

    if((car_obj[0].posX < circle.offsetX + 2.0 && car_obj[0].posX > circle.offsetX + 1.0 ||
        car_obj[0].posX > circle.offsetX - 2.0 && car_obj[0].posX < circle.offsetX - 1.0) &&
        car_obj[0].posY <= circle.offsetY + centerOffset && car_obj[0].posY >= circle.offsetY - centerOffset){
        wPressed = false
        car_obj[0].posX -= car_obj[0].velX * 12
        car_obj[0].posY -= car_obj[0].velY * 12 
        if(!gameEnded) subtractScore()
   }

    if(car_obj[0].posX <= circle.offsetX + centerOffset && car_obj[0].posX >= circle.offsetX - centerOffset &&
         car_obj[0].posY <= circle.offsetY + centerOffset && car_obj[0].posY >= circle.offsetY - centerOffset ){
        if(!gameEnded){
            RandomizeCircle()
            addScore()
        }
    }

    RenderObject(gl, program, opt, circleData)

}