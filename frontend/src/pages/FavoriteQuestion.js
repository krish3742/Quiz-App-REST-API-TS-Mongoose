import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import Style from './FavoriteQuestion.module.css';

function FavoriteQuestion() {
    const location = useLocation();
    const navigate = useNavigate(); 
    const [flag, setFlag] = useState(false);
    const [favQues, setFavQues] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [isMyQuizOpen, setIsMyQuizOpen] = useState(false);
    const [isQuizzesOpen, setIsQuizzesOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isFavouriteQuestionOpen, setIsFavouriteQuestionOpen] = useState(false);
    const token = location?.state?.token;
    const headers = {'Authorization': `Bearer ${token}`};
    function handleMyQuizClick(evt) {
        evt.preventDefault();
        navigate('/auth/quiz/myquiz', { state: { token }});
    }
    function handleFavouriteQuestionClick(evt) {
        evt.preventDefault();
        navigate('/auth/user/fav-ques', { state: { token }});
    }
    function handleQuizzesClick(evt) {
        evt.preventDefault();
        navigate('/auth/published-quiz', { state: { token }});
    }
    function handleMyAccountClick(evt) {
        navigate('/auth/user/my-account', { state: { token }});
    }
    function handleQuizAppClick(evt) {
        evt.preventDefault();
        navigate('/auth/quiz', { state: { token }});
    }
    function handleLogoutClick(evt) {
        setIsLoading(true);
        axios
            .post('http://localhost:3002/user/logout', {}, { headers })
            .then(() => {
                setIsLoading(false);
                navigate('/auth/login');
            })
            .catch(() => {
                setIsLoading(false);
                navigate('/auth/register');
            })
    }
    function handleRemoveFavouriteClick(id, e) {
        setIsLoading(true);
        axios
            .delete(`http://localhost:3002/favquestion/${id}`, { headers })
            .then(() => {
                setIsLoading(false);
                setFlag(!flag);
            })
            .catch(() => {
                setIsLoading(false);
                navigate('/auth/login')
            })
    }
    useEffect(() => {
        axios
            .get('http://localhost:3002/favquestion', { headers })
            .then((response) => {
                setIsLoading(false);
                setFavQues(response?.data?.data?.favQues);
            })
            .catch((error) => {
                setIsLoading(false);
                navigate('/auth/login');
            })
    }, [flag]);
    if(!token) {
        return <Navigate to='/auth/login' />
    }
    return (
        <>
            <div className={Style.container}>
                <h2 className={Style.quizApp} onClick={handleQuizAppClick}>Quiz App</h2>
                <div className={Style.menuDiv}>
                    <h4 className={Style.menu} onMouseEnter={() => {setIsQuizzesOpen(true)}} onMouseLeave={() => {setIsQuizzesOpen(false)}} onClick={handleQuizzesClick}>Quizzes</h4>
                    {isQuizzesOpen &&
                        <div className={Style.quizzesDiv}></div>
                    }
                    <h4 className={Style.menu} onMouseEnter={() => {setIsFavouriteQuestionOpen(true)}} onMouseLeave={() => {setIsFavouriteQuestionOpen(false)}} onClick={handleFavouriteQuestionClick}>Favorite Questions</h4>
                    {isFavouriteQuestionOpen &&
                        <div className={Style.favouriteQuestionsDiv}></div>
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
                {!!favQues && favQues.length !== 0 && favQues.map((list) => {
                    return (
                        <div className={Style.titleDiv} key={list.question}>
                            <div className={Style.itemDiv}>
                                <div className={Style.quesDiv}>
                                    <p className={Style.paraBold}>Question: </p>
                                    <p className={Style.para}>{list.question}</p>
                                </div>
                                <div>
                                    <button className={Style.favItem} onClick={(e) => handleRemoveFavouriteClick(list._id, e)}></button>
                                </div>
                            </div>
                            {!!list.options &&
                                <div className={Style.optionDiv}>
                                    <p className={Style.paraBold}>Options:</p>
                                    {Object.keys(list.options).map(function (key) {
                                        return (
                                            <div className={Style.optionsDiv} key={key}>
                                                <p className={Style.paraOption}>{key}:</p>
                                                <p className={Style.paraOption}>{list.options[key]}</p>
                                            </div>
                                        )    
                                    })}
                                </div>
                            }
                        </div>
                    )
                })}
                {!!favQues && favQues.length === 0 &&
                    <div className={Style.accountDiv}> 
                        <div className={Style.titleDiv}>
                            <h4 className={Style.noQuiz}>No question added!</h4>
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

export default FavoriteQuestion;