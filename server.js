const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const Pokemon = require("./models/Pokemon");
const router = require("./controllerV1");

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
      "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000",
      { useNewUrlParser: true }
    );
    mongoose.connection.db.dropDatabase();
  } catch (err) {
    console.log(err);
  }

  const { data: pokemons } = await axios.get(`${API_ENDPOINT}/pokedex.json`);
  pokemons.forEach(async (pokemon) => {
    const newPoke = new Pokemon(pokemon);
    await newPoke.save();
  });

  console.log("Server is running on port " + port);
});
