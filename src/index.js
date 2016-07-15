var keys = require("@nathanfaucett/keys"),
    objectValues = require("@nathanfaucett/values").objectValues,
    arrayForEach = require("@nathanfaucett/array-for_each"),
    objectForEach = require("@nathanfaucett/object-for_each"),
    isArrayLike = require("@nathanfaucett/is_array_like"),
    isFunction = require("@nathanfaucett/is_function"),
    emptyFunction = require("@nathanfaucett/empty_function"),
    fastSlice = require("@nathanfaucett/fast_slice");


module.exports = parallel;


function parallel(tasks, callback) {
    return (
        isArrayLike(tasks) ?
        arrayParallel(tasks, callback || emptyFunction) :
        objectParallel(Object(tasks), callback || emptyFunction)
    );
}

function arrayParallel(tasks, callback) {
    var results = [],
        count = tasks.length,
        called = false;

    arrayForEach(tasks, function eachArrayParallel(task, index) {
        if (isFunction(task)) {
            task(function next(error) {
                var argsLength;
                if (called === false) {
                    if (error) {
                        called = true;
                        callback(error);
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

    objectForEach(values, function eachObjectParallel(task, index) {
        if (isFunction(task)) {
            task(function next(error) {
                var argsLength;

                if (called === false) {
                    if (error) {
                        called = true;
                        callback(error);
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
