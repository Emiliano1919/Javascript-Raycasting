// Necesary code to run on the browser and use the canvas API
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.width = 600;
canvas.height = 600;
w = canvas.width;
const canvas_ctx = canvas.getContext("2d");
let canvas_buffer = canvas_ctx.getImageData(0, 0, canvas.width, canvas.height);
let data = canvas_buffer.data;

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
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,4,0,4,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,4,0,0,0,0,5,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,4,0,4,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,4,0,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
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
    let hit; // Value to determine if the coming loop will be ended
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
}
  