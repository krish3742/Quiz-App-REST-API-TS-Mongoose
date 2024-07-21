import { useEffect, useState } from 'react';
import Style from './ResetPassword.module.css';
import { Link, useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';
function ResetPassword() {
    let passwordCheck = 1;
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const userId = location?.state?.userId;
    const [color, setColor] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState(["Testing"]);
    const [flag, setFlag] = useState(true);
    function handlePasswordChange(evt) {
        setPassword(evt.target.value);
    }
    function handleConfirmPasswordChange(evt) {
        setConfirmPassword(evt.target.value);
    }
    function handleVerifyClick(evt) {
        evt.preventDefault();
        setErrors([]);
        setIsLoading(true);
        setColor("");
        passwordCheck = 1;
        if(!password) {
            setErrors((oldArray) => [...oldArray, "Please enter password"]);
        } else {
            if(
                password.indexOf('!') === -1 &&
                password.indexOf("@") === -1 &&
                password.indexOf("#") === -1 &&
                password.indexOf("$") === -1 &&
                password.indexOf("*") === -1
            ) {
                passwordCheck = 0;
            }
            if(!passwordCheck) {
                setErrors((oldArray) => {
                    return [...oldArray, "Enter the valid password"]
                })
            }
            for(let index = 0; index < password.length; index++) {
                if(password.charAt(index) >= 'a' && password.charAt(index) <= 'z') {
                    passwordCheck = 1;
                    break;
                }
            }
            if(!passwordCheck) {
                setErrors((oldArray) => {
                    return [...oldArray, "Enter the valid password"]
                })
            }
            for(let index = 0; index < password.length; index++) {
                if(password.charAt(index) >= 'A' && password.charAt(index) <= 'Z') {
                    passwordCheck = 1;
                    break;
                }
            }
            if(!passwordCheck) {
                setErrors((oldArray) => {
                    return [...oldArray, "Enter the valid password"]
                })
            }
            for(let index = 0; index < password.length; index++) {
                if(password.charAt(index) >= '0' && password.charAt(index) <= '9') {
                    passwordCheck = 1;
                    break;
                }
            }
            if(!passwordCheck) {
                setErrors((oldArray) => {
                    return [...oldArray, "Enter the valid password"]
                })
            }
        }
        if(!confirmPassword) {
            setErrors((oldArray) => [...oldArray, "Please enter confirm password"]); 
        }
        if(password !== confirmPassword) {
            setErrors((oldArray) => [...oldArray, "Confirm password mismatch"]);
        }
        setFlag(!flag);
    }
    useEffect(() => {
        if(!!errors && errors.length === 0) {
            axios
                .post(`http://localhost:3002/auth/forgotpassword/${userId}`, { password, confirmPassword})
                .then((response) => {
                    setIsLoading(false);
                    setErrors(["Password successfully reset"]);
                    setColor("black");
                })
                .catch((error) => {
                    setIsLoading(false);
                    if(error.response.status === 500) {
                        setErrors(["Try again after some time"])
                    }
                })
        } else {
            setIsLoading(false);
        }
    }, [flag]);
    if(!userId) {
        return <Navigate to='/auth/login' />;
    }
    return (
        <>
            <div className={Style.container}>
                <h2 className={Style.title}>Quiz App</h2>
                <button className={Style.LoginButton}><Link to='/auth/login' className={Style.link}>Login</Link></button>
            </div>
            <div className={Style.linear}>
                <div className={Style.body}>
                    <h2 className={Style.heading}>Reset your password!</h2>
                    <div>
                        <label htmlFor='Password'></label>
                        <input type='password' id='Password' value={password} onChange={handlePasswordChange} className={Style.input} placeholder='Password'></input>
                    </div>
                    <div>
                        <label htmlFor='ConfirmPassword'></label>
                        <input type='text' id='ConfirmPassword' value={confirmPassword} onChange={handleConfirmPasswordChange} className={Style.input} placeholder='Confirm Password'></input>
                    </div>
                    <div className={Style.paraDiv}>
                        <p className={Style.para}>Note: Password must be 8 characters long, including 1 upper case alphabet, 1 lower case alphabet, and 1 special character.</p>
                    </div>
                    {!!errors && errors.length > 0 && !errors.includes("Testing") &&
                        <div className={Style.instructionParaDiv}>
                            <ul>
                                {errors.map(message =>  {
                                    return <li className={!!color ? Style.black : Style.red} key={message}>{message}</li>
                                })}
                            </ul>
                        </div>
                    }
                    <button type='submit' onClick={handleVerifyClick} className={Style.VerifyButton}>Verify</button>
                </div>
                <div className={Style.imgDiv}>
                    <div className={Style.img}></div>
                </div>
            </div>
            {isLoading && 
                <div className={Style.loading}>
                    <div className={Style.loader}></div>
                </div>
            }
        </>
    )
};

export default ResetPassword;