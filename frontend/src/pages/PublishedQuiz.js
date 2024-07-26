import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import Style from './PublishedQuiz.module.css';

function PublishedQuiz() {
    const location = useLocation();
    const navigate = useNavigate(); 
    const [quizExam, setQuizExam] = useState([]);
    const [quizTest, setQuizTest] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMyQuizOpen, setIsMyQuizOpen] = useState(false);
    const [isQuizzesOpen, setIsQuizzesOpen] = useState(false);
    const [isReportsOpen, setIsReportsOpen] = useState(false);
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
    function handleQuizAppClick(evt) {
        evt.preventDefault();
        navigate('/auth/quiz', { state: { token }});
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
    useEffect(() => {
        axios
            .get('http://localhost:3002/quiz/allpublishedquiz/exam', { headers })
            .then((response) => {
                setQuizExam(response?.data?.data);
            })
            .catch((error) => {
                navigate('/auth/login');
            })
        axios
            .get('http://localhost:3002/quiz/allpublishedquiz/test', { headers })
            .then((response) => {
                setIsLoading(false);
                setQuizTest(response?.data?.data);
            })
            .catch((error) => {
                setIsLoading(false);
                navigate('/auth/login');
            })
    }, []);
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
                <h2 className={Style.headingExam}>Exam</h2>
                {!!quizExam && quizExam.length !== 0 &&
                    quizExam.map((list) => {
                        return (
                            <div className={Style.accountDiv} key={list._id}> 
                                <div className={Style.titleDiv}>
                                    <div>
                                        <h4 className={Style.title}>{list.name}</h4>
                                    </div>
                                    <div className={Style.buttonDiv}>
                                        <button className={Style.editButton}>Attempt</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                {!!quizExam && quizExam.length === 0 &&
                    <div className={Style.accountDiv}> 
                        <div className={Style.titleDiv}>
                            <div>
                                <h4 className={Style.title}>No quiz found!</h4>
                            </div>
                        </div>
                    </div>
                }
                <h2 className={Style.headingTest}>Test</h2>
                {!!quizTest && quizTest.length !== 0 &&
                    quizTest.map((list) => {
                        return (
                            <div className={Style.accountDiv} key={list._id}> 
                                <div className={Style.titleDiv}>
                                    <div>
                                        <h4 className={Style.title}>{list.name}</h4>
                                    </div>
                                    <div className={Style.buttonDiv}>
                                        <button className={Style.editButton}>Attempt</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                {!!quizTest && quizTest.length === 0 &&
                    <div className={Style.accountDiv}> 
                        <div className={Style.titleDiv}>
                            <div>
                                <h4 className={Style.title}>No quiz found!</h4>
                            </div>
                        </div>
                    </div>
                }
            </div>
            {isLoading && 
                <div className={Style.loading}>
                    <div className={Style.loader}></div>
                </div>
            }
        </>
    )
}

export default PublishedQuiz;