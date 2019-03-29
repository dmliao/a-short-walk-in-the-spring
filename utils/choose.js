// choose an int between low and high, exclusive
module.exports = function(low, high) {
    return low + Math.floor(high - low);
}