import { sep } from 'path';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';

const extractParameters = (array, option) => {
	// from boilerplat config Array
	let instruction = {};
	array.forEach((element) => {
		if (element[option]) {
			instruction = element[option];
		}
	});
	return instruction;
};

export const parseKeys = (body, array) => {
	// from Form passed /submit-form
	console.log(body);
	const keys = Object.keys(body);
	const instructions = [];
	keys.forEach((element) => {
		instructions.push({ [element]: extractParameters(array, element) });
	});
	return instructions;
};

const BoilerWorkingFolder = async (currPath, workingFolder) => {
	const workingDir = path.join(currPath, workingFolder);
	await fs.mkdir(workingDir, { recursive: true });
	return workingDir;
};

const runJsonConfig = (setup) => {
	// console.log(setup);
};
const runCommandConfig = (setup) => {
	// console.log(setup);
};

export const buildBoilerplate = async (instructions, boilerWorkingFolder) => {
	const currPath = await process.cwd();
	const workingDir = await BoilerWorkingFolder(currPath, boilerWorkingFolder);
	//move to workingfolder
	await process.chdir(workingDir);
	// console.log('before', process.cwd());

	instructions.forEach((element) => {
		const keys = Object.keys(element);
		keys.forEach((key) => {
			const instruction = element[key];
			switch (instruction.dest) {
				case 'json':
					runJsonConfig(instruction);
					break;
				case 'npm':
					runCommandConfig(instruction.code);
					break;
				default:
					runCommandConfig(instruction.code);
					break;
			}
		});
	});

	//move back to initial folder
	await process.chdir(currPath);
	// console.log('after', process.cwd());
};
