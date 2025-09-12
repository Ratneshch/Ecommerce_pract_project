const { json } = require('body-parser');
const db= require('../db');

//Add a new product

exports.addProduct = (req,res)=>{
    const {title,description,price,category,quantity,imgSrc}=req.body;
  const query = 'INSERT INTO products (title, description, price, category, quantity, imgSrc) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query,[title,description,price,category,quantity,imgSrc],(err,result)=>{
    if(err) return res.status(500).json({message:'Database error',error:err});
    res.status(201).json({
        message:'Product added successfully',
        productID:result.insertId,
    });
  });
}

//Get all products

exports.getAllProducts =(req,res)=>{
    const query='SELECT * FROM products';
    db.query(query,(err,results)=>{
        if(err) return res.status(500).json({message:"Database error",error:err});
        res.json(results);
    });
}

// Get a product by ID

exports.getProductById=(req,res)=>{
    const {id}=req.params;
    const query ='SELECT * FROM products WHERE id = ?';
    db.query(query,[id],(err,results)=>{
        if (err) return res.status(500).json({message:'Database error',error:err});
        if(results.length===0) return res.status(404).json({message:'Product not found'});
        res.json(results[0]); 
    })
}


// Get a product by ID
exports.getProductById = (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM products WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(results[0]);
  });
};

// Update a product by ID
exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const { title, description, price, category, quantity, imgSrc } = req.body;

  const query = 'UPDATE products SET title = ?, description = ?, price = ?, category = ?, quantity = ?, imgSrc = ? WHERE id = ?';
  db.query(query, [title, description, price, category, quantity, imgSrc, id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated successfully' });
  });
};

// Delete a product by ID
exports.deleteProduct = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM products WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  });
};




