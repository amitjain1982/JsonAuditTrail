# JsonAuditTrail
Library generates Audit trail for Json differences

### Dependendencies:
1. loadash.js
2. diff-json.js (Modified version is attached along).

Example:

```
  var newObj, oldObj;

  oldObj = {
    name: 'joe',
    age: 55,
    coins: [2, 5],
    children: [
      {name: 'kid1', age: 1},
      {name: 'kid2', age: 2}
    ]};

  newObj = {
    name: 'smith',
    coins: [2, 5, 1],
    children: [
      {name: 'kid3', age: 3},
      {name: 'kid1', age: 0},
      {name: 'kid2', age: 2}
    ]};

 AuditLog.generateAuditTrail(oldObj, new Obj);
 
 Output:
 [
 {"type":"Add", "key":"name", value:"smith", oldValue:"joe"},
 {type: "Add", key: "coins.2", value: 1},
 {type: "Update", key: "children.kid1.age", value: 0, oldValue: 1},
 {type: "Add", key: "children.kid3", value: {age:3, name:"kid3"}}]
```

# Licence

The MIT License (MIT)

Copyright (c) 2013 viruschidai@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
