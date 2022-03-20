import express from 'express';
import Joi from 'joi';
import { validateRequest } from '../_middleware/validate-request.mjs';
import { todoService } from './todo.service.mjs';
import { authorize } from '../_middleware/authorize.mjs';

const router = express.Router();


// routes

router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.post('/', authorize(), createSchema, create);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

export { router as todosController };

// route functions

function getAll(req, res, next) {
    console.log(req.user.id);
    todoService.getAll(req.user.id)
        .then(todos => res.json(todos))
        .catch(next);
}

function getById(req, res, next) {
    todoService.getById(req.params.id)
        .then(todo => res.json(todo))
        .catch(next);
}

function create(req, res, next) {
    const tempTodo = {
        userId: req.user.id,
        text: req.body.text,
        isDone: false
    };
    todoService.create(tempTodo)
        .then(() => res.json({ message: 'Todo created' }))
        .catch(next);
}

function update(req, res, next) {
    todoService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'Todo updated' }))
        .catch(next);
}

function _delete(req, res, next) {
    todoService.delete(req.params.id)
        .then(() => res.json({ message: 'Todo deleted' }))
        .catch(next);
}

// schema functions

function createSchema(req, res, next) {
    const schema = Joi.object({
        text: Joi.string().required(),
        isDone: Joi.boolean().required(),        
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        text: Joi.string().empty(''),
        isDone: Joi.boolean().empty(''),        
    });
    validateRequest(req, next, schema);
}