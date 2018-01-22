const mongoose = require('mongoose');

// 设置 Schema
let PoemSchema = new mongoose.Schema({
  body: String,
  tags: Array
});

// Poem Model
let Poem = mongoose.model('Poem', PoemSchema);

module.exports =  Poem;
