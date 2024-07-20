import { Link, useLocation } from 'react-router-dom';
import Style from './VerifyRegisteredUser.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { AutoTabProvider } from 'react-auto-tab';

function VerifyRegisteredUser() {
    const location = useLocation();
    const state = location.state;
    const [flag, setFlag] = useState(true);
    const [errors, setErrors] = useState([]);
    const [otp, setOtp] = useState();
    const [otp1, setOtp1] = useState("");
    const [otp2, setOtp2] = useState("");
    const [otp3, setOtp3] = useState("");
    const [otp4, setOtp4] = useState("");
    const [otp5, setOtp5] = useState("");
    const [otp6, setOtp6] = useState("");
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
    function handleResendClick(evt) {
        evt.preventDefault();
        setErrors([]);
        const token = state.token;
        axios
            .get(`http://localhost:3002/auth/resend-registration-otp/${token}`)
            .then((response) => {})
            .catch((error) => {
                const message = error.response.data.message;
                if(message.includes("Resend OTP")) {
                    setErrors([message]);
                }
                if(message.includes("Already Verified your Account")) {
                    setErrors((oldArray) => {
                        if(oldArray.includes("Account already registered, login")) {
                            return [...oldArray];
                        }
                        return [...oldArray, "Account already registered, login"];
                    });
                }
            })
    }
    function handleVerifyClick(evt) {
        evt.preventDefault();
        setErrors([]);
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
    useEffect(() => {
        if(!errors.includes("Please enter OTP")) {
            const otpToNumber = parseInt(otp);
            if(otpToNumber) {
                const token = state.token;
                axios
                    .post(`http://localhost:3002/auth/verify-registration-otp/${token}`, { otp })
                    .then((response) => {
                        setErrors((oldArray) => {
                            if(oldArray.includes("Account registered, please login")) {
                                return [...oldArray];
                            }
                            return [...oldArray, "Account registered, please login"];
                        });
                    })
                    .catch((error) => {
                        const message = error.response.data.message;
                        if(message.includes("OTP has not send on this email or Invalid OTP")) {
                            setErrors((oldArray) => {
                                if(oldArray.includes("OTP expired, please resend")) {
                                    return [...oldArray];
                                }
                                return [...oldArray, "OTP expired, please resend"];
                            });
                        }
                        if(message.includes("Incorrect OTP")) {
                            setErrors((oldArray) => {
                                if(oldArray.includes("Incorrect OTP")) {
                                    return [...oldArray];
                                }
                                return [...oldArray, "Incorrect OTP"];
                            });
                        }
                        if(message.includes("User already exist")) {
                            setErrors((oldArray) => {
                                if(oldArray.includes("Account already registered, login")) {
                                    return [...oldArray];
                                }
                                return [...oldArray, "Account already registered, login"];
                            });
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
        }
    }, [otp, flag]);
    if(state === null) {
        return (
            <div className={Style.helloDiv}>
                <h2>You are not authorized!</h2>
            </div>
        )
    }
    return (
        <>
            <div className={Style.container}>
                <h2 className={Style.title}>Quiz App</h2>
                <button className={Style.LoginButton}><Link to='/auth/login' className={Style.link}>Login</Link></button>
            </div>
            <div className={Style.linear}>
                <div className={Style.body}>
                    <h2 className={Style.heading}>Register yourself!</h2>
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
                    <div className={Style.resendDiv}>
                        <p className={Style.resend} onClick={handleResendClick}>Resend</p>
                    </div>
                    <div className={Style.paraDiv}>
                        <p className={Style.para}>Note: An OTP has been sent on your email. Please verify.</p>
                    </div>
                    {errors.length > 0 && 
                        <div className={Style.instructionParaDiv}>
                            <ul>
                                {errors.map(message =>  {
                                    return <li key={message}>{message}</li>
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
        </>
    )
};

export default VerifyRegisteredUser;