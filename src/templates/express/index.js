import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

// import rateLimit from 'express-rate-limit';

import userRoutes from './routes/userRoutes.js';
import authentication from './routes/authentication.js';

const app = express();
const port = process.env.BACKEND_PORT;

// const limiter = rateLimit({
// 	// in 1 minute allow 30 Requests for 1 IP
// 	windowMs: 5 * 60 * 1000,
// 	max: 100,
// 	standardHeaders: true,
// 	legacyHeaders: false,
// });

app.use(
	cors({
		origin: ['http://localhost:3000', 'http://localhost:5173'],
		credentials: true,
	})
);
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.disable('x-powered-by');

app.use(userRoutes);
app.use(authentication);

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
