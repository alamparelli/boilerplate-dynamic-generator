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

	const globalQueue = [];
	let logOutput = [];

	const consoleLog = (input) => {
		logOutput.push(input);
	};

	Object.entries(object).forEach(([key, value]) => {
		Object.entries(value).forEach(([type, operation]) => {
			if (type === 'run') {
				operation.type = 'run';
				globalQueue.push(operation);
			}
			//hotfix to handle several copy files in json files
			if (type.startsWith('file')) {
				operation.type = 'file';
				globalQueue.push(operation);
			}
			if (type === 'json') {
				operation.type = 'json';
				globalQueue.push(operation);
			}
		});
	});

	const zoneSelector = (zone, workingDir) => {
		const validZones = ['backend', 'frontend'];
		const newPath = path.join(workingDir, zone);
		if (fs.existsSync(newPath)) {
			if (validZones.includes(zone)) {
				workingDir = newPath;
			}
		}
		return workingDir;
	};

	for (let item of globalQueue) {
		if (item.type === 'run') {
			const folder = zoneSelector(item.zone, workingDir);
			for (let commandLine of item.command) {
				try {
					const { stdout, stderr } = await execPromise(commandLine, {
						cwd: folder,
					});
					consoleLog(`Execute : ${item.zone} - ${commandLine}`);
					if (stderr) {
						console.error(stderr);
					}
				} catch (error) {
					console.error(error);
				}
			}
		}
		if (item.type === 'file') {
			const folder = zoneSelector(item.zone, workingDir);
			try {
				await copyFilePromise(
					item.fileSource,
					path.join(folder, item.fileDest)
				);
				consoleLog(`Copy : ${item.zone} - ${item.fileDest}`);
			} catch (error) {
				console.error(error);
			}
		}
		if (item.type === 'json') {
			const folder = zoneSelector(item.zone, workingDir);
			const filePath = path.join(folder, item.path);
			let file = await JSON.parse(readFileSync(filePath, 'utf8'));
			Object.entries(item.default).forEach(([key, value]) => {
				file[key] = value;
				consoleLog(
					`Modify ${item.path} with content : ${JSON.stringify(item.default)}`
				);
			});
			await fs.writeFileSync(filePath, JSON.stringify(file, null, 2), 'utf-8');
		}
	}

	return { Status: 'Done', Logs: logOutput };
};
