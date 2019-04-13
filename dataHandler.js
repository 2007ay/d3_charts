const rawData = require('./data.json');
const _ = require('underscore');
const getId = (personId, index) => {
    return String(personId) + String(++index);
}

const _clone = (data) => {
    return JSON.parse(JSON.stringify(data));
};

function recursivelyIdGenerator(data, parentId) {
    if (data.children) {
        data.children.forEach((ch, index) => {
            ch.parentId = parentId;
            ch.personId = getId(parentId, index);
            if (ch.children) {
                ch.children.forEach((chi, index) => {
                    chi.parentId = parentId;
                    chi.personId = getId(ch.personId, index);
                    return recursivelyIdGenerator(chi, chi.personId);
                });
            }
        });
    }
    console.log(data.parentId);
}

function IdGenerator(data) {
    const parentId = "";
    const personId = "1";
    data.parentId = parentId;
    data.personId = personId;
    data.children.forEach((ch, index) => {
        ch.personId = getId(parentId, index);
        recursivelyIdGenerator(ch, index);
    });
}


const recursivelyFindTreeNode = (node, nodeId, parentNode, type, result) => {

    if (result) return result;

    result = _.find(node.children, {
        personId: nodeId
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
    if (_clonedData.personId == nodeId) {
        return _clonedData;
    } else {
        return recursivelyFindTreeNode(_clonedData, nodeId, _clonedData, type, result);
    }
}

const loadData = (body) => {

    const _clonedData = _clone(rawData);
    IdGenerator(_clonedData);

    let result = findTreeNode(body.personId, body.type, _clonedData);
    result.nodeHasChildren = result.children && result.children.length ? true : false;

    if (result) {
        if (body.type == "up") {
            //return data;
        } else {
            _.each(result.children, (child) => {
                child.nodeHasChildren = child.children && child.children.length ? true : false;
                delete child.children;
            })
        }
    }
    return result;
}

module.exports = {
    loadData
}