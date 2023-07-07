var freeCameraOffsetX = 0;
var freeCameraOffsetY = 0;
var freeCameraOffsetZ = 0;

var targets = [[0,0,0], [0,0,0], [0,0,0], [0,0,0]];
var cameras = [[0,0,0], [0,0,0], [0,0,0], [0,0,0]];

function MoveCamera(){
    if(wPressed){
        freeCameraOffsetX -= controls.cameraSpeed*Math.cos(controls.theta)*Math.abs(swipeHorizontalN)
        freeCameraOffsetZ -= controls.cameraSpeed*Math.cos(controls.phi)
       
        if(mobileDevice)  freeCameraOffsetY -= controls.cameraSpeed*Math.sin(controls.theta)*Math.abs(swipeVerticalN)
        else freeCameraOffsetY -= controls.cameraSpeed*Math.sin(controls.theta)

        if(mobileDevice)  freeCameraOffsetX -= controls.cameraSpeed*Math.sin(controls.theta)*Math.abs(swipeHorizontalN)
        else freeCameraOffsetX -= controls.cameraSpeed*Math.cos(controls.theta)


    }
    if(sPressed){
        freeCameraOffsetY += controls.cameraSpeed*Math.sin(controls.theta)
        freeCameraOffsetX += controls.cameraSpeed*Math.cos(controls.theta)
        freeCameraOffsetZ += controls.cameraSpeed*Math.cos(controls.phi)
    }
    if(aPressed){
        freeCameraOffsetX += controls.cameraSpeed*Math.sin(controls.phi)*Math.sin(controls.theta)
        freeCameraOffsetY -= controls.cameraSpeed*Math.cos(controls.theta)
    }
    if(dPressed){
        freeCameraOffsetX -= controls.cameraSpeed*Math.sin(controls.phi)*Math.sin(controls.theta)
        freeCameraOffsetY += controls.cameraSpeed*Math.cos(controls.theta)
    }
    if(leftArrowPressed){
        controls.theta += dr
    }
    if(rightArrowPressed){
        controls.theta -= dr
    }
    if(upArrowPressed){
        controls.phi += dr
    }
    if(downArrowPressed){
        controls.phi -= dr
    }
}

function SetCamera(){
    if(controls.camera-1 == 0){
        cameras[0] = [
            controls.D*Math.sin(controls.phi)*Math.cos(controls.theta) + freeCameraOffsetX, 
            controls.D*Math.sin(controls.phi)*Math.sin(controls.theta) + freeCameraOffsetY,
            controls.D*Math.cos(controls.phi) + 1 + freeCameraOffsetZ
        ]
        targets[0] = [freeCameraOffsetX, freeCameraOffsetY - 1, freeCameraOffsetZ]
    } else if (controls.camera-1 == 1) {
        cameras[1] = [
            controls.D*Math.sin(-carFacing)+car_obj[0].posX, 
            controls.D*Math.cos(-carFacing)+car_obj[0].posY,
            car_obj[0].posZ + 0.5
        ];
        targets[1] = [car_obj[0].posX, car_obj[0].posY, car_obj[0].posZ]
    } else if (controls.camera-1 == 2) {
        cameras[2] = [
            Math.sin(-carFacing)+car_obj[0].posX, 
            Math.cos(-carFacing)+car_obj[0].posY,
            car_obj[0].posZ + controls.D
        ];
        targets[2] = [car_obj[0].posX, car_obj[0].posY, car_obj[0].posZ]
    }
}