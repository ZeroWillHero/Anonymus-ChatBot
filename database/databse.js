const mongoose = require('mongoose');
require('dotenv').config();

try {
    const conn = mongoose.connect(process.env.MONGO_URI);
    if(conn){
        console.log("Database Connected");
    }
       
}catch(error){
    console.log("Database Connection  Error : ", error);
}