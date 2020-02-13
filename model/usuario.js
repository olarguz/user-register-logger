const mongoose = require('mongoose');

const UsuarioSchema = mongoose.Schema({
    username: { type: String, required: true },
    name: { type: String, required: true },
    pass: { type: String, required: true },
    logged: { type: Boolean, require: true, default: false },
    active: { type: Boolean, required: true, default: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Usuarios', UsuarioSchema);