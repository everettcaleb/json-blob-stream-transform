# JsonBlobTransform
Node.js Stream Transform for reading arbitrary JSON blobs from a stream (like Standard Input)

## What It Does
Allows you to consume a stream of JSON-string objects or arrays (no separators necessary) as an object stream.

Example Stream Data:

    '{"a":21,"b":32,"c":43}[1,2,3]\n{"foo":"bar"}'

Output Data Events:

    data -> { a: 21, b: 32, c: 43 }
    data -> [1, 2, 3]
    data -> { foo: "bar" }

## How To Use It
First install it:

    npm i --save json-blob-transform

Then you can use it in JavaScript:

    const JsonBlobTransform = require('json-blob-transform'),
    { spawn } = require('child_process');

    const t = new JsonBlobTransform();
    const p = spawn('some-process');
    t.on('data', obj => console.log(obj));
    p.stdout.pipe(t);

TypeScript type bindings are included as well.

## Other Notes
There are some examples of capturing JSON data from Go and C/C++ programs in the `go-test` and `c-test` directories of the repository. They are not included as part of the package, though.

## License, Copyright, and Contributions
Copyright 2018 Caleb Everett. Licensed under the MIT License. Any and all contributions (pull requests, suggestions, bug reports) are appreciated.
