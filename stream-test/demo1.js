'use strict';

const Readable = require('stream').Readable;
const rs = Readable();
const s = 'Zero Tung';
const l = s.length;
let i = 0;
rs._read = () => {
  if(i == l) {
    rs.push(' is my name');
    return rs.push(null);
  }
  rs.push(s[i++]);
};

rs.pipe(process.stdout);
