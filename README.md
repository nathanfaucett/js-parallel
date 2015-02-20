parallel
=======

parallel for the browser and node.js


##example

```javascript

var fs = require("fs"),
    parallel = require("parallel");

parallel(
    ["file1", "file2", "file3"].map(function(file) {
        return function(done) {
            fs.stat(file, function(err, stat) {
                if (err) {
                    done(err);
                } else {
                    done(undefined, stat);
                }
            });
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
