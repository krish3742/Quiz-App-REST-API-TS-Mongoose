import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

import Style from './Login.module.css';
import './Global.css';


function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const [flag, setFlag] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState(["Testing"]);
    const success = (message) => toast.success(message);
    success(location?.state?.message);
    const notify = (message) => toast.error(message);
    function handleEmailChange(evt) { 
        setEmail(evt.target.value);
    }
    function handlePasswordChange(evt) { 
        setPassword(evt.target.value);
    }
    function handleLoginClick(evt) {
        evt.preventDefault();
        setErrors([]);
        setIsLoading(true);
        if(!email) {
            setErrors((oldArray) => {
                if(oldArray.includes("Please enter email")) {
                    return [...oldArray];
                }
                return [...oldArray, "Please enter email"]
            });
        }
        if(!password) {
            setErrors((oldArray) => { 
                if(oldArray.includes("Please enter password")) {
                    return [...oldArray];
                }
                return [...oldArray, "Please enter password"]
            })
        }
        setFlag(!flag);
    }
    function handleForgotPasswordClick(evt) {
        evt.preventDefault();
        setErrors([]);
        setIsLoading(true);
        if(!email) {
            console.log('h');
            setIsLoading(false);
            notify('Please enter email');
        } else {
            axios
                .post(`http://${process.env.REACT_APP_BACKEND_URL}/auth/forgotpassword`, {email})
                .then((response) => {
                    setIsLoading(false);
                    success('An email has been sent on your account, verify!');
                })
                .catch((error) => {
                    const message = errors?.response?.data?.message;
                    setIsLoading(false);
                    if(error?.response?.status === 500) {
                        setErrors(["Try again after some time"])
                    }
                    if(message.includes("No user exist")) {
                        setErrors(["Account not registered, please register"])
                    }
                })
        }
    }
    useEffect(() => {
        if(errors.length === 0) {
            axios
                .post(`http://${process.env.REACT_APP_BACKEND_URL}/auth/login`, { email, password })
                .then((response) => {
                    setIsLoading(false);
                    const token = response?.data?.data?.token;
                    navigate('/auth/quiz', { state: { token }});
                })
                .catch((error) => {
                    const message = error?.response?.data?.message;
                    setIsLoading(false);
                    if(error.response.status === 500) {
                        setErrors(["Try again after some time"])
                    }
                    if(message.includes("Validation failed!")) {
                        setErrors((oldArray) => {
                            if(oldArray.includes("Invalid email or password")) {
                                return [...oldArray];
                            }
                            return [...oldArray, "Invalid email or password"]
                        });
                    }
                    if(message.includes("No user exist")) {
                        setErrors((oldArray) => {
                            if(oldArray.includes("Account not registered, please register")) {
                                return [...oldArray];
                            }
                            return [...oldArray, "Account not registered, please register"]
                        });
                    }
                    if(message.includes("Credential mismatch")) {
                        const subMessage = message.charAt(29);
                        setErrors((oldArray) => {
                            if(oldArray.includes(`Incorrect password, remaining try ${subMessage}`)) {
                                return [...oldArray];
                            }
                            return [...oldArray, `Incorrect password, remaining try ${subMessage}`];
                        });
                    }
                    if(message.includes("Your Account has been deactivated check your registered email for further instructions")) {
                        setErrors((oldArray) => {
                            if(oldArray.includes(`Your Account has been deactivated check your registered email for further instructions!`)) {
                                return [...oldArray];
                            }
                            return [...oldArray, `Your Account has been deactivated check your registered email for further instructions!`];
                        });
                    }
                    if(message.includes("Your account have been blocked due to multiple attempts for 24 hours")) {
                        setErrors((oldArray) => {
                            if(oldArray.includes(`Your account have been blocked due to multiple attempts for 24 hours`)) {
                                return [...oldArray];
                            }
                            return [...oldArray, `Your account have been blocked due to multiple attempts for 24 hours`];
                        });
                    }
                    if(message.includes("Your account is deactivated")) {
                        setErrors((oldArray) => {
                            if(oldArray.includes(`Account deactivated`)) {
                                return [...oldArray];
                            }
                            return [...oldArray, `Account deactivated`];
                        });
                    }
                    if(message.includes("Your account have been blocked due to multiple attempts!")) {
                        setErrors((oldArray) => {
                            if(oldArray.includes(message)) {
                                return [...oldArray];
                            }
                            return [...oldArray, message];
                        });
                    }
                    if(message.includes("Account is not Verified. Please verify your account")) {
                        setErrors((oldArray) => {
                            if(oldArray.includes("Account is not Verified. Please verify your account")) {
                                return [...oldArray];
                            }
                            return [...oldArray, "Account is not Verified. Please verify your account"];
                        });
                    }
                    if(message.includes("Account is deactivated!")) {
                        setErrors((oldArray) => {
                            if(oldArray.includes("Account is deactivated!")) {
                                return [...oldArray];
                            }
                            return [...oldArray, "Account is deactivated!"];
                        });
                    }
                })
        } else if(errors.length > 0 && !errors.includes("Testing")){
            errors.forEach((message) => {
                notify(message);
            })
            setIsLoading(false);
        }
    }, [flag])
    return (
        <>
            <div className="navbar">
                <h2 className="app-title">Quizzard</h2>
            </div>
            <div className="hero-container">
                <div className="imgDiv">
                    <div className="img"></div>
                </div>
                <div className="content">
                    <h2 className="page-title">Login yourself!</h2>
                    <form className="form">
                        <div className='inputDiv'>
                            <label htmlFor='Email'></label>
                            <input type='text' id='Email' value={email} onChange={handleEmailChange} className="input" placeholder='Email ID'></input>
                        </div>
                        <div className='inputDiv'>
                            <label htmlFor='Password'></label>
                            <input type='password' id='Password' value={password} onChange={handlePasswordChange} className="input" placeholder='Password'></input>
                        </div>
                        <div className={Style.faDiv}>
                            <div className={Style.faInnerDiv}>
                                <div className={Style.redirect1Div}>
                                    <p className="redirectLink" onClick={handleForgotPasswordClick}>Forgot password?</p>
                                </div>
                                <div className={Style.redirect2Div}>
                                    <p className="redirectLink" onClick={() => navigate('/auth/activateaccount')}>Activate account</p>
                                </div>
                            </div>
                        </div>
                    </form>
                    <button type='submit' onClick={handleLoginClick} className="button">Login</button>
                    <div className="redirectDiv">
                        <p>Not registered? <span className='redirectLink' onClick={() => navigate('/auth/register')}>Create an account!</span></p>
                    </div>
                </div>
            </div>
            <ToastContainer />
            {isLoading && 
                <div className="loading">
                    <div className="loader"></div>
                </div>
            }
        </>
    )
};

export default Login;