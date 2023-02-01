const express = require("express");
const router = express.Router();
const Pokemon = require("./models/Pokemon");

router.get("/", (req, res) => res.sendStatus(200));

router.get("/pokemons", (req, res) => {
  const { count, after } = req.query;
  const limit = count ? parseInt(count) : 10;
  const skip = after ? parseInt(after) : 0;
  Pokemon.find({})
    .skip(skip)
    .limit(limit)
    .then((pokemons) => {
      res.json(pokemons);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
router.post("/pokemon", (req, res) => {
  const { name, img, type, base } = req.body;
  const newPokemon = new Pokemon({ name, img, type, base });
  newPokemon
    .save()
    .then((pokemon) => {
      res.json(pokemon);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
router.get("/pokemon/:id", (req, res) => {
  const { id } = req.params;
  Pokemon.findById(id)
    .then((pokemon) => {
      res.json(pokemon);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
router.get("/pokemonImage/:id", (req, res) => {
  const { id } = req.params;
  Pokemon.findById(id)
    .then((pokemon) => {
      res.json(pokemon.img);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
}); // - get a pokemon Image URL
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
      res.status(404).json({ message: "Pokemon not found" });
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
    res.status(400).send(err);
  }
});

router.delete("/pokemon/:id", async (req, res) => {
  const { id } = req.params;
  const pokemon = await Pokemon.findByIdAndDelete(id).exec();
  if (pokemon) {
    res.json(pokemon);
  } else {
    res.status(404).json({ message: "Pokemon not found" });
  }
});

module.exports = router;
