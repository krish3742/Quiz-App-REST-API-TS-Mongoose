import { Link } from 'react-router-dom';
import Style from './ActivateAccount.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {AutoTabProvider} from 'react-auto-tab';

function ActivateAccount() {
    const [flag, setFlag] = useState(true);
    const [color, setColor] = useState("");
    const [errors, setErrors] = useState([]);
    const [email, setEmail] = useState("");
    const [key, setKey] = useState(1);
    const [key1, setKey1] = useState("");
    const [key2, setKey2] = useState("");
    const [key3, setKey3] = useState("");
    const [key4, setKey4] = useState("");
    const [key5, setKey5] = useState("");
    const [key6, setKey6] = useState("");
    const [key7, setKey7] = useState("");
    const [key8, setKey8] = useState("");
    function handleKey1Change(evt) {
        setKey1(evt.target.value);
    }
    function handleKey2Change(evt) {
        setKey2(evt.target.value);
    }
    function handleKey3Change(evt) {
        setKey3(evt.target.value);
    }
    function handleKey4Change(evt) {
        setKey4(evt.target.value);
    }
    function handleKey5Change(evt) {
        setKey5(evt.target.value);
    }
    function handleKey6Change(evt) {
        setKey6(evt.target.value);
    }
    function handleKey7Change(evt) {
        setKey7(evt.target.value);
    }
    function handleKey8Change(evt) {
        setKey8(evt.target.value);
    }
    function handleEmailChange(evt) {
        setEmail(evt.target.value);
    }
    function handleVerifyClick(evt) {
        evt.preventDefault();
        setErrors([]);
        setFlag(!flag);
        if(!email) {
            setErrors((oldArray) =>  [...oldArray, "Please enter email"]);
        }
        setKey(key1 + key2 + key3 + key4 + key5 + key6 + key7 + key8);  
    }
    useEffect(() => {
        if(!key) {
            setErrors((oldArray) => {
                if(oldArray.includes("Please enter key")) {
                    return [...oldArray];
                }
                return [...oldArray, "Please enter key"];
            });
        }
        if(!!key && key.length === 8 && errors.length === 0) {
            axios
                .post('http://localhost:3002/auth/activateaccount', {email, key})
                .then((response) => {
                    setErrors(["Account activated, please login"]);
                    setColor("black");
                })
                .catch((error) => {
                    const message = error?.response?.data?.message;
                    if(error.response.status === 500) {
                        setErrors(["Try again after some time"])
                    }
                    if(message.includes("Invalid Key")) {
                        setErrors(["Incorrect key"]);
                    }
                    if(message.includes("No user exist")) {
                        setErrors(["Account not registered, please register"]);
                    }
                    if(message.includes("User is already Activated")) {
                        setErrors(["Account already activated"]);
                    }
                })
        } else if(!!key && key.length < 8) {
            setErrors((oldArray) => {
                if(oldArray.includes("Please enter key")) {
                    return [...oldArray];
                }
                return [...oldArray, "Please enter key"];
            });
        }
    }, [key, flag]);
    return (
        <>
            <div className={Style.container}>
                <h2 className={Style.title}>Quiz App</h2>
                <button className={Style.LoginButton}><Link to='/auth/login' className={Style.link}>Login</Link></button>
            </div>
            <div className={Style.linear}>
                <div className={Style.body}>
                    <h2 className={Style.heading}>Activate account!</h2>
                    <div className={Style.keyPara}>
                        Enter Email
                    </div>
                    <div>
                        <label htmlFor='Email'></label>
                        <input type='text' id='Email' value={email} onChange={handleEmailChange} className={Style.inputEmail} placeholder='Email ID'></input>
                    </div>
                    <div className={Style.keyPara}>
                        Enter Key
                    </div>
                    <AutoTabProvider settings={{tabOnMax: true}}>
                        <div className={Style.inputDiv}>
                            <div>
                                <label htmlFor='Key'></label>
                                <input type='text' id='key1' maxLength={1} value={key1} onChange={handleKey1Change} className={Style.input} tabbable="true" ></input>
                            </div>
                            <div>
                                <label htmlFor='Key'></label>
                                <input type='text' id='key2' maxLength={1} value={key2} onChange={handleKey2Change} className={Style.input} tabbable="true" ></input>
                            </div>
                            <div>
                                <label htmlFor='Key'></label>
                                <input type='text' id='key3' maxLength={1} value={key3} onChange={handleKey3Change} className={Style.input} tabbable="true" ></input>
                            </div>
                            <div>
                                <label htmlFor='Key'></label>
                                <input type='text' id='key4' maxLength={1} value={key4} onChange={handleKey4Change} className={Style.input} tabbable="true" ></input>
                            </div>
                            <div>
                                <label htmlFor='Key'></label>
                                <input type='text' id='key5' maxLength={1} value={key5} onChange={handleKey5Change} className={Style.input} tabbable="true" ></input>
                            </div>
                            <div>
                                <label htmlFor='Key'></label>
                                <input type='text' id='key6' maxLength={1} value={key6} onChange={handleKey6Change} className={Style.input} tabbable="true" ></input>
                            </div>
                            <div>
                                <label htmlFor='Key'></label>
                                <input type='text' id='key7' maxLength={1} value={key7} onChange={handleKey7Change} className={Style.input} tabbable="true" ></input>
                            </div>
                            <div>
                                <label htmlFor='Key'></label>
                                <input type='text' id='key8' maxLength={1} value={key8} onChange={handleKey8Change} className={Style.input} tabbable="true" ></input>
                            </div>
                        </div>
                    </AutoTabProvider>
                    <div className={Style.paraDiv}>
                        <p className={Style.para}>Note: You will have only one chance to login after activating successfully. If you fail, your account will be blocked for 24 hours.</p>
                    </div>
                    {!!errors && errors.length > 0 && 
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
        </>
    )
};

export default ActivateAccount;