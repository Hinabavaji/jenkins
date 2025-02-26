import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Login_URL } from '@/utilities/api';
import { toast, ToastContainer } from 'react-toastify';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye,faEyeSlash  } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';
const eye = <FontAwesomeIcon icon={faEye} />;

const Login = ({ onLogin }) => {
    const [email, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordShown, setPasswordShown] = useState(false);
    const router = useRouter();

    const notify = (message, type) => {
        switch (type) {
            case 'success':
                toast.success(message);
                break;
            case 'error':
                toast.error(message);
                break;
            case 'info':
                toast.info(message);
                break;
            case 'warn':
                toast.warn(message);
                break;
            default:
                toast(message);
                break;
        }
    };

    const handleApiError = (error, navigate) => {
        if (error.response && error.response.status === 401) {
            console.warn("Unauthorized access. Redirecting to login...");
            router.push('/login'); 
          } else if (error.message === 'Network Error' || error.response?.status >= 500 || error.message.includes('ERR_CONNECTION_TIMED_OUT')) {
            console.error("Server is down or unreachable.");
            notify('Server is down or unreachable', 'error');
          } else {
            console.error("API Error:", error.message);
            notify('Server is down or unreachable', 'error');
          }
        };
        

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (isFormEmpty()) {
            setError('Please fill in all fields.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(Login_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (response.status === 200) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                notify('Login Successful', 'success');
                setTimeout(() => {
                    router.push('/dashboard');
                }, 1000);
            } else {
                notify('Invalid username or password', 'error');
            }
        } 
        catch (error) {
            setError(error.message);
            handleApiError(error); 
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = () => {
        router.push('/signup');
    };

    const isFormEmpty = () => {
        return email.trim() === '' || password.trim() === '';
    };

    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
      };

    return (
        // <div className="login-page">
        //     <ToastContainer autoClose={2000} />
        //     <div className="login-container">
        //         {isLoading && (
        //             <div
        //                 style={{
        //                     position: 'absolute',
        //                     top: '54%',
        //                     left: '50%',
        //                     transform: 'translate(-50%, -50%)',
        //                     zIndex: 1,
        //                 }}
        //             >
        //                 <div className="spinner-border color: 'rgb(2, 69, 139)'" role="status">
        //                     <span className="sr-only">Loading...</span>
        //                 </div>
        //             </div>
        //         )}
        //         <form onSubmit={handleSubmit}>
        //             <div className="text-center mb-4">
        //                 <img src="/eog.jpg" alt="Logo" style={{ maxWidth: '200px' }} />
        //             </div>
        //             <h2 style={{color:'#000000'}}>Welcome to NMS</h2>
        //             <h5 style={{color:'#CCCCCC',textAlign:'center'}}>Enter your username and password
        //             to continue.</h5>
        //             <div>
        //                 <label>Email:</label>
        //                 <input
        //                     className="login-input"
        //                     type="text"
        //                     value={email}
        //                     onChange={(e) => setUsername(e.target.value)}
        //                 />
        //             </div>
        //             <div>
        //                 <label>Password:</label>
        //                 <input
        //                     className="login-input"
        //                     type={passwordShown ? "text" : "password"}
        //                     value={password}
        //                     onChange={(e) => setPassword(e.target.value)}
        //                 />
        //                 <i
        //                     onClick={togglePasswordVisiblity}
        //                     style={{
        //                         position: 'relative',
        //                         top: '-39px',
        //                         right: '-335px',
        //                         transform: 'translateY(-50%)',
        //                         cursor: 'pointer',
        //                         fontSize: '1.2rem'
        //                     }}
        //                 >
        //                     {eye}
        //                 </i>
        //             </div>
        //             <button type="submit" disabled={isFormEmpty()} className="login-button" >
        //                 Sign In
        //             </button>
        //             {error && <p className="error-text">{error}</p>}
        //         </form>
        //     </div>
        // </div>
        <div className="container d-flex justify-content-center align-items-center vh-100">
        <ToastContainer autoClose={2000} />
        <div className="col-md-6 col-lg-4 p-4 shadow rounded bg-white">
            <div className="text-center mb-4">
                <img src="/eog.jpg" alt="Logo" className="img-fluid" style={{ maxWidth: '300px' }} />
            </div>
            <h2 className="text-center text-dark">Welcome to NMS</h2>
            <p className=" mb-4 text-center text-secondary">Enter your username and password to continue.</p>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Email:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={email}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="mb-5">
                    <label className="form-label">Password:</label>
                    <div className="input-group">
                        <input
                            type={passwordShown ? "text" : "password"}
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            className="btn"
                            type="button"
                            style={{borderColor:'#CCCCCC',borderLeftColor:'#ffffff'}}
                            onClick={() => setPasswordShown(!passwordShown)}
                        >
                            <FontAwesomeIcon icon={passwordShown ? faEyeSlash : faEye} />
                        </button>
                    </div>
                </div>

                {error && <p className="text-danger">{error}</p>}

                <button type="submit" className="btn  w-100"  style={{ backgroundColor: '#FF1100', color: '#fff' }} disabled={!email || !password}>
                    {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
            </form>
        </div>
    </div>
    );
};
export default Login;