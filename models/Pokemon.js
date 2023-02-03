const mongoose = require("mongoose");
const axios = require("axios");

const API_ENDPOINT =
  "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master";

const validateTypes = async (inputTypes) => {
  let { data: types } = await axios.get(`${API_ENDPOINT}/types.json`);
  types = types.map((type) => type.english);

  return inputTypes.every((type) => types.includes(type));
};

const pokemonSchema = new mongoose.Schema({
  id: { type: Number, index: true, unique: true },
  name: {
    type: {},
    validate: {
      validator: (name) => name.english.length <= 20,
      message: "English Name must be less than 21 characters.",
    },
  },
  type: {
    type: [String],
    validate: {
      validator: validateTypes,
      message: "Unkown type. Check API docs for valid types.",
    },
  },
  base: {},
});

const Pokemon = mongoose.model("pokemons", pokemonSchema);

module.exports = Pokemon;
