'use strict';

function getValue(obj, propertyName, defaultValue) {
    return (typeof obj[propertyName] === 'undefined') ? defaultValue : obj[propertyName];
}

function setValue(obj, propertyName, valueObj, defaultValue) {
    obj[propertyName] = getValue(valueObj, propertyName, defaultValue);
    return obj;
}

function isDifferentArray(oldArray, newArray) {
    if (Array.isArray(oldArray) || Array.isArray((newArray))) {
        if (Array.isArray(oldArray) && Array.isArray((newArray))) {
            if (oldArray.length === newArray.length) {
                if (oldArray.length > 0) {
                    return oldArray.some((item, idx) => item !== newArray[idx]);
                } else {
                    return false;
                }
            } else {
                return true;
            }
        } else {
            return true;
        }
    } else {
        throw new Error('Only for arrays!');
    }
}

function isDifferent(oldValue, newValue) {
    if (Array.isArray(oldValue) || Array.isArray((newValue))) {
        return isDifferentArray(oldValue, newValue);
    } else {
        return oldValue !== newValue;
    }
}

function updateValue(obj, propertyName, valueObj) {
    let modified = false;

    let newValue = getValue(valueObj, propertyName, undefined);
    if ((typeof newValue !== 'undefined') && isDifferent(obj[propertyName], newValue)) {
        obj[propertyName] = newValue;
        modified = true;
    }

    return modified;
}

module.exports = {
    getValue,
    setValue,
    updateValue
};
