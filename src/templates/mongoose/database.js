/*
import in index.js

import mongoose from 'mongoose';
import { connectionOption, uri } from './db/database.js';

mongoose
	.connect(uri, connectionOption)
	.then(() => console.log('MongoDB connected'))
	.catch((err) => console.error('MongoDB connection error:', err));
*/

import { configDotenv } from 'dotenv';

configDotenv();

const serverName = process.env.DB_HOST;
const userName = process.env.DB_USER;
const password = process.env.DB_PASS;
const appName = process.env.DB_APPNAME;
const dbName = process.env.DB_DBNAME;

export const connectionOption = {
	maxPoolSize: 10,
	retryWrites: true,
	w: 'majority',
	appName: appName,
};

export const uri = `mongodb+srv://${userName}:${password}@${serverName}/${dbName}`;
