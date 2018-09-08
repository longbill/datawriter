const DataWriter = require('./');

function wait(ms) {
	return new Promise(done => {
		setTimeout(done, ms);
	});
}

let writer = new DataWriter(100, 1000, async function(arr) {
	console.log('writing', arr.length, 'rows to database');
	await wait(100);
	if (Math.random() < 0.5) throw new Error('write failed');
	console.log(`write success`);
}, function(err) {
	console.log(err.message);
});


setInterval(() => {
	writer.write(Date.now());
}, 20);