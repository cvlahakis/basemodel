var PartModel = require('./PartModel');

module.exports = function(dbInterface){

	return {
		make: function(attributes){
			return new PartModel(attributes, {dbInterface: dbInterface});
		}
	};

};
