import { DataTypes } from 'sequelize';

function model(sequelize) {
    const attributes = {
        userId: { type: DataTypes.INTEGER, allowNull: false },
        text: { type: DataTypes.STRING, allowNull: false },
        isDone: { type: DataTypes.BOOLEAN, allowNull: false },
    };

    return sequelize.define('Todo', attributes);
}

export { model }