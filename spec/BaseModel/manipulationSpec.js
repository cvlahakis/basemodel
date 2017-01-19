var BaseModel = require("../../BaseModel");

describe("BaseModel manipulation", function() {

    describe("when get is called", function() {
        it("should return the value of the property", function() {
            var model = new BaseModel({ name: "foo" }, {
                dbInterface: {}
            });

            expect(model.get("name")).toBe("foo");
        });
    });

    describe("when set is called with a property and a value", function() {
        it("should set the property and value", function() {
            var model = new BaseModel(null, {
                dbInterface: {}
            });

            model.set("name", "foo");

            expect(model.get("name")).toBe("foo");
        });
    });

    describe("when set is called with an attributes object", function() {
        it("should set all the properties and values", function() {
            var model = new BaseModel(null, {
                dbInterface: {}
            });

            model.set({
                name: "foo",
                location: "earth"
            });

            expect(model.get("name")).toBe("foo");
            expect(model.get("location")).toBe("earth");
        });
    });

    describe("when the model has a schema\n" +
             "and set is called with a property\n" +
             "and the property isn't in the schema", function() {
        it("should throw an exception", function() {
            var Model = function() {
                BaseModel.apply(this, arguments);
            };

            Model.prototype = Object.create(BaseModel.prototype, {
                schema: {
                    configurable: false,
                    writable: false,
                    value: {}
                }
            });

            var model = new Model(null, {
                dbInterface: {}
            });

            function set() {
                model.set({
                    name: "foo"
                });
            }

            expect(set).toThrow();
        });
    });

    describe("when the model has a schema\n" +
             "and set is called with a property\n" +
             "and the property is in the schema", function() {
        it("should set the property and value", function() {
            var Model = function() {
                BaseModel.apply(this, arguments);
            };

            Model.prototype = Object.create(BaseModel.prototype, {
                schema: {
                    configurable: false,
                    writable: false,
                    value: {
                        name: {
                            type: "string"
                        }
                    }
                }
            });

            var model = new Model(null, {
                dbInterface: {}
            });

            model.set("name", "foo");

            expect(model.get("name")).toBe("foo");
        });
    });

    describe("when unset is called", function() {
        it("should unset the property", function() {
            var model = new BaseModel({ name: "foo" }, {
                dbInterface: {}
            });

            expect(model.get("name")).toBe("foo");
            model.unset("name");
            expect(model.get("name")).toBe(undefined);
        });
    });

});
