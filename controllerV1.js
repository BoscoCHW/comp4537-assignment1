const express = require("express");
const router = express.Router();
const Pokemon = require("./models/Pokemon");

router.get("/", (req, res) => res.sendStatus(200));

router.get("/pokemons", async (req, res) => {
  const { count, after } = req.query;
  const limit = count ? parseInt(count) : 10;
  const skip = after ? parseInt(after) : 0;
  const pokemon = await Pokemon.find({})
    .sort({ _id: 1 })
    .skip(skip)
    .limit(limit)
    .exec();
  res.json(pokemon);
});

router.post("/pokemon", async (req, res) => {
  const { id, name, img, type, base } = req.body;
  try {
    const newPokemon = await Pokemon.create({ _id: id, name, img, type, base });
    res.json({msg: "Added Successfully", newPokemon});
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ errMsg: "Pokemon already exists" });
    } else {
      res.status(500).json(err);
    }
  }
});

function parseId(id) {
  try {
    const intId = parseInt(id);
    if (!intId || intId < 1 || intId > 811) {
      throw new Error();
    }
    return intId;
  } catch (err) {
    throw new Error("Cast Error: pass pokemon id between 1 and 811");
  }
}

router.get("/pokemon/:id", async (req, res) => {
  let id;
  try {
    id = parseId(req.params.id);
  } catch (err) {
    res.status(400).json({ errMsg: err.message });
    return;
  }
  try {
    const pokemon = await Pokemon.findById(id).exec();
    if (pokemon) {
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
    const pokemon = await Pokemon.findById(parseInt(id)).exec();
    if (pokemon) {
      res.json(pokemon.img);
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
    const pokemon = await Pokemon.findById(id);
    if (pokemon) {
      pokemon.name = name;
      pokemon.img = img;
      pokemon.type = type;
      pokemon.base = base;
      const updatedPokemon = await pokemon.save();
      res.json(updatedPokemon);
    } else {
      res.status(404).json({ errMsg: "Pokemon not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.patch("/pokemon/:id", async (req, res) => {
  const id = req.params.id;
  const updates = req.body;
  try {
    const updatedUnicorn = await Unicorn.findByIdAndUpdate(id, updates, {
      new: true,
    }).exec();
    res.status(200).json(updatedUnicorn);
  } catch (err) {
    res.status(400).send({errMsg: err.message});
  }
});

router.delete("/pokemon/:id", async (req, res) => {
  const { id } = req.params;
  const pokemon = await Pokemon.findByIdAndDelete(id).exec();
  if (pokemon) {
    res.json(pokemon);
  } else {
    res.status(404).json({ errMsg: "Pokemon not found" });
  }
});

module.exports = router;
