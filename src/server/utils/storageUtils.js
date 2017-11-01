'use strict';

function handlePromiseResult(resolve, result, reject, error) {
    if (error) {
        reject(error);
    } else {
        resolve(result);
    }
}

function getValue(obj, propertyName, defaultValue) {
    return (typeof obj[propertyName] === 'undefined') ? defaultValue : obj[propertyName];
}

function setValue(obj, propertyName, valueObj, defaultValue) {
    obj[propertyName] = getValue(valueObj, propertyName, defaultValue);
    return  obj;
}

function updateValue(obj, propertyName, valueObj) {
    let modified = false;

    let newVal = getValue(valueObj, propertyName, undefined);
    if ((typeof newVal !== 'undefined') && (obj[propertyName] !== newVal)) {
        obj[propertyName] = newVal;
        modified = true;
    }

    return modified;
}

module.exports = {
    handlePromiseResult,
    getValue,
    setValue,
    updateValue
};
