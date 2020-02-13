const collections = {
    usuario: require('./model/usuario'),
    registro: require('./model/registro')
}

const hacerRegistro = (data, url, collection, accion) => {
    var reg = {
        apiUrl: url,
        idUsuario: data._id,
        datoGeneral: collection + ' : ' + accion
    }
    var registro = collections['registro'];
    new registro(reg).save();
    return data;
}

module.exports = hacerRegistro;
