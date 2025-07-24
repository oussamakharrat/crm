'use strict';

const {operator} = require('putout');
const {__json} = operator;

module.exports.report = () => `Convert '*.json' to '*.js'`;

module.exports.replace = () => ({
    [__json]: 'export default __object',
});
