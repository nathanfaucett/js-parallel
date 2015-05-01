var keys = require("keys"),
    objectValues = require("values").objectValues,
    forEach = require("for_each"),
    isArray = require("is_array"),
    isFunction = require("is_function"),
    emptyFunction = require("empty_function"),
    fastSlice = require("fast_slice");


module.exports = parallel;


function parallel(tasks, callback) {
    return (
        isArray(tasks) ?
        arrayParallel(tasks, callback || emptyFunction) :
        objectParallel(Object(tasks), callback || emptyFunction)
    );
}

function arrayParallel(tasks, callback) {
    var results = [],
        count = tasks.length,
        called = false;

    forEach(tasks, function(task, index) {
        if (isFunction(task)) {
            task(function(err) {
                var argsLength;
                if (called === false) {
                    if (err) {
                        called = true;
                        callback(err);
                    } else {
                        argsLength = arguments.length;
                        if (argsLength > 1) {
                            results[index] = argsLength > 2 ? fastSlice(arguments, 1) : arguments[1];
                        }
                        count -= 1;
                        if (count === 0) {
                            called = true;
                            callback(undefined, results);
                        }
                    }
                }
            });
        } else {
            throw new TypeError("parallel(tasks, callback) tasks must be functions");
        }
    });
}

function objectParallel(tasks, callback) {
    var results = {},
        objectKeys = keys(tasks),
        values = objectValues(tasks, objectKeys),
        count = objectKeys.length,
        called = false;

    forEach(values, function(task, index) {
        if (isFunction(task)) {
            task(function(err) {
                var argsLength;
                if (called === false) {
                    if (err) {
                        called = true;
                        callback(err);
                    } else {
                        argsLength = arguments.length;
                        if (argsLength > 1) {
                            results[objectKeys[index]] = argsLength > 2 ? fastSlice(arguments, 1) : arguments[1];
                        }
                        count -= 1;
                        if (count === 0) {
                            called = true;
                            callback(undefined, results);
                        }
                    }
                }
            });
        } else {
            throw new TypeError("parallel(tasks, callback) tasks must be functions");
        }
    });
}
