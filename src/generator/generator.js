const extractParameters = (array, key, value) => {
	// from boilerplat config Array
	let instruction = {};
	array.forEach((element) => {
		if (element[key]) {
			Object.entries(element[key]).forEach(([defKey, defValue]) => {
				Object.entries(defkey).forEach(([k, v]) => {
					console.log(k, v);
					instruction = { defkey, defValue };
				});
			});
		}
	});
	return instruction;
};

export const parseKeys = (body, array) => {
	// from Form passed /submit-form
	const instructions = [];
	for (const [key, value] of Object.entries(body)) {
		instructions.push(extractParameters(array, key, value));
	}
	return instructions;
};
