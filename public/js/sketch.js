let pixelSize = 10;
let gridWidth;
let gridHeight;
let gridMarginX;
let gridMarginY;

let canvasWidth;
let canvasHeight;

let grid = [];
let framerate = 60;

function setup(){
	//let menuHeight = document.getElementById("menu").offsetHeight;
	let menuWidth = document.getElementById("menu").offsetWidth;
	canvasWidth = windowWidth - menuWidth;
	canvasHeight = windowHeight;
	let canvas = createCanvas(canvasWidth,canvasHeight);
	canvas.parent("canvas");
	frameRate(framerate)
	gridWidth = Math.floor(canvasWidth / pixelSize);
	gridHeight = Math.floor(canvasHeight / pixelSize);
	gridMarginX = Math.floor((canvasWidth - (gridWidth*pixelSize)) / 2);
	gridMarginY = Math.floor((canvasHeight - (gridHeight*pixelSize)) / 2);

	clearCanvas();
}

function draw(){
	background(41, 147, 217);

	noStroke();

	let changes = [];

	//Get changes to be made
	for (x=0;x<grid.length;x++) {
		for(y=0;y<grid[x].length;y++) {
			let change = grid[x][y].update(x,y,grid);
			if (change) {changes.push(change)}
		}
	}

	//Spawn particles where clicked
	if (mouseIsPressed) {
		let particleX = Math.floor((mouseX+gridMarginX)/pixelSize)-1;
		let particleY = Math.floor((mouseY+gridMarginY)/pixelSize)-1;

		if (particleX < grid.length && particleY < grid[0].length) {
			grid[particleX][particleY] = new Sand();
		}
	}

	//make changes
	for (i=0;i<changes.length;i++) {
		for (j=0;j<changes[i].length;j++) {
			grid[changes[i][j][0]][changes[i][j][1]] = changes[i][j][2];
		}
	}
	//Draw grid
	for (x=0;x<grid.length;x++) {
		for (y=0;y<grid[x].length;y++) {
			fill(grid[x][y].colour[0],grid[x][y].colour[1],grid[x][y].colour[2]); //Set fill to particle's colour
			square((x*pixelSize)+gridMarginX,(y*pixelSize)+gridMarginY,pixelSize);
		}
	}
}

/*

Button Functions

*/

function clearCanvas() {

	grid = [];

	for (x=0;x<gridWidth;x++) {
		let row = [];
		for (y=0;y<gridHeight;y++) {
			row.push(new Air());
		}
		grid.push(row);
	}
}