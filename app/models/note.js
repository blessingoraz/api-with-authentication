const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
    create_by: { type: Schema.Types.ObjectId, ref: 'User'},
    note: { type: String }
});

const note = mongoose.model('Note', noteSchema);
module.exports = note;
