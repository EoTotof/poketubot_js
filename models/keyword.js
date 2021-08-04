module.exports = function(sequelize, DataTypes) {
    return sequelize.define('keyword', {
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
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'keyword',
        timestamps: false,
        indexes: [
            {
                name: 'keyword_name',
                unique: true,
                fields: [
                    { name: 'name' },
                ],
            },
        ],
    });
};
