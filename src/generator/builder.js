import fs, { copyFileSync } from 'fs';
import { readFileSync } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

const BoilerWorkingFolder = async (currPath, workingFolder) => {
	const workingDir = path.join(currPath, workingFolder);
	// await fs.mkdir(workingDir, { recursive: true });
	return workingDir;
};

const runJsonConfig = async (setup, workingDir) => {
	let filePath = path.join(workingDir, setup.path);
	if (setup.pathNotExist) {
		if (!fs.existsSync(filePath)) {
			await runCommandConfig(setup.pathNotExist, workingDir);
		}
	}

	setTimeout(async () => {
		let file = await JSON.parse(readFileSync(filePath, 'utf8'));
		Object.entries(setup.operations).forEach(([key, value]) => {
			file[key] = value;
		});
		fs.writeFileSync(filePath, JSON.stringify(file, null, 2), 'utf-8');
	}, 3600);
};

const runCommandConfig = async (setup, workingDir) => {
	setup.forEach(async (value) => {
		const { stdout, stderr } = await execPromise(value, { cwd: workingDir });
		console.log(`Outcome : ${stdout}`);
	});
};

const runCopyFile = (setup, workingDir) => {
	console.log(setup);
	console.log(process.cwd());
	copyFileSync(setup.fileSource, path.join(workingDir, setup.fileDest));
};

export const buildBoilerplate = async (instructions, boilerWorkingFolder) => {
	const currPath = await process.cwd();
	const workingDir = await BoilerWorkingFolder(currPath, boilerWorkingFolder);
	// move to workingfolder
	//process.chdir(workingDir);

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
				case 'file':
					runCopyFile(instruction, workingDir);
					break;
				default:
					await runCommandConfig(instruction.operations, workingDir);
					break;
			}
		});
	});

	//move back to initial folder
	// process.chdir(currPath);
};
