import { Link } from 'react-router-dom';
import Style from './VerifyRegisteredUser.module.css';

function VerifyRegisteredUser() {
    return (
        <>
            <div className={Style.container}>
                <h2 className={Style.title}>Quiz App</h2>
                <button className={Style.LoginButton}><Link to='/login' className={Style.link}>Login</Link></button>
            </div>
            <div className={Style.linear}>
                <div className={Style.body}>
                    <h2 className={Style.heading}>Register yourself!</h2>
                    <div className={Style.otpPara}>
                        Enter OTP
                    </div>
                    <div className={Style.inputDiv}>
                        <div>
                            <label htmlFor='OTP'></label>
                            <input type='text' id='otp1' className={Style.input}></input>
                        </div>
                        <div>
                            <label htmlFor='OTP'></label>
                            <input type='text' id='otp2' className={Style.input}></input>
                        </div>
                        <div>
                            <label htmlFor='OTP'></label>
                            <input type='text' id='otp3' className={Style.input}></input>
                        </div>
                        <div>
                            <label htmlFor='OTP'></label>
                            <input type='text' id='otp4' className={Style.input}></input>
                        </div>
                        <div>
                            <label htmlFor='OTP'></label>
                            <input type='text' id='otp5' className={Style.input}></input>
                        </div>
                        <div>
                            <label htmlFor='OTP'></label>
                            <input type='text' id='otp6' className={Style.input}></input>
                        </div>
                    </div>
                    <div className={Style.paraDiv}>
                        <p className={Style.para}>Note: An OTP has been sent on your email. Please verify.</p>
                    </div>
                    <button type='submit' className={Style.RegisterButton}>Verify</button>
                </div>
                <div className={Style.imgDiv}>
                    <div className={Style.img}></div>
                </div>
            </div>
        </>
    )
};

export default VerifyRegisteredUser;