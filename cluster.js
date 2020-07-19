const cpus = require('os').cpus(),
	cluster = require('cluster'),
	logger = require('./tools/logger');

if(cluster.isMaster){
	logger.info('The master process has pid ' + process.pid);
	for( let i = 0; i < cpus.length-1; i++){
		const worker = cluster.fork();
		worker.on('exit', () => {
			logger.warn('Worker died! Pid: ' + worker.process.pid);
			cluster.fork();
		})
	}
} else {
	require('./worker');
}