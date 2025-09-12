const express =require('express');
const db= require('./db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productsRoutes')
const app= express();

app.use(express.json());

const PORT = 3000;

app.get("/",(req,res)=>{
    res.send("Api is running");
})

//Users
app.use('/api/user', userRoutes);
//Products
app.use('/api/products', productRoutes);

app.listen(PORT,()=>{
    console.log(`Server is ruinning on ${PORT}`);
    
});