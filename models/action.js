module.exports = function(sequelize, DataTypes) {
    return sequelize.define('action', {
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
    }, {
        sequelize,
        tableName: 'action',
        timestamps: false,
        indexes: [
            {
                name: 'action_name',
                unique: true,
                fields: [
                    { name: 'name' },
                ],
            },
        ],
    });
};
