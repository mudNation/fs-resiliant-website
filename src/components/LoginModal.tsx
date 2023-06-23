import '../style/login.scss'; 

interface LoginModaltype{
    mode: string,
    onSubmit: () => void,
    onAlternate: () => void,
    children: JSX.Element,
    error: string, 
    disabled: boolean,
}

const LoginModal = ({ mode, onSubmit, onAlternate, children, error, disabled } : LoginModaltype) => {
    return(
        (
            <div className='loginContent'>
                <div className='loginBackground'></div>
                <div className='loginModal'>
                    <h1>{mode}</h1>

                    {/* <input type='text' placeholder='Username or Email' />
                    <input type='password' placeholder='Your Password' /> */}
                    {children}

                    <p className='error'>{error}</p>

                    <button onClick={onSubmit} disabled={disabled}>{disabled ? '...' : mode}</button>
                    <p className="alternate" onClick={onAlternate}>{mode==="Login" ? "Don't have an account? Sign Up" : "Already have an account? Login"}</p>
                </div>
            </div>
        )
    )
}

export default LoginModal; 