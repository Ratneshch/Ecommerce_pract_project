const express =require('express');
const db= require('./db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productsRoutes')
const cartRoutes = require('./routes/cartRoutes')
const addressRoutes = require('./routes/addressRoutes')
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require("./routes/paymentRoute");

const cors =require ('cors');

const app= express();

app.use(express.json());

app.use(cors({
    origin:true,
    methods:['GET','PUT','POST','DELETE'],
    credentials:true
}))

const PORT = 3000;

app.get("/",(req,res)=>{
    res.send("Api is running");
})

//Users
app.use('/api/user', userRoutes);
//Products
app.use('/api/products', productRoutes);

//Cart
app.use('/api/cart', cartRoutes);

//Address
app.use("/api/address", addressRoutes);

//Orders
app.use("/api/orders", orderRoutes);

//Payment
app.use("/api/payment", paymentRoutes);

app.listen(PORT,()=>{
    console.log(`Server is ruinning on ${PORT}`);
    
});