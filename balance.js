// Receive on stdin a comma separated list of floats and returns
// the same with the data points evenly distributed

const { processData } = require('./balance-libs')
const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin
});

rl.on('line', (line) => {
    console.log(processData(line))
});

