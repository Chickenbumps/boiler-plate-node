import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../_actions/user_action";
import { withRouter } from "react-router-dom";
function RegisterPage(props) {
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });
  const { email, name, password, confirmPassword } = inputs;

  const onChange = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return alert("Check the password.");
    }
    const info = {
      email: email,
      password: password,
      name: name,
    };
    console.log(info);
    dispatch(registerUser(info)).then((res) => {
      console.log(res.payload.success);
      if (res.payload.success) {
        props.history.push("/login");
      } else {
        alert("register error");
      }
    });
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={onSubmit}
      >
        <label>Email</label>
        <input name="email" type="email" onChange={onChange} />
        <label>Name</label>
        <input name="name" type="text" onChange={onChange} />
        <label>Password</label>
        <input name="password" type="password" onChange={onChange} />
        <label>Confirm Password</label>
        <input name="confirmPassword" type="password" onChange={onChange} />
        <br />
        <button>Sign up</button>
      </form>
    </div>
  );
}
export default withRouter(RegisterPage);
