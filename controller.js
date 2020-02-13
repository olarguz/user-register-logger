const factory = require('./factory');
const collections = {
    usuario: require('./model/usuario'),
    registro: require('./model/registro')
}

const createObject = body => {
    var data = {};
    Object.keys(body).forEach(e => data[e] = body[e]);
    return data;
}

const create = (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: 'No se puede almacenar sin datos' });
    }
    var nCol = req.params.collection;

    var collection = collections[nCol];

    if (req.params.collection != 'registro') {
        new collection(createObject(req.body)).save()
            .then(data => factory.hacerRegistro(data, req.url, nCol, 'guardar'))
            .then(data => res.json(data))
            .catch(err => res.status(500).json({ message: err.message }));
    } else {
        res.status(403).json({ message: 'No se puede agregar registros de forma manual' });
    }
};

const update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "No se puede actualizar sin datos" });
    }

    collections.usuario.findOne({ username: req.body.username }, (err, usuario) => {
        if (usuario.pass === req.body.pass && usuario.logged !== req.body.logged) {
            usuario.logged = req.body.logged;
            collections.usuario.update(usuario)
                .then(data => factory.hacerRegistro(usuario, req.url, 'usuario', 'actualizar'))
                .then(data => res.json({ message: 'cambio de estado de usuario' }))
                .catch(err => res.status(500).json({ message: err.message }));
        } else {
            res.json({ message: 'problemas con el usuario' });
        }
    });
};

const erase = (req, res) => {
    var nCol = req.params.collection;
    var collection = collections[nCol];
    var id = req.params.id;

    collections.usuario.findOne({ _id: req.body.autoriza })
        .then(responsable => {
            if (responsable.logged === true) {
                collection.findByIdAndRemove(id)
                .then(d => factory.hacerRegistro(d, req.url, nCol, 'eliminando'))
                    .then(d => res.send({ message: 'Eliminado elemento' }))
                    .catch(err => res.status(500).send({ message: err.message || "No se pudo encontrar valor." }));
            } else {
                res.status(403).send({ message: 'Usuario no loggeado' });
            }
        })
        .catch(err => res.status(500).json({ message: 'nap' }));
};

const findAll = (req, res) => {
    let nCol = req.params.collection;

    var collection = collections[nCol];

    collection.find()
        .then(d => factory.hacerRegistro(d, nCol, req.url, 'obtener listado'))
        .then(d => res.send({ message: 'operacion exitosa', data: d }))
        .catch(err => res.status(500).send({ message: err.message || "No se pudo encontrar valor." }));
};

const findOne = (req, res) => {
    let nCol = req.params.collection;
    let id = req.params.id;

    var collection = collections[nCol];

    collection.findOne({ _id: id })
        .then(d => factory.hacerRegistro(d, nCol, req.url, 'obtener imp'))
        .then(d => res.send({ mesasge: 'operacion exitosa', data: d }))
        .catch(err => res.status(500).send({ message: err.message || "Something wrong while retrieving products." }));
}


/**
 * Las operaciones se separan entre las que escriben y las que solo leen.
 * Esto se hace para que mas adelante se pueda implementar el patron CQRS
 * en el cual las esrituras se ven como comandos y las lecturas como query.
 * 
 * La idea es que a posteriori se pueda separar el servicio en dos componentes,
 * los cuales pueden escalar de forma diferente pues los costos de escritura y  de
 * lectura no son iguales.
 * 
 * De esta forma se aseguraria la disponibilidad del servicio lectura así el servicio de escritura
 * este esturado. 
 */
module.exports = {
    command: {
        create: create,
        update: update,
        erase: erase
    },
    query: {
        findAll: findAll,
        findOne: findOne
    }
}
