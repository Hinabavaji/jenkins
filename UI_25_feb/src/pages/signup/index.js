import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { SIGNUP_URL } from '@/utilities/api';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from '@fortawesome/free-solid-svg-icons';
const eye = <FontAwesomeIcon icon={faEye} />;

const Signup = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordShown, setPasswordShown] = useState(false);
    const router = useRouter();
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isFormEmpty()) {
            alert('Please fill in all fields');
            return;
        }
        const data = {
            username: username,
            email: email,
            password: password,
            country_code: '+91',
            contact_number: '9999999999',
            company_name: 'Utthunga',
            department: '',
            designation: '',
            reference: '',
        };

        try {
            const response = await fetch(SIGNUP_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to sign up');
            }

            const responseData = await response.json();
            console.log('New User Data:', responseData);
            router.push('/login');
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to sign up. Please try again later.');
        }
    };

    const isFormEmpty = () => {
        return email.trim() === '' || username.trim() === '' || password.trim() === '';
    };

    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
      };

    const handleLogin = () => {
        router.push('/login');
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
                <form onSubmit={handleSubmit}>
                    <div className="text-center mb-4">
                        <img src="/eog_resources.png" alt="Logo" style={{ maxWidth: '150px' }} />
                    </div>
                    <h2>Sign Up</h2>
                    <div>
                        <label>Email:</label>
                        <input
                            className="signup-input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Username:</label>
                        <input
                            className="signup-input"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            className="signup-input"
                            type={passwordShown ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                paddingRight: '40px', 
                                boxSizing: 'border-box', 
                            }}
                        />
                        <i
                            onClick={togglePasswordVisiblity}
                            style={{
                                position: 'relative',
                                top: '-39px',
                                right: '-335px',
                                transform: 'translateY(-50%)',
                                cursor: 'pointer',
                                fontSize: '1.2rem'
                            }}
                        >
                            {eye}
                        </i>
                    </div>
                    <button type="submit" disabled={isFormEmpty()} className="signup-button">
                        Submit
                    </button>
                    <p className="login-link">
                        Already have an account?{' '}
                        <a href="#" onClick={handleLogin}>
                            Login 
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;