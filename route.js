const controller = require('./controller');
const restaturants = require('./controller-restaurants');

module.exports = app => {

    /*
    Esta es la invocación de las funciones que escriben en base de datos.
    */
    app.post('/:collection', controller.command.create);
    app.put('/:collection', controller.command.update);
    app.delete('/:collection/:id', controller.command.erase);

    /*
    Esta es la invocacion de las funciones que leen de la base de datos.
    */
    app.get('/:collection', controller.query.findAll);
    app.get('/:collection/:id', controller.query.findOne);

    /*
    Esta es la invocacion 
     */
    app.get('/api/restaturants/:city', restaturants.findCity);
};
