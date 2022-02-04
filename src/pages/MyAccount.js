import React, { useState, useEffect } from "react";
import S3UploadUsingCognitoIdPool from "../S3UploadUsingCognitoIdPool";
import Loading from "../Loading";
import Alert from "../Alert";

export default function MyAccount() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [oldPass, setOldPass] = useState("")
  const [updated, setUpdated] = useState(false);
  const [passUpdated, setPassUpdated] = useState(false);
  const [phoneUpdated, setPhoneUpdated] = useState(false);
  const getUserUrl =
    "http://localhost:8000/users/" + localStorage.getItem("user_id");
  const getProdUserUrl =
    "https://fastapi-bagheera.herokuapp.com/users/" +localStorage.getItem("user_id");
  const putUserProdUrl = "https://fastapi-bagheera.herokuapp.com/users/";
  const putUserUrl = "http://localhost:8000/users/";
  const [user, setUser] = useState({});
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });

  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, type, msg });
  };

  const updateAccount = async (e) => {
    e.preventDefault();
    if (!(phone === "e.g. 9898989898")) {
      const response = await fetch(putUserProdUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({"phone": `${phone}`}),
      });
      if (response.status === 200) {
        setPhoneUpdated(true);
        console.log("phone number updated")
      } else {
        showAlert(
          true,
          "danger",
          "Internal Application Error, Please try again after sometime."
        );
      }
    }else {
      showAlert(
        true,
        "danger",
        "Phone number not updated"
      );
    }
    if (!(password === "" || oldPass === "")) {
      const update_pwd_response = await fetch(
        `${putUserProdUrl}changepassword/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: JSON.stringify({ email:user.email, old_password: oldPass , password: password }),
        }
      );
      console.log(update_pwd_response.status)
      if (update_pwd_response.status === 200) {
        setPassUpdated(true);
        console.log("password updated")
      } else {
        showAlert(
          true,
          "danger",
          "Internal Application Error, Please try again after sometime."
        );
      }
    }else {
      showAlert(
        true,
        "danger",
        "Password not changed"
      );
    }
  };
  const fetchUserDetails = async () => {
    const response = await fetch(getProdUserUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    if (response.status === 200) {
      const user_data = await response.json();
      console.log(user_data);
      setUser(user_data.User);
    } else {
      console.log(response.status);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    if (user.phone !== null) {
      setPhone(user.phone);
    } else {
      setPhone("e.g. 9898989898");
    }
  }, [getProdUserUrl, localStorage.getItem("accessToken")], localStorage.getItem("user_id"));

  if (!localStorage.getItem("loggedin")) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h3>You're not loggedin</h3>
        <Loading />
      </div>
    );
  }
  return (
    <>
     (
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          <form
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              marginTop: "50px",
              backgroundColor: "white",
              padding: "25px",
              width: "500px",
            }}
            onSubmit={updateAccount}
          >
            <div style={{ display: "flex", flexDirection: "column", border:'2px solid #34b38d', borderTopLeftRadius:'10%', padding:'20px' }}>
              <label>
                Email
                <input
                  style={{
                    marginLeft: "35px",
                    border: "none",
                    borderTopLeftRadius: "5px",
                    borderBottomLeftRadius: "5px",
                    paddingLeft: "15px",
                    paddingTop: "2px",
                    paddingBottom: "2px",
                    height: "35px",
                    width: "200px",
                    background: "white",
                  }}
                  readOnly={true}
                  type="text"
                  id="email"
                  placeholder={user.email}
                />
              </label>
              <label>
                Old Password{" "}
                <input
                  style={{
                    marginLeft: "35px",
                    border: "none",
                    borderTopLeftRadius: "5px",
                    borderBottomLeftRadius: "5px",
                    paddingLeft: "15px",
                    paddingTop: "2px",
                    paddingBottom: "2px",
                    height: "35px",
                    width: "100px",
                    background: "white",
                  }}
                  type="password"
                  id="password"
                  value={oldPass}
                  placeholder="password"
                  onChange={(e) => setOldPass(e.target.value)}
                />
              </label>
              <label>
                New Password{" "}
                <input
                  style={{
                    marginLeft: "35px",
                    border: "none",
                    borderTopLeftRadius: "5px",
                    borderBottomLeftRadius: "5px",
                    paddingLeft: "15px",
                    paddingTop: "2px",
                    paddingBottom: "2px",
                    height: "35px",
                    width: "100px",
                    background: "white",
                  }}
                  type="password"
                  id="password"
                  value={password}
                  placeholder="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <label>
                Phone
                <input
                  style={{
                    marginLeft: "35px",
                    border: "none",
                    borderTopLeftRadius: "5px",
                    borderBottomLeftRadius: "5px",
                    paddingLeft: "15px",
                    paddingTop: "2px",
                    paddingBottom: "2px",
                    height: "35px",
                    width: "150px",
                    background: "white",
                  }}
                  type="text"
                  value={phone}
                  placeholder={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>

              <button
                style={{ marginTop: "20px" }}
                className="account-btn"
                type="submit"
                onClick={updateAccount}
              >
                Update
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
          <div
            style={{
              width: "500px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              margin: "50px",
              backgroundColor: "white",
              padding: "25px",
              border:'2px solid #34b38d', borderTopLeftRadius:'10%', padding:'20px'
            }}
          >
            <img
              src={user["profile_pic"]}
              style={{ width: "100px", height: "100px", borderRadius: "50%" }}
            ></img>
            <h3 style={{ marginTop: "20px", fontFamily:'cursive' }}>Upload Profile Picture</h3>
            <S3UploadUsingCognitoIdPool />
          </div>
        </section>
      )
    </>
  );
}
