DataWriter
===========

If you need to write something in very high frequency and you want to reduce system load or network connections, this is the best utility for you.

## Install

`npm i --save datawriter`


## API

```
new DataWriter(maxBufferSize, maxCacheAge, batchWriteFunction, errorHandler);
```
- `maxBufferSize`  is the max data rows cached in DataWriter. If the cached data rows grows bigger than this value, an batch write call will be triggered.

- `maxCacheAge` a max cache time in milliseconds. Once a `write()` command is called, a batch write call will be triggered after this time delay.

- `batchWriteFunction` the function you provide to do a batch writing operation. 

- `errorHandler` the global error handler. 


```
dataWriteInstance.write(...args);
```

The write command call. `args` will be treated as a data row. So you can pass any parameters.  Please notice the `write` command will not trigger any error. The error occured in the `batchWriteFunction`, will be caught by the `errorHandler` function.


## Example

```
const DataWriter = require('datawriter');
const fs = require('fs');

let writer = new DataWriter(10, 1000, async arr => {
	console.log('batch write', arr.length, 'rows');
	fs.appendFileSync('a.log', arr.map(params => JSON.stringify(params)).join('\n') + '\n');
}, function(err) {
	console.log('onError', err);
});


writer.write(1);
writer.write('a');
writer.write(1, 2, 3);
writer.write({a: 'A'}, 'nice', [1, 2, 4]);

/*
a.log content will be:

[1]
["a"]
[1,2,3]
[{"a":"A"},"nice",[1,2,4]]

*/
```

