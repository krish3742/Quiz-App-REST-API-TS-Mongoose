import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

import Style from './Quiz.module.css';

function Quiz() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isMyQuizOpen, setIsMyQuizOpen] = useState(false);
    const [isReportsOpen, setIsReportsOpen] = useState(false);
    const [isQuizzesOpen, setIsQuizzesOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const token = location?.state?.token;
    const headers = {'Authorization': `Bearer ${token}`};
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
    function handleCreateQuizClick(evt) {
        evt.preventDefault();
        navigate('/auth/quiz/create', { state: { token }});
    }
    function handleQuizAppClick(evt) {
        evt.preventDefault();
        navigate('/auth/quiz', { state: { token }});
    }
    function handlePublishQuizClick(evt) {
        evt.preventDefault();
        navigate('/auth/quiz/publish', {state: {token}});
    }
    function handleMyQuizClick(evt) {
        evt.preventDefault();
        navigate('/auth/quiz/myquiz', { state: { token }});
    }
    function handleReportsClick(evt) {
        evt.preventDefault();
        navigate('/auth/reports', { state: { token }});
    }
    function handleQuizzesClick(evt) {
        evt.preventDefault();
        navigate('/auth/published-quiz', { state: { token }});
    }
    if(!token) {
        return <Navigate to='/auth/login' />
    }
    return (
        <>
            <div className={Style.container}>
                <h2 className={Style.title} onClick={handleQuizAppClick}>Quiz App</h2>
                <div className={Style.menuDiv}>
                    <h4 className={Style.menu} onMouseEnter={() => {setIsQuizzesOpen(true)}} onMouseLeave={() => {setIsQuizzesOpen(false)}} onClick={handleQuizzesClick}>Quizzes</h4>
                    {isQuizzesOpen &&
                        <div className={Style.quizzesDiv}></div>
                    }
                    <h4 className={Style.menu} onMouseEnter={() => {setIsReportsOpen(true)}} onMouseLeave={() => {setIsReportsOpen(false)}} onClick={handleReportsClick}>Reports</h4>
                    {isReportsOpen &&
                        <div className={Style.reportsDiv}></div>
                    }
                    <h4 className={Style.menu} onMouseEnter={() => {setIsMyQuizOpen(true)}} onMouseLeave={() => {setIsMyQuizOpen(false)}} onClick={handleMyQuizClick}>My Quiz</h4>
                    {isMyQuizOpen &&
                        <div className={Style.myQuizDiv}></div>
                    }
                </div>
                <div className={Style.profile} onMouseEnter={() => {setIsProfileOpen(true)}} onMouseLeave={() => {setIsProfileOpen(false)}}></div>
                {isProfileOpen &&
                    <div className={Style.myAccountDiv} onMouseEnter={() => setIsProfileOpen(true)} onMouseLeave={() => {setIsProfileOpen(false)}}>
                        <p onClick={handleMyAccountClick} className={Style.options}>My Account</p>
                        <p onClick={handleLogoutClick} className={Style.options}> Logout</p>
                    </div>
                }
            </div>
            <div className={Style.linear}>
                <div className={Style.quizDiv}>
                    <h2 className={Style.heading}>Create Quiz</h2>
                    <span className={Style.para}>Create you own customized quiz.</span>
                    <button className={Style.button} onClick={handleCreateQuizClick}>Create Quiz</button>
                </div>
                <div className={Style.quizDiv}>
                    <h2 className={Style.heading}>Publish Quiz</h2>
                    <span className={Style.para}>Users can attempt only published quizzes.</span>
                    <button className={Style.button} onClick={handlePublishQuizClick}>Publish Quiz</button>
                </div>
            </div>
            {isLoading && 
                <div className={Style.loading}>
                    <div className={Style.loader}></div>
                </div>
            }
        </>
    )
}

export default Quiz;