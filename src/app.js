import { readdirSync, readFileSync } from 'node:fs';
import path from 'path';
import express from 'express';

const configPath = './src/boilerplate/boilerplateConfig.json';
const templatesArray = [];
const app = express();
const fullPage = readFileSync('./src/public/index.html', 'utf-8');

try {
	var boilerplateConfig = JSON.parse(readFileSync(configPath, 'utf8'));
} catch (error) {
	console.log(`${configPath} not found`);
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

app.use('/', async (req, res) => {
	let content = '';
	templatesArray.forEach((element) => {
		content = content + readFileSync(element.html, 'utf-8');
	});
	let tempFullPage = await fullPage.replace('<BODYGENERATOR>', content);
	res.send(tempFullPage);
});

app.listen(3000, () => {
	console.log('listen to port 3000');
});
