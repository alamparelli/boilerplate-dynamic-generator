import fs, { copyFile, readFileSync } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);
const copyFilePromise = promisify(copyFile);

export const buildBoilerplate = async (object, boilerWorkingFolder) => {
	let workingDir = path.join(process.cwd(), boilerWorkingFolder);
	if (!fs.existsSync(workingDir)) {
		fs.mkdirSync(workingDir);
	}

	const runCommandArray = [];
	let npmCommand = 'npm install';
	const runCopyFiles = [];
	const runJson = [];
	let logOutput = [];

	const consoleLog = (input) => {
		logOutput.push(input);
		console.log(input);
	};

	Object.entries(object).forEach(([key, value]) => {
		Object.entries(value).forEach(([type, operation]) => {
			if (type === 'run') {
				runCommandArray.push(operation);
			}
			if (type === 'npm') {
				for (let command of operation) {
					npmCommand = npmCommand + ' ' + command;
				}
			}
			//hotfix to handle several copy files in json files
			if (type.startsWith('file')) {
				runCopyFiles.push(operation);
			}
			if (type === 'json') {
				runJson.push(operation);
			}
		});
	});

	// to modify
	//runCommandArray.push({ zone: 'root', command: [npmCommand] });

	Object.entries(runCommandArray).forEach(async ([key, value]) => {
		for (let instr of value.command) {
			try {
				const validZones = ['backend', 'fontend'];
				const newPath = path.join(workingDir, value.zone);
				if (fs.existsSync(newPath)) {
					if (validZones.includes(value.zone)) {
						workingDir = newPath;
					}
				}
				const { stdout, stderr } = await execPromise(instr, {
					cwd: workingDir,
				});
				consoleLog(`Execute : ${value.zone} - ${instr}`);
				if (stderr) {
					console.error(stderr);
				}
			} catch (error) {
				console.error(error);
			}
		}
	});

	for (let instruct of runCopyFiles) {
		try {
			const validZones = ['backend', 'fontend'];
			const newPath = path.join(workingDir, instruct.zone);
			if (fs.existsSync(newPath)) {
				if (validZones.includes(instruct.zone)) {
					workingDir = newPath;
				}
			}
			await copyFilePromise(
				instruct.fileSource,
				path.join(workingDir, instruct.fileDest)
			);
			consoleLog(`Copy : ${instruct.fileDest}`);
		} catch (error) {
			console.error(error);
		}
	}

	for (const jsonConfig of runJson) {
		try {
			const validZones = ['backend', 'fontend'];
			const newPath = path.join(workingDir, jsonConfig.zone);
			if (fs.existsSync(newPath)) {
				if (validZones.includes(jsonConfig.zone)) {
					workingDir = newPath;
				}
			} else {
				workingDir = path.join(process.cwd(), boilerWorkingFolder);
			}
			let filePath = path.join(workingDir, jsonConfig.path);
			console.log(filePath);
			let file = await JSON.parse(readFileSync(filePath, 'utf8'));
			// Object.entries(jsonConfig.object).forEach(([key, value]) => {
			Object.entries(jsonConfig.default).forEach(([key, value]) => {
				file[key] = value;
				consoleLog(
					`Modify ${jsonConfig.path} with content : ${JSON.stringify(
						jsonConfig.default
					)}`
				);
			});
			await fs.writeFileSync(filePath, JSON.stringify(file, null, 2), 'utf-8');
		} catch (error) {
			console.log(error);
		}
	}

	return { Status: 'Done', Logs: logOutput };
};
