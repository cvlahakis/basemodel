// BaseModel.js 0.2.0
// (c) 2016 Costas Vlahakis, Pixacore
// Licensed under the MIT license.

var async = require('async'),
	_ = require('lodash'),
	validateVal = require('./validation');

module.exports = BaseModel;

function BaseModel(attributes, options){
	options || (options = {});

	if(!options.dbInterface){
		throw new Error('Invalid dbInterface');
	}

	this._db = options.dbInterface;

	this.attributes = {};

	if(options.wrapValidationError){
		this.wrapValidationError = options.wrapValidationError;
	}

	this.initialize.apply(this, arguments);
}

BaseModel.prototype.initialize = function(attributes){
	if(attributes){
		this.set(attributes);
	}
};

BaseModel.prototype.set = function(property, value){
	var attributes, hasSchema = !!this.schema;

	if(typeof property === 'object'){
		attributes = property;
	}else{
		(attributes = {})[property] = value;
	}

	for(attribute in attributes){
		if(hasSchema && !this.schema.hasOwnProperty(attribute)){
			throw new Error('Cannot set property: ' + attribute + ', schema doesn\'t allow it');
		}
		this.attributes[attribute] = attributes[attribute];
	}
};

BaseModel.prototype.get = function(property){
	return this.attributes[property];
};

BaseModel.prototype.unset = function(property){
	delete this.attributes[property];
};

BaseModel.prototype.create = function(cb){
	var self = this;

	if(!this.isNew()){
		throw new Error('Can\'t call create on a persisted model');
	}

	var date = new Date;
	this.set({createdAt: date, updatedAt: date, _state: this._defaultActiveState});

	async.waterfall([
		function(next){
			self.validate(next);
		}
	],
	function(err){
		if(err){
			return cb(self.wrapValidationError(err));
		}

		self._db.insertOne(self._collection, self.getPreparedAttributes(), function(err, r){
			if(err) return cb(err);
			if(self.afterCreate){
				self.afterCreate(r, cb);
				return;
			}
			cb(null, self);
		});
	});
};

BaseModel.prototype.save = function(cb){
	var self = this;

	if(this.isNew()){
		throw new Error('Must create first');
	}

	this.set('updatedAt', new Date);

	async.waterfall([
		function(next){
			self.validate(next);
		}
	],
	function(err){
		if(err){
			return cb(self.wrapValidationError(err));
		}

		var where = {};
		where[self._defaultIdProperty] = self.getObjectId();
		self._db.updateOne(self._collection, where, _.omit(self.getPreparedAttributes(), self._defaultIdProperty), function(err){
			if(err) return cb(err);
			cb(null, self);
		});
	});
};

BaseModel.prototype.softDestroy = function(cb){
	var self = this;

	if(this.isNew()){
		throw new Error('Can\'t destroy a new model');
	}

	this.set('updatedAt', new Date);
	this.set('_state', this._deletedState);

	async.waterfall([
		function(next){
			var errors = {};
			async.parallel([
				function(next){
					self.validateProperty('updatedAt', function(err){
						if(err) _.extend(errors, err);
						next();
					});
				},
				function(next){
					self.validateProperty('_state', function(err){
						if(err) _.extend(errors, err);
						next();
					});
				}
			],
			function(){
				if(Object.keys(errors).length){
					next(err);
				}else{
					next();
				}
			});
		}
	],
	function(err){
		if(err){
			return cb(self.wrapValidationError(err));
		}

		var where = {};
		where[self._defaultIdProperty] = self.getObjectId();
		self._db.updateOne(self._collection, where, {_state: self.get('_state'), updatedAt: self.get('updatedAt')}, function(err){
			if(err) return cb(err);
			cb(null, self);
		});
	});
};

BaseModel.prototype.hardDestroy = function(cb){
	var self = this;

	if(this.isNew()){
		throw new Error('Can\'t destroy a new model');
	}

	var where = {};
	where[self._defaultIdProperty] = self.getObjectId();
	this._db.removeOne(this._collection, where, function(err){
		if(err) return cb(err);
		cb(null, self);
	});
};

BaseModel.prototype.validate = function(cb){
	var self = this;

	if(!this.schema) return cb();

	var errors = {};

	async.waterfall([
		function(next){
			async.each(Object.keys(self.schema), function(property, next){
				self.validateProperty(property, function(err){
					if(err){
						_.extend(errors, err);
					}
					next();
				});
			}, next);
		}
	],
	function(){
		if(Object.keys(errors).length){
			cb(errors);
		}else{
			cb();
		}
	});
};

BaseModel.prototype.validateProperty = function(property, cb){
	var self = this;

	if(!this.schema) return cb();

	var schemaDefinition = this.getSchemaDefinition(property);

	if(!schemaDefinition){
		throw new Error('Cannot validate property: ' + property + ', schema doesn\'t allow it');
	}

	var errors = {};

	if(typeof schemaDefinition === 'function'){
		schemaDefinition.call(this, this.get(property), function(err){
			if(err){
				errors[property] = err;
				cb(errors);
			}else{
				cb();
			}
		});
	}else{
		var err = validateVal(schemaDefinition, this.get(property));
		if(err){
			errors[property] = err;
			cb(errors);
		}else{
			cb();
		}
	}
};

BaseModel.prototype.getPreparedAttributes = function(){
	return this.attributes;
};

BaseModel.prototype.isNew = function(){
	return !this.get(this._defaultIdProperty);
};

BaseModel.prototype.getObjectId = function(){
	return this.attributes[this._defaultIdProperty];
};

BaseModel.prototype.wrapValidationError = function(err){
	return err;
};

BaseModel.prototype.getSchemaDefinition = function(property){
	return this.schema[property];
};

BaseModel.prototype._defaultActiveState = 1;
BaseModel.prototype._deletedState = 0;
BaseModel.prototype._defaultIdProperty = '_id';
