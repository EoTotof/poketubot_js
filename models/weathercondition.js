module.exports = function(sequelize, DataTypes) {
    return sequelize.define('weathercondition', {
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
        display_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'weathercondition',
        timestamps: false,
        indexes: [
            {
                name: 'weathercondition_name',
                unique: true,
                fields: [
                    { name: 'name' },
                ],
            },
        ],
    });
};
