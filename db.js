const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ecommercedb',
    port: 4306, 
});

db.connect((err)=>{
    if(err){
        console.error("Database connection failed",err);
        return;
        
    }
    console.log("Connected to db");
    
})

module.exports=db;