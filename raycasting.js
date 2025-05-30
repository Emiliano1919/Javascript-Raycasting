// Necesary code to run on the browser and use the canvas API
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.width = 800;
canvas.height = 800;
h = canvas.height;
w = canvas.width;
const canvas_ctx = canvas.getContext("2d");
let canvas_buffer = canvas_ctx.getImageData(0, 0, canvas.width, canvas.height);
let data = canvas_buffer.data;

document.body.style.margin = "0";
document.body.style.height = "100vh";
document.body.style.display = "flex";
document.body.style.justifyContent = "center";
document.body.style.alignItems = "center";
document.body.style.background = "#111"; 

// This map is from the main source I used to code this
const worldMap = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,2,2,2,2,2,0,0,0,0,3,0,3,0,3,0,0,0,1],
    [1,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,2,0,0,0,2,0,0,0,0,3,0,0,0,3,0,0,0,1],
    [1,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,2,2,0,2,2,0,0,0,0,3,0,3,0,3,0,0,0,1],
    [1,0,0,0,0,0,0,2,0,2,0,0,0,3,0,3,0,3,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,2,0,2,0,0,0,0,0,3,0,3,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,2,0,2,2,0,0,3,0,3,0,3,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,2,0,0,0,0,0,0,0,3,0,3,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,2,2,2,2,0,0,0,0,3,0,3,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,4,0,4,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,4,0,0,0,0,0,0,4,0,4,0,0,4,4,0,0,0,0,0,0,0,0,1],
    [1,4,0,4,0,0,0,0,4,0,4,0,0,0,4,0,0,0,0,0,0,0,0,1],
    [1,4,0,4,4,4,4,4,4,4,4,0,0,0,4,0,0,0,0,0,0,0,0,1],
    [1,4,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,1],
    [1,4,4,4,4,4,4,4,4,4,0,0,0,0,4,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];
// Position is our position on the map
let posX = 22;
let posY = 12;
// Direction is the unic vector where we are facing (treat it as if it where to be in respect of the player)
let dirX = -1;
let dirY = 0;
// This is one of the end points of the direction vector. If you do pos+dir+plane you get one endpoint and if you do pos+dir-plane 
// you get the other one
let planeX = 0;
let planeY = 0.66; 

const RGB_Red = [255, 0, 0];
const RGB_Green = [0, 255, 0];
const RGB_Blue = [0, 0, 255];
const RGB_White = [255,255, 255];
const RGB_Yellow = [255, 255, 0];
const RGB_Black = [0,0,0];

function verticalLine(x, drawStart, drawEnd, color, perpWallDist) {
    drawStart = Math.floor(drawStart);
    drawEnd = Math.floor(drawEnd);

    for (let y = 0; y < h; y++) {
        const index = (y * canvas.width + x) * 4;
        if (y >= drawStart && y <= drawEnd) {
            data[index + 0] = color[0] / Math.min(perpWallDist , 2.5); // Red
            data[index + 1] = color[1] / Math.min(perpWallDist , 2.5); // Green
            data[index + 2] = color[2] / Math.min(perpWallDist , 2.5); // Blue
            data[index + 3] = 255;      // Alpha
        } else {
            data[index + 0] = RGB_Black[0]; // Red
            data[index + 1] = RGB_Black[1]; // Green
            data[index + 2] = RGB_Black[2]; // Blue
            data[index + 3] = 255;      // Alpha
        }
    }
}

function raycaster() {
    // Loop through the canvas
    for (let x = 0; x < w; x++) {
        // Transform x from canvas width to cameraX value in [-1;1]
        let cameraX = ((2 * x ) / w ) - 1;
        let rayDirX = dirX + planeX * cameraX;
        let rayDirY = dirY + planeY * cameraX;
        // Position in the map
        let mapX = Math.floor(posX);
        let mapY = Math.floor(posY);
        // Variables to hold the values of the distance from the current position to the first next x or y side
        let sideDistX;
        let sideDistY;
        // The distance the ray has to travel from the current x side to the next x side  (same thing with y side)
        let deltaDistX = (rayDirX === 0) ? 1e30 : Math.abs(1 / rayDirX);
        let deltaDistY = (rayDirY === 0) ? 1e30 : Math.abs(1 / rayDirY);
        // Variable necessary to calculate length of the ray
        let perpWallDist;
        // What direction to go next step (-1 or 1)
        let stepX;
        let stepY;
        let hit=0; // Value to determine if the coming loop will be ended
        let side; // Value to determine if we hit a side x or a y side of a wall.
        // Calculate to which side we should step and the inidial sideDistX
        if (rayDirX < 0) {
            stepX = -1;
            sideDistX = (posX - mapX) * deltaDistX;
        } else {
            stepX = 1;
            sideDistX = (mapX + 1.0 - posX) * deltaDistX;
        }
        if (rayDirY < 0) {
            stepY = -1;
            sideDistY = (posY - mapY) * deltaDistY;
        } else {
            stepY = 1;
            sideDistY = (mapY + 1.0 - posY) * deltaDistY;
        }
        // DDA
        while (hit == 0) {
            if (sideDistX < sideDistY) {
                sideDistX += deltaDistX;
                mapX += stepX;
                side = 0; 
            } else {
                sideDistY += deltaDistY;
                mapY += stepY;
                side = 1;
            }
            if (worldMap[mapX][mapY] > 0) {
                hit = 1;
            }
        }
        // Calculate distance from the camera plane to the wall
        if (side == 0) {
            perpWallDist = (sideDistX - deltaDistX);
        } else {
            perpWallDist = (sideDistY - deltaDistY);
        }
        // Get the height of the line that we should draw (basically we make the height relative to the distance the ray has traveled)
        let lineHeight = h/perpWallDist;
        // Calculate the lowest and highest pixel to fill in current stripe (We are basically doing math to centre the line on the screen)
        let drawStart = - lineHeight/2 + h/2; // This one centers by putting the start below or equal to the middle of the screen
        if (drawStart < 0) {
            drawStart = 0;
        }
        let drawEnd = lineHeight/2 + h/2; // This one centers by putting the end above or equal to the middle of the screen
        if (drawEnd >= h) {
            drawEnd = h-1;
        }
        let color;
        switch(worldMap[mapX][mapY]) {
            case 1:  color = RGB_Red;    break;
            case 2:  color = RGB_Green;  break;
            case 3:  color = RGB_Blue;   break;
            case 4:  color = RGB_White;  break;
            default: color = RGB_Yellow; break; 
        }
        // Give a different color to the sides
        if (side == 1) {
            color = color.map(c => c / 2);
        }
        verticalLine(x, drawStart, drawEnd, color, perpWallDist);
    }
    canvas_ctx.putImageData(canvas_buffer, 0, 0); //Outside the loop for performance reasons
}

let keys = {};
document.addEventListener('keydown', (event) =>{
    keys[event.code] = true;
})
document.addEventListener('keyup', (event) =>{
    keys[event.code] = false;
})

function updatePlayer() {
    // Hard code speed.
    const moveSpeed = 0.05; 
    const rotSpeed = 0.03;

    // move forward if no wall in front of you
    if (keys['KeyW']) {
        if (worldMap[Math.floor(posX + dirX * moveSpeed)][Math.floor(posY)] === 0) {
            posX += dirX * moveSpeed;
        }
        if (worldMap[Math.floor(posX)][Math.floor(posY + dirY * moveSpeed)] === 0) {
            posY += dirY * moveSpeed;
        }
    }

    // move backward if no wall behind you
    if (keys['KeyS']) {
        if (worldMap[Math.floor(posX - dirX * moveSpeed)][Math.floor(posY)] === 0) {
            posX -= dirX * moveSpeed;
        }
        if (worldMap[Math.floor(posX)][Math.floor(posY - dirY * moveSpeed)] === 0) {
            posY -= dirY * moveSpeed;
        }
    }

    // rotate to the right
    if (keys['KeyD']) { // Use rotation matrices
        const oldDirX = dirX;
        dirX = dirX * Math.cos(-rotSpeed) - dirY * Math.sin(-rotSpeed);
        dirY = oldDirX * Math.sin(-rotSpeed) + dirY * Math.cos(-rotSpeed);
        const oldPlaneX = planeX;
        planeX = planeX * Math.cos(-rotSpeed) - planeY * Math.sin(-rotSpeed);
        planeY = oldPlaneX * Math.sin(-rotSpeed) + planeY * Math.cos(-rotSpeed);
    }

    // rotate to the left
    if (keys['KeyA']) { // Use rotation matrices
        const oldDirX = dirX;
        dirX = dirX * Math.cos(rotSpeed) - dirY * Math.sin(rotSpeed);
        dirY = oldDirX * Math.sin(rotSpeed) + dirY * Math.cos(rotSpeed);
        const oldPlaneX = planeX;
        planeX = planeX * Math.cos(rotSpeed) - planeY * Math.sin(rotSpeed);
        planeY = oldPlaneX * Math.sin(rotSpeed) + planeY * Math.cos(rotSpeed);
    }
}

function gameLoop() {
    updatePlayer();
    raycaster();
    requestAnimationFrame(gameLoop);
}
raycaster(); 
gameLoop();
  