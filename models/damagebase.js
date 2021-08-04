module.exports = function(sequelize, DataTypes) {
    return sequelize.define('damagebase', {
        value: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        dice_roll: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        critical_roll: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'damagebase',
        timestamps: false,
    });
};
