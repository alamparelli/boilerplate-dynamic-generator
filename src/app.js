import { readdirSync, readFileSync } from 'fs';
import path from 'path';
import express from 'express';
import { parseKeys } from './generator/generator.js';
import { buildBoilerplate } from './generator/builder.js';

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
	const templateObject = {};
	try {
		const files = readdirSync(templatePath);
		files.forEach((file) => {
			if (path.extname(file) === '.json') {
				const tempObj = JSON.parse(
					readFileSync(path.join(templatePath, file), 'utf8')
				);
				templateObject[tempObj.position] = tempObj;
			}
		});
	} catch (err) {
		console.error('Error reading directory:', err);
	}
	return templateObject;
};

const buildUI = async () => {
	const fullPage = readFileSync('./src/public/index.html', 'utf-8');
	const templateObject = readTemplatesConfig();

	let sections = '';
	let content = '';
	let tempMENU = '';
	let tempFullPage = '';

	Object.entries(templateObject).forEach(([key, value]) => {
		sections =
			sections +
			`<div><a href="#${value.filename}" class="text-primary fs-5 my-2">${
				value.filename.charAt(0).toUpperCase() +
				value.filename.slice(1).toLowerCase()
			}</a></div>`;
	});

	Object.entries(templateObject).forEach(([key, value]) => {
		content = content + readFileSync(value.html, 'utf-8');
	});

	tempMENU = fullPage.replace('<MENUGENERATOR>', sections);
	tempFullPage = tempMENU.replace('<BODYGENERATOR>', content);
	return tempFullPage;
};

const appUI = await buildUI();

app.use(express.urlencoded({ extended: true }));

app.post('/submit-form', (req, res) => {
	const instructions = parseKeys(req.body, readTemplatesConfig());
	const boilerWorkingFolder = readBoilerplateConfig().base.boilerWorkingFolder;
	buildBoilerplate(instructions, boilerWorkingFolder);
	res.status(200).json(instructions);
});

app.use('/', async (req, res) => {
	res.send(appUI);
});

app.listen(3000, () => {});
