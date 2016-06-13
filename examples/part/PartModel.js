var BaseModel = require('basemodel');

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

	// sets the model identifier
	// called automatically in the create routine
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

/*
	this is a static method, shown here as an example
	an actual implementation is left out	

PartModel.getByNumber = function(_db, num, cb){
	// .execArbitraryQuery() is nice to have on the db interface
	// the string being used as the first parameter has to be replaced
	// with an actual query
	_db.execArbitraryQuery(' insert query here ', function(err, results){
		if(err) return cb(err);

		var r = results[0];

		if(!r) return cb(null, null);

		cb(null, new PartModel(r, {dbInterface: _db}));
	});

	// .getByNumber() can be written in a cleaner way by adding a
	// generic .getOneByQuery() method to the db interface
	// var coll = PartModel.prototype._collection;
	// _db.getOneByQuery(coll, {num: num}, function(err, results){ ...
};
*/

module.exports = PartModel;
