import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';
import { readFileSync } from 'fs';

const execPromise = util.promisify(exec);

const BoilerWorkingFolder = async (currPath, workingFolder) => {
	const workingDir = path.join(currPath, workingFolder);
	// await fs.mkdir(workingDir, { recursive: true });
	return workingDir;
};

const runJsonConfig = async (setup, workingDir) => {
	let filePath = path.join(workingDir, setup.path);

	if (!fs.existsSync(filePath)) {
		await runCommandConfig(setup.pathNotExist, workingDir);
	} else {
	}

	let file = await JSON.parse(readFileSync(filePath, 'utf8'));
	const [operationKey, operationValue] = await Object.entries(
		setup.operations
	)[0];

	const writeOperation = async (file) => {
		file[operationKey] = operationValue;
		return file;
	};

	file = await writeOperation(file);
	fs.writeFileSync(filePath, JSON.stringify(file, null, 2), 'utf-8');

	// verify if file exist
	// verify if content to be added exist
	// >> if not added, add and save file back
	// >> if exist, check if the same, modify it and save back

	// if command exist, run runCOmmandCOnfig(cmd, workingfolder)
};

const runCommandConfig = async (setup, workingDir) => {
	setup.forEach(async (value) => {
		const { stdout, stderr } = await execPromise(value, { cwd: workingDir });
		console.log(`Outcome : ${stdout}`);
	});
};

export const buildBoilerplate = async (instructions, boilerWorkingFolder) => {
	const currPath = await process.cwd();
	const workingDir = await BoilerWorkingFolder(currPath, boilerWorkingFolder);
	// move to workingfolder
	await process.chdir(workingDir);
	// console.log('before', process.cwd());

	instructions.forEach((element) => {
		const keys = Object.keys(element);
		keys.forEach(async (key) => {
			const instruction = element[key];
			switch (instruction.dest) {
				case 'json':
					await runJsonConfig(instruction, workingDir);
					break;
				case 'npm':
					await runCommandConfig(instruction.operations, workingDir);
					break;
				default:
					await runCommandConfig(instruction.operations, workingDir);
					break;
			}
		});
	});

	//move back to initial folder
	await process.chdir(currPath);
	// console.log('after', process.cwd());
};
