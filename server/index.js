const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const userRoutes = require('./src/routes/user_routes');
const productRoutes = require('./src/routes/product_routes');

require('dotenv').config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("API CRUD");
});
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});