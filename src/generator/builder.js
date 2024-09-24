import fs, { copyFile, readFileSync } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);
const copyFilePromise = promisify(copyFile);

const queueCommandArray = [];
const queueFileArray = [];
const queueJsonArray = [];

const BoilerWorkingFolder = async (currPath, workingFolder) => {
	const workingDir = path.join(currPath, workingFolder);
	return workingDir;
};

const runJsonConfigSequentially = async (setups, workingDir) => {
	for (const jsonConfig of setups) {
		let filePath = path.join(workingDir, jsonConfig.path);

		try {
			let file = await JSON.parse(readFileSync(filePath, 'utf8'));
			Object.entries(jsonConfig.operations).forEach(([key, value]) => {
				file[key] = value;
			});
			fs.writeFileSync(filePath, JSON.stringify(file, null, 2), 'utf-8');
		} catch (error) {
			console.log(error);
		}
	}
};

const runCopyFileSequentially = async (files, queueJsonArray, workingDir) => {
	for (const file of files) {
		try {
			await copyFilePromise(
				file.fileSource,
				path.join(workingDir, file.fileDest)
			);
		} catch (error) {
			console.error(error);
		}
	}

	runJsonConfigSequentially(queueJsonArray, workingDir);
};

const runCommandsSequentially = async (
	commands,
	queueFileArray,
	queueJsonArray,
	workingDir
) => {
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

	runCopyFileSequentially(queueFileArray, queueJsonArray, workingDir);
};

export const buildBoilerplate = async (instructions, boilerWorkingFolder) => {
	const currPath = process.cwd();
	const workingDir = await BoilerWorkingFolder(currPath, boilerWorkingFolder);
	// move to workingfolder
	//process.chdir(workingDir);

	for (let instruction of instructions) {
		const keys = Object.keys(instruction);
		keys.forEach(async (key) => {
			const element = instruction[key];
			switch (element.dest) {
				case 'json':
					queueJsonArray.push(element);
					break;
				case 'npm':
					queueCommandArray.push(element.operations);
					break;
				case 'file':
					queueFileArray.push(element);
					break;
				default:
					queueCommandArray.push(element.operations);
					break;
			}
		});
	}

	runCommandsSequentially(
		queueCommandArray,
		queueFileArray,
		queueJsonArray,
		workingDir
	);

	//move back to initial folder
	// process.chdir(currPath);
};
