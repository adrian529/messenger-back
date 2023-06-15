import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../auth/authSlice';
import { useLoginMutation } from '../auth/authApiSlice';
import { useGoogleLoginMutation } from '../auth/authApiSlice';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../auth/authSlice';

function Login() {

    const location = useLocation();
    const dispatch = useAppDispatch()
    let [googleLogin] = useGoogleLoginMutation()

    const [timesRun, setTimesRun] = useState(0);
    const counter = useRef(0);
    const effectCalled = useRef(false);
    let user = useAppSelector(state => selectCurrentUser(state))
    console.log('user: ', user)

    const socialLogin = async () => {
        try {
            const { search } = location
            const codeFromGoogle = search.slice(6) // to get the value of the code query param.

            let userData = await googleLogin(codeFromGoogle) // unwrap lets you use try/catch block
    
            window.location.replace('/')

        } catch (err) {
            console.error(err)
        }
    }

    const { pathname } = location;
    console.log(pathname)
    if (pathname === '/auth/google') {

        // this ensures that the social login method is run only when the path is /auth/google
        useEffect(() => {
            //wyjebac to w produkcji
            if (effectCalled.current) return;
            counter.current += 1;
            setTimesRun(counter.current);
            effectCalled.current = true;

            socialLogin()
        }, [])
        return (
        <>
        </>
        )

    } else {
        // the app continues with its normal logic

        const queryParams = queryString.stringify({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, // It must correspond to what we declared earlier in the backend
            scope: 'profile email', // This is the user data you have access to, in our case its just the mail.
            redirect_uri: `http://localhost:5173/auth/google`, // This is the uri that will be redirected to if the user signs into his google account successfully
            auth_type: 'rerequest', // This tells the consent screen to reappear if the user initially entered wrong credentials into the google modal
            display: 'popup', //It pops up the consent screen when the anchor tag is clicked
            response_type: 'code', // This tells Google to append code to the response which will be sent to the backend which exchange the code for a token
            access_type: 'offline',
        });
        const url = `https://accounts.google.com/o/oauth2/v2/auth?${queryParams}`

        const content = (
            <section className='login-section'>
                <form className='login-form'>
                    <button type='button' className='login-form-button' onClick={() => window.location.href = url}>Continue with Google</button>
                </form>
            </section>
        )

        return content
    }
}

export default Login