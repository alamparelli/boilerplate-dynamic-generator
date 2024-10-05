import fs, { copyFile, readFileSync } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);
const copyFilePromise = promisify(copyFile);

export const buildBoilerplate = async (object, boilerWorkingFolder) => {
	const workingDir = path.join(process.cwd(), boilerWorkingFolder);
	if (!fs.existsSync(workingDir)) {
		fs.mkdirSync(workingDir);
	}

	const runCommandArray = [];
	let npmCommand = 'npm install ';
	const runCopyFiles = [];
	const runJson = [];
	let logOutput = [];

	const consoleLog = (input) => {
		logOutput.push(input);
		console.log(input);
	};

	Object.entries(object).forEach(([key, value]) => {
		Object.entries(value).forEach(async ([type, operation]) => {
			if (type === 'run') {
				console.log(operation);
				// runCommandArray.push(operation);
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

	runCommandArray.push(npmCommand);

	for (let command of runCommandArray) {
		try {
			const { stdout, stderr } = await execPromise(command, {
				cwd: workingDir,
			});
			consoleLog(`Execute : ${command}`);
			if (stderr) {
				console.error(stderr);
			}
		} catch (error) {
			console.error(error);
		}
	}

	console.log(runCommandArray);

	for (let instruct of runCopyFiles) {
		try {
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
		let filePath = path.join(workingDir, jsonConfig.path);
		try {
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
			fs.writeFileSync(filePath, JSON.stringify(file, null, 2), 'utf-8');
		} catch (error) {
			console.log(error);
		}
	}

	return { Status: 'Done', Logs: logOutput };
};
