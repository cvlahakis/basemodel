# Example: Part
##Description
The goal is to run the addPart.js script to persist data in a MySQL database, and to learn more about BM in the process.  
  
There are several takeaways from this example:  
1. PartModel.js is a concrete subclass with schema  
2. MySqlInterface.js is a basic, fully functional database adapter  
3. partFactory.js shows how you can leverage the factory pattern to ease model instantiation  
4. Instantiating a configured MySqlInterface instance (in addPart.js)  
5. Instantiating a subclass instance (in addPart.js)  
6. Persisting data using .create() (in addPart.js)  
  
Before you run the addPart.js script, follow the Setup procedure. Read through the source code and comments for a deeper understanding.
##Running
`node addPart number name`  
  
Example: `node addPart 1 'Monkey Wrench'`
##Setup
### MySQL Setup
If you have difficulty getting MySQL up and running, seek help online.  
1. Get MySQL server running  
2. Get MySQL client running  
3. Run `create database basemodel_example`  
4. Run `use basemodel_example`  
5. Run `source [ path to basemodel/examples/part ]/part.sql` - this will create a MySQL table named "part"  
6. Optional: run `describe part`, which will show you the part table design
### MySqlInterface Configuration
1. In addPart.js: make all necessary configuration adjustments in the **dbConfig** object
  
### NPM Install
1. Run `npm install` in the basemodel/examples/part directory
