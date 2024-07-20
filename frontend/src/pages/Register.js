import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Style from './Register.module.css';

function Register() {
    let flag = 1;
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState(["Testing"]);
    function handleNameChange(evt) {
        setName(evt.target.value);
    }
    function handleEmailChange(evt) {
        setEmail(evt.target.value);
    }
    function handlePasswordChange(evt) {
        setPassword(evt.target.value);
    }
    function handleConfirmPasswordChange(evt) {
        setConfirmPassword(evt.target.value);
    }
    function handleRegisterClick(evt) {
        evt.preventDefault();
        setErrors([]);
        flag = 1;
        if(name.length < 5) {
            setErrors((oldArray) => {
                return [...oldArray, "Name must be 5 characters long"]
            });
        }
        if(!email) {
            setErrors((oldArray) => {
                return [...oldArray, "Please enter Email"]
            });
        }
        if(!password) {
            setErrors((oldArray) => {
                return [...oldArray, "Please enter password"]
            });
        } else {
            if(
                password.indexOf('!') === -1 &&
                password.indexOf("@") === -1 &&
                password.indexOf("#") === -1 &&
                password.indexOf("$") === -1 &&
                password.indexOf("*") === -1
            ) {
                flag = 0;
            }
            if(!flag) {
                setErrors((oldArray) => {
                    return [...oldArray, "Enter the valid password"]
                })
            }
            for(let index = 0; index < password.length; index++) {
                if(password.charAt(index) >= 'a' && password.charAt(index) <= 'z') {
                    flag = 1;
                    break;
                }
            }
            if(!flag) {
                setErrors((oldArray) => {
                    return [...oldArray, "Enter the valid password"]
                })
            }
            for(let index = 0; index < password.length; index++) {
                if(password.charAt(index) >= 'A' && password.charAt(index) <= 'Z') {
                    flag = 1;
                    break;
                }
            }
            if(!flag) {
                setErrors((oldArray) => {
                    return [...oldArray, "Enter the valid password"]
                })
            }
            for(let index = 0; index < password.length; index++) {
                if(password.charAt(index) >= '0' && password.charAt(index) <= '9') {
                    flag = 1;
                    break;
                }
            }
            if(!flag) {
                setErrors((oldArray) => {
                    return [...oldArray, "Enter the valid password"]
                })
            }
        }
        if(confirmPassword !== password) {
            setErrors((oldArray) => {
                return [...oldArray, "Confirm password mismatch"]
            });
        }
    }
    const data = {
        name, 
        email,
        password,
        confirmPassword
    };
    useEffect(() => {
        if(errors.length === 0) {
            axios
                .post("http://localhost:3002/auth", data)
                .then((response) => {
                    if(response.data.message === "OTP has sent on your email. Please Verify") {
                        navigate('/auth/verify-account', { state: { token: response.data.data.token }});
                    }
                })
                .catch((error) => {
                    const message = error.response.data.message;
                    if(message.includes("Validation failed!")) {
                        setErrors((oldArray) => {
                            if(oldArray.includes("Account already registered, login")) {
                                return [...oldArray];
                            }
                            return [...oldArray, "Account already registered, login"];
                        });
                    }
                })
        }
    },[errors])
    return (
        <>
            <div className={Style.container}>
                <h2 className={Style.title}>Quiz App</h2>
                <button className={Style.LoginButton}><Link to='/auth/login' className={Style.link}>Login</Link></button>
            </div>
            <div className={Style.linear}>
                <div className={Style.body}>
                    <h2 className={Style.heading}>Register yourself!</h2>
                    <div>
                        <label htmlFor='Name'></label>
                        <input type='text' id='Name' value={name} className={Style.input} onChange={handleNameChange} placeholder='Name'></input>
                    </div>
                    <div>
                        <label htmlFor='Email'></label>
                        <input type='text' id='Email' value={email} className={Style.input} onChange={handleEmailChange} placeholder='Email ID'></input>
                    </div>
                    <div>
                        <label htmlFor='Password'></label>
                        <input type='password' id='Password' value={password} className={Style.input} onChange={handlePasswordChange} placeholder='Password'></input>
                    </div>
                    <div>
                        <label htmlFor='Confirm_Password'></label>
                        <input type='password' id='Confirm_Password' value={confirmPassword} className={Style.input} onChange={handleConfirmPasswordChange} placeholder='Confirm Password'></input>
                    </div>
                    <div className={Style.paraDiv}>
                        <p className={Style.para}>Note: Password must be 8 characters long, including 1 upper case alphabet, 1 lower case alphabet, and 1 special character.</p>
                    </div>
                    {errors.length > 0 && !errors.includes("Testing") && 
                        <div className={Style.instructionParaDiv}>
                            <ul>
                                {errors.map(message =>  {
                                    return <li key={message}>{message}</li>
                                })}
                            </ul>
                        </div>
                    }
                    <button type='submit' className={Style.RegisterButton} onClick={handleRegisterClick}>Register</button>
                </div>
                <div className={Style.imgDiv}>
                    <div className={Style.img}></div>
                </div>
            </div>
        </>
    )
};

export default Register;