var cube = {}
cube.mesh = new Array()
cube.mesh.sourceMesh = "data/objects/iron-cube.obj"

let pos = []
let nCubes = controls.cubesNumber

let ironCubeData = {}


function InitCubes(gl){
    // Load mesh
    LoadMesh(gl, cube)

    RandomizeCubes()
    
    // Set data shared by every iron cube
    cube.offsetZ = 1;
    
    ironCubeData.positions = cube.positions
    ironCubeData.normals = cube.normals
    ironCubeData.texcoords = cube.texcoords
    ironCubeData.texture = cube.texture
    ironCubeData.translate = true
    ironCubeData.offsetZ = cube.offsetZ
    ironCubeData.diffuse = cube.diffuse[1]
    ironCubeData.ambient = cube.ambient[1]
    ironCubeData.specular = cube.specular[1]
    ironCubeData.emissive = cube.emissive[1]
    ironCubeData.shininess = cube.shininess[1]
    ironCubeData.opacity = cube.opacity[1]
}

function RandomizeCubes(){
    // Set position for each iron cube
    pos = []
    for(let i = 0; i < controls.cubesNumber; i++){
        let newCoord = getRandomCoord()
        // Update array used in utils.js by getRandomCoord()
        cubesPos.push(newCoord)
        // Update local positions array
        pos.push(newCoord)
    }
}

function RenderCubes(gl, program, opt){
    // for each iron cube
    for(let p of pos){
        // render it in its position
        ironCubeData.offsetX = p.x
        ironCubeData.offsetY = p.y
        RenderObject(gl, program, opt, ironCubeData)

        // handle collissions with car
        if(car_obj[0].posX < p.x + 1.0 && car_obj[0].posX > p.x - 1 &&
            car_obj[0].posY <= p.y + 1 && car_obj[0].posY >= p.y - 1){
            wPressed = false
            car_obj[0].posX -= car_obj[0].velX * 12
            car_obj[0].posY -= car_obj[0].velY * 12
            // if there is still time, update score
            if(!gameEnded) subtractScore()
       }
    }
}
