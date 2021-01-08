class Particle {
	constructor(type, colour) {
		this.type = type;
		this.colour = colour;
	}

	update(x, y, grid){
		return false;
	}
}

class Air extends Particle {
	constructor() {
		super("air", [0,0,0]);
	}
}

class Sand extends Particle {
	constructor() {
		super("sand", [194,187,54]);
	}

	update(x, y, grid) {

		let changes = [];

		//If the sand reaches the bottom, stop moving it
		if (y+1 > grid[x].length-1) {
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
		if (x+1 < grid.length-1) {
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