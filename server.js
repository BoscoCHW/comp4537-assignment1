const express = require("express");
const https = require("https");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://bcit:bosco-bcit@cluster0.u8zqn.mongodb.net/?retryWrites=true&w=majority"
    );
    mongoose.connection.db.dropDatabase();
  } catch (err) {
    console.log(err);
  }

  const url =
    "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json";
  https.get(url, (res) => {
    let chunks = "";
    res.on("data", (chunk) => (chunks += chunk));
    res.on("end", () => {
      const pokemons = JSON.parse(chunks);
      const pokeSchema = new mongoose.Schema({
        id: Number,
        name: {},
        img: String,
        type: [String],
        base: {
          hp: Number,
          attack: Number,
          defense: Number,
          "special-attack": Number,
          "special-defense": Number,
          speed: Number,
        },
      });
      const pokeModel = mongoose.model("Pokemon", pokeSchema);
      pokemons.forEach(async (pokemon) => {
        const newPoke = new pokeModel(pokemon);
        await newPoke.save();
      });
    });
  });

  console.log("Server is running on port " + port);
});
