var ground = {}
ground.mesh = new Array()
ground.mesh.sourceMesh = "data/objects/ground.obj"

groundSize = 60

let groundData = {}

function InitGround(gl){
    LoadMesh(gl, ground)

    groundData.positions = ground.positions
    groundData.normals = ground.normals
    groundData.texcoords = ground.texcoords
    groundData.scale = true
    groundData.scaleX = 70
    groundData.scaleY = 70
    groundData.scaleZ = 70
    groundData.texture = ground.texture
    groundData.diffuse = ground.diffuse[1]
    groundData.ambient = ground.ambient[1]
    groundData.specular = ground.specular[1]
    groundData.emissive = ground.emissive[1]
    groundData.shininess = ground.shininess[1]
    groundData.opacity = ground.opacity[1]
}

function RenderGround(gl, program, opt){
   
    RenderObject(gl, program, opt, groundData)
}