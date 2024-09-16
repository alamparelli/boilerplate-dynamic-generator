import { readdirSync, readFileSync } from 'node:fs';
import path from 'path';
import express from 'express';

const templatesArray = [];
const app = express();

try {
	var boilerplateConfig = JSON.parse(
		readFileSync('./src/boilerplate/boilerplateConfig.json', 'utf8')
	);
} catch (error) {
	console.log(`${boilerplateConfigPath} not found`);
}

try {
	const files = readdirSync(boilerplateConfig.base.template);
	files.forEach((file) => {
		if (path.extname(file) === '.json') {
			templatesArray.push(
				JSON.parse(
					readFileSync(path.join(boilerplateConfig.base.template, file), 'utf8')
				)
			);
		}
	});
} catch (err) {
	console.error('Error reading directory:', err);
}

templatesArray.forEach((element) => {
	console.log(element.filename);
});

app.use('/', (req, res) => {
	res.send(fullPage);
});

app.listen(3000, () => {
	console.log('listen to port 3000');
});
