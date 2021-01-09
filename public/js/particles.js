class Particle {
	constructor(type, colour) {
		this.type = type;
		this.colour = colour;
		this.static = false;
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
			//If framecount is even, move left
			if (frameCount % 2 === 0) {
				changes.push([x-1,y+1,grid[x][y]]);
				changes.push([x,y,new Air()]);

				return changes;
			}
			//If it is odd, move right
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
	}

	update(x, y, grid) {

		let changes = [];

		//If air is below the water, it falls
		if (grid[x][y+1].type === "air") {
			changes.push([x,y+1,grid[x][y]]);
			changes.push([x,y,new Air()]);

			return changes;
		}

		//If air is down and to the left of the water, move it there
		let left = false;
		let right = false;
		let ldown = false;
		let rdown = false;
		if (x-1 >= 0) {
			if (grid[x-1][y].type === "air") {
				left = true;
			}
			if (y+1 < grid[0].length && grid[x-1][y+1].type === "air") {
				ldown = true;
			}
		}
		if (x+1 < grid.length) {
			if (grid[x+1][y].type === "air") {
				right = true;
			}
			if (y+1 < grid[0].length && grid[x+1][y+1].type === "air") {
				rdown = true;
			}
		}

		//If water can move left and down or right and down choose a pseudo-random direction
		if (ldown && rdown) {
			//If framecount is even, move left
			if (frameCount % 2 === 0) {
				changes.push([x-1,y+1,grid[x][y]]);
				changes.push([x,y,new Air()]);

				return changes;
			}
			//If it is odd, move right
			else {
				changes.push([x+1,y+1,grid[x][y]]);
				changes.push([x,y,new Air()]);

				return changes;
			}
		}
		//If water can only move left and down or right and down, move in that direction
		if (ldown) {
			changes.push([x-1,y+1,grid[x][y]]);
			changes.push([x,y,new Air()]);

			return changes;
		}

		if (rdown) {
			changes.push([x+1,y+1,grid[x][y]]);
			changes.push([x,y,new Air()]);

			return changes;			
		}

		//If water can move horizontally left or horizontally right choose a pseudo-random direction
		if (left && right) {
			//If framecount is even, move left
			if (frameCount % 2 === 0) {
				changes.push([x-1,y,grid[x][y]]);
				changes.push([x,y,new Air()]);

				return changes;	
			}
			//If framecount is odd, move right
			else {
				changes.push([x+1,y,grid[x][y]]);
				changes.push([x,y,new Air()]);

				return changes;
			}
		}

		//If water can only move in one direction horizontally, move in that direction
		if (left) {
			changes.push([x-1,y,grid[x][y]]);
			changes.push([x,y,new Air()]);

			return changes;	
		}

		if (right) {
			changes.push([x+1,y,grid[x][y]]);
			changes.push([x,y,new Air()]);

			return changes;
		}
	}
}