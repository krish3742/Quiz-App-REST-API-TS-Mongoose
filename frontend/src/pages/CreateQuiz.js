import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import Style from './CreateQuiz.module.css';

function CreateQuiz() {
    const location = useLocation();
    const navigate = useNavigate();
    const [myQuizList, setMyQuizList] = useState([]); 
    const [quizzesList, setQuizzesList] = useState([]);
    const [isMyQuizOpen, setIsMyQuizOpen] = useState(false);
    const [isQuizzesOpen, setIsQuizzesOpen] = useState(false);
    const [errors, setErrors] = useState(["Testing"]);
    const [color, setColor] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [name, setName] = useState("");
    const [category, setCategory] = useState("Choose Option");
    const [difficultyLevel, setDifficultyLevel] = useState("Choose Option");
    let [questionNo, setQuestionNo] = useState(1);
    const [questionList, setQuestionList] = useState([{questionNumber: 1, question: '', options: {'1': ''}}]);
    const [answers, setAnswers] = useState({});
    const [passingPercentage, setPassingPercentage] = useState(0);
    const [attemptsAllowed, setAttemptsAllowed] = useState(0);
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
            let allowedUserList = [];
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
            let length = oldArray.length;
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
                // (question: { questionNumber: Number; question: String; options: {} }) => {
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
        } else if(isNaN(passingPercentage)) {
            setErrors((oldArray) => [...oldArray, 'Enter valid passing percentage']);
        }
        if(!!attemptsAllowed && isNaN(attemptsAllowed)) {
            setErrors((oldArray) => [...oldArray, "Enter valid attempts per user"]);
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
        name,
        category,
        difficultyLevel,
        questionList,
        answers,
        passingPercentage,
        attemptsAllowed,
        isPublicQuiz,
        allowedUser
    }
    useEffect(() => {
        if(errors.length === 0) {
            axios
                .post('http://localhost:3002/quiz', data, { headers })
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
        } else {
            setIsLoading(false);
        }
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
                console.log(response);
            })
            .catch((error) => {
                setIsLoading(false);
                const message = error?.response?.data?.message;
                if(message.includes('No quiz found!')) {
                    setMyQuizList(["No quiz published!"]);
                }
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
                    {!!questionList && 
                        questionList.map((list) => {
                            let length = questionList.length;
                            if(length === 1) {
                                length = undefined;
                            }
                            return (
                                <div className={Style.titleDiv}>
                                    <div>
                                        <h4 className={Style.title}>Question {list.questionNumber}: *</h4>
                                        <input type='text' placeholder='Enter question' value={list.question} onChange={(e) => handleQuestionChange(list.questionNumber, e)} id='questionName' key={list.questionNumber} className={Style.input}></input>
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
                                                    <div className={Style.optionDiv}>
                                                        <div>
                                                            <span key={key}>{key}: </span>
                                                            <input type='text' value={list.options[key]} placeholder='Enter option' id='options' key={Object.keys(list.options).length} onChange={(e) => handleOptionsChange(list.questionNumber, key, e)} className={Style.input}></input>
                                                        </div>
                                                        {key === '1' &&
                                                            <button onClick={() => handleAddOptionClick(list.questionNumber)} className={Style.addRemoveButton} key={key}>Add Option</button>
                                                        }
                                                        {key === lastKeyString &&
                                                            <button onClick={() => handleRemoveOptionClick(list.questionNumber)} className={Style.addRemoveButton} id={key}>Remove Option</button>
                                                        } 
                                                    </div>
                                                )    
                                            })
                                        }
                                    </div>
                                    {list.questionNumber === 1 &&
                                        <button className={Style.addRemoveQuesButton} onClick={handleAddQuesClick}>Add Question</button>
                                    }
                                    {list.questionNumber === length &&
                                        <button className={Style.addRemoveQuesButton} onClick={handleRemoveQuesClick}>Remove Question</button>
                                    }
                                </div>
                            )
                        })
                    }
                    <div className={Style.titleDiv}>
                        <div>
                            <h4 className={Style.title}>Answers *</h4>
                            {!!questionList &&
                                questionList.map((list) => {
                                    return (
                                        <div>
                                            <span>Ques {list.questionNumber}: </span>
                                            <input type='text' maxLength={1} placeholder='Enter the correct option number' onChange={(e) => handleAnswersChange(list.questionNumber, e)}  id='Answers' className={Style.input}></input>
                                        </div>
                                    )
                                })
                            }
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
                                <option value='True'>True</option>
                                <option value='False'>False</option>
                            </select>
                        </div>
                    </div>
                    <div className={Style.titleDiv}>
                        <div>
                            <h4 className={Style.title}>Allowed User</h4>
                            {!!allowedUser &&
                                allowedUser.map((value, index) => {
                                    const lastKey = allowedUser.length;
                                    if(index === 0) {
                                        return (
                                            <div className={Style.optionDiv}>
                                                <div>
                                                    <span id={index}>{index + 1}: </span>
                                                    <input type='text' value={value} placeholder='Enter user id' id='allowedUser' onChange={(e) => handleAllowedUserChange(index, e)} className={Style.input}></input>
                                                </div>
                                                <button onClick={handleAddUserClick} className={Style.addRemoveButton} key={index}>Add User</button>
                                            </div>
                                        )
                                    } else if(index === lastKey-1) {
                                        return (
                                            <div className={Style.optionDiv}>
                                                <div>
                                                    <span id={index}>{index + 1}: </span>
                                                    <input type='text' value={value} placeholder='Enter user id' id='allowedUser' onChange={(e) => handleAllowedUserChange(index, e)} className={Style.input}></input>
                                                </div>
                                                <button onClick={handleRemoveUserClick} className={Style.addRemoveButton} key={index}>Remove User</button>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div className={Style.optionDiv}>
                                                <div>
                                                    <span id={index}>{index + 1}: </span>
                                                    <input type='text' value={value} placeholder='Enter user id' id='allowedUser' onChange={(e) => handleAllowedUserChange(index, e)} className={Style.input}></input>
                                                </div>
                                            </div>
                                        )
                                    }
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