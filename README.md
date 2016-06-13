# BaseModel
This software project provides an abstract class to be inherited from for the purpose of persisting models in the Node.js environment.  

This project started as a piece of a proprietary Node.js HTTP application that was designed and implemented in 2015. Most of the design goals of the original application are intrinsic to the project. The software is currently running in production, but on a relatively small scale. It would be unwise to use this software (version 0.1.0) as a critical component to a larger system.

## Installation
This software is available through npm. Install it as a dependency by running: `npm install basemodel`

## Advantages
* Zero assumptions about database engines
* Write your own adapters to persist data
* Validate model data by defining a schema, and produce consumable schema violation objects - for simple API requests you won't have to do ad-hoc data sanitization anymore

## Constraints
There are a few constraints baked into the design of the software. They are listed here to reduce wasted time.  
* A concrete subclass of BM (an implementation) must define a **_collection** property. The **_collection** property is used to associate an implementation with a particular table or collection in the underlying datastore.  
* Once a model has been persisted, it is assumed to have a unique identifier relative to **_collection**. See `create(cb)` for more info.  
* An implementation will have a **_state** attribute. This attribute is meant to reflect the state of a model. For example, a Ticket model has two states: not-used/used.

## Interface
### initialize(attributes)
This method is used to set an attributes object on a model instance.
It is called automatically in the BM constructor.
### get(property)
Returns the value of the property. Returns undefined if the property doesn't exist.
### set(property, value)
Set the value(s) of one or more properties. There are two signatures for this method: `set(p, v)` and `set(attrs)`.
### unset(property)
Dereferences the value of the property using the JavaScript keyword *delete*.
### create(cb)
Persist a new model to the datastore. The callback is called with cb(null, self) on success.  
1. Automatically sets the **createdAt**, **updatedAt**, and **_state** attributes  
2. Validates the model attributes (if the model has a schema)  
3. Utilizes the model instance's db interface reference (specifically, the .insertOne() method) to persist the data  
A key step in the create routine is setting the model identifer. One way to do this is to define a "afterCreate" property on the prototype of an implementation, and use that function to set the identifier.
### save(cb)
Updates a model that was previously persisted. The callback is called with cb(null, self) on success.  
1. Automatically sets the **updatedAt** attribute  
2. Validates the model attributes (if the model has a schema)  
3. Similar to step 3 for `create(cb)`, but using the .updateOne() method  
All attributes except the model identifier are passed to .updateOne().
### softDestroy(cb)
Changes the **_state** of a model to **_deletedState**. This is useful for retaining data. The callback is called with cb(null, self) on success.  
1. Automatically sets the **updatedAt** and **_state** attributes  
2. Validates the attributes that were set in step 1  
3. Similar to step 3 for `save(cb)`  
The only attributes that are passed to .updateOne() are **updatedAt** and **_state**.
### hardDestroy(cb)
Remove the model's data from the datastore. Uses the db interface's .removeOne() method. The callback is called with cb(null, self) on success.
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
An identity function, meant to be overridden by an implementation.
### getSchemaDefinition(property)
A helper function that returns the schema definition for an attribute.

## Prototype
All the methods listed under the Interface heading are part of the BM prototype. There are a few more properties on the prototype.  
### _defaultActiveState = 1
The value **_state** is set to in `create(cb)`.
### _deletedState = 0
The value **_state** is set to in `softDestroy(cb)`.
### _defaultIdProperty = '_id'
The property for the model identifier value. This variable is used throughout the BM class.

## Database Interface
* DB interface must implement: insertOne(), updateOne(), removeOne()

## Examples
### Part
The part example is a complete working example of BM. The example ties together a PartModel class with a MySQL database adapter. The example is run in the form of a simple script. Check out the README in examples/part/ for more info.

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
