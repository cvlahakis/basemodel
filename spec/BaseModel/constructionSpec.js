var BaseModel = require("../../BaseModel");

describe("BaseModel construction", function() {

    describe("when the constructor is invoked", function() {
        it("should initialize the model", function() {
            spyOn(BaseModel.prototype, "initialize").and.callThrough();

            var attributes = { name: "foo" };
            var options = { dbInterface: {} };
            var model = new BaseModel(attributes, options);

            expect(BaseModel.prototype.initialize)
                .toHaveBeenCalledWith(attributes, options);
            expect(model.get("name")).toBe("foo");
        });
    });

    describe("when the constructor is invoked with a custom validation error wrapper", function() {
        it("should override the default", function() {
            function wrapper() {}
            var model = new BaseModel(null, {
                dbInterface: {},
                wrapValidationError: wrapper
            });

            expect(model.wrapValidationError).toBe(wrapper);
        });
    });

    describe("when the constructor is invoked without a db interface", function() {
        it("should throw an exception", function() {
            expect(function() { new BaseModel(null); }).toThrowError();
        });
    });

    describe("when initialize is called with attributes", function() {
        it("should set the attributes on the model", function() {
            spyOn(BaseModel.prototype, "set").and.callThrough();

            var model = new BaseModel(null, {
                dbInterface: {}
            });

            var attributes = {
                name: "foo",
                location: "earth"
            };

            model.initialize(attributes);

            expect(BaseModel.prototype.set).toHaveBeenCalledWith(attributes);
            expect(model.get("name")).toBe("foo");
            expect(model.get("location")).toBe("earth");
        });
    });

});
