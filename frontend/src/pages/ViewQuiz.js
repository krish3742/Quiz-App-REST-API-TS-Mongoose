import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import Style from './ViewQuiz.module.css';

function ViewQuiz() {
    const location = useLocation();
    const navigate = useNavigate();
    const [users, setUsers] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [isMyQuizOpen, setIsMyQuizOpen] = useState(false);
    const [isQuizzesOpen, setIsQuizzesOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isFavouriteQuestionOpen, setIsFavouriteQuestionOpen] = useState(false);
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [questionList, setQuestionList] = useState([{questionNumber: 1, question: '', options: {'1': ''}}]);
    const [answers, setAnswers] = useState({});
    const [passingPercentage, setPassingPercentage] = useState(0);
    const [isPublicQuiz, setIsPublicQuiz] = useState("Choose Option");
    const [allowedUser, setAllowedUser] = useState(['']);
    const token = location?.state?.token;
    const [quizId, setQuizId] = useState(location?.state?.viewQuizId);
    const headers = {'Authorization': `Bearer ${token}`};
    function handleQuizAppClick(evt) {
        evt.preventDefault();
        navigate('/auth/quiz', { state: { token }});
    }
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
    useEffect(() => {
        axios
            .get(`http://localhost:3002/quiz/${quizId}`, { headers })
            .then((response) => {
                setIsLoading(false);
                const quiz = response?.data?.data; 
                setName(quiz?.name);
                setCategory(quiz?.category);
                setQuestionList(quiz?.questionList);
                setAnswers(quiz?.answers);
                setPassingPercentage(quiz?.passingPercentage);
                setIsPublicQuiz(quiz?.isPublicQuiz);
                setAllowedUser(quiz?.allowedUser);
            })
            .catch(() => {
                setIsLoading(false);
                setQuizId("");
                navigate('/auth/login');
            });
        axios
            .get('http://localhost:3002/user/all', { headers })
            .then((response) => {
                setIsLoading(false);
                setUsers(response?.data?.data);
            })
            .catch((error) => {
                setIsLoading(false);
                navigate('/auth/login');
            });
    }, []);
    if(!token && !quizId) {
        return <Navigate to='/auth/login' />
    }
    return (
        <>
            <div className={Style.container}>
                <h2 className={Style.QuizApp} onClick={handleQuizAppClick}>Quiz App</h2>
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
                <h2 className={Style.heading}>Quiz</h2>
                <div className={Style.accountDiv}> 
                    <div className={Style.titleDiv}>
                        <div>
                            <h4 className={Style.title}>Quiz Name *</h4>
                            <p className={Style.para}>{name}</p>
                        </div>
                    </div>
                    <div className={Style.titleDiv}>
                        <div>
                            <h4 className={Style.title}>Category *</h4>
                            <p className={Style.para}>{category === "exam" ? "Exam" : "Test"}</p>
                        </div>
                    </div>
                    {!!questionList && 
                        questionList.map((list) => {
                            return (
                                <div className={Style.titleDiv} key={list.questionNumber}>
                                    <div>
                                        <h4 className={Style.title}>Question {list.questionNumber}: *</h4>
                                        <p className={Style.para}>{list.question}</p>
                                    </div>
                                    <div>
                                        <h4 className={Style.titleOption}>Options</h4>
                                        {!!list.options &&
                                            Object.keys(list.options).map(function (key) {
                                                return (
                                                    <div className={Style.optionDiv} key={key}>
                                                        <div className={Style.sameLine}>
                                                            <span key={key}>{key}: </span>
                                                            <p className={Style.spanPara}>{list.options[key]}</p>
                                                        </div> 
                                                    </div>
                                                )    
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                    <div className={Style.titleDiv}>
                        <div>
                            <h4 className={Style.title}>Answers *</h4>
                            {!!answers &&
                                Object.keys(answers).map(function (key) {
                                    return (
                                        <div key={key} className={Style.sameLine}>
                                            <span>Ques {key}: </span>
                                            <p className={Style.spanPara}>{answers[key]}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className={Style.titleDiv}>
                        <div>
                            <h4 className={Style.title}>Passing Percentage *</h4>
                            <p className={Style.para}>{passingPercentage}</p>
                        </div>
                    </div>
                    <div className={Style.titleDiv}>
                        <div>
                            <h4 className={Style.title}>Is this is a public quiz? *</h4>
                            <p className={Style.para}>{isPublicQuiz ? "True" : "False"}</p>
                        </div>
                    </div>
                    {isPublicQuiz === false &&
                        <div className={Style.titleDiv}>
                            <div>
                                <h4 className={Style.title}>Allowed Users *</h4>
                                {!!allowedUser &&
                                    allowedUser.map((value, index) => {
                                        return (
                                            <div className={Style.optionDiv} key={index}>
                                                <div className={Style.sameLine}>
                                                    <span id={index}>{index + 1}: </span>
                                                    {users.map((user) => {
                                                        if(user?._id === value) {
                                                            return <p className={Style.spanPara} key={value}>{value}: {user?.name}</p>
                                                        }
                                                    })}
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>  
                    }
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

export default ViewQuiz;