
class DataWriter {

	constructor(maxBufferSize, maxDelay, batchWriteFunction, onError) {
		this.maxBufferSize = maxBufferSize;
		this.maxDelay = maxDelay;
		this.batchWriteFunction = batchWriteFunction;
		this.buffer = [];
		this.timeout = null;
		this.onError = onError;
	}

	write(...args) {
		this.buffer.push(args);
		this.checkWrite();
	}

	checkWrite() {
		if (!this.timeout) {
			this.timeout = setTimeout(this.batchWrite.bind(this), this.maxDelay);
		}
		if (this.buffer.length >= this.maxBufferSize) {
			this.batchWrite();
		}
	}

	async batchWrite() {
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}
		
		if (this.buffer.length === 0) return;
		let arr = [...this.buffer];
		this.buffer = [];
		try {
			await this.batchWriteFunction(arr);
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