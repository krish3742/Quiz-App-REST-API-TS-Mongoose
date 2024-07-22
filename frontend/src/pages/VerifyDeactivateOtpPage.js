import { Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Style from './VerifyDeactivateOtpPage.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { AutoTabProvider } from 'react-auto-tab';

function VerifyDeactivateOtpPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const token = location?.state?.token;
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [flag, setFlag] = useState(true);
    const [color, setColor] = useState("");
    const [errors, setErrors] = useState([]);
    const [otp, setOtp] = useState();
    const [otp1, setOtp1] = useState("");
    const [otp2, setOtp2] = useState("");
    const [otp3, setOtp3] = useState("");
    const [otp4, setOtp4] = useState("");
    const [otp5, setOtp5] = useState("");
    const [otp6, setOtp6] = useState("");
    const headers = {'Authorization': `Bearer ${token}`};
    function handleOtp1Change(evt) {
        setOtp1(evt.target.value);
    }
    function handleOtp2Change(evt) {
        setOtp2(evt.target.value);
    }
    function handleOtp3Change(evt) {
        setOtp3(evt.target.value);
    }
    function handleOtp4Change(evt) {
        setOtp4(evt.target.value);
    }
    function handleOtp5Change(evt) {
        setOtp5(evt.target.value);
    }
    function handleOtp6Change(evt) {
        setOtp6(evt.target.value);
    }
    function handleVerifyClick(evt) {
        evt.preventDefault();
        setErrors([]);
        setColor("");
        setIsLoading(true);
        if(!otp1 || otp1 === undefined) {
            setErrors((oldArray) =>  {
                if(oldArray.includes("Please enter OTP")) {
                    return [...oldArray];
                }
                return [...oldArray, "Please enter OTP"];
            });
        }
        if(!otp2 || otp2 === undefined) {
            setErrors((oldArray) =>  {
                if(oldArray.includes("Please enter OTP")) {
                    return [...oldArray];
                }
                return [...oldArray, "Please enter OTP"];
            });
        }
        if(!otp3 || otp3 === undefined) {
            setErrors((oldArray) =>  {
                if(oldArray.includes("Please enter OTP")) {
                    return [...oldArray];
                }
                return [...oldArray, "Please enter OTP"];
            });
        }
        if(!otp4 || otp4 === undefined) {
            setErrors((oldArray) =>  {
                if(oldArray.includes("Please enter OTP")) {
                    return [...oldArray];
                }
                return [...oldArray, "Please enter OTP"];
            });
        }
        if(!otp5 || otp5 === undefined) {
            setErrors((oldArray) =>  {
                if(oldArray.includes("Please enter OTP")) {
                    return [...oldArray];
                }
                return [...oldArray, "Please enter OTP"];
            });
        }
        if(!otp6 || otp6 === undefined) {
            setErrors((oldArray) =>  {
                if(oldArray.includes("Please enter OTP")) {
                    return [...oldArray];
                }
                return [...oldArray, "Please enter OTP"];
            });
        }
        setOtp(otp1 + otp2 + otp3 + otp4 + otp5 + otp6);
        setFlag(!flag);
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
    useEffect(() => {
        if(!errors.includes("Please enter OTP")) {
            const otpToNumber = parseInt(otp);
            if(otpToNumber) {
                axios
                    .post(`http://localhost:3002/user/deactivate/verify-deactivate-account-otp`, { otp }, { headers })
                    .then((response) => {
                        setIsLoading(false);
                        setErrors((oldArray) => {
                            if(oldArray.includes("Account deactivated, redirecting...")) {
                                return [...oldArray];
                            }
                            return [...oldArray, "Account deactivated, redirecting..."];
                        });
                        setColor("black");
                        setTimeout(() => {
                            navigate('/auth/login');
                        }, 1000)
                    })
                    .catch((error) => {
                        const message = error?.response?.data?.message;
                        setIsLoading(false);
                        if(error?.response?.status === 500) {
                            setErrors(["Try again after some time"])
                        }
                        if(message.includes("Incorrect OTP")) {
                            setErrors((oldArray) => {
                                if(oldArray.includes("Incorrect OTP")) {
                                    return [...oldArray];
                                }
                                return [...oldArray, "Incorrect OTP"];
                            });
                        }
                        if(message.includes("OTP has not send on this email ")) {
                            setErrors((oldArray) => {
                                if(oldArray.includes("OTP expired, redirecting...")) {
                                    return [...oldArray];
                                }
                                return [...oldArray, "OTP expired, redirecting..."];
                            });
                            setTimeout(() => {
                                navigate('/auth/user/my-account', { state: { token }});
                            }, 1000)
                        }
                    })
            } else if(!isNaN(otpToNumber)){
                setErrors((oldArray) =>  {
                    if(oldArray.includes("Please enter OTP")) {
                        return [...oldArray];
                    }
                    return [...oldArray, "Please enter OTP"];
                });
            }
        } else {
            setIsLoading(false);
        }
    }, [otp, flag]);
    if(!token) {
        return <Navigate to='/auth/login' /> ; 
    }
    return (
        <>
            <div className={Style.container}>
                <h2 className={Style.title}>Quiz App</h2>
                <div className={Style.profile} onMouseEnter={() => {setIsProfileOpen(true)}} onMouseLeave={() => {setIsProfileOpen(false)}}></div>
                    {isProfileOpen &&
                        <div className={Style.myAccountDiv} onMouseEnter={() => setIsProfileOpen(true)} onMouseLeave={() => {setIsProfileOpen(false)}}>
                            <p className={Style.options} onClick={handleMyAccountClick}>My Account</p>
                            <p className={Style.options} onClick={handleLogoutClick}> Logout</p>
                        </div>
                    }
            </div>
            <div className={Style.linear}>
                <div className={Style.body}>
                    <h2 className={Style.heading}>Deactivate account!</h2>
                    <div className={Style.otpPara}>
                        Enter OTP
                    </div>
                    <AutoTabProvider settings={{tabOnMax: true}}>
                        <div className={Style.inputDiv}>
                            <div>
                                <label htmlFor='OTP'></label>
                                <input type='text' id='otp1' value={otp1} maxLength={1} onChange={handleOtp1Change} className={Style.input} tabbable="true" ></input>
                            </div>
                            <div>
                                <label htmlFor='OTP'></label>
                                <input type='text' id='otp2' value={otp2} maxLength={1} onChange={handleOtp2Change} className={Style.input} tabbable="true" ></input>
                            </div>
                            <div>
                                <label htmlFor='OTP'></label>
                                <input type='text' id='otp3' value={otp3} maxLength={1} onChange={handleOtp3Change} className={Style.input} tabbable="true" ></input>
                            </div>
                            <div>
                                <label htmlFor='OTP'></label>
                                <input type='text' id='otp4' value={otp4} maxLength={1} onChange={handleOtp4Change} className={Style.input} tabbable="true" ></input>
                            </div>
                            <div>
                                <label htmlFor='OTP'></label>
                                <input type='text' id='otp5' value={otp5} maxLength={1} onChange={handleOtp5Change} className={Style.input} tabbable="true" ></input>
                            </div>
                            <div>
                                <label htmlFor='OTP'></label>
                                <input type='text' id='otp6' value={otp6} maxLength={1} onChange={handleOtp6Change} className={Style.input} tabbable="true" ></input>
                            </div>
                        </div>
                    </AutoTabProvider>
                    <div className={Style.paraDiv}>
                        <p className={Style.para}>Note: An OTP has been sent on your email. Please verify.</p>
                    </div>
                    {errors.length > 0 && 
                        <div className={Style.instructionParaDiv}>
                            <ul>
                                {errors.map(message =>  {
                                    return <li className={!!color ? Style.black : Style.red} key={message}>{message}</li>
                                })}
                            </ul>
                        </div>
                    }
                    <button type='submit' onClick={handleVerifyClick} className={Style.RegisterButton}>Verify</button>
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

export default VerifyDeactivateOtpPage;