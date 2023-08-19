const {add, square} = require('./utils');

it("Should add two numbers", () => {
    var res = add(11,22);
    if(res !== 44)
    throw new Error(`Expected 44, but got ${res}`);
});
it("Should square a number", () => {
    var res = square(4);
    if(res !== 16) {
        throw new Error(`Expected 16, but got ${res}`);
    }
})