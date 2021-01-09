class Particle {
	constructor(type, colour) {
		this.type = type;
		this.colour = colour;
		this.static = false;
		this.liquid = false;
	}

	update(x, y, grid){
		return false;
	}
}

class Air extends Particle {
	constructor() {
		super("air", [0,0,0]);
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
	}
}

class Water extends Particle {
	constructor() {
		super("water", [28,163,236]);
		this.liquid = true;
		this.density = 1;
	}

	update(x,y,grid) {
		let changes = [];

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

					return true;
				} else {
					grid[x+1][y] = grid[x][y];
					grid[x][y] = new Air();

					return true;
				}
			}

			//If water can only move in one direction, go in that direction

			if (left) {
				grid[x-1][y] = grid[x][y];
				grid[x][y] = new Air();

				return true;
			}

			if (right) {
				grid[x+1][y] = grid[x][y];
				grid[x][y] = new Air();

				return true;
			}
		}
	}
}