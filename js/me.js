var me = {}
me.mesh = new Array()
me.mesh.sourceMesh = "data/objects/me.obj"

let myData = {}


function InitMe(gl){
    LoadMesh(gl, me)
    me.offsetY = -5;
    me.offsetX = -5;
    me.offsetZ = 1;
    me.rotZ = 0;

    myData.positions = me.positions
    myData.normals = me.normals
    myData.texcoords = me.texcoords
    myData.texture = me.texture
    myData.translate = true
    myData.offsetX = me.offsetX
    myData.offsetY = me.offsetY
    myData.offsetZ = me.offsetZ
    myData.rotate = true
    myData.rotX = 0
    myData.rotY = 0
    myData.rotZ = me.rotZ
    myData.diffuse = me.diffuse[1]
    myData.ambient = me.ambient[1]
    myData.specular = me.specular[1]
    myData.emissive = me.emissive[1]
    myData.shininess = me.shininess[1]
}

function RenderMe(gl, program, opt){
    
    myData.opacity = controls.myTransparency

    if(car_obj[0].posX < me.offsetX + 1.0 && car_obj[0].posX > me.offsetX - 1 &&
        car_obj[0].posY <= me.offsetY + 1 && car_obj[0].posY >= me.offsetY - 1){
        wPressed = false
        car_obj[0].posX -= car_obj[0].velX * 12 * controls.myTransparency
        car_obj[0].posY -= car_obj[0].velY * 12 * controls.myTransparency
        if(!gameEnded) subtractScore()
   }


    RenderObject(gl, program, opt, myData)
    // gl.bindTexture(gl.TEXTURE_2D, null);
    gl.disableVertexAttribArray(opt.texcoordLocation)
    
}