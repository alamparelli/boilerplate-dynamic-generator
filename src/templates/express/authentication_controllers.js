import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config';

export const createAccessToken = (payload) => {
	const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: '15m',
	});
	return accessToken;
};

export const checkToken = (token) => {
	if (token) {
		const isValid = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		return isValid ? true : false;
	} else {
		return false;
	}
};

export const createHash = (password) => {
	return bcrypt.hashSync(password, Number(process.env.SALT));
};

export const checkHash = (password, hash) => {
	return bcrypt.compareSync(password, hash);
};
