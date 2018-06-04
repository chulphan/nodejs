var sum = require('./lib/sum');

console.log(sum(3,4));

var calculator = require('./lib/calculator');
console.log(calculator.sum(1,2));
console.log(calculator.avg(1,2));
console.log(calculator.mul(1,2));
console.log(calculator.div(1,0));
