# BaseModel
This software project strives to do one thing very well: to provide an abstract class to be inherited from for the purpose of persisting models in the Node.js environment.  
  
This project started as a piece of a proprietary Node.js boilerplate HTTP application that was designed and implemented in 2015. Most of the design goals of the original application are intrisic to the project. The software is currently running in production, but on a relatively small scale. It would be unwise to use this software (version 0.1.0) as a critical component to a larger system. One of the primary goals is to get the software to the level where it can be relied on as a critical component.

## Quick Start
What's included: BaseModel.js, and validation.js  
Dive in to a unrealistic example:  
1. `mkdir basemodel-example`  
2. `cd basemodel-example`  
3. `npm install basemodel`  
4. Add a file ... maybe include link to gist instead

## Advantages
* No assumptions about database engines
* Write your own adapters to persist data
* Validate data by defining a schema, and produce consumable schema violation objects - for simple API requests you won't have to do ad-hoc data sanitization anymore


## other points to make
* DB interface must implement: insertOne, updateOne, removeOne()
* what this BM is good for (reason about the class MORE): model<-- 1:1 --> collection or table, primary id required


# things to do examples for
* subclass with schema
* factory usage
* db adapter (maybe?)

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
### softDestroy()
### hardDestroy()
### validate()
### validateProperty()
### getPreparedAttributes()
### isNew()
### getObjectId()
### wrapValidationError()
### getSchemaDefinition()

# the future
* working towards version 1.0.0

## Design Goals
* Database agnostic
* Minimal dependencies
* Professional
* Loose coupling
* Protection against dependency API changes
* Promote extension

# author info

# license info
