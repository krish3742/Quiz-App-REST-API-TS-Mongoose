import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import Style from './UpdateQuiz.module.css';

function UpdateQuiz() {
    const location = useLocation();
    const navigate = useNavigate();
    const [_id, setId] = useState();
    const [color, setColor] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState(["Testing"]);
    const [isMyQuizOpen, setIsMyQuizOpen] = useState(false);
    const [isQuizzesOpen, setIsQuizzesOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isFavouriteQuestionOpen, setIsFavouriteQuestionOpen] = useState(false);
    const [name, setName] = useState("");
    let [questionNo, setQuestionNo] = useState(1);
    const [questionList, setQuestionList] = useState([{questionNumber: 1, question: '', options: {'1': ''}}]);
    const [answers, setAnswers] = useState({});
    const [passingPercentage, setPassingPercentage] = useState(0);
    const [isPublicQuiz, setIsPublicQuiz] = useState("Choose Option");
    const [allowedUser, setAllowedUser] = useState(['']);
    const token = location?.state?.token;
    const [quizId, setQuizId] = useState(location?.state?.quizId);
    const headers = {'Authorization': `Bearer ${token}`};
    function handleQuizNameChange(evt) {
        setName(evt.target.value);
    }
    function handleQuestionChange(questionNumber, e) {
        setQuestionList((oldArray) => {
            return oldArray.map((list) => {
                if(list.questionNumber === questionNumber) {
                    return {questionNumber: list.questionNumber, question: e.target.value, options: list.options};
                } else {
                    return list;
                }
            })
        })
    }
    function handleOptionsChange(questionNumber, key, e) {
        e.preventDefault();
        setQuestionList((oldArray) => {
            return oldArray.map((list) => {
                if(list.questionNumber === questionNumber) {
                    let option = {};
                    for(let i in list.options) {
                        if(i == key) {
                            option = {...option, [i]: e.target.value};
                        } else {
                            option = {...option, [i]: list.options[i]};
                        }
                    }
                    return {questionNumber: list.questionNumber, question: list.question, options: option}
                } else {
                    return list;
                }
            })
        })
    }
    function handleAnswersChange(key, e) {
        e.preventDefault();
        setAnswers((oldObject) => {
            return {...oldObject, [key]: e.target.value};
        })
    }
    function handlePassingPercentageChange(evt) {
        evt.preventDefault();
        setPassingPercentage(evt.target.value);
    }
    function handlePublicQuizChange(evt) {
        evt.preventDefault();
        setIsPublicQuiz(evt.target.value);
    }
    function handleAllowedUserChange(index, e) {
        setAllowedUser((oldArray) => {
            return oldArray.map((value, ind) => {
                if(index === ind) {
                    return e.target.value;
                } else {
                    return value;
                }
            })
        })
    }
    function handleQuizAppClick(evt) {
        evt.preventDefault();
        navigate('/auth/quiz', { state: { token }});
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
    function handleAddOptionClick(questionNumber) {
        setQuestionList((oldArray) => {
            return oldArray.map((list) => {
                if(list.questionNumber === questionNumber) {
                    let length = Object.keys(oldArray[questionNumber - 1].options).length;
                    const optionsList = list.options;
                    const option = {...optionsList, [`${++length}`]: ''};
                    return {questionNumber: list.questionNumber, question: list.question, options: option};
                } else {
                    return list;
                }
            })
        });
    }
    function handleRemoveOptionClick(questionNumber) {
        setQuestionList((oldArray) => {
            return oldArray.map((list) => {
                if(list.questionNumber === questionNumber) {
                    let length = Object.keys(oldArray[questionNumber - 1].options).length;
                    const optionsList = list.options;
                    let option = {};
                    for(let key in optionsList) {
                        if(key != (length)) {
                            option = {...option, [key]: optionsList[key]};
                        }
                    }
                    return {questionNumber: list.questionNumber, question: list.question, options: option};
                } else {
                    return list;
                }
            })
        });
    }
    function handleAddQuesClick(evt) {
        evt.preventDefault();
        setQuestionNo(++questionNo);
        setQuestionList((oldArray) => {
            return [...oldArray, {questionNumber: questionNo, question: '', options: {'1': ''}}]
        })
    }
    function handleRemoveQuesClick(evt) {
        evt.preventDefault();
        setQuestionList((oldArray) => {
            const questionNumber = questionNo + 1;
            return oldArray.filter((list) => {
                if(list.questionNumber === questionNumber) {
                    return false;
                }
                return true;
            })
        });
        setQuestionNo(--questionNo);
    }
    function handleAddUserClick(evt) {
        evt.preventDefault();
        setAllowedUser((oldArray) => {
            return [...oldArray, ''];
        })
    }
    function handleRemoveUserClick(evt) {
        evt.preventDefault();
        setAllowedUser((oldArray) => {
            let length = oldArray.length;
            return oldArray.filter((value, index) => {
                if(index === (length - 1)) {
                    return false;
                }
                return true;
            });
        })
    }
    function handleUpdateQuizClick(evt) {
        let flag = false;
        evt.preventDefault();
        setErrors([]);
        setColor("");
        setIsLoading(true);
        if(name.length < 10) {
            setErrors((oldArray) => [...oldArray, 'Quiz name should be 10 charcters long']);
        }
        questionList.forEach((list) => {
            flag = true;
            if(!list.question) {
                flag = false;
            }
            Object.values(list.options).forEach((option) => {
                if(!option) {
                    flag = false;
                }
            })
            if(!flag) {
                setErrors((oldArray) => [...oldArray, "Please enter question with options"])
            }
        })
        if(questionList.length !== Object.keys(answers).length) {
            setErrors((oldArray) => [...oldArray, "Please enter answers"])
        } else {
            flag = true;
            questionList.forEach((list) => {
                let opt = Object.keys(list.options);
                if (
                    opt.indexOf(
                    `${Object.values(answers)[Object.keys(answers).indexOf(list.questionNumber.toString())]}`
                    ) === -1
                ) {
                    flag = false;
                }
            });
            if(!flag) {
                setErrors((oldArray) => [...oldArray, "Please enter correct option number in answers"]);
            }
        }
        if(!passingPercentage) {
            setErrors((oldArray) => [...oldArray, "Please enter passing percentage"]);
        } else if(passingPercentage === '0') {
            setErrors((oldArray) => [...oldArray, 'Passing percentage can not be zero']);
        } else if(isNaN(passingPercentage)) {
            setErrors((oldArray) => [...oldArray, 'Enter valid passing percentage']);
        }
        if(isPublicQuiz === 'Choose Option') {
            setErrors((oldArray) => [...oldArray, "Please choose is this is a public quiz?"]);
        } else if(isPublicQuiz === 'True') {
            setIsPublicQuiz(true);
        } else if(isPublicQuiz === 'False') {
            setIsPublicQuiz(false);
        }
    }
    const data = {
        _id,
        name,
        questionList,
        answers,
        difficultyLevel: "easy",
        passingPercentage,
        isPublicQuiz,
        allowedUser
    }
    useEffect(() => {
        if(errors.length === 0) {
            axios
                .put('http://localhost:3002/quiz', data, { headers })
                .then((response) => {
                    setIsLoading(false);
                    setErrors(["Quiz updated, redirecting..."]);
                    setColor("black");
                    setTimeout(() => {
                        navigate('/auth/quiz/myquiz', { state: { token }});
                    }, 1000);
                })
                .catch((error) => {
                    setIsLoading(false);
                    const message = error?.response?.data?.message;
                    if(error?.response?.status === 500) {
                        setErrors(["Try again after some time"]);
                    } else if(message.includes('Validation failed!')) {
                        setErrors(["Quiz name must be unique"]);
                    } else {
                        navigate('/auth/login');
                    }
                })
        }
        if(!!quizId) {
            axios
            .get(`http://localhost:3002/quiz/${quizId}`, { headers })
            .then((response) => {
                setQuizId("");
                setIsLoading(false);
                const quiz = response?.data?.data; 
                setId(quiz?._id);
                setName(quiz?.name);
                setQuestionList(quiz?.questionList);
                setAnswers(quiz?.answers);
                setPassingPercentage(quiz?.passingPercentage);
                setIsPublicQuiz(quiz?.isPublicQuiz);
                if(!!quiz?.allowedUser) {
                    setAllowedUser(quiz?.allowedUser);
                }
            })
            .catch(() => {
                setIsLoading(false);
                setQuizId("");
                navigate('/auth/login');
            })
        }    
    }, [errors]);
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
                <h2 className={Style.heading}>Update Quiz</h2>
                <div className={Style.accountDiv}> 
                    <div className={Style.titleDiv}>
                        <div>
                            <h4 className={Style.title}>Quiz Name *</h4>
                            <input type='text' id='Name' value={name} placeholder='Name must be 10 characters long and unique' className={Style.input} onChange={handleQuizNameChange}></input>
                        </div>
                    </div>
                    {!!questionList && 
                        questionList.map((list) => {
                            let length = questionList.length;
                            if(length === 1) {
                                length = undefined;
                            }
                            return (
                                <div className={Style.titleDiv} key={list.questionNumber}>
                                    <div>
                                        <h4 className={Style.title}>Question {list.questionNumber}: *</h4>
                                        <input type='text' placeholder='Enter question' value={list.question} onChange={(e) => handleQuestionChange(list.questionNumber, e)} id='questionName' className={Style.input}></input>
                                    </div>
                                    <div>
                                        <h4 className={Style.titleOption}>Options</h4>
                                        {!!list.options &&
                                            Object.keys(list.options).map(function (key) {
                                                const lastKey = Object.keys(list.options).length;
                                                let lastKeyString;
                                                if(lastKey !== 1) {
                                                    lastKeyString = lastKey.toString();
                                                }
                                                return (
                                                    <div className={Style.optionDiv} key={key}>
                                                        <div>
                                                            <span key={key}>{key}: </span>
                                                            <input type='text' value={list.options[key]} placeholder='Enter option' id='options' onChange={(e) => handleOptionsChange(list.questionNumber, key, e)} className={Style.input}></input>
                                                        </div>
                                                        {key === '1' &&
                                                            <button onClick={() => handleAddOptionClick(list.questionNumber)} className={Style.addRemoveButton} key='addOption'>Add Option</button>
                                                        }
                                                        {key === lastKeyString &&
                                                            <button onClick={() => handleRemoveOptionClick(list.questionNumber)} className={Style.addRemoveButton} key='removeOption'>Remove Option</button>
                                                        } 
                                                    </div>
                                                )    
                                            })
                                        }
                                    </div>
                                    {list.questionNumber === 1 &&
                                        <button className={Style.addRemoveQuesButton} onClick={handleAddQuesClick} key='addQues'>Add Question</button>
                                    }
                                    {list.questionNumber === length &&
                                        <button className={Style.addRemoveQuesButton} onClick={handleRemoveQuesClick} key='removeQues'>Remove Question</button>
                                    }
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
                                        <div key={key}>
                                            <span>Ques {key}: </span>
                                            <input type='text' maxLength={1} value={answers[key]} placeholder='Enter the correct option number' onChange={(e) => handleAnswersChange(key, e)}  id='Answers' className={Style.input}></input>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className={Style.titleDiv}>
                        <div>
                            <h4 className={Style.title}>Passing Percentage *</h4>
                            <input type='text' placeholder='Enter the number only' value={passingPercentage} id='passing' onChange={handlePassingPercentageChange} className={Style.input}></input>
                        </div>
                    </div>
                    <div className={Style.titleDiv}>
                        <div>
                            <h4 className={Style.title}>Is this is a public quiz? *</h4>
                            <select className={Style.option} value={isPublicQuiz} onChange={handlePublicQuizChange}>
                                <option value='Choose Option'>Choose Option</option>
                                <option value='true'>True</option>
                                <option value='false'>False</option>
                            </select>
                        </div>
                    </div>
                    <div className={Style.titleDiv}>
                        <div>
                            <h4 className={Style.title}>Allowed User</h4>
                            {!!allowedUser &&
                                allowedUser.map((value, index) => {
                                    let lastKey = allowedUser.length;
                                    if(lastKey === 1) {
                                        lastKey = undefined;
                                    } 
                                    return (
                                        <div className={Style.optionDiv} key={index}>
                                            <div>
                                                <span id={index}>{index + 1}: </span>
                                                <input type='text' value={value} placeholder='Enter user id' id='allowedUser' onChange={(e) => handleAllowedUserChange(index, e)} className={Style.input}></input>
                                            </div>
                                            {index === 0 &&
                                                <button onClick={handleAddUserClick} className={Style.addRemoveButton} key={index}>Add User</button>
                                            }
                                            {index === (lastKey-1) &&
                                                <button onClick={handleRemoveUserClick} className={Style.addRemoveButton} key={index}>Remove User</button>
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    {!!errors && errors.length > 0 && !errors.includes("Testing") &&
                        <div className={Style.instructionParaDiv}>
                            <ul>
                                {errors.map(message =>  {
                                    return <li className={!!color ? Style.black : Style.red} key={message}>{message}</li>
                                })}
                            </ul>
                        </div>
                    }
                    <div className={Style.createDiv}>
                        <button className={Style.createButton} onClick={handleUpdateQuizClick}>Update</button>
                    </div>   
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

export default UpdateQuiz;