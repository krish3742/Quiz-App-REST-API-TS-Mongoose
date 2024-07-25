import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import Style from './Quiz.module.css';

function Quiz() {
    const location = useLocation();
    const navigate = useNavigate();
    const [quizzesList, setQuizzesList] = useState([]);
    const [isQuizzesOpen, setIsQuizzesOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isMyQuizOpen, setIsMyQuizOpen] = useState(false);
    const [myQuizList, setMyQuizList] = useState([]); 
    const token = location?.state?.token;
    const headers = {'Authorization': `Bearer ${token}`};
    function handleLogoutClick(evt) {
        axios
            .post('http://localhost:3002/user/logout', {}, { headers })
            .then((response) => {
                navigate('/auth/login');
            })
            .catch((error) => {
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
    useEffect(() => {
        axios
            .get('http://localhost:3002/quiz', { headers })
            .then((response) => {
                setMyQuizList(response?.data?.data);
            })
            .catch((error) => {
                const message = error?.response?.data?.message;
                if(message.includes('Quiz not found!')) {
                    setMyQuizList(["No quiz found"]);
                }
            })
        axios
            .get('http://localhost:3002/quiz/allpublishedquiz', { headers })
            .then((response) => {
                setIsLoading(false);
                setQuizzesList(response?.data?.data);
            })
            .catch((error) => {
                setIsLoading(false);
                const message = error?.response?.data?.message;
                if(message.includes('No quiz found!')) {
                    setMyQuizList(["No quiz published!"]);
                }
            })
    }, [])
    if(!token) {
        return <Navigate to='/auth/login' />
    }
    return (
        <>
            <div className={Style.container}>
                <h2 className={Style.title} onClick={handleQuizAppClick}>Quiz App</h2>
                <div className={Style.menuDiv}>
                    <h4 className={Style.menu} onMouseEnter={() => {setIsQuizzesOpen(true)}} onMouseLeave={() => {setIsQuizzesOpen(false)}}>Quizzes</h4>
                    {isQuizzesOpen &&
                        <div className={Style.quizzesDiv} onMouseEnter={() => setIsQuizzesOpen(true)} onMouseLeave={() => {setIsQuizzesOpen(false)}}>
                            {quizzesList.length !== 0 ?quizzesList.map((list) => {
                                return <p className={Style.options} key={list.name}>{list.name}</p>
                            }) : <p className={Style.noQuiz} key='noQuiz'>No quiz published!</p>}
                        </div>
                    }
                    <h4 className={Style.menu}>Reports</h4>
                    <h4 className={Style.menu} onMouseEnter={() => {setIsMyQuizOpen(true)}} onMouseLeave={() => {setIsMyQuizOpen(false)}}>My Quiz</h4>
                    {isMyQuizOpen &&
                        <div className={Style.myQuizDiv} onMouseEnter={() => setIsMyQuizOpen(true)} onMouseLeave={() => {setIsMyQuizOpen(false)}}>
                            {myQuizList.length !== 0 ? myQuizList.map((list) => {
                                return <p className={Style.options} key={list.name}>{list.name}</p>
                            }) : <p className={Style.noQuiz} key='noQuiz'>No quiz created!</p>}
                        </div>
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