import { Link } from 'react-router-dom';
import Style from './Home.module.css';
function Home() {
    return (
        <>
            <div className={Style.container}>
                <h2 className={Style.title}>Quiz App</h2>
                <button className={Style.LoginButton}><Link to='/login' className={Style.link}>Login</Link></button>
            </div>
            <div className={Style.linear}>
                <div className={Style.body}>
                    <h2 className={Style.heading}>Register yourself!</h2>
                    <div>
                        <label htmlFor='Name'></label>
                        <input type='text' id='Name' className={Style.input} placeholder='Name'></input>
                    </div>
                    <div>
                        <label htmlFor='Email'></label>
                        <input type='text' id='Email' className={Style.input} placeholder='Email ID'></input>
                    </div>
                    <div>
                        <label htmlFor='Password'></label>
                        <input type='password' id='Password' className={Style.input} placeholder='Password'></input>
                    </div>
                    <div>
                        <label htmlFor='Confirm_Password'></label>
                        <input type='password' id='Confirm_Password' className={Style.input} placeholder='Confirm Password'></input>
                    </div>
                    <div className={Style.paraDiv}>
                        <p className={Style.para}>Note: Password must be 8 characters long, including 1 upper case alphabet, 1 lower case alphabet, and 1 special character.</p>
                    </div>
                    <button type='submit' className={Style.RegisterButton}>Register</button>
                </div>
                <div className={Style.imgDiv}>
                    <div className={Style.img}></div>
                </div>
            </div>
        </>
    )
};

export default Home;