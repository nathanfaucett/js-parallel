var keys = require("keys"),
    forEach = require("for_each"),
    isArray = require("is_array"),
    isFunction = require("is_function"),
    emptyFunction = require("empty_function"),
    fastSlice = require("fast_slice");


function baseParallel(tasks, count, results, callback) {
    var called = false;

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

module.exports = function parallel(tasks, callback) {
    return (
        isArray(tasks) ?
        baseParallel(tasks, tasks.length, [], callback || emptyFunction) :
        baseParallel(Object(tasks), keys(tasks).length, {}, callback || emptyFunction)
    );
};
