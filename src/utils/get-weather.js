const request = require('request')


const getWeather = (coord, unit = '°C', callback) => {
    const lng = coord.lng
    const lat = coord.lat
    var weatherURL
    if (unit == '°C') {
        weatherURL = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${lat},${lng}?units=si`;
    } else {
        weatherURL = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${lat},${lng}`;
    }

    request({
        method: 'GET',
        uri: weatherURL,
        json: true
    },
        (error, response, body) => {
            if (error) {
                callback('Unable to connect to Weather services!', undefined)
            } else if (response.statusCode != 200) {
                callback(body.error, undefined);
            } else {
                callback(undefined, body.currently);
            }
        })
}

module.exports = getWeather
