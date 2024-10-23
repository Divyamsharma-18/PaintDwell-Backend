const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const main = async () => {
  mongoose
    .connect(
      "mongodb+srv://divyamsharmaworks:xscgnVA9bS593yTC@cluster0.rtp0y.mongodb.net/PaintDwell?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(() => {
      console.log("Connected to MongoDB");
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    })
    .catch((err) => console.log("Error connecting to MongoDB:", err));
};

const orderSchema = new mongoose.Schema({
  name: String,
  address: String,
  city: String,
  zip: String,
  phone: String,
  cartItems: Array,
  totalPrice: Number,
});

const Order = mongoose.model("Order", orderSchema);

app.post("/api/orders", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to place order", error });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
});

app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

app.patch("/api/orders/:id/complete", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).send("Order not found");

    order.status = "completed";
    await order.save();

    res.send(order);
  } catch (error) {
    res.status(500).send("Error completing order: " + error.message);
  }
});

app.patch("/api/orders/:id/cancel", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).send("Order not found");

    order.status = "cancelled";
    await order.save();

    res.send(order);
  } catch (error) {
    res.status(500).send("Error cancelling order: " + error.message);
  }
});

app.delete("/api/orders/delete", async (req, res) => {
  try {
    const { name, phone } = req.body;

    const deletedOrder = await Order.findOneAndDelete({
      name: name,
      phone: phone,
    });

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Failed to delete order" });
  }
});

main();
