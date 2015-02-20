var assert = require("assert"),
    parallel = require("../src/index");


describe("parallel(tasks, callback)", function() {
    describe("#(tasks : Array, callback)", function() {
        it("should call array of tasks in parallel", function(done) {
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
                done();
            });
        });

        it("should exit and call callback with error", function(done) {
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
                done();
            });
        });

        it("should throw an error if a task is not a function", function(done) {
            try {
                parallel([
                    "string"
                ], function() {});
            } catch (err) {
                assert.equal(err.message, "parallel(tasks, callback) tasks must be functions");
                done();
            }
        });
    });
    describe("#(tasks : Object, callback)", function() {
        it("should call object tasks in parallel", function(done) {
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
                done();
            });
        });

        it("should exit and call callback with error", function(done) {
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
                done();
            });
        });

        it("should throw an error if a task is not a function", function(done) {
            try {
                parallel({
                    "first": "string",
                    "second": function(done) {
                        done();
                    }
                }, function() {});
            } catch (err) {
                assert.equal(err.message, "parallel(tasks, callback) tasks must be functions");
                done();
            }
        });
    });
});
