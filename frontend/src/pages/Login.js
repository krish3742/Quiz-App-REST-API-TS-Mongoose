import { Link } from 'react-router-dom';
import Style from './Login.module.css';
function Login() {
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
                        <input type='text' id='Email' className={Style.input} placeholder='Email ID'></input>
                    </div>
                    <div>
                        <label htmlFor='Password'></label>
                        <input type='password' id='Password' className={Style.input} placeholder='Password'></input>
                    </div>
                    <div className={Style.paraDiv}>
                        <p className={Style.para}>Forgot password?</p>
                    </div>
                    <button type='submit' className={Style.LoginButton}>Login</button>
                </div>
                <div className={Style.imgDiv}>
                    <div className={Style.img}></div>
                </div>
            </div>
        </>
    )
};

export default Login;