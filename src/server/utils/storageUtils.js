'use strict';

function handlePromiseResult(resolve, result, reject, error) {
    if (error) {
        reject(error);
    } else {
        resolve(result);
    }
}

module.exports = {
    handlePromiseResult
};
