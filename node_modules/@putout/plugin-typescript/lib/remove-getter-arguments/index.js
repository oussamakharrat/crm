'use strict';

module.exports.report = () => 'Avoid getter arguments';

module.exports.fix = (path) => {
    path.node.params = [];
};

module.exports.traverse = ({push}) => ({
    TSMethodSignature(path) {
        const {kind} = path.node;
        
        if (kind !== 'get')
            return;
        
        if (!path.node.params.length)
            return;
        
        push(path);
    },
});
