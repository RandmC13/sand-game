const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
	res.setHeader('Content-type', 'text/html');
	fs.readFile('webfiles/index.html', (err, data) => {
		if (err) {throw error};
		res.write(data);
		res.end();
	});
});

app.listen(port, () => {
	console.log(`server started on port ${port}`);
});