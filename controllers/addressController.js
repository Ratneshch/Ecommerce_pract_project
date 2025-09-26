const db=require('../db');

exports.addOrUpadteAddress = (req,res)=>{
    const {user_id,fullName,address,city,state,country,pincode,phoneNumber}= req.body;
    
if(!user_id || !fullName || !address|| !city|| !state|| !country||!pincode||!phoneNumber) {
    return res.status(400).json({message:'All fields are required'});
}

const sql =`INSERT INTO addresses (user_id,fullName,address,city,state,country,pincode,phoneNumber)
 VALUES(?, ?, ?, ?, ?, ?, ?, ?)
 ON DUPLICATE KEY UPDATE
       fullName = VALUES(fullName),
      address = VALUES(address),
      city = VALUES(city),
      state = VALUES(state),
      country = VALUES(country),
      pincode = VALUES(pincode),
      phoneNumber = VALUES(phoneNumber)
  `;

  db.query(sql, [user_id, fullName, address, city, state, country, pincode, phoneNumber], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: " Address saved successfully" });
  });
};

// Get Address by User ID
exports.getAddressByUser = (req, res) => {
  const { user_id } = req.params;

  db.query("SELECT * FROM addresses WHERE user_id = ?", [user_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: "No address found for this user" });
    res.json(result[0]);
  });
};

exports.addOrUpadteAddress = (req, res) => {
  const { user_id, fullName, address, city, state, country, pincode, phoneNumber, type } = req.body;

  if (!user_id || !fullName || !address || !city || !state || !country || !pincode || !phoneNumber) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const sql = `INSERT INTO addresses (user_id, fullName, address, city, state, country, pincode, phoneNumber, type)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      fullName = VALUES(fullName),
      address = VALUES(address),
      city = VALUES(city),
      state = VALUES(state),
      country = VALUES(country),
      pincode = VALUES(pincode),
      phoneNumber = VALUES(phoneNumber),
      type = VALUES(type)
  `;

  db.query(sql, [user_id, fullName, address, city, state, country, pincode, phoneNumber, type || 'Home'], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Address saved successfully" });
  });
};


// Delete Address by User ID
exports.deleteAddress = (req, res) => {
  const { user_id } = req.params;

  db.query("DELETE FROM addresses WHERE user_id = ?", [user_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: " Address deleted successfully" });
  });
};