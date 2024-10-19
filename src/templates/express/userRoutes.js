import { Router } from 'express';
// import { getSetting, setSetting, queryUser } from '../controllers/database.js';
import { checkToken } from '../controllers/authentication.js';
import jwt from 'jsonwebtoken';

const router = Router();

router.get('/user', (req, res) => {
	if (req.cookies.authcookie) {
		let jwtDecoded = jwt.decode(req.cookies.authcookie);
		// const query = queryUser(jwtDecoded.username);
		const query = 'ok';
		res.status(200).json(query);
	} else {
		res
			.status(200)
			.json({ user: 'Not found' });
	}
});

// router.get('/getbgcolor', (req, res) => {
// 	if (checkToken(req.cookies.authcookie)) {
// 		let jwtDecoded = jwt.decode(req.cookies.authcookie);
// 		const query = getSetting('bgColor', jwtDecoded.username);
// 		if (query) {
// 			res.status(200).json(query);
// 		} else {
// 			res.status(200).json({ name: 'bgColor', value: 'default' });
// 		}
// 	} else {
// 		res.status(401).json({ Access: 'Not Authorized' });
// 	}
// });

// router.post('/setbgcolor', (req, res) => {
// 	if (checkToken(req.cookies.authcookie)) {
// 		let jwtDecoded = jwt.decode(req.cookies.authcookie);
// 		const query = setSetting(
// 			req.body.name,
// 			req.body.value,
// 			jwtDecoded.username,
// 		);
// 		res.status(200).json(query);
// 	} else {
// 		res.status(401).json({ Access: 'Not Authorized' });
// 	}
// });

export default router;
