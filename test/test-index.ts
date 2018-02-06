import JsonBlobTransform from "../index";
import * as assert from "assert";
import * as fs from "fs";

describe("JsonBlobTransform", () => {
  describe("consumeString", () => {
    it('should work with a simple JSON string split in half', done => {
      let t = new JsonBlobTransform();
      let s = '{ "half": 53, "otherHalf": 52 }';

      let r1 = t.consumeString(s.slice(0, 11));
      assert.ok(r1);
      assert.ok(r1.length == 0);
      assert.equal("}", t.expect);
      assert.equal(s.slice(0, 11), t.internalBuffer);
      assert.equal(1, t.depth);

      let r2 = t.consumeString(s.slice(11));
      assert.ok(r2);
      assert.ok(r2.length == 1);
      assert.equal("", t.expect);
      assert.equal("", t.internalBuffer);
      assert.equal(0, t.depth);

      let [obj] = r2;
      assert.equal(53, obj.half);
      assert.equal(52, obj.otherHalf);

      done();
    });
  });

  it('should work reading the three-objects.txt file', done => {
    const rs = fs.createReadStream('test/files/three-objects.txt', 'utf8');
    const t = new JsonBlobTransform();
    const arr = new Array<any>();

    t.on('data', chunk => arr.push(chunk));
    t.on('end', () => {
      assert.equal(3, arr.length);
      assert.equal(1, arr[0].value);
      assert.equal(2, arr[1].value);
      assert.equal(3, arr[2][0]);
      done();
    });
    rs.pipe(t);
  });
});
