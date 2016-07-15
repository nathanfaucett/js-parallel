parallel
=======

parallel for the browser and node.js


##example

```javascript

var fs = require("fs"),
    parallel = require("@nathanfaucett/parallel");

parallel(
    ["file1", "file2", "file3"].map(function(path) {
        return function(done) {
            fs.stat(path, done);
        };
    }),
    function(err, results) {
        if (err) {
            console.log(err);
        } else {
            console.log(results); // array of file stat in same order as passed
        }
    }
);
```
