class Wood extends Particle {
	constructor() {
		super("wood", [117, 70, 0]);

		this.burningFrames = 0;
		this.putoutFrames = 0;

	}

	update(x,y,grid) {
		let changes = [];

		let surroundingCoords =[[x-1, y-1],	[x, y-1],	[x+1, y-1],
								[x-1, y],				[x+1, y],
								[x-1, y+1],	[x,y+1],	[x+1, y+1]];

		//If it is not burning, check if it should be unless it has been putout by water
		//If it has been putout by water wait 500 frames before being putout again

		if (this.putout) {
			console.log("putout");
		}

		if (this.putout && this.putoutFrames == 50) {
			this.putoutFrames = 0;
			this.putout = false;
		} else if (this.putout) {
			this.putoutFrames += 1;
			return false;
		}

		//There is a 20% chance that it will check to be ignited

		if (!this.burning) {
			surroundingCoords.forEach((v) => {
				if (v[0] >= 0 && v[0] < grid.length) {
					if (v[1] >= 0 && v[1] < grid[0].length) {
						if (grid[v[0]][v[1]].burning) {
							this.burning = true;
						}
					}
				}
			});

			//80% of the time the burning attribute will be set to false anyway
			if (Math.random() < 0.8) {
				this.burning = false;
			}
		}

		//If adjacent square is putout it has a 10% chance of becoming putout

		if (this.burning) {
			surroundingCoords.forEach((v) => {
				if (v[0] >= 0 && v[0] < grid.length) {
					if (v[1] >= 0 && v[1] < grid[0].length) {
						if (grid[v[0]][v[1]].putout) {
							this.putout = true;
							this.putoutFrames = grid[v[0]][v[1]].putoutFrames;
						}
					}
				}
			});

			if (Math.random() < 0.90) {
				this.putout = false;
			 }
		}

		if (this.burning) {

			//If there is space above, make fire there if not choose a random space
			if (y-1 >= 0) {
				if (grid[x][y-1].type === "air") {
					changes.push([x,y-1,new Fire2()]);

					return changes;
				}
			}

			let options = [];

			if (x-1 >= 0) {
				if (grid[x-1][y].type === "air") {
					options.push([x-1,y,new Fire2()]);
				}
				if (y-1 >= 0) {
					if (grid[x-1][y-1].type === "air") {
						options.push([x-1,y-1,new Fire2()]);
					}
				}
				if (y+1 < grid[0].length) {
					if (grid[x-1][y+1].type === "air") {
						options.push([x-1,y+1,new Fire2()]);
					}
				}
			}
			if (x+1 < grid.length) {
				if (grid[x+1][y].type === "air") {
					options.push([x+1,y,new Fire2()]);
				}
				if (y-1 >= 0) {
					if (grid[x+1][y-1].type === "air") {
						options.push([x+1,y-1,new Fire2()]);
					}
				}
				if (y+1 < grid[0].length) {
					if (grid[x+1][y+1].type === "air") {
						options.push([x+1,y+1,new Fire2()]);
					}
				}
			}
			if (y+1 < grid.length) {
				if (grid[x][y+1].type === "air") {
					options.push([x,y+1,new Fire2()]);
				}
			}

			//Make the colour of the wood darker

			//50% of the time the colour will darken
			if (Math.random() < 0.5) {
				if (this.colour[0] > 0) {this.colour[0] -= 1;}
				if (this.colour[1] > 0) {this.colour[1] -= 1;}

				this.burningFrames += 1;
			}

			//After 140 frames the wood burns up
			if (this.burningFrames === 140) {
				changes.push([x,y,new Air()]);

				return changes;
			}

			//Choose a random place to spawn fire, if there is space

			if (options.length > 0) {
				const random = Math.floor(Math.random() * options.length);
				changes.push(options[random]);

				return changes;
			}

		}

		return false;
	}
}