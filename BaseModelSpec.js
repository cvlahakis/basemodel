var BaseModel = require("../../BaseModel"),
    dbInterface = require("../dbInterface");

describe("BaseModel", function() {

    describe("when create is called", function() {
        it("should set the createdAt and updatedAt properties", function(done) {
            var model = new BaseModel(null, {
                dbInterface: dbInterface
            });

            model.create(function() {
                expect(model.get("createdAt")).toBeTruthy();
                expect(model.get("updatedAt")).toBeTruthy();
                done();
            });
        });

        it("should set the _state property to the default active state", function(done) {
            var model = new BaseModel(null, {
                dbInterface: dbInterface
            });

            model.create(function() {
                expect(model.get("_state")).toBe(1);
                done();
            });
        });

        it("should validate the model", function(done) {
            var model = new BaseModel(null, {
                dbInterface: dbInterface
            });

            spyOn(BaseModel.prototype, "validate").and.callThrough();

            model.create(function() {
                expect(BaseModel.prototype.validate).toHaveBeenCalled();
                done();
            });
        });

        it("should call the db interface .insertOne() with correct parameters", function(done) {
            var Model = function() {
                BaseModel.apply(this, arguments);
            };

            Model.prototype = Object.create(BaseModel.prototype, {
                _collection: {
                    configurable: false,
                    writable: false,
                    value: "person"
                }
            });

            spyOn(dbInterface, "insertOne").and.callThrough();

            var model = new Model({ name: "foo" }, {
                dbInterface: dbInterface
            });

            model.create(function() {
                expect(dbInterface.insertOne.calls.first().args[0]).toBe("person");
                expect(dbInterface.insertOne.calls.first().args[1]).toEqual({
                    name: "foo",
                    createdAt: model.get("createdAt"),
                    updatedAt: model.get("updatedAt"),
                    _state: 1
                });
                done();
            });
        });
    });

    describe("when the model has an afterCreate hook defined\n    " +
             "and create is called", function() {
        it("should call the afterCreate hook", function(done) {
            var model = new BaseModel(null, {
                dbInterface: dbInterface
            });

            model.afterCreate = function(result, cb) {
                cb();
            };

            spyOn(model, "afterCreate").and.callThrough();

            model.create(function() {
                expect(model.afterCreate).toHaveBeenCalled();
                done();
            }); 
        });
    });

    describe("when create is called\n    " +
             "and the model is already persisted", function() {
        it("should throw an exception", function(done) {
            var model = new BaseModel(null, {
                dbInterface: dbInterface
            });

            model.afterCreate = function(result, cb) {
                this.set("_id", 1);
                cb();
            };

            model.create(function() {
                function create() {
                    model.create();
                }

                expect(create).toThrow();
                done();
            });
        });
    });

    // add test for validation failure and callback being called with err

    describe("when save is called", function() {
        beforeEach(function(done) {
            var Model = function() {
                BaseModel.apply(this, arguments);
            };
            Model.prototype = Object.create(BaseModel.prototype, {
                _collection: {
                    configurable: false,
                    writable: false,
                    value: "person"
                }
            });
            this.model = new Model(null, {
                dbInterface: dbInterface
            });
            this.model.afterCreate = function(result, cb) {
                this.set("_id", 1);
                cb();
            };
            this.model.create(done);
        });

        it("should set the updatedAt property", function(done) {
            var that = this,
                updatedAt = this.model.get("updatedAt").getTime();

            setTimeout(function() {
                that.model.save(function() {
                    expect(that.model.get("updatedAt").getTime()).not.toBe(updatedAt);
                    done();
                });
            }, 100);
        });

        it("should validate the model", function(done) {
            spyOn(BaseModel.prototype, "validate").and.callThrough();

            this.model.save(function() {
                expect(BaseModel.prototype.validate).toHaveBeenCalled();
                done();
            });
        });

        it("should call the db interface .updateOne() with correct parameters", function(done) {
            spyOn(dbInterface, "updateOne").and.callThrough();

            this.model.save(function(err, model) {
                expect(dbInterface.updateOne.calls.first().args[0]).toBe("person");
                expect(dbInterface.updateOne.calls.first().args[1]).toEqual({ "_id": 1 });
                expect(dbInterface.updateOne.calls.first().args[2]).toEqual({
                    createdAt: model.get("createdAt"),
                    updatedAt: model.get("updatedAt"),
                    _state: 1
                });
                done();
            });
        });
    });

    describe("when save is called\n    " +
             "and the model isn't already persisted", function() {
        it("throws exception if model isn't persisted", function() {
            var model = new BaseModel(null, {
                dbInterface: dbInterface
            });

            expect(function() { model.save(); }).toThrow();
        });
    });

    // add test for validation failure and callback being called with err

    describe("when softDestroy is called", function() {
        beforeEach(function(done) {
            var Model = function() {
                BaseModel.apply(this, arguments);
            };
            Model.prototype = Object.create(BaseModel.prototype, {
                _collection: {
                    configurable: false,
                    writable: false,
                    value: "person"
                }
            });
            this.model = new Model(null, {
                dbInterface: dbInterface
            });
            this.model.afterCreate = function(result, cb) {
                this.set("_id", 1);
                cb();
            };
            this.model.create(done);
        });

        it("should set the updatedAt property", function(done) {
            var that = this,
                updatedAt = this.model.get("updatedAt").getTime();

            setTimeout(function() {
                that.model.softDestroy(function() {
                    expect(that.model.get("updatedAt").getTime()).not.toBe(updatedAt);
                    done();
                });
            }, 100);
        });

        it("should set the _state property to deleted state", function(done) {
            var that = this;

            this.model.softDestroy(function() {
                expect(that.model.get("_state")).toBe(0);
                done();
            });
        });

        it("should validate the updatedAt and _state properties", function(done) {
            spyOn(BaseModel.prototype, "validateProperty").and.callThrough();

            this.model.softDestroy(function() {
                expect(BaseModel.prototype.validateProperty)
                    .toHaveBeenCalledWith("updatedAt", jasmine.any(Function));
                expect(BaseModel.prototype.validateProperty)
                    .toHaveBeenCalledWith("_state", jasmine.any(Function));
                done();
            });
        });

        it("should call the db interface .updateOne() with correct parameters", function(done) {
            spyOn(dbInterface, "updateOne").and.callThrough();

            this.model.softDestroy(function(err, model) {
                expect(dbInterface.updateOne).toHaveBeenCalledWith(
                    "person",
                    { "_id": 1 },
                    {
                        updatedAt: model.get("updatedAt"),
                        _state: 0
                    },
                    jasmine.any(Function)
                );
                done();
            });
        });
    });

    describe("when softDestroy is called\n    " +
             "and the model isn't already persisted", function() {
        it("should throw an exception", function() {
            var model = new BaseModel(null, {
                dbInterface: dbInterface
            });

            expect(function() { model.softDestroy(); }).toThrow();
        });
    });

    // add test for validation failure and callback being called with err

    describe("when hardDestroy is called", function() {
        beforeEach(function(done) {
            var Model = function() {
                BaseModel.apply(this, arguments);
            };
            Model.prototype = Object.create(BaseModel.prototype, {
                _collection: {
                    configurable: false,
                    writable: false,
                    value: "person"
                }
            });
            this.model = new Model(null, {
                dbInterface: dbInterface
            });
            this.model.afterCreate = function(result, cb) {
                this.set("_id", 1);
                cb();
            };
            this.model.create(done);
        });

        it("should call the db interface .removeOne() with correct parameters", function(done) {
            spyOn(dbInterface, "removeOne").and.callThrough();

            this.model.hardDestroy(function() {
                expect(dbInterface.removeOne).toHaveBeenCalledWith(
                    "person",
                    { "_id": 1 },
                    jasmine.any(Function)
                );
                done();
            });
        });
    });
    
    describe("when hardDestroy is called\n    " +
             "and the model isn't already persisted", function() {
        it("should throw an exception", function() {
            var model = new BaseModel(null, {
                dbInterface: dbInterface
            });

            expect(function() { model.hardDestroy(); }).toThrow();
        });
    });

    describe("when validate is called", function() {
        it("always passes for a model without a schema", function() {

        });

        it("validates all attributes defined in model schema", function() {

        });

        it("builds error object", function() {

        });
    });

    describe("when validateProperty is called", function() {
        it("should always pass for a model without a schema", function() {

        });

        it("throws an exception if there isn't a schema definition", function() {

        });

        it("supports custom validators", function() {

        });

        it("supports generic validators", function() {

        });
    });

    describe("when getPreparedAttributes is called", function() {
        it("should return the model attributes", function() {
            var model = new BaseModel({ name: "foo" }, {
                dbInterface: {}
            });

            var attributes = model.getPreparedAttributes();

            expect(attributes.name).toBe("foo");
        })
    });

    describe("when isNew is called\n    " +
             "and the model hasn't been persisted", function() {
        it("should return true", function() {
            var model = new BaseModel({ name: "foo" }, {
                dbInterface: dbInterface
            });

            expect(model.isNew()).toBe(true);
        });
    });

    describe("when isNew is called\n    " +
             "and the model is persisted", function() {
        it("should return false", function(done) {
            var model = new BaseModel({ name: "foo" }, {
                dbInterface: dbInterface
            });

            model.afterCreate = function(result, cb) {
                this.set("_id", 1);
                cb();
            };

            model.create(function() {
                expect(model.isNew()).toBe(false);
                done();
            });
        });
    });

    describe("when getObjectId is called", function() {
        it("should return the model identifier", function() {
            var model = new BaseModel({ name: "foo" }, {
                dbInterface: dbInterface
            });

            model.set("_id", 10);

            expect(model.getObjectId()).toBe(10);
        });
    });

    describe("when getSchemaDefinition is called", function() {
        it("should return the schema definition for the property", function() {
            var Model = function() {
                BaseModel.apply(this, arguments);
            };

            Model.prototype = Object.create(BaseModel.prototype, {
                schema: {
                    configurable: false,
                    writable: false,
                    value: {
                        id: { type: "number" }
                    }
                }
            });

            var model = new Model(null, {
                dbInterface: {}
            });

            expect(model.getSchemaDefinition("id")).toEqual({ type: "number" });
        });
    });

});
