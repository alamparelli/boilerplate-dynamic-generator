import { Router } from 'express';
// import { addUser, queryUser } from '../controllers/database.js';
import { createAccessToken } from '../controllers/authentication.js';
import { body, validationResult } from 'express-validator';
import { checkToken } from '../controllers/authentication.js';

const router = Router();

router.post(
	'/register',
	[
		body('username').isEmail().withMessage('Please enter a valid email'),
		body('password')
			.isLength({ min: 8, max: 256 })
			.isStrongPassword()
			.withMessage('Minimum 8 chars, max 25 chars, and StrongPassword needed'),
		body('role')
			.isString()
			.isLength({ max: 10 })
			.withMessage('Only String accepted'),
	],
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				// S'il y a des erreurs, les retourner au client
				return res.status(400).json({ errors: errors.array() });
			}
			const { username, password, role } = req.body;
			const operation = addUser(username, password, role);
			res.status(200).json(operation);
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	}
);

router.post('/login', (req, res) => {
	try {
		const { username, password } = req.body;
		if (queryUser(username, password)) {
			const accessToken = createAccessToken({
				username: username,
			});
			res.cookie('authcookie', accessToken, {
				maxAge: 900000,
				httpOnly: true,
				secure: true,
				sameSite: 'Strict',
				path: '/',
			});
			res
				.status(200)
				.json({ logged: true });
		} else {
			res
				.status(403)
				.json({ Message: 'Username or Password incorrect', logged: false });
		}
	} catch (error) {
		res.status(401).json({ error: error.message, logged: false });
	}
});

router.post('/logout', (req, res) => {
	try {
		if (req.cookies.authcookie) {
			res.clearCookie('authcookie', {
				httpOnly: true,
				secure: false,
			});
			res
				.status(200)
				.json({ message: 'Cookie cleared', logged: false });
		} else {
			res
				.status(200)
				.json({ message: 'No Cookie found!', logged: false });
		}
	} catch (error) {
		res.status(401).json({ error: error.message, logged: false });
	}
});

router.post('/role', async (req, res) => {
	if (checkToken(req.cookies.authcookie)) {
		try {
			const { username } = req.body;
			const userRole = await getRole(username);
			res.status(200).json({ role: userRole });
		} catch (error) {
			res.status(401).json({ error: error.message });
		}
	} else {
		res
			.status(401)
			.json({ Access: 'Not Authorized' });
	}
});

export default router;
