import { db } from '../_helpers/db.mjs';

const todoService = {};

todoService.getAll = async (userId) => {
    return await db.Todo.findAll({
        where: {
          userId: userId
        }
      });
}

todoService.getById = async (id) => {
    const todo = await db.Todo.findByPk(id);
    if (!todo) throw 'Todo not found';
    return todo;
}

todoService.create = async (params) => {
    const todo = new db.Todo(params);


    await todo.save();
}

todoService.update = async (id, params) => {
    const todo = await db.Todo.findByPk(id);

    // copy params to user and save
    Object.assign(todo, params);
    await todo.save();
}

todoService.delete = async (id) => {
    const todo = await db.Todo.findByPk(id);
    await todo.destroy();
}


export { todoService };