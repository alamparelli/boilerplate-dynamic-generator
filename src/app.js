import { readdirSync, readFileSync } from 'node:fs';
import path from 'path';
import express from 'express';
import { writeJson } from './generator/generateJson.js';
import { parseKeys, buildBoilerplate } from './generator/generator.js';

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

	templatesArray.sort((a, b) => a.position - b.position);

	let sections = '';
	let content = '';
	let tempMENU = '';
	let tempFullPage = '';

	templatesArray.forEach((element) => {
		sections =
			sections +
			`<div><a href="#${element.filename}" class="text-primary fs-5 my-2">${
				element.filename.charAt(0).toUpperCase() +
				element.filename.slice(1).toLowerCase()
			}</a></div>`;
	});

	templatesArray.forEach((element) => {
		content = content + readFileSync(element.html, 'utf-8');
	});
	tempMENU = await fullPage.replace('<MENUGENERATOR>', sections);
	tempFullPage = await tempMENU.replace('<BODYGENERATOR>', content);
	return tempFullPage;
};

const appUI = await buildUI();

app.use(express.urlencoded({ extended: true }));

app.post('/submit-form', (req, res) => {
	console.log(req.body);
	const instructions = parseKeys(req.body, readTemplatesConfig());
	console.log('instr', instructions);

	const boilerWorkingFolder = readBoilerplateConfig().base.boilerWorkingFolder;

	buildBoilerplate(instructions, boilerWorkingFolder);
	// res.send('BoilerPlate Generated');
	res.status(200).json(instructions);
});

app.use('/', async (req, res) => {
	res.send(appUI);
});

app.listen(3000, () => {});
