import axios from "axios";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ForgotPasword() {
    const params = useParams();
    const token = params.token;
    const navigate = useNavigate();
    useEffect(() => {
        axios
            .get(`http://localhost:3002/auth/forgotpassword/${token}`)
            .then((response) => {
                const message = response?.data?.message;
                const messageArray = message.split('/');
                const userId = messageArray[5];
                navigate(`/auth/resetpassword`, {state: { userId }});
            })
            .catch((error) => {
                const message = error?.response?.data?.message;
                if(error?.response?.status === 500) {
                    navigate("/auth/login");
                }
                if(!!message && message.includes("Invalid link!")) {
                    navigate("/auth/login");
                }
            })
    }, [])
}

export default ForgotPasword;