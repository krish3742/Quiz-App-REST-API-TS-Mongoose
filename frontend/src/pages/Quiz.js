import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Style from './Quiz.module.css';
import { useState } from 'react';
import axios from 'axios';

function Quiz() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const token = location?.state?.token;
    const headers = {'Authorization': `Bearer ${token}`};
    function handleLogoutClick(evt) {
        axios
            .post('http://localhost:3002/user/logout', {}, { headers })
            .then((response) => {
                navigate('/auth/login');
            })
            .catch((error) => {
                navigate('/auth/login');
            })
    }
    if(!token) {
        return <Navigate to='/auth/login' />
    }
    return (
        <>
            <div className={Style.container}>
                <h2 className={Style.title}>Quiz App</h2>
                <div className={Style.menuDiv}>
                    <h4 className={Style.menu}>Quizzes</h4>
                    <h4 className={Style.menu}>Reports</h4>
                    <h4 className={Style.menu}>My Quiz</h4>
                </div>
                <div className={Style.profile} onMouseEnter={() => {setIsProfileOpen(true)}} onMouseLeave={() => {setIsProfileOpen(false)}}></div>
                {isProfileOpen &&
                    <div className={Style.myAccountDiv} onMouseEnter={() => setIsProfileOpen(true)} onMouseLeave={() => {setIsProfileOpen(false)}}>
                        <p className={Style.options}>My Account</p>
                        <p onClick={handleLogoutClick} className={Style.options}> Logout</p>
                    </div>
                }
            </div>
            <div className={Style.linear}>
                <div className={Style.quizDiv}>
                    <h2 className={Style.heading}>Create Quiz</h2>
                    <span className={Style.para}>Create you own customized quiz.</span>
                    <button className={Style.button}>Create Quiz</button>
                </div>
                <div className={Style.quizDiv}>
                    <h2 className={Style.heading}>Publish Quiz</h2>
                    <span className={Style.para}>Users can attempt only published quizzes.</span>
                    <button className={Style.button}>Publish Quiz</button>
                </div>
            </div>
        </>
    )
}

export default Quiz;