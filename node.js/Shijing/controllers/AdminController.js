const Poem = require('../models/Poem');

module.exports = function (app) {
  app.get('/admin', function (req, res) {
    res.redirect('/admin/poems');
  });

  app.get('/admin/poems', function (req, res) {
    Poem.find({}, function (err, data) {
      if (err) throw err;

      res.render('admin/poems/index', { poems: data });
    });
  });

  app.post('/admin/poems', function (req, res) {
    let data = req.body;
    let poem = new Poem({
      body: data.body,
      tags: data.tags.split(' ')
    });

    poem.save(function (err) {
      if (err) throw err;
      res.render('succ', { action: 'added' });
    });
  });

  app.get('/admin/poems/create', function (req, res) {
    res.render('admin/poems/create');
  });

  app.get('/admin/poems/:id/edit', function (req, res) {
    // use findOne
    Poem.findOne({ '_id': req.params.id }, function (err, data) {
      if (err) throw err;
      res.render('admin/poems/edit', { poem: data });
    });
  });

  app.post('/admin/poems/:id/edit', function (req, res) {
    let data = req.body;
    Poem.update({ _id: req.params.id }, { body: data.body, tags: data.tags.split(' ') }, function (err) {
      if (err) throw err;
      res.render('succ', { action: 'updated' });
    });
  });

  app.post('/admin/poems/:id/remove', function (req, res) {
    Poem.remove({ '_id': req.params.id }, function (err, data) {
      if (err) throw err;
      res.render('succ', { action: 'deleted' });
    });
  });
};
