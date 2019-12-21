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

```js
const DataWriter = require('datawriter');

const update = new DataWriter(3, 1000, updates => {
	console.log('bach write:', updates.map(args => args[0]));
}, console.error);

let i = 0;
let timer = setInterval(() => {
	console.log('write:', i);
	update.write(i++);
}, 300);

setTimeout(() => {
	clearInterval(timer);
}, 3500);



/*
output will be:

write: 0
write: 1
write: 2
bach write: [ 0, 1, 2 ]
write: 3
write: 4
write: 5
bach write: [ 3, 4, 5 ]
write: 6
write: 7
write: 8
bach write: [ 6, 7, 8 ]
write: 9
write: 10
bach write: [ 9, 10 ]
*/
```


```js
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


