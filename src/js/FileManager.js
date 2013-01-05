var fs = require('fs');

var FileManager = {
	files: { }
};

var FileStatus = {
	OPEN: 0,
	CLOSE: 1
};

var QueueType = {
	READ: 'startRead',
	WRITE: 'startWrite',
	PIPE_READ: 'startPipeRead',
	PIPE_WRITE: 'startPipeWrite'
};
// [TODO] ここら辺汚い、同じような処理まとめる
FileManager.read = function(path, callback) {
	if (!this.files[path]) this.newFile(path);

	if (this.status(path) == FileStatus.OPEN) {
		this.enqueue(QueueType.READ, path, callback);
	} else {
		this.startRead(path, callback);
	}
};

FileManager.write = function(path, callback, data) {
	if (!this.files[path]) this.newFile(path);

	if (this.status(path) == FileStatus.OPEN) {
		this.enqueue(QueueType.WRITE, path, callback, data);
	} else {
		this.startWrite(path, callback, data);
	}
};

FileManager.pipeRead = function(path, source, destination, callback) {
	if (!this.files[path]) this.newFile(path);

	if (this.status(path) == FileStatus.OPEN) {
		this.enqueue(QueueType.PIPE_READ, path, source, destination, callback);
	} else {
		this.startPipeRead(path, callback, source, destination);
	}
};

FileManager.pipeWrite = function(path, source, destination, callback) {
	if (!this.files[path]) this.newFile(path);

	if (this.status(path) == FileStatus.OPEN) {
		this.enqueue(QueueType.PIPE_WRITE, path, source, destination, callback);
	} else {
		this.startPipeWrite(path, callback, source, destination);
	}
};

FileManager.syncRead = function(path) {
	if (!this.files[path]) this.newFile(path);

	this.open(path);

	var ret = fs.readFileSync(path);

	this.close(path);

	return ret;
};

FileManager.newFile = function(path) {
	this.files[path] = {
		status: FileStatus.CLOSE,
		queue: [ ]
	};
};

FileManager.status = function(path) {
	return this.files[path].status;
};

FileManager.open = function(path) {
	this.files[path].status = FileStatus.OPEN;
};
// [TODO] dequeue は別の関数へ
FileManager.close = function(path) {
	this.files[path].status = FileStatus.CLOSE;

	if (this.files[path].queue.length !== 0) {
		var queue = this.files[path].queue.shift();

		switch(queue.type) {
		case QueueType.READ:
			this[queue.type](path, queue.callback);
			break;

		case QueueType.WRITE:
			this[queue.type](path, queue.callback, queue.data);
			break;

		case QueueType.PIPE_READ:
		case QueueType.PIPE_WRITE:
			this[queue.type](path, queue.callback, queue.source, queue.destination);
			break;
		}
	}
};

FileManager.enqueue = function(queueType, path, callback, arg1, arg2) {
	switch(queueType) {
	case QueueType.READ:
		this.files[path].queue.push({
			type: queueType,
			callback: callback
		});
		break;

	case QueueType.WRITE:
		this.files[path].queue.push({
			type: queueType,
			callback: callback,
			data: arg1
		});
		break;

	case QueueType.PIPE_READ:
	case QueueType.PIPE_WRITE:
		this.files[path].queue.push({
			type: queueType,
			callback: callback,
			source: arg1,
			destination: arg2
		});
		break;
	}
};

FileManager.startRead = function(path, callback) {
	this.open(path);

	var that = this;

	var stream = fs.createReadStream(path),
		ret = [ ];

	stream.on('data', function(chunk) {
		ret.push(chunk);
	});

	stream.on('end', function() {
		that.close(path);
		callback(null, Buffer.concat(ret));
		stream.destroy();
	});

	stream.on('error', function() {
		that.close(path);
		callback('Error in reading ' + path);
	});

	stream.resume();
};


FileManager.startWrite = function(path, callback, data) {
	this.open(path);

	var that = this;

	var stream = fs.createWriteStream(path);

	stream.on('error', function() {
		that.close(path);
		callback('Error in reading ' + path);
	});
	
	stream.end(data);
	stream.destroySoon();

	stream.on('close', function() {
		that.close(path);
		callback();
	});
};
/*
FileManager.startPipeRead = function(path, callback, source, destination) {
	this.open(path);

	var stream = fs.createReadStream(path);

	source.pipe(destination);

	stream.on('end', function() {
		stream.destroy();
		callback();console.log('req/req' + reqCounts + ' closed(write)');
	});
};
*/
FileManager.startPipeWrite = function(path, callback, source, destination) {
	this.open(path);

	var that = this;

	if (!destination) {
		destination = fs.createWriteStream(path);
	}

	source.pipe(destination);

	source.on('end', function() {
		that.close(path);
		destination.destroy();
		callback();
	});

	destination.on('error', function() {
		that.close(path);
		callback('Error in writing file ' + path);
	});
};

module.exports = exports = FileManager;