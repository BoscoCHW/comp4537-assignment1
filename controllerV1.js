const express = require("express");
const router = express.Router();
const Pokemon = require("./models/Pokemon");

const API_ENDPOINT =
  "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master";

router.get("/", (_, res) => res.sendStatus(200));

router.get("/pokemons", async (req, res) => {
  const { count, after } = req.query;
  const limit = count ? parseInt(count) : 10;
  const skip = after ? parseInt(after) : 0;
  const pokemon = await Pokemon.find({})
    .sort({ id: 1 })
    .skip(skip)
    .limit(limit)
    .exec();
  res.json(pokemon);
});

router.post("/pokemon", async (req, res) => {
  const { id, name, type, base } = req.body;
  try {
    const newPokemon = await Pokemon.create({ id, name, type, base });
    res.json({ msg: "Added Successfully", newPokemon });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ errMsg: "Pokemon already exists" });
    } else if (err.name == "ValidationError") {
      res.status(400).json({ errMsg: err.message });
    } else {
      res.status(500).json({ errMsg: err.message });
    }
  }
});

router.get("/pokemon/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (!id) {
    res
      .status(400)
      .json({ errMsg: "Cast Error: pass pokemon id between 1 and 811" });
    return;
  }

  try {
    const pokemon = await Pokemon.find({ id }).exec();
    if (pokemon.length > 0) {
      res.json(pokemon);
    } else {
      res.status(404).json({ errMsg: "Pokemon not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/pokemonImage/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const pokemon = await Pokemon.findOne({ id }).exec();
    if (pokemon) {
      res.json({ img: `${API_ENDPOINT}/images/${pokemon.id}.png` });
    } else {
      res.status(404).json({ errMsg: "Pokemon not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/pokemon/:id", async (req, res) => {
  const { id } = req.params;
  const { name, img, type, base } = req.body;
  try {
    const pokemon = await Pokemon.findOne({ id }).exec();
    if (pokemon) {
      pokemon.name = name;
      pokemon.img = img;
      pokemon.type = type;
      pokemon.base = base;
      const updatedPokemon = await pokemon.save();
      res.json({ msg: "Updated Successfully", pokeInfo: updatedPokemon });
    } else {
      res.status(404).json({ errMsg: "Pokemon not found" });
    }
  } catch (err) {
    res.status(500).json({ errMsg: err.message });
  }
});

router.patch("/pokemon/:id", async (req, res) => {
  const id = req.params.id;
  const updates = req.body;
  try {
    const updatedUnicorn = await Pokemon.findOneAndUpdate({ id }, updates, {
      new: true,
    }).exec();
    if (!updatedUnicorn) {
      res.status(404).json({ errMsg: "Pokemon not found" });
    } else {
      res
        .status(200)
        .json({ msg: "Updated Successfully", pokeInfo: updatedUnicorn });
    }
  } catch (err) {
    res.status(500).send({ errMsg: err.message });
  }
});

router.delete("/pokemon/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const pokemon = await Pokemon.findOneAndDelete({ id }).exec();
    if (pokemon) {
      res.json({ msg: "Deleted Successfully", pokeInfo: pokemon });
    } else {
      res.status(404).json({ errMsg: "Pokemon not found" });
    }
  } catch (err) {
    res.status(500).json({ errMsg: err.message });
  }
});

module.exports = router;
