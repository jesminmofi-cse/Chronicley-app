import React, {useState} from "react";
import axios from 'axios';
import './Auth.css';
import {useNavigate} from "react-router-dom";
const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const handleChange = (e)=>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit=async(e)=>{
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try{
            await axios.post('http://localhost:5000/api/auth/register','https://chronicley-app.onrender.com/api/auth/register', formData);
            navigate('/');
        }catch(err) {
            setError(err.response?.data?.message || "Registration failed");
    }
};
return(
    <div className="auth-container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
            <input name='name' placeholder ='Name' value={formData.name} onChange={handleChange} required />
            <input name='email' placeholder="Email" type="email" value={formData.email} onChange={handleChange} required />
            <input name='password' placeholder="Password" type="password" value={formData.password} onChange={handleChange} required />
            <input name='confirmPassword' placeholder="Confirm Password" type="password" value={formData.confirmPassword} onChange={handleChange} required />
            {error && <p className="error">{error}</p>}
            <button type="submit">Register</button>
        </form> 
        <p>Already have an account? <span onClick={()=> navigate('/')}>Login</span></p>
    </div>
);
};
export default RegisterPage;
