require('dotenv').config();
const express = require('express');
const app = express();

const dbConfig = require("./models/db");
const oracledb = require("oracledb");

app.use(express.json());

app.get('/api/users/',(req,res)=>{
    res.json({
        name: 'Patil',
        price: 100,
    })
});

app.post('/api/users/',async (req,res)=>{
     const {name,email,passwordHash,phone,gender} = req.body;
      try {
        const conn = await oracledb.getConnection(dbConfig);
        await conn.execute(
            `INSERT INTO ServiceUser (Name, Email, PasswordHash, Phone, Gender)
             VALUES (:name, :email, :passwordHash, :phone,  :gender)`,
            { name, email, passwordHash, phone, gender },
            { autoCommit: true }
        );
        res.status(201).send("Inserted successfully");
      } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
      }
});

app.get('/',(req,res)=>{
    res.json({Hello:"Yoyo"});
})

app.listen(process.env.PORT,()=>{
    console.log("Listening on port 4000");
});