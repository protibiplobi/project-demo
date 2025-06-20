const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const oracledb = require("oracledb");
const { executeQuery } = require("../db");

const SECRET = "your_jwt_secret"; // Use .env in production

// Register new user
async function register(req, res) {
  const { name, email, password, phone, dob, gender, role, storeName, storeDescription } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into ServiceUser
    const insertUser = `
  INSERT INTO ServiceUser (Name, Email, PasswordHash, Phone, DateOfBirth, Gender)
  VALUES (:name, :email, :passwordHash, :phone, TO_DATE(:dob, 'YYYY-MM-DD'), :gender)
  RETURNING UserID INTO :userId
`;

  const binds = {
    name,
    email,
    passwordHash: hashedPassword,
    phone,
    dob,
    gender,
    userId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
  };

  const userResult = await executeQuery(insertUser, binds);
  const userId = userResult.outBinds.userId[0];

    if (role === "seller") {
      await executeQuery(
        `INSERT INTO Seller (SellerID, StoreName, StoreDescription) VALUES (:id, :storeName, :storeDesc)`,
        { id: userId, storeName, storeDesc: storeDescription }
      );
    } else if (role === "buyer") {
      await executeQuery(`INSERT INTO Customer (CustomerID) VALUES (:id)`, { id: userId });
    }

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
}

// Login
async function login(req, res) {
  const { email, password } = req.body;

  try {
    const userResult = await executeQuery(
      `SELECT * FROM ServiceUser WHERE Email = :email`,
      { email }
    );

    const user = userResult.rows[0];
    if (!user) return res.status(401).json({ error: "Invalid email" });

    const isMatch = await bcrypt.compare(password, user[3]);
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    const userId = user[0];

    let role = "unknown";
    const sellerCheck = await executeQuery(`SELECT * FROM Seller WHERE SellerID = :id`, { id: userId });
    if (sellerCheck.rows.length > 0) role = "seller";

    const buyerCheck = await executeQuery(`SELECT * FROM Customer WHERE CustomerID = :id`, { id: userId });
    if (buyerCheck.rows.length > 0) role = "buyer";

    const token = jwt.sign({ userId, role }, SECRET, { expiresIn: "2h" });
    res.json({ token, role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
}

module.exports = { register, login };
