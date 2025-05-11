import React, { useState } from 'react';
import './white.css';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import Firebase auth function
import { auth } from '../../firebase/firebase'; // Import initialized Firebase auth instance
import { useNavigate } from 'react-router-dom';

function AdminAuth({ onLoginSuccess }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Loading state

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(''); // Clear previous errors
        setIsLoading(true); // Start loading

        try {
            // Authenticate using Firebase email/password authentication
            await signInWithEmailAndPassword(auth, email, password);
            console.log('Login successful!');
            onLoginSuccess(); // Update isAuthenticated in App.js
            navigate('/inactive'); // Navigate to InActive page after successful login
        } catch (error) {
            // Handle Firebase authentication errors
            const errorCode = error.code;
            switch (errorCode) {
                case 'auth/invalid-email':
                    setError('Invalid email format.');
                    break;
                case 'auth/user-not-found':
                    setError('No user found with this email.');
                    break;
                case 'auth/wrong-password':
                    setError('Incorrect password.');
                    break;
                default:
                    setError('An unexpected error occurred. Please try again.');
            }
            console.error("Error logging in:", error.message);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <div className='login-container'>
            <div className='login-box'>
                <h1 className='login-title'>Admin Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className='input-group'>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='login-input'
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className='input-group'>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='login-input'
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    {error && <div className='error-message'>{error}</div>}
                    <button type="submit" className='login-button' disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminAuth;
