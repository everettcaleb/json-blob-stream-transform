import { Transform } from "stream";

export default class JsonBlobTransform extends Transform {
  expect: string = "";
  depth: number = 0;
  internalBuffer: string = "";

  constructor(options?: any) {
    super(Object.assign({}, options, {
      readableObjectMode: true,
      writableObjectMode: false
    }));
  }

  _transform(chunk: any, encoding: string, callback: (err?: Error) => void) {
    if (typeof chunk == "string") {
      try {
        const writes = this.consumeString(chunk as string);
        for (const write of writes) {
          this.push(write);
        }
        callback();
      }
      catch (err) {
        callback(err);
      }
    }
    else if (chunk instanceof Buffer) {
      try {
        const writes = this.consumeBuffer(chunk as Buffer, encoding);
        for (const write of writes) {
          this.push(write);
        }
        callback();
      }
      catch (err) {
        callback(err);
      }
    }
    else {
      try {
        const writes = this.consumeObject(chunk);
        for (const write of writes) {
          this.push(write);
        }
        callback();
      }
      catch (err) {
        callback(err);
      }
    }
  }

  consumeString(str: string): Array<any> {
    const combined = this.internalBuffer + str;
    const len = this.internalBuffer.length + 1;
    let snip = 0;
    const writes = new Array<any>();

    [...str].forEach((c, i) => {
      if (c == this.expect) {
        this.depth--;
        if (this.depth == 0) {
          writes.push(JSON.parse(combined.slice(snip, len + i)));
          this.expect = "";
          snip = len + i;
        }
        return;
      }
      else if (this.depth == 0 && this.expect.length == 0) {
        switch (c) {
          case "{":
            this.expect = "}";
            this.depth = 1;
            return;
          case "[":
            this.expect = "]";
            this.depth = 1;
            return;
          case "\r":
          case "\n":
            return;
          default:
            throw new Error(`Invalid character ${c} following closing bracket or curly brace`);
        }
      }
      else if ((this.expect == "}" && c == "{") || (this.expect == "]" && c == "[")) {
        this.depth++;
      }
    });

    this.internalBuffer = combined.slice(snip);
    return writes;
  }

  consumeBuffer(buffer: Buffer, encoding: string): Array<any> {
    return this.consumeString(buffer.toString("utf8"));
  }

  consumeObject(obj: any) {
    return [JSON.stringify(obj)];
  }
}
