if(process.argv.length !== 4){
	console.error('');
	console.error('Usage: node addPart number name');
	console.error('');
	process.exit(1);
}

var MySqlInterface = require('./MySqlInterface');

var dbConfig = {
	host: 'localhost',
	port: 3306,
	user: 'root',
	// password: 'root', some unsecure installs don't require a password
	database: 'basemodel_example',
	connectionLimit: 10
};

var dbInterface = new MySqlInterface({
	connection: MySqlInterface.createPool(dbConfig)
});

// this assignment also binds dbInterface
var partFactory = require('./partFactory.js')(dbInterface);

var hexDriver = partFactory.make({
	number: process.argv[2],
	name: process.argv[3]
});

hexDriver.create(function(err, sameObjAsHexDriver){
	if(err){
		console.error('Something went wrong:');
		console.error(err);
		process.exit(1);
	}

	console.log('A PartModel was created.');
	console.log(hexDriver.getPreparedAttributes());
	process.exit();
});
