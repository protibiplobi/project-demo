import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    dob: '',
    gender: '',
    role: 'buyer',
    storeName: '',
    storeDescription: ''
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/register', formData);
      alert(res.data.message);
    } catch (err) {
      alert('Registration failed');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="email" placeholder="Email" type="email" onChange={handleChange} required />
        <input name="password" placeholder="Password" type="password" onChange={handleChange} required />
        <input name="phone" placeholder="Phone" onChange={handleChange} required />
        <input name="dob" placeholder="Date of Birth (YYYY-MM-DD)" onChange={handleChange} required />
        <select name="gender" onChange={handleChange}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <select name="role" onChange={handleChange}>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>

        {formData.role === 'seller' && (
          <>
            <input name="storeName" placeholder="Store Name" onChange={handleChange} required />
            <input name="storeDescription" placeholder="Store Description" onChange={handleChange} required />
          </>
        )}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
