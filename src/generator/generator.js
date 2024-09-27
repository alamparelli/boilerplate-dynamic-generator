export const parseKeys = (body, object) => {
	// from Form passed /submit-form
	const modifiedObject = {};
	Object.entries(object).forEach(([key, value]) => {
		Object.entries(body).forEach(([bodyKey, bodyValue]) => {
			if (value[bodyKey] && value[bodyKey].type) {
				if (value[bodyKey].type === 'radio') {
					// console.log(bodyKey, value[bodyKey][bodyValue]);
					modifiedObject[bodyKey] = value[bodyKey][bodyValue];
				}
				if (value[bodyKey].type === 'checkbox') {
					// console.log(bodyKey, value[bodyKey][bodyValue]);
					modifiedObject[bodyKey] = value[bodyKey][bodyValue];
				}
				if (value[bodyKey].type === 'input') {
					if (value[bodyKey].json) {
						const [[k, v]] = Object.entries(value[bodyKey].json.default);
						value[bodyKey].json.default[k] = bodyValue;
						modifiedObject[bodyKey] = value[bodyKey];
					}
					if (value[bodyKey].test) {
						console.log('Not Yet Implemented');
					}
				}
			}
		});
	});

	return modifiedObject;
};
