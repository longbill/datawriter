
class DataWriter {

	constructor(maxBufferSize, maxDelay, bulkWriteFunction, onError) {
		this.maxBufferSize = maxBufferSize;
		this.maxDelay = maxDelay;
		this.bulkWriteFunction = bulkWriteFunction;
		this.buffer = [];
		this.timeout = null;
		this.onError = onError;
	}

	write(...args) {
		this.buffer.push(args);
		this.checkWrite();
	}

	checkWrite() {
		if (this.timeout) clearTimeout(this.timeout);
		if (this.buffer.length >= this.maxBufferSize) {
			this.bulkWrite();
		} else {
			this.timeout = setTimeout(this.bulkWrite.bind(this), this.maxDelay);
		}
	}

	async bulkWrite() {
		if (this.buffer.length === 0) return;
		let arr = [...this.buffer];
		this.buffer = [];
		try {
			await this.bulkWriteFunction(arr);
		} catch (err) {
			let error = new Error(`DataWriter write error: ${err ? err.message : 'unknown error'}`);
			error.data = arr;
			error.original = err;
			if (this.onError) {
				this.onError(error);
			} else {
				console.error(error);
			}
		}
	}
}


module.exports = DataWriter;