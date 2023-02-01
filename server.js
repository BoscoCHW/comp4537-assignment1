const express = require("express");
const https = require("https");
const mongoose = require("mongoose");
const Pokemon = require("./models/Pokemon");
const router = require("./controllerV1");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/v1", router);

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

  const url =
    "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json";
  https.get(url, (res) => {
    let chunks = "";
    res.on("data", (chunk) => (chunks += chunk));
    res.on("end", () => {
      const pokemons = JSON.parse(chunks);
      pokemons.forEach(async (pokemon) => {
        const newPoke = new Pokemon({...pokemon, _id: pokemon.id});
        await newPoke.save();
      });
    });
  });

  console.log("Server is running on port " + port);
});
