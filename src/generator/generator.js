export const extractParameters = (array, option) => {
	let instruction = {};
	array.forEach((element) => {
		if (element[option]) {
			instruction = element[option];
		}
	});
	return instruction;
};

export const parseKeys = (bodyKeys, array) => {
	const keys = Object.keys(bodyKeys);
	const instructions = [];
	keys.forEach((element) => {
		instructions[element] = extractParameters(array, element); // does not works
	});
	return instructions;
};
