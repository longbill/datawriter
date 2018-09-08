const DataWriter = require('./');

function wait(ms) {
	return new Promise(done => {
		setTimeout(done, ms);
	});
}

let writer = new DataWriter(3, 1000, async function(arr) {
	console.log('writing', arr, 'rows to database');

	// await wait(100);
	if (Math.random() < 0.5) throw new Error('batch write failed');
	console.log(`write success`);

}, function(err) {
	console.log('onError', err);
});


(async () => {
	for (let i = 0; i < 1; i++ ) {
		writer.write(i);
		await wait((i % 10) * 200);
	}
})();