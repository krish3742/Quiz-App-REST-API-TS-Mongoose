import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import Style from './ActivateUser.module.css';

function ActivateUser() {
    const [flag, setFlag] = useState(true);
    const [email, setEmail] = useState("");
    const [color, setColor] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState(["testing"]);
    function handleEmailChange(evt) { 
        setEmail(evt.target.value);
    }
    function handleActivateClick(evt) {
        evt.preventDefault();
        setErrors([]);
        setIsLoading(true);
        setFlag(!flag);
        setColor("");
        if(!email) {
            setErrors((oldArray) => {
                if(oldArray.includes("Please enter email")) {
                    return [...oldArray];
                }
                return [...oldArray, "Please enter email"]
            });
        }
    }
    useEffect(() => {
        if(errors.length === 0) {
            axios
                .post('http://localhost:3002/auth/activate', { email })
                .then((response) => {
                    setIsLoading(false);
                    setErrors(["A mail has been sent on your mail"]);
                    setColor("black");
                })
                .catch((error) => {
                    setIsLoading(false);
                    const message = error?.response?.data?.message;
                    if(error?.response?.status === 500) {
                        setErrors(["Try again after some time"])
                    }
                    if(message.includes("No user exist")) {
                        setErrors(["User not registered, please register"]);
                    }
                    if(message.includes("User is already activated!")) {
                        setErrors(["Account already activated"]);
                    }
                })
        } else {
            setIsLoading(false);
        }
    }, [flag])
    return (
        <>
            <div className={Style.container}>
                <h2 className={Style.title}>Quiz App</h2>
                <button className={Style.RegisterButton}><Link to='/auth/login' className={Style.link}>Login</Link></button>
            </div>
            <div className={Style.linear}>
                <div className={Style.body}>
                    <h2 className={Style.heading}>Activate User!</h2>
                    <div className={Style.keyPara}>
                        Email
                    </div>
                    <div>
                        <label htmlFor='Email'></label>
                        <input type='text' id='Email' value={email} onChange={handleEmailChange} className={Style.input} placeholder='Email ID'></input>
                    </div>
                    {errors.length > 0 && !errors.includes("testing") &&
                        <div className={Style.instructionParaDiv}>
                            <ul>
                                {errors.map(message =>  {
                                    return <li className={!!color ? Style.black : Style.red} key={message}>{message}</li>
                                })}
                            </ul>
                        </div>
                    }
                    <button type='submit' onClick={handleActivateClick} className={Style.LoginButton}>Activate</button>
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

export default ActivateUser;