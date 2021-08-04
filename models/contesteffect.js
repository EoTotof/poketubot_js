module.exports = function(sequelize, DataTypes) {
    return sequelize.define('contesteffect', {
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
        dice_roll: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        effect: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'contesteffect',
        timestamps: false,
        indexes: [
            {
                name: 'contesteffect_name',
                unique: true,
                fields: [
                    { name: 'name' },
                ],
            },
        ],
    });
};
