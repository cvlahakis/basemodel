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

# Interface
## initialize()
## get()
## set()
## unset()
## create()
## save()
## softDestroy()
## hardDestroy()
## validate()
## validateProperty()
## getPreparedAttributes()
## isNew()
## getObjectId()
## wrapValidationError()
## getSchemaDefinition()

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
