class Torch extends Particle {
	constructor() {
		super("torch", [255, 166, 0]);
	}

	update(x,y,grid) {
		let changes = [];

		//check if there is air above, if so spawn fire
		if (y-1 >= 0) {
			if (grid[x][y-1].type === "air") {
				changes.push([x,y-1,new Fire0()]);

				return changes;
			}
		}

		return false;
	}
}