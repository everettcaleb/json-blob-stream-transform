const JsonBlobTransform = require('../dist/index').default,
  child_process = require('child_process');

let t = new JsonBlobTransform();
let i = 0;
t.on('data', chunk => console.log((++i).toString() + ': ' + JSON.stringify(chunk, null, '  ')));
let p = child_process.spawn('./main');
p.stdout.pipe(t);
