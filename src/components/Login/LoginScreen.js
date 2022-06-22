import React, { Component } from "react";
import styles from '../../App.module.css';
import $ from 'jquery';
import apiUrl from "../api";

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      retypedPassword: "",
      loginScreen: true
    };

    this.login = this.login.bind(this);
    this.createUser = this.createUser.bind(this);
    this.toggleScreenType = this.toggleScreenType.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  login(e) {
    e.preventDefault();
    console.log("WORKING2");

    let me = this;

    $.get(`${apiUrl}/users?username=${this.state.username}&password=${this.state.password}`, function (result) {
      if (result.userID) {
        me.props.playMessage("Logged in!");

        me.props.setUser(result.userID, me.state.username);
        me.props.toggleLoginScreen();
      } else {
        me.props.playMessage("Username and password do not match.");
      }
    });
  }

  createUser(e) {
    e.preventDefault();
    console.log("WORKING");

    if (this.state.password.length < 8) {
      this.props.playMessage("Password must be 8 characters or more.");
      return;
    }

    if (this.state.password === this.state.retypedPassword) {
      let me = this;

      $.ajax({
        method: "POST",
        url: `${apiUrl}/users?username=${this.state.username}&password=${this.state.password}`,
        dataType: "text"
      }).then(function (response) {
        me.props.playMessage("User created!");
      }).catch(function (ex) {
        console.log(ex);
        me.props.playMessage("User creation failed. Please try again.");
      });
    } else {
      this.props.playMessage("Passwords do not match.")
    }
  }

  toggleScreenType() {
    this.setState({
      loginScreen: !this.state.loginScreen
    });
  }

  render() {
    let screen = null;
    if (this.state.loginScreen) {
      screen =
        <div className={styles.login_form}>
          <form onSubmit={this.login}>
            <div className={styles.input_group}>
              <label>Username</label><br></br>
              <input type="text" name="username" value={this.state.username} onChange={this.handleInputChange}></input>
            </div>
            <div className={styles.input_group}>
              <label>Password</label><br></br>
              <input type="password" name="password" value={this.state.password} onChange={this.handleInputChange}></input>
            </div>
            <button type="submit">Login</button>
            <button className={styles.login_form__link} onClick={this.toggleScreenType}>Create User</button>
          </form>
        </div>;
    } else {
      screen =
        <div className={styles.login_form}>
          <form onSubmit={this.createUser}>
            <div className={styles.input_group}>
              <label>Username</label><br></br>
              <input type="text" name="username" value={this.state.username} onChange={this.handleInputChange}></input>
            </div>
            <div className={styles.input_group}>
              <label>Password</label><br></br>
              <input type="password" name="password" value={this.state.password} onChange={this.handleInputChange}></input>
            </div>
            <div className={styles.input_group}>
              <label>Retype Password</label><br></br>
              <input type="password" name="retypedPassword" value={this.state.retypedPassword} onChange={this.handleInputChange}></input>
            </div>
            <button type="submit">Create User</button>
            <button className={styles.login_form__link} onClick={this.toggleScreenType}>Login</button>
          </form>
        </div>
    }

    return (
      <div className={styles.login_screen}>
        <button className={styles.login__close} onClick={this.props.toggleLoginScreen}>x</button>
        <div className={styles.login}>
          {screen}
        </div>
      </div>
    )
  }
}

export default LoginScreen;