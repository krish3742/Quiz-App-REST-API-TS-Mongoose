import { Link } from 'react-router-dom';
import Style from './Login.module.css';
import { useState } from 'react';
function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const [flag, setFlag] = useState(true);
    function handleEmailChange(evt) { 
        setEmail(evt.target.value);
    }
    function handlePasswordChange(evt) { 
        setPassword(evt.target.value);
    }
    function handleLoginClick(evt) {
        evt.preventDefault();
        setErrors([]);
        if(!email) {
            setErrors((oldArray) => [...oldArray, "Please enter email"]);
        }
        if(!password) {
            setErrors((oldArray) => [...oldArray, "Please enter password"]);
        }
    }
    return (
        <>
            <div className={Style.container}>
                <h2 className={Style.title}>Quiz App</h2>
                <button className={Style.RegisterButton}><Link to='/' className={Style.link}>Register</Link></button>
            </div>
            <div className={Style.linear}>
                <div className={Style.body}>
                    <h2 className={Style.heading}>Login yourself!</h2>
                    <div>
                        <label htmlFor='Email'></label>
                        <input type='text' id='Email' value={email} onChange={handleEmailChange} className={Style.input} placeholder='Email ID'></input>
                    </div>
                    <div>
                        <label htmlFor='Password'></label>
                        <input type='password' id='Password' value={password} onChange={handlePasswordChange} className={Style.input} placeholder='Password'></input>
                    </div>
                    <div className={Style.paraDiv}>
                        <p className={Style.para}>Forgot password?</p>
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
                    <button type='submit' onClick={handleLoginClick} className={Style.LoginButton}>Login</button>
                </div>
                <div className={Style.imgDiv}>
                    <div className={Style.img}></div>
                </div>
            </div>
        </>
    )
};

export default Login;