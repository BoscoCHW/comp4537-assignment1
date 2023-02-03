const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const Pokemon = require("./models/Pokemon");
const router = require("./controllerV1");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

const API_ENDPOINT =
  "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master";

app.use(express.json());
app.use("/api/v1", router);

app.use("/*", (req, res) =>
  res.status(404).json({ msg: "Improper route. Check API docs plz." })
);

app.listen(port, async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_CONNECTION_STRING,
      { useNewUrlParser: true }
    );
    mongoose.connection.db.dropDatabase();
    const { data: pokemons } = await axios.get(`${API_ENDPOINT}/pokedex.json`);
    pokemons.forEach(async (pokemon) => {
      const newPoke = new Pokemon(pokemon);
      await newPoke.save();
    });
  } catch (err) {
    console.log(err);
  }

  console.log("Server is running on port " + port);
});
