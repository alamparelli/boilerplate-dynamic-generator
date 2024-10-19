import { readdirSync, readFileSync } from 'fs';
import path from 'path';
import express from 'express';
import { parseKeys } from './generator/generator.js';
import { buildBoilerplate } from './generator/builder.js';
import { promisify } from 'util';
import { exec } from 'child_process';

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

	// let sections = '';
	let content = '';
	let tempMENU = '';
	let tempFullPage = '';

	// Object.entries(templateObject).forEach(([key, value]) => {
	// 	sections =
	// 		sections +
	// 		`<div><a href="#${value.filename}" class="text-primary fs-5 my-2">${
	// 			value.filename.charAt(0).toUpperCase() +
	// 			value.filename.slice(1).toLowerCase()
	// 		}</a></div>`;
	// });

	Object.entries(templateObject).forEach(([key, value]) => {
		content = content + readFileSync(value.html, 'utf-8');
	});

	// tempMENU = fullPage.replace('<MENUGENERATOR>', sections);
	// tempFullPage = tempMENU.replace('<BODYGENERATOR>', content);
	tempFullPage = fullPage.replace('<BODYGENERATOR>', content);
	return tempFullPage;
};

const appUI = await buildUI();

app.use(express.urlencoded({ extended: true }));

const execPromise = promisify(exec);

app.post('/submit-form', async (req, res) => {
	const { setMonorepo, ...newReq } = req.body;
	const instructions = parseKeys(newReq, readTemplatesConfig());
	const boilerWorkingFolder = readBoilerplateConfig().base.boilerWorkingFolder;
	let workingDir = path.join(process.cwd(), boilerWorkingFolder);

	// Handle MonoRepo creation upfront
	try {
		if (req.body.setMonorepo) {
			const instructionsMonorepo = parseKeys(
				{ setMonorepo: 'true' },
				readTemplatesConfig()
			);

			try {
				const { stdout, stderr } = await execPromise(
					'mkdir backend frontend && npm init -y && npm install eslint prettier concurrently --save-dev && cd backend && npm init -y',
					{
						cwd: workingDir,
					}
				);
				if (stderr) {
					console.error(stderr);
				}
			} catch (error) {
				console.error(error);
			}

			await buildBoilerplate(instructionsMonorepo, boilerWorkingFolder);
		}
	} catch (error) {
		console.error(error);
	} finally {
		const result = await buildBoilerplate(instructions, boilerWorkingFolder);
		res.status(200).json({ Operations: result, Instructions: instructions });
	}
});

app.use('/', async (req, res) => {
	res.send(appUI);
});

app.listen(3000, () => {});
