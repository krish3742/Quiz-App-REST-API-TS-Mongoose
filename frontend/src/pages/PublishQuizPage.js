import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import Style from './PublishQuizPage.module.css';

function PublishQuiz() {
    const location = useLocation();
    const navigate = useNavigate();
    const [flag, setFlag] = useState(true);
    const [quizId, setQuizId] = useState();
    const [myQuizList, setMyQuizList] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [quizzesList, setQuizzesList] = useState([]);
    const [isMyQuizOpen, setIsMyQuizOpen] = useState(false);
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
    function handleQuizAppClick(evt) {
        evt.preventDefault();
        navigate('/auth/quiz', { state: { token }});
    }
    function handlePublishButtonClick(id, e) {
        e.preventDefault();
        setIsLoading(true);
        setQuizId(id);
    }
    useEffect(() => {
        if(!!quizId) {
            axios
                .patch('http://localhost:3002/quiz/publish', { quizId }, { headers })
                .then((response) => {
                    setQuizId("");
                    setFlag(!flag);
                    console.log(response);
                })
                .catch((error) => {
                    setQuizId("");
                    setFlag(!flag);
                    navigate('/auth/login');
                })
        }
        axios
            .get('http://localhost:3002/quiz', { headers })
            .then((response) => {
                setIsLoading(false);
                setMyQuizList(response?.data?.data);
            })
            .catch((error) => {
                setIsLoading(false);
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
                console.log(response);
            })
            .catch((error) => {
                setIsLoading(false);
                const message = error?.response?.data?.message;
                if(message.includes('No quiz found!')) {
                    setMyQuizList(["No quiz published!"]);
                }
            })
    }, [quizId, flag]);
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
                <h2 className={Style.heading}>Publish Quiz</h2>
                    {!!myQuizList && myQuizList.length != 0 &&
                        myQuizList.map((list) => {
                            return (
                                <div className={Style.accountDiv}> 
                                    <div className={Style.titleDiv}>
                                        <div>
                                            <h4 className={Style.title}>{list.name}</h4>
                                        </div>
                                        {list?.isPublished ? 
                                            <button className={Style.editButtonDisabled} disabled>Published</button> :
                                            <button className={Style.editButton} onClick={(e) => handlePublishButtonClick(list._id, e)}>Publish</button>
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                    {!!myQuizList && myQuizList.length === 0 &&
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

export default PublishQuiz;