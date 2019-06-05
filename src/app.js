require('dotenv').config();
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const hbs = require('hbs');

const getWeather = require('./utils/get-weather');

const app = express();
const staticDir = path.join(__dirname, '../static');
const templateDir = path.join(__dirname, '../templates');
const partialDir = path.join(__dirname, '../templates/partials');

// app settings
app.use(morgan('common'));
app.set('views', templateDir);
app.set('view engine', 'hbs');
app.engine('html', require('hbs').__express);
app.use(express.static(staticDir));

// hbs settings
hbs.registerPartials(partialDir);

// home page
app.get('', (req, res) => {
    return res.render('index.html')
});

// get weather
app.get('/weather', (req, res) => {
    if (!req.query.lng || !req.query.lat) {
        return res.status(404).send({
            error: 'Both lat(latitude) and lng(longitude) must be provided'
        });
    }
    coord = {
        lng: req.query.lng,
        lat: req.query.lat
    };
    getWeather(coord, '°C', (error, report) => {
        if (error) {
            return res.status(400).send({
                error: error
            });
        }
        return res.send(report);
    });
});

app.listen(3000)