let pixelSize = 10;
let gridWidth;
let gridHeight;
let gridMarginX;
let gridMarginY;

let canvas;
let canvasWidth;
let canvasHeight;
let mouseOverCanvas = false;

let grid = [];
let framerate = 60;

let selectedParticle;

//Particle Type Descriptions

let descriptions = {
	"air": `Air: A simple placeholder particle that represents that absence of anything.`,
	"metal": `Metal: A dark grey particle with no gravity that is dissolved by acid.`,
	"sand": `Sand: A yellow powder, affected by gravity, that naturally forms piles and sinks in water.`,
	"water": `Water: A blue liquid that will over time distribute itself horizontally to fill up the space it exists in.`,
	"acid": `Acid: A green liquid that acts like water except it will dissolve metal on contact, converting it into air.`,
	"fire0": `Fire: A particle that exists in a random colour between red and yellow and will create child particles that float upwards. Also it burns stuff.`,
	"torch": `Torch: An orange particle that will infinitely generate fire if there is air above it.`,
};

/*

Functions

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

function drawCircle(xc, yc, r) {
	//Bruteforce algorithm for drawing circles
	for (y=-r;y<=r;y++) {
		for (x=-r;x<=r;x++) {
			if (x*x+y*y <= r * r) {
				if (xc+x >= 0 && xc+x <= grid.length-1) {
					if (yc+y >= 0 && yc+y <= grid[0].length-1) {
						//Spawn the selected particle
						switch (selectedParticle) {
							case "sand":
								grid[xc+x][Math.round(yc+y)] = new Sand();
								break;
							case "metal":
								grid[xc+x][Math.round(yc+y)] = new Metal();
								break;
							case "air":
								grid[xc+x][Math.round(yc+y)] = new Air();
								break;
							case "water":
								grid[xc+x][Math.round(yc+y)] = new Water();
								break;
							case "acid":
								grid[xc+x][Math.round(yc+y)] = new Acid();
								break;
							case "fire0":
								grid[xc+x][Math.round(yc+y)] = new Fire0();
								break;
							case "torch":
								grid[xc+x][Math.round(yc+y)] = new Torch();
						}
					}
				}
			}
		}
	}

}

function mouseOnCanvas() {
	mouseOverCanvas = true;
}

function mouseOffCanvas() {
	mouseOverCanvas = false;
}

function setParticle(type, id) {
	selectedParticle = type;

	//Reset all buttons
	let buttons = document.getElementsByClassName("particleButtons")[0].getElementsByTagName("a");
	
	for (i=0;i<buttons.length;i++) {
		buttons[i].className = "particleButton";
	}

	//Change color of button pressed
	document.getElementById(id).className = "selectedButton";

	//Set description
	document.getElementById("description").innerHTML = descriptions[type];
}

/*

Main Loop

*/

function setup(){
	//let menuHeight = document.getElementById("menu").offsetHeight;
	let menuWidth = document.getElementById("menu").offsetWidth;
	canvasWidth = windowWidth - menuWidth;
	canvasHeight = windowHeight;
	canvas = createCanvas(canvasWidth,canvasHeight);
	canvas.parent("canvas");
	canvas.mouseOver(mouseOnCanvas);
	canvas.mouseOut(mouseOffCanvas);

	//Set framerate
	frameRate(framerate)
	gridWidth = Math.floor(canvasWidth / pixelSize);
	gridHeight = Math.floor(canvasHeight / pixelSize);
	gridMarginX = Math.floor((canvasWidth - (gridWidth*pixelSize)) / 2);
	gridMarginY = Math.floor((canvasHeight - (gridHeight*pixelSize)) / 2);

	//Sets the particle to sand
	setParticle('sand', 'sandButton');

	//Fills grid array with air
	clearCanvas();
}

function draw(){
	background(41, 147, 217);

	noStroke();

	let changes = [];

	//Get changes to be made
	for (x=0;x<grid.length;x++) {
		for(y=0;y<grid[x].length;y++) {
			if (!grid[x][y].static){
				let change = grid[x][y].update(x,y,grid);
				if (change) {changes.push(change)}

				//If liquid can't move downward, attempt to dissipate
				if (grid[x][y].liquid && !change) {
					grid[x][y].dissipate(x,y,grid);
				}
			}
		}
	}

	//Spawn particles where clicked
	if (mouseIsPressed && mouseOverCanvas) {
		let particleX = Math.floor((mouseX+gridMarginX)/pixelSize);
		let particleY = Math.floor((mouseY+gridMarginY)/pixelSize)-1;

		//Draw circle with chosen slider radius
		let brushSlider = document.getElementById("brushSlider");
			
		drawCircle(particleX,particleY,brushSlider.value);
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