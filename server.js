// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = 4000;

// MongoDB setup
mongoose.connect("mongodb://localhost:27017/inventoryapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("MongoDB connected successfully");
});

// Define a schema for User
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  pass: {
    type: String,
    required: true,
  },
});

// Create a User model using the schema
const User = mongoose.model("userlogs", userSchema); // collections

app.use(bodyParser.json());

// API endpoint to save user logs
app.post("/inventoryapp/userlogs", async (req, res) => {
  const { name, pass } = req.body;

  const newUser = new User({ name, pass });

  try {
    await newUser.save();
    res.status(201).json({ message: "User saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error saving user" });
  }
});

app.get("/inventoryapp/userlogs", async (req, res) => {
  try {
    const Users = await User.find();
    res.status(200).json(Users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

const inventoryItemSchema = new mongoose.Schema({
  // ITEM LIST INVENTORY SCHEMA
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
});
const InventoryItem = mongoose.model("itemlist", inventoryItemSchema);

app.use(bodyParser.json());
app.post("/inventoryapp/itemlist", async (req, res) => {
  const { name, quantity, price, desc } = req.body;

  const newInventoryItem = new InventoryItem({ name, quantity, price, desc });

  try {
    await newInventoryItem.save();
    res.status(201).json({ message: "Inventory item saved successfully" });
  } catch (error) {
    console.error("Error saving inventory item:", error);
    res.status(500).json({ message: "Error saving inventory item" });
  }
});

// API endpoint to update an inventory item
app.put("/inventoryapp/itemlist/:itemName", async (req, res) => {
  const { itemName } = req.params;
  const { name, quantity, price, desc } = req.body;

  try {
    await InventoryItem.updateOne(
      { name: itemName },
      { name, quantity, price, desc }
    );
    res.status(200).json({ message: "Inventory item updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating inventory item" });
  }
});

// API endpoint to delete an inventory item
app.delete("/inventoryapp/itemlist/:itemName", async (req, res) => {
  const { itemName } = req.params;

  try {
    await InventoryItem.deleteOne({ name: itemName });
    res.status(200).json({ message: "Inventory item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting inventory item" });
  }
});

app.get("/inventoryapp/itemlist", async (req, res) => {
  try {
    let inventoryItemSchema = [];
    if (req?.query?.name)
      inventoryItemSchema.push(
        await InventoryItem.find({
          name: req.query.name,
        })
      );
    inventoryItemSchema.push(await InventoryItem.find());
    res.status(200).json(inventoryItemSchema[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching inventory items" });
  }
});

app.get("/inventoryapp/itemlist/:param", async (req, res) => {
  const { param } = req.params;

  try {
    if (mongoose.Types.ObjectId.isValid(param)) {
      // Search by ID
      const existingItem = await InventoryItem.findOne({ _id: param });
      if (existingItem) {
        const { id, name, quantity, price, desc } = existingItem;
        res.status(200).json({ id, name, quantity, price, desc });
      } else {
        res.status(200).json({ exists: false });
      }
    } else {
      // Search by name
      const existingItems = await InventoryItem.findOne({ name: param });
      console.log(existingItems);
      if (existingItems) {
        res.status(200).json(existingItems);
      } else {
        res.status(200).json({ exists: false });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error checking item existence" });
  }
});

// app.get("/inventoryapp/itemlist", async (req, res) => {
//   // Search
//   console.log(req.query);
//   // const { id, name, action } = req;

//   // console.log(query);
//   // console.log(req.params);
//   try {
//     const existingItem = await InventoryItem.findOne({ _id: id }); // ID Saerch
//     if (existingItem) {
//       const { id, name, quantity, price, desc } = existingItem;

//       res.status(200).json({ id, name, quantity, price, desc });
//     } else {
//       res.status(200).json({ exists: false });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Error checking item existence" });
//   }
// });

// app.get("/inventoryapp/itemlist/:itemName", async (req, res) => {
//   // Search
//   const { itemName } = req.params;
//   console.log(req.params);
//   try {
//     const existingItem = await InventoryItem.findOne({ name: itemName }); // ID Saerch
//     if (existingItem) {
//       res.status(200).json({ exists: true });
//     } else {
//       res.status(200).json({ exists: false });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Error checking item existence" });
//   }
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
