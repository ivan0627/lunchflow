const express = require('express');
const app = express();
const cors = require('cors');

// Middleware
app.use(cors());
app.use(express.json()); //req.body

// Routes

// Register and login routes

app.use("/auth", require("./routes/jwAuth"));

// Dashboard route

app.use("/dashboard", require("./routes/dashboard"));

// Responses route
app.use("/responses", require("./routes/responses"));

// Menu Creator route
app.use("/menu-creator", require("./routes/menu-creator"));

// Menus route
app.use("/menus", require("./routes/menus"));


// Order History route
app.use("/order-history", require("./routes/order-history"));

app.listen(5000, () => {
    console.log('Server is running on port 5000');
    });