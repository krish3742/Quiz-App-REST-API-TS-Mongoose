import Style from './ChangeName.module.css';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function ChangeName() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const token = location?.state?.token;
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const headers = {'Authorization': `Bearer ${token}`};
    const [errors, setErrors] = useState([]);
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
    function handleNameChange(evt) {
        setName(evt.target.value);
    }
    function handleNameSubmitClick(evt) {
        evt.preventDefault();
        setErrors([]);
        setIsLoading(true);
        if(!name) {
            setErrors((oldArray) => [...oldArray, "Please enter name"])
        }
    }
    useEffect(() => {
        if(!!token) {
            axios
                .get('http://localhost:3002/user', { headers })
                .then((response) => {
                    setIsLoading(false);
                    const data = response.data.data;
                    setEmail(data.email);
                })
                .catch((error) => {
                    console.log(error);
                    setIsLoading(false);
                    navigate('/auth/register');
                })
        } else {
            navigate('/auth/login');
        }
        if(!!errors && errors.length === 0 && name.length >= 1) {
            axios
                .put('http://localhost:3002/user', { name }, { headers })
                .then((response) => {
                    setIsLoading(false);
                    navigate('/auth/user/my-account', { state: { token }})
                })
                .catch((error) => {
                    console.log(error);
                    setIsLoading(false);
                    navigate('/auth/login')
                })
        }
    }, [errors]);
    if(!token) {
        return <Navigate to='/auth/login' />
    }
    return (
        <>
            <div className={Style.container}>
                <h2 className={Style.title}>Quiz App</h2>
                <div className={Style.menuDiv}>
                    <h4 className={Style.menu}>Quizzes</h4>
                    <h4 className={Style.menu}>Reports</h4>
                    <h4 className={Style.menu}>My Quiz</h4>
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
                            <label htmlFor='Name'></label>
                            <input type='text' placeholder='Enter name' value={name} onChange={handleNameChange} className={Style.input}></input>
                        </div>
                        <button className={Style.editButton} onClick={handleNameSubmitClick} >Submit</button>
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
                        <button className={Style.editButton}>Edit</button>
                    </div>
                    <div className={Style.line}></div>
                    <div className={Style.deactivateAccountDiv}>
                        <button className={Style.deactivateAccountButton}>Deactivate account!</button>
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

export default ChangeName;