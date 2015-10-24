var tape = require("tape"),
    parallel = require("..");


tape("parallel#(tasks : Object, callback)should call array of tasks in parallel", function(assert) {
    parallel([
        function(done) {
            process.nextTick(function() {
                done(undefined, {
                    id: 1
                });
            });
        },
        function(done) {
            process.nextTick(function() {
                done(undefined, {
                    id: 2
                });
            });
        },
        function(done) {
            process.nextTick(function() {
                done(undefined, {
                    id: 3
                });
            });
        }
    ], function(err, results) {
        assert.equal(err, undefined);
        assert.deepEqual(results, [{
            id: 1
        }, {
            id: 2
        }, {
            id: 3
        }]);
        assert.end();
    });
});

tape("should exit and call callback with error", function(assert) {
    parallel([
        function(done) {
            process.nextTick(function() {
                done(new Error("not found"));
            });
        },
        function(done) {
            process.nextTick(function() {
                done(undefined, {
                    id: 2
                });
            });
        }
    ], function(err) {
        assert.equal(err.message, "not found");
        assert.end();
    });
});

tape("should throw an error if a task is not a function", function(assert) {
    try {
        parallel([
            "string"
        ], function() {});
    } catch (err) {
        assert.equal(err.message, "parallel(tasks, callback) tasks must be functions");
        assert.end();
    }
});

tape("parallel#(tasks : Object, callback) should call object tasks in parallel", function(assert) {
    parallel({
        "first": function(done) {
            process.nextTick(function() {
                done(undefined, {
                    id: 1
                });
            });
        },
        "second": function(done) {
            process.nextTick(function() {
                done(undefined, {
                    id: 2
                });
            });
        },
        "last": function(done) {
            process.nextTick(function() {
                done(undefined, {
                    id: 3
                });
            });
        }
    }, function(err, results) {
        assert.equal(err, undefined);
        assert.deepEqual(results, {
            "first": {
                id: 1
            },
            "second": {
                id: 2
            },
            "last": {
                id: 3
            }
        });
        assert.end();
    });
});

tape("parallel#(tasks : Object, callback) should exit and call callback with error", function(assert) {
    parallel({
        "first": function(done) {
            process.nextTick(function() {
                done(new Error("not found"));
            });
        },
        "last": function(done) {
            process.nextTick(function() {
                done(undefined, {
                    id: 2
                });
            });
        }
    }, function(err) {
        assert.equal(err.message, "not found");
        assert.end();
    });
});

tape("parallel#(tasks : Object, callback) should throw an error if a task is not a function", function(assert) {
    try {
        parallel({
            "first": "string",
            "second": function(done) {
                done();
            }
        }, function() {});
    } catch (err) {
        assert.equal(err.message, "parallel(tasks, callback) tasks must be functions");
        assert.end();
    }
});
