import Style from './ResetPassword.module.css';
import { Link } from 'react-router-dom';
function ResetPassword() {
    return (
        <>
            <div className={Style.container}>
                <h2 className={Style.title}>Quiz App</h2>
                <button className={Style.LoginButton}><Link to='/login' className={Style.link}>Login</Link></button>
            </div>
            <div className={Style.linear}>
                <div className={Style.body}>
                    <h2 className={Style.heading}>Reset your password!</h2>
                    <div>
                        <label htmlFor='Password'></label>
                        <input type='password' id='Password' className={Style.input} placeholder='Password'></input>
                    </div>
                    <div>
                        <label htmlFor='ConfirmPassword'></label>
                        <input type='text' id='ConfirmPassword' className={Style.input} placeholder='Confirm Password'></input>
                    </div>
                    <div className={Style.paraDiv}>
                        <p className={Style.para}>Note: Password must be 8 characters long, including 1 upper case alphabet, 1 lower case alphabet, and 1 special character.</p>
                    </div>
                    <button type='submit' className={Style.VerifyButton}>Verify</button>
                </div>
                <div className={Style.imgDiv}>
                    <div className={Style.img}></div>
                </div>
            </div>
        </>
    )
};

export default ResetPassword;