#!/usr/bin/env node

import express from 'express';
import cors from 'cors';
import { errorHandler } from './_middleware/error-handler.mjs';
import { todosController } from './todos/todos.controller.mjs';
import { usersController } from './users/users.controller.mjs';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// api routes
app.use('/todos', todosController);
app.use('/users', usersController);

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));