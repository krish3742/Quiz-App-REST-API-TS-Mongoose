import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import Style from './MyAccount.module.css';

function MyAccount() {
    const location = useLocation();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [myQuizList, setMyQuizList] = useState([]); 
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
    function handleChangePasswordClick(evt) {
        navigate('/auth/user/change-password', { state: { token }});
    }
    function handleNameEditClick(evt) {
        evt.preventDefault();
        navigate('/auth/user/change-name', { state: { token }}) 
    }
    function handleDeactivateAccountClick(evt) {
        evt.preventDefault();
        setIsLoading(true);
        axios.patch('http://localhost:3002/user/deactivate', {}, { headers })
            .then((response) => {
                setIsLoading(false);
                navigate('/auth/user/deactivateaccount', { state: { token }})
            })
            .catch((error) => {
                setIsLoading(false);
                const message = error?.response?.data?.message;
                if(message.includes("Resend OTP after")) {
                    const minute = message.charAt(17);
                    if(minute == 0) {
                        setErrors('Try again after 1 minute');
                    } else {
                        setErrors(`Try again after ${minute} minutes`);
                    }
                } else {
                    navigate('/auth/login');
                }
            })
    }
    useEffect(() => {
        if(!!token) {
            axios
                .get('http://localhost:3002/user', { headers })
                .then((response) => {
                    setIsLoading(false);
                    const data = response.data.data;
                    setName(data.name);
                    setEmail(data.email);
                })
                .catch((error) => {
                    setIsLoading(false);
                    navigate('/auth/register');
                })
        } else {
            navigate('/auth/login');
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
    }, []);
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
                <h2 className={Style.heading}>Login and Security</h2>
                <div className={Style.accountDiv}> 
                    <div className={Style.titleDiv}>
                        <div>
                            <h4 className={Style.title}>Name</h4>
                            <p className={Style.para}>{name}</p>
                        </div>
                        <button className={Style.editButton} onClick={handleNameEditClick}>Edit</button>
                    </div>
                    <div className={Style.line}></div>
                    <div className={Style.paraDiv}>
                        <h4 className={Style.title}>Email</h4>
                        <p className={Style.para}>{email}</p>
                    </div>
                    <div className={Style.line}></div>
                    <div className={Style.titleDiv}>
                        <div>
                            <h4 className={Style.title}>Password</h4>
                            <p className={Style.para}>**********</p>
                        </div>
                        <button className={Style.editButton} onClick={handleChangePasswordClick}>Edit</button>
                    </div>
                    <div className={Style.line}></div>
                    <div className={Style.deactivateAccountDiv}>
                        <button className={Style.deactivateAccountButton} onClick={handleDeactivateAccountClick}>Deactivate account!</button>
                        {!!errors && errors?.includes("Try again") &&
                            <>
                                <i className={Style.icon}>{String.fromCodePoint(0x26A0)}</i>
                                <p className={Style.errorPara}>{errors}</p>
                            </>
                        }
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

export default MyAccount;