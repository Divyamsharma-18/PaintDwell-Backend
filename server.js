const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('your_mongodb_connection_string', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Order model
const orderSchema = new mongoose.Schema({
    name: String,
    address: String,
    city: String,
    zip: String,
    phone: String,
    cartItems: Array,
    totalPrice: Number,
  });
  
  const Order = mongoose.model('Order', orderSchema);
  
  // POST endpoint to save order
  app.post('/api/orders', async (req, res) => {
    try {
      const order = new Order(req.body);
      await order.save();
      res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error) {
      res.status(500).json({ message: 'Failed to place order', error });
    }
  });
  
  // GET endpoint to fetch all orders for admin panel
  app.get('/api/orders', async (req, res) => {
    try {
      const orders = await Order.find();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch orders', error });
    }
  });
  
  // Root route to handle '/'
  app.get('/', (req, res) => {
    res.send('Backend server is running!');
  });


  



  // Complete order
app.patch('/api/orders/:id/complete', async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).send('Order not found');
  
      order.status = 'completed'; // Update the order status
      await order.save();
      
      res.send(order); // Send back the updated order
    } catch (error) {
      res.status(500).send('Error completing order: ' + error.message);
    }
  });
  
  // Cancel order
  app.patch('/api/orders/:id/cancel', async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).send('Order not found');
  
      order.status = 'cancelled'; // Update the order status
      await order.save();
      
      res.send(order); // Send back the updated order
    } catch (error) {
      res.status(500).send('Error cancelling order: ' + error.message);
    }
  });
  
  

  //Delete
  app.delete('/api/orders/delete', async (req, res) => {
    try {
      const { name, phone } = req.body;
  
      const deletedOrder = await Order.findOneAndDelete({ name: name, phone: phone });
  
      if (!deletedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
      console.error('Error deleting order:', error);
      res.status(500).json({ message: 'Failed to delete order' });
    }
  });
  

  
  
  
  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
