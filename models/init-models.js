const DataTypes = require('sequelize').DataTypes;
const _ability = require('./ability');
const _action = require('./action');
const _affliction = require('./affliction');
const _capability = require('./capability');
const _category = require('./category');
const _combatmaneuver = require('./combatmaneuver');
const _contesteffect = require('./contesteffect');
const _contesttype = require('./contesttype');
const _damagebase = require('./damagebase');
const _edge = require('./edge');
const _feature = require('./feature');
const _frequency = require('./frequency');
const _item = require('./item');
const _keyword = require('./keyword');
const _move = require('./move');
const _nature = require('./nature');
const _pokeedge = require('./pokeedge');
const _pokemon = require('./pokemon');
const _stat = require('./stat');
const _type = require('./type');
const _typeeffectiveness = require('./typeeffectiveness');
const _weathercondition = require('./weathercondition');

function initModels(sequelize) {
    const ability = _ability(sequelize, DataTypes);
    const action = _action(sequelize, DataTypes);
    const affliction = _affliction(sequelize, DataTypes);
    const capability = _capability(sequelize, DataTypes);
    const category = _category(sequelize, DataTypes);
    const combatmaneuver = _combatmaneuver(sequelize, DataTypes);
    const contesteffect = _contesteffect(sequelize, DataTypes);
    const contesttype = _contesttype(sequelize, DataTypes);
    const damagebase = _damagebase(sequelize, DataTypes);
    const edge = _edge(sequelize, DataTypes);
    const feature = _feature(sequelize, DataTypes);
    const frequency = _frequency(sequelize, DataTypes);
    const item = _item(sequelize, DataTypes);
    const keyword = _keyword(sequelize, DataTypes);
    const move = _move(sequelize, DataTypes);
    const nature = _nature(sequelize, DataTypes);
    const pokeedge = _pokeedge(sequelize, DataTypes);
    const pokemon = _pokemon(sequelize, DataTypes);
    const stat = _stat(sequelize, DataTypes);
    const type = _type(sequelize, DataTypes);
    const typeeffectiveness = _typeeffectiveness(sequelize, DataTypes);
    const weathercondition = _weathercondition(sequelize, DataTypes);

    ability.belongsTo(action, { as: 'action', foreignKey: 'action_id' });
    action.hasMany(ability, { as: 'abilities', foreignKey: 'action_id' });
    combatmaneuver.belongsTo(action, { as: 'action', foreignKey: 'action_id' });
    action.hasMany(combatmaneuver, { as: 'combatmaneuvers', foreignKey: 'action_id' });
    feature.belongsTo(action, { as: 'action', foreignKey: 'action_id' });
    action.hasMany(feature, { as: 'features', foreignKey: 'action_id' });
    move.belongsTo(category, { as: 'category', foreignKey: 'category_id' });
    category.hasMany(move, { as: 'moves', foreignKey: 'category_id' });
    move.belongsTo(contesteffect, { as: 'contest_effect', foreignKey: 'contest_effect_id' });
    contesteffect.hasMany(move, { as: 'moves', foreignKey: 'contest_effect_id' });
    move.belongsTo(contesttype, { as: 'contest_type', foreignKey: 'contest_type_id' });
    contesttype.hasMany(move, { as: 'moves', foreignKey: 'contest_type_id' });
    stat.belongsTo(contesttype, { as: 'contest_type', foreignKey: 'contest_type_id' });
    contesttype.hasMany(stat, { as: 'stats', foreignKey: 'contest_type_id' });
    move.belongsTo(damagebase, { as: 'db', foreignKey: 'db_id' });
    damagebase.hasMany(move, { as: 'moves', foreignKey: 'db_id' });
    feature.belongsTo(feature, { as: 'branch_feature', foreignKey: 'branch_feature_id' });
    feature.hasMany(feature, { as: 'features', foreignKey: 'branch_feature_id' });
    feature.belongsTo(feature, { as: 'class_feature', foreignKey: 'class_feature_id' });
    feature.hasMany(feature, { as: 'class_feature_features', foreignKey: 'class_feature_id' });
    ability.belongsTo(frequency, { as: 'frequency', foreignKey: 'frequency_id' });
    frequency.hasMany(ability, { as: 'abilities', foreignKey: 'frequency_id' });
    feature.belongsTo(frequency, { as: 'frequency', foreignKey: 'frequency_id' });
    frequency.hasMany(feature, { as: 'features', foreignKey: 'frequency_id' });
    move.belongsTo(frequency, { as: 'frequency', foreignKey: 'frequency_id' });
    frequency.hasMany(move, { as: 'moves', foreignKey: 'frequency_id' });
    item.belongsTo(item, { as: 'parent', foreignKey: 'parent_id' });
    item.hasMany(item, { as: 'items', foreignKey: 'parent_id' });
    ability.belongsTo(keyword, { as: 'keyword', foreignKey: 'keyword_id' });
    keyword.hasMany(ability, { as: 'abilities', foreignKey: 'keyword_id' });
    combatmaneuver.belongsTo(keyword, { as: 'keyword', foreignKey: 'keyword_id' });
    keyword.hasMany(combatmaneuver, { as: 'combatmaneuvers', foreignKey: 'keyword_id' });
    nature.belongsTo(stat, { as: 'decrease', foreignKey: 'decreases_id' });
    stat.hasMany(nature, { as: 'natures', foreignKey: 'decreases_id' });
    nature.belongsTo(stat, { as: 'increase', foreignKey: 'increases_id' });
    stat.hasMany(nature, { as: 'increases_natures', foreignKey: 'increases_id' });
    move.belongsTo(type, { as: 'type', foreignKey: 'type_id' });
    type.hasMany(move, { as: 'moves', foreignKey: 'type_id' });
    typeeffectiveness.belongsTo(type, { as: 'defending', foreignKey: 'defending_id' });
    type.hasMany(typeeffectiveness, { as: 'typeeffectivenesses', foreignKey: 'defending_id' });
    typeeffectiveness.belongsTo(type, { as: 'attacking', foreignKey: 'attacking_id' });
    type.hasMany(typeeffectiveness, { as: 'attacking_typeeffectivenesses', foreignKey: 'attacking_id' });

    return {
        ability,
        action,
        affliction,
        capability,
        category,
        combatmaneuver,
        contesteffect,
        contesttype,
        damagebase,
        edge,
        feature,
        frequency,
        item,
        keyword,
        move,
        nature,
        pokeedge,
        pokemon,
        stat,
        type,
        typeeffectiveness,
        weathercondition,
    };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
