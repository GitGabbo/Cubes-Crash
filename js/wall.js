var wall = {}
wall.mesh = new Array()
wall.mesh.sourceMesh = "data/objects/wall-cube.obj"

var offsetsY = []
var offsetsX = []

let wallData = {};

function InitWall(gl){
    LoadMesh(gl, wall)
    let i = 0
    offsetsY[i] = {}
    offsetsY[i].offsetX = groundSize/2
    offsetsY[i].offsetY = []
    for(let offY = groundSize/2 - groundSize + 1 ; offY < groundSize / 2 + 1; offY += 2){
        offsetsY[i].offsetY.push(offY);
    }
    i = 1
    offsetsY[i] = {}
    offsetsY[i].offsetX =  groundSize/2 - groundSize
    offsetsY[i].offsetY = []
    for(let offY = groundSize/2 - groundSize + 1 ; offY < groundSize/2+1; offY+=2){
        offsetsY[i].offsetY.push(offY);
    }
    i = 0
    offsetsX[i] = {}
    offsetsX[i].offsetY = groundSize/2
    offsetsX[i].offsetX = []
    offsetsX[i].rotZ = 90 * Math.PI / 180.0
    for(let offX = groundSize/2 - groundSize + 1 ; offX < groundSize / 2 + 1; offX += 2){
        offsetsX[i].offsetX.push(offX);
    }
    i = 1
    offsetsX[i] = {}
    offsetsX[i].offsetY =  groundSize/2 - groundSize
    offsetsX[i].offsetX = []
    offsetsX[i].rotZ = 90 * Math.PI / 180.0
    for(let offX = groundSize/2 - groundSize + 1 ; offX < groundSize/2+1; offX+=2){
        offsetsX[i].offsetX.push(offX);
    }
    wall.offsetZ = 1;
    wall.rotZ = 0;

    wallData.positions = wall.positions
    wallData.normals = wall.normals
    wallData.texcoords = wall.texcoords
    wallData.texture = wall.texture
    wallData.translate = true
    wallData.offsetZ = wall.offsetZ
    wallData.rotate = true
    wallData.rotX = 0
    wallData.rotY = 0
    wallData.diffuse = wall.diffuse[1]
    wallData.ambient = wall.ambient[1]
    wallData.specular = wall.specular[1]
    wallData.emissive = wall.emissive[1]
    wallData.shininess = wall.shininess[1]
    wallData.opacity = wall.opacity[1]
}

function RenderWall(gl, program, opt){
    

    for(let i = 0; i < offsetsY.length; i++){
        for(let j = 0; j < offsetsY[i].offsetY.length; j++){
            wallData.offsetX = offsetsY[i].offsetX
            wallData.offsetY = offsetsY[i].offsetY[j]
            wallData.rotZ = wall.rotZ
    
            if(car_obj[0].posX < offsetsY[i].offsetX + 1.0 && car_obj[0].posX > offsetsY[i].offsetX - 1 &&
                car_obj[0].posY <=  offsetsY[i].offsetY[j] + 1 && car_obj[0].posY >=  offsetsY[i].offsetY[j] - 1){
                wPressed = false
                car_obj[0].posX -= car_obj[0].velX * 12
                car_obj[0].posY -= car_obj[0].velY * 12 
                subtractScore()
            }
    
            RenderObject(gl, program, opt, wallData)
        }
        
    }

    for(let i = 0; i < offsetsX.length; i++){
        for(let j = 0; j < offsetsX[i].offsetX.length; j++){
            wallData.offsetX = offsetsX[i].offsetX[j]
            wallData.offsetY = offsetsX[i].offsetY
            wallData.rotZ =  offsetsX[i].rotZ

            if(car_obj[0].posX < offsetsX[i].offsetX[j] + 1.0 && car_obj[0].posX > offsetsX[i].offsetX[j] - 1 &&
                car_obj[0].posY <=  offsetsX[i].offsetY + 1 && car_obj[0].posY >=  offsetsX[i].offsetY - 1){
                wPressed = false
                car_obj[0].posX -= car_obj[0].velX * 12
                car_obj[0].posY -= car_obj[0].velY * 12 
                if(!gameEnded) subtractScore()
            }
    
            RenderObject(gl, program, opt, wallData)
        }
        
    }
}