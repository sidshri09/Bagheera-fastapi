import React, { useState } from "react";
import { Link } from "react-router-dom";
import S3UploadUsingCognitoIdPool from "../S3UploadUsingCognitoIdPool";
import Alert from "../Alert";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedEmail, setConfirmedEmail] = useState("");
  const [signedUp, setSignedUp] = useState(false);
  const signupUrl = "http://localhost:8000/users";
  const signupProdUrl = "https://fastapi-bagheera.herokuapp.com/users";
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });

  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, type, msg });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch(signupProdUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });
    const data = await response.json();

    if (response.status === 201) {
      console.log(data);
      setConfirmedEmail(data.email);
      setEmail("");
      setPassword("");
      setSignedUp(true);
    }
    if (response.status === 409) {
      showAlert(
        true,
        "danger",
        "email id already belongs to a registered user"
      );
    }
  };
  return (
    <>
      {signedUp ? (
        <article style={{ display: "grid", justifyContent: "center" }}>
          <h1 style={{fontFamily:'cursive'}}>Hi !! {confirmedEmail}!!</h1>
          <Link to="/signin">
            <span style={{fontFamily:'cursive'}}>Login here to enjoi Posts</span>
          </Link>
        </article>
      ) : (
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <form
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              marginTop: "50px",
            }}
            onSubmit={handleLogin}
          >
            <div style={{ display: "flex", flexDirection: "row" }}>
              <input
                style={{
                  border: "none",
                  borderTopLeftRadius: "5px",
                  borderBottomLeftRadius: "5px",
                  paddingLeft: "15px",
                  paddingTop: "2px",
                  paddingBottom: "2px",
                  height: "35px",
                  width: "100px",
                  background: "hsl(210, 36%, 96%)",
                }}
                type="text"
                id="email"
                value={email}
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                style={{
                  border: "none",
                  borderTopLeftRadius: "5px",
                  borderBottomLeftRadius: "5px",
                  paddingLeft: "15px",
                  paddingTop: "2px",
                  paddingBottom: "2px",
                  height: "35px",
                  width: "100px",
                  background: "hsl(210, 36%, 96%)",
                }}
                type="password"
                id="password"
                value={password}
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
              />

              <button className="button" type="submit">
                Signup
              </button>
            </div>
          </form>
          {alert.show && (
            <Alert
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
              {...alert}
              removeAlert={showAlert}
              condition={password}
            />
          )}
        </section>
      )}
    </>
  );
};

export default Signup;
