import fs, { copyFile, readFileSync } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);
const copyFilePromise = promisify(copyFile);

const queueCommandArray = [];
const queueFileArray = [];
const queueJsonArray = [];

const runCommandsSequentially = async (
	commands,
	queueFileArray,
	queueJsonArray,
	workingDir
) => {
	// Command Configs
	for (const command of commands) {
		try {
			const { stdout, stderr } = await execPromise(command, {
				cwd: workingDir,
			});
			console.log(stdout);
			if (stderr) {
				console.error(stderr);
			}
		} catch (error) {
			console.error(error);
		}
	}

	//File Copy
	for (const file of queueFileArray) {
		try {
			await copyFilePromise(
				file.fileSource,
				path.join(workingDir, file.fileDest)
			);
		} catch (error) {
			console.error(error);
		}
	}

	// JSON configs
	for (const jsonConfig of queueJsonArray) {
		let filePath = path.join(workingDir, jsonConfig.path);
		try {
			let file = await JSON.parse(readFileSync(filePath, 'utf8'));
			Object.entries(jsonConfig.default).forEach(([key, value]) => {
				file[key] = value;
			});
			fs.writeFileSync(filePath, JSON.stringify(file, null, 2), 'utf-8');
		} catch (error) {
			console.log(error);
		}
	}
};

export const buildBoilerplate = (object, boilerWorkingFolder) => {
	const workingDir = path.join(process.cwd(), boilerWorkingFolder);

	Object.entries(object).forEach(([key, value]) => {
		Object.entries(value).forEach(async ([type, operation]) => {
			if (type === 'run') {
				for (let command of operation) {
					try {
						const { stdout, stderr } = await execPromise(command, {
							cwd: workingDir,
						});
						console.log(stdout);
						if (stderr) {
							console.error(stderr);
						}
					} catch (error) {
						console.error(error);
					}
				}
			}
			if (type === 'file') {
				try {
					await copyFilePromise(
						value.file.fileSource,
						path.join(workingDir, value.file.fileDest)
					);
				} catch (error) {
					console.error(error);
				}
			}
			if (type === 'json') {
				//read path & inject object
			}
		});
	});
};
