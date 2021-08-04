module.exports = function(sequelize, DataTypes) {
    return sequelize.define('category', {
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
        tableName: 'category',
        timestamps: false,
        indexes: [
            {
                name: 'category_name',
                unique: true,
                fields: [
                    { name: 'name' },
                ],
            },
        ],
    });
};
