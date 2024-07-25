import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import Style from './ChangePassword.module.css';

function Register() {
    let flag = 1;
    const navigate = useNavigate();
    const location = useLocation();
    const [color, setColor] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [errors, setErrors] = useState(["Testing"]);
    const token = location?.state?.token;
    const headers = {'Authorization': `Bearer ${token}`};
    function handleCurrentPasswordChange(evt) {
        setCurrentPassword(evt.target.value);
    }
    function handleNewPasswordChange(evt) {
        setNewPassword(evt.target.value);
    }
    function handleConfirmPasswordChange(evt) {
        setConfirmPassword(evt.target.value);
    }
    function handleQuizAppClick(evt) {
        evt.preventDefault();
        navigate('/auth/quiz', { state: { token }});
    }
    function handleLogoutClick(evt) {
        setIsLoading(true);
        axios
            .post('http://localhost:3002/user/logout', {}, { headers })
            .then((response) => {
                setIsLoading(false);
                navigate('/auth/login');
            })
            .catch((error) => {
                setIsLoading(false);
                navigate('/auth/register');
            })
    }
    function handleMyAccountClick(evt) {
        navigate('/auth/user/my-account', { state: { token }});
    }
    function handleVerifyClick(evt) {
        evt.preventDefault();
        setIsLoading(true);
        setErrors([]);
        flag = 1;
        if(!currentPassword) {
            setErrors((oldArray) => {
                return [...oldArray, "Please enter current password"];
            });
        }
        if(!newPassword) {
            setErrors((oldArray) => {
                return [...oldArray, "Please enter new password"];
            });
        } else {
            if(
                newPassword.indexOf('!') === -1 &&
                newPassword.indexOf("@") === -1 &&
                newPassword.indexOf("#") === -1 &&
                newPassword.indexOf("$") === -1 &&
                newPassword.indexOf("*") === -1
            ) {
                flag = 0;
            }
            if(!flag) {
                setErrors((oldArray) => {
                    return [...oldArray, "Enter the valid new password"]
                })
            }
            for(let index = 0; index < newPassword.length; index++) {
                if(newPassword.charAt(index) >= 'a' && newPassword.charAt(index) <= 'z') {
                    flag = 1;
                    break;
                }
            }
            if(!flag) {
                setErrors((oldArray) => {
                    return [...oldArray, "Enter the valid new password"]
                })
            }
            for(let index = 0; index < newPassword.length; index++) {
                if(newPassword.charAt(index) >= 'A' && newPassword.charAt(index) <= 'Z') {
                    flag = 1;
                    break;
                }
            }
            if(!flag) {
                setErrors((oldArray) => {
                    return [...oldArray, "Enter the valid new password"]
                })
            }
            for(let index = 0; index < newPassword.length; index++) {
                if(newPassword.charAt(index) >= '0' && newPassword.charAt(index) <= '9') {
                    flag = 1;
                    break;
                }
            }
            if(!flag) {
                setErrors((oldArray) => {
                    return [...oldArray, "Enter the valid new password"]
                })
            }
        }
        if(confirmPassword !== newPassword) {
            setErrors((oldArray) => {
                return [...oldArray, "Confirm password mismatch"]
            });
        }
    }
    useEffect(() => {
        if(errors.length === 0) {
            axios
                .put("http://localhost:3002/user/changepassword", {currentPassword, newPassword, confirmPassword}, { headers })
                .then((response) => {
                    setIsLoading(false);
                    setErrors(["Password successfully changed, redirecting..."]);
                    setColor("black");
                    setTimeout(() => {
                        navigate('/auth/user/my-account', { state: { token }});
                    }, 1000);
                })
                .catch((error) => {
                    setIsLoading(false);
                    const message = error?.response?.data?.message;
                    if(error?.response?.status === 500) {
                        setErrors(["Try again after some time"])
                    }
                    if(message.includes("Current Password is incorrect. Please try again.")) {
                        setErrors((oldArray) => {
                            if(oldArray.includes("Current password is incorrect")) {
                                return [...oldArray];
                            }
                            return [...oldArray, "Current password is incorrect"];
                        });
                    }
                    if(message.includes("Same as current password. Try another one")) {
                        setErrors((oldArray) => {
                            if(oldArray.includes("New password is same as current password")) {
                                return [...oldArray];
                            }
                            return [...oldArray, "New password is same as current password"];
                        });
                    }
                })
        } else {
            setIsLoading(false);
        }
    },[errors])
    if(!token) {
        return <Navigate to='/auth/login' />
    }
    return (
        <>
            <div className={Style.container}>
                <h2 className={Style.title} onClick={handleQuizAppClick}>Quiz App</h2>
                <div className={Style.profile} onMouseEnter={() => {setIsProfileOpen(true)}} onMouseLeave={() => {setIsProfileOpen(false)}}></div>
                    {isProfileOpen &&
                        <div className={Style.myAccountDiv} onMouseEnter={() => setIsProfileOpen(true)} onMouseLeave={() => {setIsProfileOpen(false)}}>
                            <p className={Style.options} onClick={handleMyAccountClick}>My Account</p>
                            <p className={Style.options} onClick={handleLogoutClick}> Logout</p>
                        </div>
                    }            </div>
            <div className={Style.linear}>
                <div className={Style.body}>
                    <h2 className={Style.heading}>Change password!</h2>
                    <div>
                        <label htmlFor='currentPassowrd'></label>
                        <input type='password' id='currentPassword' value={currentPassword} className={Style.input} onChange={handleCurrentPasswordChange} placeholder='Current password'></input>
                    </div>
                    <div>
                        <label htmlFor='newPassword'></label>
                        <input type='password' id='newPassword' value={newPassword} className={Style.input} onChange={handleNewPasswordChange} placeholder='New password'></input>
                    </div>
                    <div>
                        <label htmlFor='Confirm_Password'></label>
                        <input type='text' id='Confirm_Password' value={confirmPassword} className={Style.input} onChange={handleConfirmPasswordChange} placeholder='Confirm Password'></input>
                    </div>
                    <div className={Style.paraDiv}>
                        <p className={Style.para}>Note: Password must be 8 characters long, including 1 upper case alphabet, 1 lower case alphabet, and 1 special character.</p>
                    </div>
                    {errors.length > 0 && !errors.includes("Testing") && 
                        <div className={Style.instructionParaDiv}>
                            <ul>
                                {errors.map(message =>  {
                                    return <li key={message} className={!!color ? Style.black : Style.red}>{message}</li>
                                })}
                            </ul>
                        </div>
                    }
                    <button type='submit' className={Style.RegisterButton} onClick={handleVerifyClick}>Verify</button>
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

export default Register;