module.exports = function(sequelize, DataTypes) {
    return sequelize.define('type', {
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
        tableName: 'type',
        timestamps: false,
        indexes: [
            {
                name: 'type_name',
                unique: true,
                fields: [
                    { name: 'name' },
                ],
            },
        ],
    });
};
