let pixelSize = 10;
let gridWidth;
let gridHeight

function setup(){
	createCanvas(windowWidth,windowHeight);
}

function draw(){
	gridWidth = Math.floor(windowWidth / pixelSize);
	gridHeight = Math.floor(windowHeight / pixelSize);
	background(255);

	for (x=0;x<gridWidth;x++) {
		for (y=0;y<gridHeight;y++) {
			stroke(0);
			strokeWeight(1);
			square(x*pixelSize,y*pixelSize,pixelSize);
		}
	}
}