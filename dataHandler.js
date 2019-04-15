const rawData = require('./data.json');
const _ = require('underscore');
const getId = (id, index) => {
    return String(id) + String(++index);
}

const _clone = (data) => {
    return JSON.parse(JSON.stringify(data));
};

const _clonedData = _clone(rawData);
IdGenerator(_clonedData);

function recursivelyIdGenerator(data, parentId) {
    if (data.children) {
        data.children.forEach((ch, index) => {
            ch.parentId = parentId;
            ch.uniqueIdentifier = getId(parentId, index);
            if (ch.children) {
                ch.children.forEach((chi, index) => {
                    chi.parentId = parentId;
                    chi.uniqueIdentifier = getId(ch.uniqueIdentifier, index);
                    return recursivelyIdGenerator(chi, chi.uniqueIdentifier);
                });
            }
        });
    }
}

function IdGenerator(data) {
    const parentId = "";
    const uniqueIdentifier = "1";
    data.parentId = parentId;
    data.uniqueIdentifier = uniqueIdentifier;
    data.children.forEach((ch, index) => {
        ch.uniqueIdentifier = getId(uniqueIdentifier, index);
        ch.parentId = uniqueIdentifier;
        recursivelyIdGenerator(ch, index);
    });
}


const recursivelyFindTreeNode = (node, nodeId, parentNode, type, result) => {

    if (result) return result;

    result = _.find(node.children, {
        uniqueIdentifier: nodeId
    });
    if (result && type == "up") {
        result = parentNode;
    }
    if (!result) {
        _.each(node.children, (child) => {
            result = recursivelyFindTreeNode(child, nodeId, node, type, result);
            if (result) {
                return result;
            }
        });
    }
    return result;
}

const findTreeNode = (nodeId, type, _clonedData) => {
    let result = null;
    if (_clonedData.uniqueIdentifier == nodeId) {
        return _clonedData;
    } else {
        return recursivelyFindTreeNode(_clonedData, nodeId, _clonedData, type, result);
    }
}

const nodeHasChildren = (node) => node.children && node.children.length ? true : false;

const loadData = (body) => {

    let result = findTreeNode(body.personId, body.type, _clonedData);
    let _cloneResult = _clone(result);
    _cloneResult.nodeHasChildren = nodeHasChildren(_cloneResult);

    if (_cloneResult) {
        if (body.type == "up") {
            _cloneResult.nodeHasChildren = nodeHasChildren(_cloneResult);
            _.each(_cloneResult.children, (child) => {
                child.nodeHasChildren = nodeHasChildren(child);
                delete child.children;
            });
            return _cloneResult;
        } else {
            _.each(_cloneResult.children, (child) => {
                child.nodeHasChildren = nodeHasChildren(child);
                delete child.children;
            });
        }
    }
    return _cloneResult;
}

module.exports = {
    loadData
}