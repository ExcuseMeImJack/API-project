// frontend/src/components/LoginFormModal/index.js
import React, { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import { useHistory } from "react-router-dom";

function LoginFormModal() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    const err = {};
    if(credential.length < 4) err.credentials = "Username or Email must be 4 or more characters."
    if(password.length < 6) err.password = "Password must be 6 or more characters."
    setErrors(err);
  }, [credential, password])

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .then(history.push('/'))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <div className="login-form-div">
      <h2-semibold className="login-text">Log In</h2-semibold>
      <form onSubmit={handleSubmit}>
      {errors.credential && (<p className="errors-shown-removepadding">{errors.credential}</p>)}
      <div className="login-credential-div">
        <label className="login-credential-label"></label>
          <input
            className="login-credential-input"
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            placeholder="Username or Email"
          />
      </div>
      <div className="login-password-div">
          <input
            className="login-password-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
      </div>
          <div className="login-div">
            <button className={Object.values(errors).length > 0 ? 'login-button-invalid' : 'login-button-valid changeCursor'} type="submit" disabled={Object.values(errors).length > 0} >Log In</button>
          </div>
      </form>
      <div className="demouser-login-div">
        <button className="demouser-login-button changeCursor" onClick={() => {
          dispatch(sessionActions.login({ credential: 'demo@user.io', password: 'password' }))
          .then(closeModal)
          history.push('/')
        }}>Demo User</button>
      </div>
    </div>
  );
}

export default LoginFormModal;
