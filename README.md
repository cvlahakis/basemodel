# BaseModel
This software project strives to do one thing very well: to provide an abstract class to be inherited from for the purpose of persisting models in the Node.js environment.  
  
This project started as a piece of a proprietary Node.js boilerplate HTTP application that was designed and implemented in 2015. Most of the design goals of the original application are intrinsic to the project. The software is currently running in production, but on a relatively small scale. It would be unwise to use this software (version 0.1.0) as a critical component to a larger system. One of the primary goals is to get the software to the level where it can be relied on as a critical component.

## Installation
This software is available through npm. Install it as a dependency by running: `npm install basemodel`.

## Advantages
* No assumptions about database engines
* Write your own adapters to persist data
* Validate data by defining a schema, and produce consumable schema violation objects - for simple API requests you won't have to do ad-hoc data sanitization anymore

## Constraints
* what this BM is good for (reason about the class MORE): model<-- 1:1 --> collection or table, primary id required

## Interface
### initialize(attributes)
This method is used to set an attributes object on a model instance.
It is called automatically in the BM constructor.
### get(property)
Returns the value of the property. Returns undefined if the property doesn't exist.
### set(property, value)
Set the value(s) of one or more properties. There are really two signatures for this method: set(p, v) and set(attrs).
### unset(property)
Dereferences the value of the property using the JavaScript keyword *delete*.
### create(cb)
Persist a new model to the database. The callback is called with cb(null, self) on success.  
1. Automatically sets the **createdAt**, **updatedAt**, and **_state** properties  
2. Validates the model attributes (if the model has a schema)  
3. Utilizes the model instance's db interface reference (specifically, the .insertOne() method) to persist the data.  
A key step in the create routine is setting the model identifer. One way to do this is to define a function named "afterCreate" on the prototype of a subclass of BM, and use that fn to set the identifier.
### save(cb)
Updates a model that was previously persisted. The callback is called with cb(null, self) on success.  
1. Automatically sets the **updatedAt** property  
2. Validates the model attributes (if the model has a schema)  
3. Similar to step 3 for create, using the .updateOne() method  
All attributes except the model identifier are passed using .updateOne().
### softDestroy(cb)
Changes the **_state** of a model to the deleted state. This is useful for retaining data. The callback is called with cb(null, self).  
1. Automatically sets the **updatedAt** and **_state** properties  
2. Validates the properties that were set in step 1  
3. Similar to step 3 for create, using the .updateOne() method  
The only properties that are passed to .updateOne() are **updatedAt** and **_state**.
### hardDestroy(cb)
Remove the model's data from the database. Uses the db interface's .removeOne() method. The callback is called with cb(null, self) on success.
### validate(cb)
Validates the model attributes using the model schema. The callback is called with no parameters if the model doesn't have a schema or the validation succeeded. The callback is called with an errors object if the validation failed.
### validateProperty(property, cb)
Validates a specific property using the model schema. This method will throw an exception if there isn't a schema definition for the property. The callback is called with no parameters if validation succeeded. The callback is called with an errors object if the validation failed.
### getPreparedAttributes()
Returns the model attributes.
### isNew()
Returns a bool signifying whether the model has been previously persisted.
### getObjectId()
Returns the model identifier.
### wrapValidationError(err)
An identity function, meant to be overridden by a BM subclass.
### getSchemaDefinition(property)
A helper function that returns the schema definition for a property.

## Prototype
All the methods listed under the Interface heading are part of the BM prototype. There are a few more properties on the prototype.  
### _defaultActiveState = 1
The value **_state** is set to in create().
### _deletedState = 0
The value **_state** is set to in softDestroy().
### _defaultIdProperty = '_id'
The property for the model identifier value. This variable is used throughout the BM class.

## Database Interface
* DB interface must implement: insertOne, updateOne, removeOne()

## Examples
### Subclass with schema
### Instantiation using factory pattern
### Database adapter

## The Future
Looking ahead, the primary goal is to get some developers using BM in order to create a feedback loop to drive the evolution of the project.

## Design Goals
* Database agnostic
* Minimal dependencies
* Professional
* Loose coupling
* Protection against dependency API changes
* Promote extension

## Author
This software was designed and implemented by Costas Vlahakis.

## License
MIT
