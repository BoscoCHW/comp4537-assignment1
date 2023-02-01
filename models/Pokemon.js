const mongoose = require("mongoose");

const pokemonSchema = new mongoose.Schema({
  _id: Number,
  name: {},
  img: String,
  type: [String],
  base: {},
}, { _id: false });

const Pokemon = mongoose.model("pokemons", pokemonSchema);

module.exports = Pokemon;
