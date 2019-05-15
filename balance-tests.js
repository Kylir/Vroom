// Ideally I would use some test framework like Jasmine, Karma or Jest...
// Let's keep it simple without dependencies...

const assert = require('assert').strict
const { processData } = require('./balance-libs')

let input = ''
let message = ''

// Several Happy path scenario
message = 'One value in each bucket'
input = '0.1,0.3,0.5,0.7,0.9'
assert.strictEqual(
    processData(input),
    '0.1,0.3,0.5,0.7,0.9',
    'Error in test: ' + message
)

message = 'Two values per bucket'
input = '0.01,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9'
assert.strictEqual(
    processData(input),
    '0.01,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9',
    'Error in test: ' + message
)

message = 'Duplicated values'
input = '0.1,0.3,0.5,0.7,0.9,0.1,0.3,0.5,0.7,0.9'
assert.strictEqual(
    processData(input),
    '0.1,0.1,0.3,0.3,0.5,0.5,0.7,0.7,0.9,0.9',
    'Error in test: ' + message
)

message = 'Even more duplicated values!'
input = '0.1,0.3,0.5,0.7,0.9,0.1,0.3,0.5,0.7,0.9,0.1,0.3,0.5,0.7,0.9,0.1,0.3,0.5,0.7,0.9,0.1,0.3,0.5,0.7,0.9,0.1,0.3,0.5,0.7,0.9,0.1,0.3,0.5,0.7,0.9,0.1,0.3,0.5,0.7,0.9'
assert.strictEqual(
    processData(input),
    '0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.3,0.3,0.3,0.3,0.3,0.3,0.3,0.3,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.7,0.7,0.7,0.7,0.7,0.7,0.7,0.7,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9',
    'Error in test: ' + message
)

message = 'Spaces? Why not...'
input = '0.01, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9'
assert.strictEqual(
    processData(input),
    '0.01,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9',
    'Error in test: ' + message
)


// Filtering scenario
message = 'Values removed because one bucket has less values'
input = '0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9'
assert.strictEqual(
    processData(input),
    '0.1,0.2,0.4,0.6,0.8',
    'Error in test: ' + message
)

message = 'Values removed because one bucket has less values (second version)'
input = '0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8'
assert.strictEqual(
    processData(input),
    '0.1,0.2,0.4,0.6,0.8',
    'Error in test: ' + message
)

message = 'One empty bucket - no output'
input = '0.1,0.2,0.3,0.4,0.5,0.6,0.7'
assert.strictEqual(
    processData(input),
    '',
    'Error in test: ' + message
)

message = 'One value only - no output'
input = '0.5'
assert.strictEqual(
    processData(input),
    '',
    'Error in test: ' + message
)

// weird cases
message = 'Empty input must throw an error'
input = ''
assert.throws(function () {processData(input)}, /^Error: Unexpected input value!$/, message)

message = 'no negative number'
input = '0.1,0.2,-0.3'
assert.throws(function () {processData(input)}, /^Error: Unexpected input value!$/, message)

message = 'no number bigger than 1'
input = '0.1,0.2,0.3,1.3'
assert.throws(function () {processData(input)}, /^Error: Unexpected input value!$/, message)

message = 'no characters'
input = '0.1,0.2,0.3,abc,0.4'
assert.throws(function () {processData(input)}, /^Error: Unexpected input value!$/, message)





