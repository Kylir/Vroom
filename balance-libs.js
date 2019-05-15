
function processData(line) {

    // Showing off chained functions...
    // We end up with an array of floats
    const data = line.split(',').map(parseFloat)

    // Pushing the floats in the right buckets
    let buckets = [[], [], [], [], []]
    for (let f of data) {
        let index
        if (f <= 0) {
            throw new Error('Unexpected input value!')
        }else if (f < 0.2) {
            index = 0
        } else if (f < 0.4) {
            index = 1
        } else if (f < 0.6) {
            index = 2
        } else if (f < 0.8) {
            index = 3
        } else if (f < 1) {
            index = 4
        } else {
            throw new Error('Unexpected input value!')
        }
        buckets[index].push(f)
    }

    // Can be useful for debugging to see the content of the buckets
    //console.log(buckets)

    // What is the smallest bucket?
    const minReducer = (accumulator, bucket) => Math.min(accumulator, bucket.length)
    const min = buckets.reduce(minReducer, Infinity)

    // output the same number of each bucket
    const formatReducer = (output, bucket) => output.concat(bucket.slice(0, min))
    const output = buckets.reduce(formatReducer, []).join(',')

    return output
}

module.exports = {processData}
