class Particle {
	constructor(type, colour) {
		this.type = type;
		this.colour = colour;
		this.static = false;
		this.liquid = false;
		this.burning = false;
		this.putout = false;
	}

	update(x, y, grid){
		return false;
	}
}

class Air extends Particle {
	constructor() {
		super("air", [45,45,45]);
		this.static = true;
	}
}

class Metal extends Particle {
	constructor() {
		super("metal", [133, 133, 133])
		this.static = true;
	}
}

class Sand extends Particle {
	constructor() {
		super("sand", [227, 211, 86]);
		this.density = 10;
	}

	update(x, y, grid) {

		let changes = [];

		//If the sand reaches the bottom, stop moving it
		if (y+1 > grid[x].length-1) {
			this.static = true;
			return false;
		}

		//If air is below the sand, it falls
		if (grid[x][y+1].type === "air") {
			changes.push([x,y+1,grid[x][y]]);
			changes.push([x,y,new Air()]);

			return changes;
		}

		//If it is denser than the liquid below it, it sinks
		if (grid[x][y+1].liquid && this.density > grid[x][y+1].density) {
			changes.push([x,y+1,grid[x][y]]);
			changes.push([x,y,grid[x][y+1]]);

			return changes;
		}

		//If air is down and to the left of the sand, move it there
		let left = false;
		let right = false;
		if (x-1 >= 0) {
			if (grid[x-1][y].type === "air" && grid[x-1][y+1].type === "air") {
				left = true;
			}
		}
		if (x+1 < grid.length) {
			if (grid[x+1][y].type === "air" && grid[x+1][y+1].type === "air") {
				right = true;
			}
		}

		//If sand can move left or right choose a pseudo-random direction
		if (left && right) {
			if (Math.random() < 0.5) {
				changes.push([x-1,y+1,grid[x][y]]);
				changes.push([x,y,new Air()]);

				return changes;
			}
			else {
				changes.push([x+1,y+1,grid[x][y]]);
				changes.push([x,y,new Air()]);

				return changes;
			}
		}
		//If sand can only move left or right, move in that direction
		if (left) {
			changes.push([x-1,y+1,grid[x][y]]);
			changes.push([x,y,new Air()]);

			return changes;
		}

		if (right) {
			changes.push([x+1,y+1,grid[x][y]]);
			changes.push([x,y,new Air()]);

			return changes;
		}

		return false;
	}
}

class Water extends Particle {
	constructor() {
		super("water", [28,163,236]);
		this.liquid = true;
		this.density = 1;
	}

	dissipate(x,y,grid) {
		//This function causes the water to spread out horizontally if it is unable to move downwards
		let left = false;
		let right = false;

		if (x-1 >= 0) {
			if (grid[x-1][y].type === "air") {
				left = true;
			}
		}

		if (x+1 < grid.length) {
			if (grid[x+1][y].type === "air") {
				right = true;
			}
		}

		//Water has a 90% chance of moving left or right
		if (Math.random() < 0.9) {

			//If water can move left or right choose a random direction
			if (left && right) {
				if (Math.random() < 0.5) {
					grid[x-1][y] = grid[x][y];
					grid[x][y] = new Air();


				} else {
					grid[x+1][y] = grid[x][y];
					grid[x][y] = new Air();


				}
			}

			//If water can only move in one direction, go in that direction

			if (left) {
				grid[x-1][y] = grid[x][y];
				grid[x][y] = new Air();


			}

			if (right) {
				grid[x+1][y] = grid[x][y];
				grid[x][y] = new Air();


			}
		}
	}

	putoutBurning(x,y,grid) {

		//Putout adjacent burning particles

		if (x-1 >= 0) {
			if (grid[x-1][y].burning) {
				grid[x-1][y].burning = false;
				grid[x-1][y].putout = true;
			}
			if (y-1 >= 0) {
				if (grid[x-1][y-1].burning) {
					grid[x-1][y-1].burning = false;
					grid[x-1][y-1].putout = true;
				}
			}
			if (y+1 < grid[0].length) {
				if (grid[x-1][y+1].burning) {
					grid[x-1][y+1].burning = false;
					grid[x-1][y+1].putout = true;
				}
			}
		}
		if (x+1 < grid.length) {
			if (grid[x+1][y].burning) {
				grid[x+1][y].burning = false;
				grid[x+1][y].putout = true;
			}
			if (y-1 >= 0) {
				if (grid[x+1][y-1].burning) {
					grid[x+1][y-1].burning = false;
					grid[x+1][y-1].putout = true;
				}
			}
			if (y+1 < grid[0].length) {
				if (grid[x+1][y+1].burning) {
					grid[x+1][y+1].burning = false;
					grid[x+1][y+1].putout = true;
				}
			}
		}
		if (y-1 >= 0) {
			if (grid[x][y-1].burning) {
				grid[x][y-1].burning = false;
				grid[x][y-1].putout = true;
			}
		}
		if (y+1 < grid[0].length) {
			if (grid[x][y+1].burning) {
				grid[x][y+1].burning = false;
				grid[x][y+1].putout = true;
			}
		}
	}

	update(x,y,grid) {
		let changes = [];

		//Attempt to putout adjacent particles
		this.putoutBurning(x,y,grid);

		//If the water reaches the bottom, stop moving it
		if (y+1 > grid[x].length-1) {
			return false;
		}

		//If air is below the water, it falls
		if (grid[x][y+1].type === "air") {
			changes.push([x,y+1,grid[x][y]]);
			changes.push([x,y,new Air()]);

			return changes;
		}

		//If there is less dense liquid below, sink
		if (grid[x][y+1].liquid && this.density > grid[x][y+1].density) {
			changes.push([x,y+1,grid[x][y]]);
			changes.push([x,y,grid[x][y+1]]);

			return changes;
		}

		//If air is down and to the left of the water, move it there
		let left = false;
		let right = false;
		if (x-1 >= 0) {
			if (grid[x-1][y].type === "air" && grid[x-1][y+1].type === "air") {
				left = true;
			}
		}
		if (x+1 < grid.length) {
			if (grid[x+1][y].type === "air" && grid[x+1][y+1].type === "air") {
				right = true;
			}
		}

		//If water can move left or right choose a pseudo-random direction
		if (left && right) {
			if (Math.random() < 0.5) {
				changes.push([x-1,y+1,grid[x][y]]);
				changes.push([x,y,new Air()]);

				return changes;
			}
			else {
				changes.push([x+1,y+1,grid[x][y]]);
				changes.push([x,y,new Air()]);

				return changes;
			}
		}
		//If water can only move left or right, move in that direction
		if (left) {
			changes.push([x-1,y+1,grid[x][y]]);
			changes.push([x,y,new Air()]);

			return changes;
		}

		if (right) {
			changes.push([x+1,y+1,grid[x][y]]);
			changes.push([x,y,new Air()]);

			return changes;
		}

		return false;
	}
}

class Fire0 extends Particle {
	constructor(totalFrames=0) {

		//Generate random colour between yellow and red

		let green = Math.round(Math.random() * 170);

		super("fire0", [255,green,0]);
		this.framecount = 0;

		this.totalFrames = totalFrames;
		this.burning = true;
	}

	update(x,y,grid) {
		this.framecount += 1;

		let changes = [];

		let options = [];

		//If burning is not true it will delete itself
		if (!this.burning) {
			changes.push([x,y,new Air()]);

			return changes;
		}

		//If it has been alive for 2 frames it will delete itself
		if (this.framecount === 2) {
			changes.push([x,y,new Air()]);

			return changes;
		}

		//check if the fire can spread in any direction upward and chooses a random direction of those directions to spread the fire
		if (y-1 >= 0){
			if (grid[x][y-1].type === "air") {
				options.push([x,y-1,new Fire1(this.totalFrames)]);
			}
			if (x-1 >= 0) {
				if (grid[x-1][y-1].type === "air") {
					options.push([x-1,y-1,new Fire1(this.totalFrames)]);
				}
			}
			if (x+1 < grid.length) {
				if (grid[x+1][y-1].type === "air") {
					options.push([x+1,y-1,new Fire1(this.totalFrames)]);
				}
			}
		}

		//if the fire cannot spread upwards it will move to the side
		if (options.length === 0) {
			if (x-1 >= 0) {
				if (grid[x-1][y].type === "air") {
					options.push([x-1,y,new Fire1(this.totalFrames)]);
				}
			}
			if (x+1 < grid.length) {
				if (grid[x+1][y].type === "air") {
					options.push([x+1,y,new Fire1(this.totalFrames)]);
				}
			}
		}

		if (options.length > 0) {
			const random = Math.floor(Math.random() * options.length);
			changes.push(options[random]);

			return changes;
		}

		return false;
	}
}

class Fire1 extends Particle {
	constructor(totalFrames=0) {
		super("fire1", [247, 55, 24]);
		this.framecount = 0;
		this.deathFrame = 15;

		this.totalFrames = totalFrames;
		this.burning = true;
	}

	update(x,y,grid) {

		//keeps track of total frames that have passed since the fast Fire0() instance was spawned
		this.totalFrames += 1;

		let changes = [];

		//If burning is not true it will delete itself
		if (!this.burning) {
			changes.push([x,y,new Air()]);

			return changes;
		}

		//if total frames that have passed is greater than the number specified, the particle dies
		if (this.totalFrames >= this.deathFrame) {
			changes.push([x,y,new Air()]);

			return changes;
		}

		changes.push([x,y,new Fire0(this.totalFrames)]);

		if (changes.length > 0){return changes;} else {return false;}
	}
}

class Fire2 extends Particle {
	constructor() {
		let green = Math.round(Math.random() * 30) + 170;
		super("fire2", [255,green,0]);
		this.burning = true;
	}

	update(x,y,grid) {
		let changes = [];

		//If burning is not true it will delete itself
		if (!this.burning) {
			changes.push([x,y,new Air()]);

			return changes;
		}

		//There is an 80% chance that it will decay into fire1
		if (Math.random() < 0.8) {
			changes.push([x,y,new Fire1()]);

			return changes;
		}

		return false;
	}
}