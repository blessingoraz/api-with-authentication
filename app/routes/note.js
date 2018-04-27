const note = require('../controllers/note');
const VerifyToken = require('../auth/VerifyToken');

module.exports = (app) => {
    app.post('/api/user/:userId/note', VerifyToken, note.create);

    app.get('/api/user/:userId/notes', VerifyToken, note.findAll);

    app.put('/api/user/:userId/notes/:noteId', VerifyToken, note.update);

    app.delete('/api/nuser/:userId/notes/:noteId', VerifyToken, note.delete);
};

