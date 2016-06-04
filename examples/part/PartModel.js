var BaseModel = require('basemodel');

module.exports = PartModel;

function PartModel(attributes, options){
	BaseModel.apply(this, arguments);
}

PartModel.prototype = Object.create(BaseModel.prototype, {

	_collection: {
		configurable: false,
		writable: false,
		value: 'part',
	},

	schema: {
		configurable: false,
		writable: false,
		value: {
			_id: {
				type: 'number'
			},
			number: {
				type: 'string',
				size: {min: 1, max: 10},
				required: true
			},
			name: {
				type: 'string',
				size: {min: 1, max: 50},
				required: true
			},
			createdAt: {
				type: 'date',
				required: true
			},
			updatedAt: {
				type: 'date',
				required: true
			},
			_state: {
				type: 'enum',
				values: [0, 1],
				required: true
			}
		}
	},

	afterCreate: {
		configurable: false,
		writable: false,
		value: function(dbObj, cb){
			this.set('_id', dbObj.insertId);
			cb(null, this);
		}
	}

});

PartModel.prototype.constructor = PartModel;

PartModel.getByNumber = function(_db, num, cb){
	// .execArbitraryQuery() is nice to have on the db interface
	// the string being used as the first parameter is just an example
	_db.execArbitraryQuery(' insert query here ', function(err, data){
		if(err) return cb(err);

		if(!data) return cb(null, null);

		cb(null, new PartModel(data, {dbInterface: _db}));
	});

	return;

	// a better and more abstract way of performing this query 
	// var coll = PartModel.prototype._collection;
	// _db.getOneByQuery(coll, {num: num}, function(err, data){ ...
};
