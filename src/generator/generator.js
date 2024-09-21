const extractParameters = (array, key, value) => {
	// from boilerplat config Array
	let instruction = {};
	array.forEach((element) => {
		if (element[key]) {
			let path = element[key].path;
			let pathNotExist = element[key].pathNotExist;
			let dest = element[key].dest;
			let operations = element[key][value];
			instruction = { path, pathNotExist, dest, operations };
		}
	});
	return instruction;
};

export const parseKeys = (body, array) => {
	// from Form passed /submit-form
	const instructions = [];

	for (const [key, value] of Object.entries(body)) {
		instructions.push({ [key]: extractParameters(array, key, value) });
	}
	return instructions;
};
