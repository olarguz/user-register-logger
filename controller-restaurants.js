const request = require('request-promise');
const config = require('./config');


const findCity = (req, res) => {
    var city = req.params.city;
    console.log(city, req.body);

    var params = {
        method: 'GET',
        uri: 'https://developers.zomato.com/api/v2.1/cities?q=' + city,
        json: true,
        headers: {
            'user-key': config.apiKey
        }
    };

    request(params)
        .then(data => getCityId(data, res))
        .catch(err => res.status(400).json({ message: 'problemas de conexion' }));
};

const getCityId = (data, res) => {
    console.log(data.location_suggestions.length);
    if (data.location_suggestions.length > 0) {
        var id = data.location_suggestions[0].id;

        var params = {
            method: 'GET',
            uri: 'https://developers.zomato.com/api/v2.1/location_details?entity_id=' + id + '&entity_type=city',
            json: true,
            headers: {
                'user-key': config.apiKey
            }
        };

        request(params).then(data => getRestaurantsInfo(data, res));
    } else {
        res.status(400).json({ message: 'no hay datos' });
    }
}

async function getRestaurantsInfo (data, res) {
    var listado = data.nearby_res.map(id => {
        return {
            method: 'GET',
            uri: 'https://developers.zomato.com/api/v2.1/restaurant?res_id=' + id,
            json: true,
            headers: {
                'user-key': config.apiKey
            }
        }
    });

    res.json({
        message: 'operacion exitosa',
        data: await Promise.all(listado.map(params => request(params)))
    });
};

module.exports = {
    findCity: findCity
};
