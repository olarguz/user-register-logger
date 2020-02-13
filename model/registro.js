const mongoose = require('mongoose');

const RegistroSchema = mongoose.Schema({
    apiUrl: { type: String, required: true },
    idUsuario: { type: String, required: true },
    datoGeneral: { type: String, required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Registros', RegistroSchema);