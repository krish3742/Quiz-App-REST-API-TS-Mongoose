import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { MdDeleteOutline } from "react-icons/md";
import { useEffect, useState } from 'react';
import axios from 'axios';

import Style from './CreateQuiz.module.css';

function CreateQuiz() {
    let data;
    const location = useLocation();
    const navigate = useNavigate();
    const [users, setUsers] = useState();
    const [color, setColor] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState(["Testing"]);
    const [isMyQuizOpen, setIsMyQuizOpen] = useState(false);
    const [isQuizzesOpen, setIsQuizzesOpen] = useState(false);
    const [isFavouriteQuestionOpen, setIsFavouriteQuestionOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [name, setName] = useState("");
    const [category, setCategory] = useState("Choose Option");
    const [difficultyLevel, setDifficultyLevel] = useState("Choose Option");
    const [questionList, setQuestionList] = useState([]);
    const [answers, setAnswers] = useState({});
    const [passingPercentage, setPassingPercentage] = useState(0);
    const [attemptsAllowedPerUser, setAttemptsAllowed] = useState(0);
    const [isPublicQuiz, setIsPublicQuiz] = useState("Choose Option");
    const [allowedUser, setAllowedUser] = useState(['']);
    const token = location?.state?.token;
    const headers = {'Authorization': `Bearer ${token}`};
    function handleQuizNameChange(evt) {
        setName(evt.target.value);
    }
    function handleCategoryChange(evt) {
        setCategory(evt.target.value);
    }
    function handleDifficultyLevelChange(evt) {
        setDifficultyLevel(evt.target.value);
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
    function handleAnswersChange(questionNumber, e) {
        setAnswers((oldObject) => {
            return {...oldObject, [questionNumber]: e.target.value};
        })
    }
    function handlePassingPercentageChange(evt) {
        evt.preventDefault();
        setPassingPercentage(evt.target.value);
    }
    function handleAttemptsAllowedChange(evt) {
        evt.preventDefault();
        setAttemptsAllowed(evt.target.value);
    }
    function handlePublicQuizChange(evt) {
        evt.preventDefault();
        setIsPublicQuiz(evt.target.value);
    }
    function handleAllowedUserChange(index, e) {
        setAllowedUser((oldArray) => {
            if(oldArray.length === 0) {
                return [e.target.value];
            } else {
                return oldArray.map((value, ind) => {
                    if(index === ind) {
                        return e.target.value;
                    } else {
                        return value;
                    }
                })
            }    
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
            .post(`http://${process.env.REACT_APP_BACKEND_URL}/user/logout`, {}, { headers })
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
    function handleRemoveOptionClick(questionNumber, key) {
        setQuestionList((oldArray) => {
            return oldArray.map((list) => {
                if(list.questionNumber === questionNumber) {
                    let length = 1;
                    const optionsList = list.options;
                    let option = {}, tempOption = {};
                    for(let i in optionsList) {
                        if(i !== key) {
                            option = {...option, [i]: optionsList[i]};
                        }
                    }
                    for(let i in option) {
                        tempOption = {...tempOption, [length++]: option[i]};
                    }
                    return {questionNumber: list.questionNumber, question: list.question, options: tempOption};
                } else {
                    return list;
                }
            })
        });
    }
    function handleAddQuesClick(evt) {
        evt.preventDefault();
        setQuestionList((oldArray) => {
            const length = questionList.length;
            return [...oldArray, {questionNumber: length + 1, question: '', options: {'1': ''}}]
        })
    }
    function handleRemoveQuesClick(questionNumber, evt) {
        evt.preventDefault();
        setQuestionList((oldArray) => {
            let tempQuestionNumber = 1;
            let tempList = oldArray.filter((list) => {
                if(list.questionNumber !== questionNumber) {
                    return true;
                }
                return false;
            })
            return tempList.map((list) => {
                return {questionNumber: tempQuestionNumber++, question: list.question, options: list.options};
            })
        });
        setAnswers((oldObject) => {
            let newAnswers= {}, tempAnswers = {};
            let tempQuestionNumber = 1;
            for(let i in oldObject) {
                if(i != questionNumber) {
                    newAnswers = {...newAnswers, [i]: oldObject[i]};
                } else {
                    newAnswers = {...newAnswers};
                }
            }
            for(let i in newAnswers) {
                tempAnswers = {...tempAnswers, [tempQuestionNumber++]: newAnswers[i]};
            }
            return tempAnswers;
        })
    }
    function handleAddUserClick(evt) {
        evt.preventDefault();
        setAllowedUser((oldArray) => {
            return [...oldArray, ''];
        })
    }
    function handleRemoveUserClick(index, evt) {
        evt.preventDefault();
        setAllowedUser((oldArray) => {
            return oldArray.filter((value, i) => {
                if(i === index) {
                    return false;
                }
                return true;
            });
        })
    }
    function handleCreateQuizClick(evt) {
        let flag = false;
        evt.preventDefault();
        setErrors([]);
        setColor("");
        setIsLoading(true);
        if(name.length < 10) {
            setErrors((oldArray) => [...oldArray, 'Quiz name should be 10 charcters long']);
        }
        if(category === 'Choose Option') {
            setErrors((oldArray) => [...oldArray, 'Choose category']);
        } else if(category === 'Exam') {
            setCategory("exam");
        } else if(category === 'Test') {
            setCategory("test");
        }
        if(difficultyLevel === 'Choose Option') {
            setErrors((oldArray) => [...oldArray, 'Choose difficulty level']);
        } else if(difficultyLevel === 'Easy') {
            setDifficultyLevel('easy');
        } else if(difficultyLevel === "Medium") {
            setDifficultyLevel('medium');
        } else if(difficultyLevel === 'Hard') {
            setDifficultyLevel('hard');
        }
        if(questionList.length === 0) {
            setErrors((oldArray) => [...oldArray, "Please enter atleast 1 question"]);
        } else {
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
        }
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
        if(!!attemptsAllowedPerUser && isNaN(attemptsAllowedPerUser)) {
            setErrors((oldArray) => [...oldArray, "Enter valid attempts per user"]);
        }
        if(isPublicQuiz === 'Choose Option') {
            setErrors((oldArray) => [...oldArray, "Please choose is this is a public quiz?"]);
        }
        if(isPublicQuiz === "false") {
            flag = true;
            allowedUser.forEach((value) => {
                if(value === '') {
                    flag = false;
                }
            })
            if(!flag) {
                setErrors((oldArray) => [...oldArray, "Please choose allowed users"]);
            }
        }
    }
    if(isPublicQuiz === 'true') {
        data = {
            name,
            category,
            difficultyLevel,
            questionList,
            answers,
            passingPercentage,
            attemptsAllowedPerUser,
            isPublicQuiz,
            allowedUser: []
        }
    } else if(isPublicQuiz === 'false') {
        data = {
            name,
            category,
            difficultyLevel,
            questionList,
            answers,
            passingPercentage,
            attemptsAllowedPerUser,
            isPublicQuiz,
            allowedUser
        }
    }
    useEffect(() => {
        if(errors.length === 0) {
            axios
                .post(`http://${process.env.REACT_APP_BACKEND_URL}/quiz`, data, { headers })
                .then((response) => {
                    setIsLoading(false);
                    setErrors(["Quiz created, redirecting..."]);
                    setColor("black");
                    setTimeout(() => {
                        navigate('/auth/quiz', { state: { token }});
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
        axios
            .get(`http://${process.env.REACT_APP_BACKEND_URL}/user/all`, { headers })
            .then((response) => {
                setIsLoading(false);
                setUsers(response?.data?.data);
            })
            .catch((error) => {
                setIsLoading(false);
                navigate('/auth/login');
            })
    }, [errors]);
    if(!token) {
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
                <h2 className={Style.heading}>Create Quiz</h2>
                <div className={Style.accountDiv}> 
                    <div className={Style.titleDiv}>
                        <div>
                            <h4 className={Style.title}>Quiz Name *</h4>
                            <input type='text' id='Name' placeholder='Name must be 10 characters long and unique' className={Style.input} onChange={handleQuizNameChange}></input>
                        </div>
                    </div>
                    <div className={Style.titleDiv}>
                        <div>
                            <h4 className={Style.title}>Category *</h4>
                            <select id='Category' className={Style.option} onChange={handleCategoryChange}>
                                <option value='Choose Option'>Choose Option</option>
                                <option value='exam'>Exam</option>
                                <option value='test'>Test</option>
                            </select>
                        </div>
                    </div>
                    <div className={Style.titleDiv}>
                        <div>
                            <h4 className={Style.title}>Difficulty Level *</h4>
                            <select id='DifficultyLevel' className={Style.option} onChange={handleDifficultyLevelChange}>
                                <option value='Choose Option'>Choose Option</option>
                                <option value='easy'>Easy</option>
                                <option value='medium'>Medium</option>
                                <option value='hard'>Hard</option>
                            </select>
                        </div>
                    </div>
                    <div className={Style.titleDiv}>
                        <div>
                            <h4 className={Style.title}>Passing Percentage *</h4>
                            <input type='text' placeholder='Enter the number only' id='passing' onChange={handlePassingPercentageChange} className={Style.input}></input>
                        </div>
                    </div>
                    <div className={Style.titleDiv}>
                        <div>
                            <h4 className={Style.title}>Attempts allowed per user!</h4>
                            <input type='text' placeholder='' onChange={handleAttemptsAllowedChange}id='attempts' className={Style.input}></input>
                        </div>
                    </div>
                    <div className={Style.titleDiv}>
                        <div>
                            <h4 className={Style.title}>Is this is a public quiz? *</h4>
                            <select className={Style.option} onChange={handlePublicQuizChange}>
                                <option value='Choose Option'>Choose Option</option>
                                <option value={true}>True</option>
                                <option value={false}>False</option>
                            </select>
                        </div>
                    </div>
                    {isPublicQuiz === "false" &&
                        <div className={Style.titleDiv}>
                            <div>
                                <h4 className={Style.title}>Allowed Users *</h4>
                                {!!allowedUser && 
                                    allowedUser.map((value, index) => {
                                        return (
                                            <div className={Style.optionDiv} key={index}>
                                                <div>
                                                    <span id={index}>{index + 1}: </span>
                                                    <select className={Style.option} value={value} onChange={(e) => handleAllowedUserChange(index, e)}>
                                                        <option value=''>Choose Option</option>
                                                        {users.map((user) => {
                                                            if(allowedUser.includes(user?._id)) {
                                                                return <option value={user?._id} key={user?._id} disabled>{user?._id}: {user?.name}</option>
                                                            } else {
                                                                return <option value={user?._id} key={user?._id}>{user?._id}: {user?.name}</option>
                                                            }
                                                        })}
                                                    </select>
                                                </div>
                                                <button onClick={(e) => handleRemoveUserClick(index, e)} className={Style.addRemoveButton} key={index}><MdDeleteOutline /></button>
                                            </div>
                                        )
                                    })
                                }
                                <button onClick={handleAddUserClick} className={Style.addButton}>Add User</button>
                            </div>
                        </div>
                    }
                    {!!questionList && questionList.length !== 0 &&
                        questionList.map((list) => {
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
                                                return (
                                                    <div className={Style.optionDiv} key={key}>
                                                        <div>
                                                            <span key={key}>{key}: </span>
                                                            <input type='text' value={list.options[key]} placeholder='Enter option' id='options' onChange={(e) => handleOptionsChange(list.questionNumber, key, e)} className={Style.input}></input>
                                                        </div>
                                                        <button onClick={() => handleRemoveOptionClick(list.questionNumber, key)} className={Style.addRemoveButton} key='removeOption'><MdDeleteOutline /></button>
                                                    </div>
                                                )    
                                            })
                                        }
                                        <button onClick={() => handleAddOptionClick(list.questionNumber)} className={Style.addButton} key='addOption'>Add Option</button>
                                    </div>
                                    <div className={Style.titleOptionDiv}>
                                        <h4 className={Style.titleOption}>Answer: </h4>
                                        <input type='text' maxLength={1} placeholder='Enter the correct option number' onChange={(e) => handleAnswersChange(list.questionNumber, e)}  id='Answers' className={Style.inputAnswers} value={Object.keys(answers).length !== 0 ? answers[list.questionNumber] : ''}></input>
                                    </div>
                                    <div className={Style.buttonDiv}>
                                        <button className={Style.removeQuesButton} onClick={(e) => handleRemoveQuesClick(list.questionNumber, e)} key='removeQues'><MdDeleteOutline /></button>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <div className={Style.buttonDiv}>
                        <button className={Style.addRemoveQuesButton} onClick={handleAddQuesClick} key='addQues'>Add Question</button>
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
                        <button className={Style.createButton} onClick={handleCreateQuizClick}>Create</button>
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

export default CreateQuiz;