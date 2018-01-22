const Poem = require('../models/Poem');

module.exports = function (app) {

  // Get all poems.
  app.get('/', function (req, res) {
    res.redirect('/poems');
  });

  app.get('/poems', function (req, res) {
    Poem.find({}, function (err, data) {
      if (err) throw err;

      let poems = [];

      // chunk data.
      for (let i = 0, j = data.length, chunk = 2; i < j; i += chunk) {
          poems.push(data.slice(i , i + chunk));
      }

      res.render('home', { poems });
    });
  });
};
