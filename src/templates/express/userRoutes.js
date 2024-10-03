import { Router } from 'express';
import { body, validationResult } from 'express-validator';

const router = Router();

router.get('/', (req, res) => {
	res.json({ message: 'message' });
});

export default router;
