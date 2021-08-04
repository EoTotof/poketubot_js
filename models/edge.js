module.exports = function(sequelize, DataTypes) {
    return sequelize.define('edge', {
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
        effect: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'edge',
        timestamps: false,
        indexes: [
            {
                name: 'edge_name',
                unique: true,
                fields: [
                    { name: 'name' },
                ],
            },
        ],
    });
};
