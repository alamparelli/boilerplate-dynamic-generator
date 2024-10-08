import { exec } from 'child_process';

const commande = (number) => {
	return new Promise((resolve, reject) => {
		try {
			const run = `touch file${number}.md`;
			const { stdout, stderr } = exec(run, {
				cwd: '.',
			});
			resolve(stdout);
		} catch (error) {
			reject(error);
		}
	});
};

const tab = [];
tab.push(commande(1));
tab.push(commande(2));
tab.push(commande(3));
tab.push(commande(4));

console.log(tab);

for (let order of tab) {
	order
		.then((value) => console.log(value))
		.catch((error) => console.log(error));
}
