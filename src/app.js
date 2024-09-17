import { readdirSync, readFileSync } from 'node:fs';
import path from 'path';
import express from 'express';

const app = express();

const readBoilerplateConfig = () => {
	const configPath = './src/boilerplate/boilerplateConfig.json';
	try {
		var boilerplateConfig = JSON.parse(readFileSync(configPath, 'utf8'));
	} catch (error) {
		console.log(`${configPath} not found`);
	}
	return boilerplateConfig;
};

const readTemplatesConfig = () => {
	const templatePath = readBoilerplateConfig().base.template;
	const templatesArray = [];
	try {
		const files = readdirSync(templatePath);
		files.forEach((file) => {
			if (path.extname(file) === '.json') {
				templatesArray.push(
					JSON.parse(readFileSync(path.join(templatePath, file), 'utf8'))
				);
			}
		});
	} catch (err) {
		console.error('Error reading directory:', err);
	}
	return templatesArray;
};

const buildUI = async () => {
	const fullPage = readFileSync('./src/public/index.html', 'utf-8');
	const templatesArray = readTemplatesConfig();
	let content = '';
	templatesArray.forEach((element) => {
		content = content + readFileSync(element.html, 'utf-8');
	});
	let tempFullPage = await fullPage.replace('<BODYGENERATOR>', content);
	return tempFullPage;
};

const appUI = await buildUI();

app.use('/', async (req, res) => {
	res.send(appUI);
});

app.listen(3000, () => {});
