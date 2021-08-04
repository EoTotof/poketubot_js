module.exports = function(sequelize, DataTypes) {
    return sequelize.define('capability', {
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
        tableName: 'capability',
        timestamps: false,
        indexes: [
            {
                name: 'capability_name',
                unique: true,
                fields: [
                    { name: 'name' },
                ],
            },
        ],
    });
};
