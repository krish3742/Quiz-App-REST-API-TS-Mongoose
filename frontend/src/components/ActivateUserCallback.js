import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ActivateUserCallback() {
    const params = useParams();
    const navigate = useNavigate();
    const token = params.token;
    useEffect(() => {
        if(!token) {
            navigate('/auth/register');
        } else if(!!token) {
            axios
                .get(`http://localhost:3002/auth/activate/${token}`)
                .then((response) => {
                    navigate('/auth/login', { state: { message: "Account activated, login!" }});
                })
                .catch((error) => {
                    navigate('/auth/register');
                })
        }
    }, [])
}

export default ActivateUserCallback;