import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import Style from './AllReports.module.css';

function Reports() {
    const location = useLocation();
    const navigate = useNavigate();
    const [flag, setFlag] = useState(0);
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [tempReports, setTempReports] = useState();
    const [isMyQuizOpen, setIsMyQuizOpen] = useState(false);
    const [isQuizzesOpen, setIsQuizzesOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isFavouriteQuestionOpen, setIsFavouriteQuestionOpen] = useState(false);
    const token = location?.state?.token;
    const headers = {'Authorization': `Bearer ${token}`};
    function handleLogoutClick(evt) {
        setIsLoading(true);
        axios
            .post(`http://${process.env.REACT_APP_BACKEND_URL}/user/logout`, {}, { headers })
            .then(() => {
                setIsLoading(false);
                navigate('/auth/login');
            })
            .catch(() => {
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
    function handleFavouriteQuestionClick(evt) {
        evt.preventDefault();
        navigate('/auth/user/fav-ques', { state: { token }});
    }
    function handleQuizzesClick(evt) {
        evt.preventDefault();
        navigate('/auth/published-quiz', { state: { token }});
    }
    function handleViewButtonClick(id, evt) {
        evt.preventDefault();
        navigate(`/auth/report/${id}`, { state: { token }});
    }
    useEffect(() => {
        if(!tempReports) {
            axios
                .get(`http://${process.env.REACT_APP_BACKEND_URL}/report`, { headers })
                .then((response) => {
                    setFlag(!flag);
                    setTempReports(response?.data?.data);
                })
                .catch(() => {
                    setIsLoading(false);
                    navigate('/auth/login');
                });
        } else if(!!tempReports) {
            tempReports.map((report) => {
                axios
                    .get(`http://${process.env.REACT_APP_BACKEND_URL}/quiz/name/${report?.quizId}`, { headers })
                    .then((response) => {
                        setIsLoading(false);
                        setReports((oldArray) => [...oldArray, {...report, quizName: response?.data?.data?.name}]);
                    })
                    .catch(() => {
                        setIsLoading(false);
                        navigate('/auth/login');
                    })
            });
        }
    }, [flag]);
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
                <h2 className={Style.heading}>All Reports</h2>
                {!!reports &&
                    reports.map((report) => {
                        return (
                            <div className={Style.accountDiv} key={report?._id}>
                                <div className={Style.titleDiv}>
                                    <div>
                                        <h4 className={Style.quiz}>{report?.quizName}</h4>
                                    </div>
                                    <div>
                                        <button className={Style.button} onClick={(evt) => handleViewButtonClick(report?._id, evt)}>View</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
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

export default Reports;