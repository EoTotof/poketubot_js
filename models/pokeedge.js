module.exports = function(sequelize, DataTypes) {
    return sequelize.define('pokeedge', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        prerequisites: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        tp_cost: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        effect: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'pokeedge',
        timestamps: false,
        indexes: [
            {
                name: 'pokeedge_name',
                unique: true,
                fields: [
                    { name: 'name' },
                ],
            },
        ],
    });
};
