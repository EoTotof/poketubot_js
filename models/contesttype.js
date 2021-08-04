module.exports = function(sequelize, DataTypes) {
    return sequelize.define('contesttype', {
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
        tableName: 'contesttype',
        timestamps: false,
        indexes: [
            {
                name: 'contesttype_name',
                unique: true,
                fields: [
                    { name: 'name' },
                ],
            },
        ],
    });
};
