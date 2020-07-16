import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors'; // Deve ser importado logo após a importação do express
import cors from 'cors';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

app.use(
	// (err: Error, request: Request, response: Response, next: NextFunction) => {
	(err: Error, request: Request, response: Response, _: NextFunction) => {
		if (err instanceof AppError) {
			return response.status(err.statusCode).json({
				status: 'error',
				message: err.message,
			});
		}

		console.log(err);

		return response.status(500).json({
			status: 'error',
			message: 'Internal server error',
		});
	},
);

app.listen(3333, () => {
	console.log(':rocket: Server started on port 3333!');
});