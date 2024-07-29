import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import Style from './ExamPage.module.css';

function ExamPage() {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate(); 
    const [quiz, setQuiz] = useState();
    const [errors, setErrors] = useState(["testing"]);
    const [quizId, setQuizId] = useState(params?.id);
    const [isLoading, setIsLoading] = useState(true);
    const [attemptedQuestion, setAttemptedQuestion] = useState({});
    const token = location?.state?.token;
    const headers = {'Authorization': `Bearer ${token}`};
    function handleOptionChangeClick(questionNumber, key) {
        setAttemptedQuestion((oldObject) => {
            return {...oldObject, [questionNumber]: key};
        })
    }
    function handleClearButtonClick(questionNumber, e) {
        e.preventDefault();
        setAttemptedQuestion((oldObject) => {
            let object = {};
            for(let i in oldObject) {
                if(i == questionNumber) {
                    object = {...object};
                } else {
                    object = {...object, [i]: oldObject[i]};
                }
            }
            return object;
        })
    }
    function handleSubmitClick(evt) {
        evt.preventDefault();
        setErrors([]);
        // setIsLoading(true);
        if(quiz.questionList.length !== Object.keys(attemptedQuestion).length) {
            setErrors(["Attempt all the questions"]);
        }
    }
    console.log(attemptedQuestion);
    useEffect(() => {
        if(!!errors && errors.length === 0) {
            axios
                .post("http://localhost:3002/exam", {quizId: params?.id, attemptedQuestion}, { headers })
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.log(error);
                })
        }
        if(!!quizId) {
            axios
                .get(`http://localhost:3002/exam/${quizId}`, { headers })
                .then((response) => {
                    setIsLoading(false);
                    setQuizId("");
                    console.log(response);
                    setQuiz(response?.data?.data);
                })
                .catch((error) => {
                    setIsLoading(false);
                    setQuizId("");
                    const message = error?.response?.data?.message;
                    if(message.includes("You have zero attempts left!")) {
                        navigate('/auth/published-quiz', { state: { token, message: true }});
                    } else {
                        navigate('/auth/login');
                    }
                })
        }
    }, [quizId, errors]);
    if(!token) {
        return <Navigate to='/auth/login' />
    }
    return (
        <>
            <div className={Style.container}>
                <h2 className={Style.title}>Quiz App</h2>
            </div>
            <div className={Style.linear}>
                <h2 className={Style.heading}>{quiz?.name}</h2>
                {!!quiz && quiz?.questionList.map((list) => {
                    return (
                        <div className={Style.titleDiv} key={list.questionNumber}>
                            <div>
                                <div className={Style.quesDiv}>
                                    <h4 className={Style.quesTitle}>Question {list.questionNumber}:</h4>
                                    <p className={Style.para}>{list.question}</p>
                                    <p className={Style.star}>*</p>
                                </div>
                                <div className={Style.optionDiv}>
                                    <h4 className={Style.titleOption}>Options</h4>
                                    {!!list.options &&
                                        Object.keys(list.options).map(function (key) {
                                            return (
                                                <div className={Style.optionsDiv} key={key}>
                                                    <input type='radio' name={'question' + list.questionNumber} onChange={(e) => handleOptionChangeClick(list.questionNumber, key)} value={key} checked={
                                                        !!attemptedQuestion && 
                                                            Object.keys(attemptedQuestion).some((index) => {
                                                                if(index == list.questionNumber && attemptedQuestion[index] == key) {
                                                                    return true;
                                                                }
                                                                return false;
                                                            })
                                                    }></input>
                                                    <p className={Style.para}>{key}:</p>
                                                    <p className={Style.para}>{list.options[key]}</p>
                                                </div>
                                            )    
                                        })
                                    }
                                    <button className={Style.clearButton} onClick={(e) => handleClearButtonClick(list.questionNumber, e)}>Clear choice</button>
                                </div>
                            </div>
                        </div>
                    )
                })}
                {!!errors && errors.length > 0 && !errors.includes('testing') &&
                    <div className={Style.instructionParaDiv}>
                        <ul>
                            {errors.map(message =>  {
                                return <li key={message}>{message}</li>
                            })}
                        </ul>
                    </div>
                }
                <button className={Style.submitButton} onClick={(e) => handleSubmitClick(e)}>Submit</button>
            </div>
            {isLoading && 
                <div className={Style.loading}>
                    <div className={Style.loader}></div>
                </div>
            }
        </>
    )
}

export default ExamPage;