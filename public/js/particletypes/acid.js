class Acid extends Particle {
	constructor() {
		super("acid", [176,191,26]);
		this.liquid = true;
		this.density = 1.1;
		this.reactions = 0;
	}

	update(x,y,grid) {
		let changes = [];

		//If the acid has reacted 5 times, it is used up
		if (this.reactions === 5) {
			changes.push([x,y,new Air()]);

			return changes;
		}

		//If the acid reaches the bottom, stop moving it
		if (y+1 > grid[x].length-1) {
			return false;
		} 

		//If air is below the acid, it falls
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

		//If metal is below the acid, it has a 10% chance of being dissolved
		if (grid[x][y+1].type === "metal") {
			if (Math.random() < 0.1) {
				changes.push([x,y+1,new Air()]);
				this.reactions += 1;

				return changes;
			}
		}

		//If air is down and to the left of the acid, move it there
		let left = false;
		let right = false;
		let ldissolve = false;
		let rdissolve = false;
		if (x-1 >= 0) {
			//If metal is to the left of the acid, it has a 5% chance of being dissolved
			if (grid[x-1][y].type === "metal") {
				if (Math.random() < 0.05) {
					ldissolve = true;
				}
			}
			if (grid[x-1][y].type === "air" && grid[x-1][y+1].type === "air") {
				left = true;
			}
		}
		if (x+1 < grid.length) {
			//If metal is to the right of the acid, it has a 5% chance of being dissolved
			if (grid[x+1][y].type === "metal") {
				if (Math.random() < 0.05) {
					rdissolve = true;
				}
			}
			if (grid[x+1][y].type === "air" && grid[x+1][y+1].type === "air") {
				right = true;
			}
		}

		//If acid can dissolve metal left or right choose a pseudo-random direction
		if (ldissolve && rdissolve) {
			if (Math.random() < 0.5) {
				changes.push([x-1,y,new Air()]);

				return changes;
			} else {
				changes.push([x+1,y,new Air()]);

				return changes;
			}
		}

		//If acid can only move in one direction, choose that direction
		if (ldissolve) {
			changes.push([x-1,y,new Air()]);

			return changes;
		}
		if (rdissolve) {
			changes.push([x+1,y,new Air()]);

			return changes;
		}

		//If acid can move left or right choose a pseudo-random direction
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
		//If acid can only move left or right, move in that direction
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
		//This function causes the acid to spread out horizontally if it is unable to move downwards
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

		//acid has a 90% chance of moving left or right
		if (Math.random() < 0.9) {

			//If acid can move left or right choose a random direction
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

			//If acid can only move in one direction, go in that direction

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