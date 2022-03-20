import config from '../config.mjs';
import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';
import { model as todoModel } from '../todos/todo.model.mjs';
import { model as userModel } from '../users/user.model.mjs';

export const db = {};

initialize();

async function initialize() {
    // create db if it doesn't already exist
    const { host, port, user, password, database } = config;
    console.log('Connecting to mysql on: ');
    console.log(`host: ${host}, port: ${port}, user: ${user}, pw: ${password},`);
    
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // connect to db
    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });

    // init models and add them to the exported db object
    
    db.Todo = todoModel(sequelize);
    db.User = userModel(sequelize);

    // sync all models with database
    await sequelize.sync({ alter: true });
}

