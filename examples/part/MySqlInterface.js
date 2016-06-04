// consider license on this
var	EventEmitter = require('events').EventEmitter,
	util = require('util'),
	async = require('async'),
	mysql = require('mysql');

function MySqlInterface(options){
	options || (options = {});
	this.options = options;

	this._conn = null;

	options.debug = options.debug === true;

	EventEmitter.call(this);

	if(options.connection){
		this.setConnection(options.connection);
	}
}

util.inherits(MySqlInterface, EventEmitter);

MySqlInterface.prototype.setConnection = function(conn){
	var that = this;
	if(this._conn){
		this._conn.off('error');
	}
	this._conn = conn;
	this._conn.on('error', function(err){
		that.trigger('error', err);

		if(that.options.debug){
			console.error('MySqlInterface detected an error:');
			console.error(err);
		}
	});
};

MySqlInterface.prototype.getConnection = function(){ return this._conn; };

MySqlInterface.prototype.insertOne = function(table, attributes, cb){
	var interfaceConn = this.getConnection(),
		connection;
	
	if(!interfaceConn){
		throw new Error;
	}

	async.waterfall([
		function(next){
			interfaceConn.getConnection(next);
		},
		function(actualConnection, next){
			connection = actualConnection;

			var sqlQuery = 'INSERT INTO ' + table + ' SET ?';
			connection.query(sqlQuery, attributes, next);
		}
	],
	function(err, result){
		if(connection) connection.release();

		if(err) return cb( new DatabaseError(err.code, err.fatal) );

		cb(null, result);
	});
};

MySqlInterface.prototype.updateOne = function(table, where, attributes, cb){
	var interfaceConn = this.getConnection(),
		connection,
		idProperty,
		idValue;

	if(!interfaceConn){
		throw new Error;
	}

	if(Object.keys(where).length !== 1) throw new Error('Invalid "where" parameter');

	for(var k in where){
		idProperty = k;
		idValue = where[k];
	}

	async.waterfall([
		function(next){
			interfaceConn.getConnection(next);
		},
		function(actualConnection, next){
			connection = actualConnection;

			var sqlQuery = 'UPDATE ' + table + ' SET ? WHERE ' + mysql.escapeId(idProperty) + '=' + mysql.escape(idValue) + ' LIMIT 1';
			connection.query(sqlQuery, [attributes], next);
		}
	],
	function(err, result){
		if(connection) connection.release();

		if(err) return cb( new DatabaseError(err.code, err.fatal) );

		cb(null, result);
	});
};

MySqlInterface.prototype.removeOne = function(table, where, cb){
	var interfaceConn = this.getConnection(),
		connection,
		idProperty,
		idValue;

	if(!interfaceConn){
		throw new Error;
	}

	if(Object.keys(where).length !== 1) throw new Error('Invalid "where" parameter');

	for(var k in where){
		idProperty = k;
		idValue = where[k];
	}

	async.waterfall([
		function(next){
			interfaceConn.getConnection(next);
		},
		function(actualConnection, next){
			connection = actualConnection;

			var sqlQuery = 'DELETE FROM ' + table + ' WHERE ' + mysql.escapeId(idProperty) + '=' + mysql.escape(idValue) + ' LIMIT 1';
			connection.query(sqlQuery, next);
		}
	],
	function(err, result){
		if(connection) connection.release();

		if(err) return cb( new DatabaseError(err.code, err.fatal) );

		cb(null, result);
	});
};

MySqlInterface.createPool = function(config){
	return mysql.createPool(config);
};

function DatabaseError(code, fatal){
	this.code = code;
	this.fatal = fatal;
}
DatabaseError.prototype = Object.create(Error.prototype);
DatabaseError.prototype.constructor = DatabaseError;

module.exports = MySqlInterface;
