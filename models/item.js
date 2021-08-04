module.exports = function(sequelize, DataTypes) {
    return sequelize.define('item', {
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
        cost: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        modifier: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        additional_info: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        pickup: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        is_parent: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        parent_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'item',
                key: 'id',
            },
        },
    }, {
        sequelize,
        tableName: 'item',
        timestamps: false,
        indexes: [
            {
                name: 'item_name',
                unique: true,
                fields: [
                    { name: 'name' },
                ],
            },
            {
                name: 'item_parent_id',
                fields: [
                    { name: 'parent_id' },
                ],
            },
        ],
    });
};
