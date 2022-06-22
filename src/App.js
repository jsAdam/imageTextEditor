import React, { Component } from "react";
import styles from './App.module.css';
import LoginScreen from './components/Login/LoginScreen';
import Generator from './components/Generator/Generator';
import Profile from './components/Profile/Profile';
import doofenshmirtz from './images/doofenshmirtz.png';
import $ from 'jquery';

export class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showLoginScreen: false,
            showSavedMemes: false,
            user: {
                userID: null,
                userName: null,
            },
            message: {
                value: "",
                isPlaying: false
            }
        }

        this.toggleLoginScreen = this.toggleLoginScreen.bind(this);
        this.setUser = this.setUser.bind(this);
        this.playMessage = this.playMessage.bind(this);
        this.showSavedMemes = this.showSavedMemes.bind(this);
        this.showMemeCreation = this.showMemeCreation.bind(this);
        this.logout = this.logout.bind(this);
    }

    toggleLoginScreen() {
        this.setState({
            showLoginScreen: !this.state.showLoginScreen
        })
    }

    setUser(userID, userName) {
        this.setState({
            user: {
                userID,
                userName
            }
        });
    }

    logout() {
        this.setState({
            user: {
                userID: null,
                userName: null
            },
            showSavedMemes: false
        });

        this.playMessage("Logged out!");
    }

    playMessage(message) {
        this.setState({
            message: {
                value: message,
                isPlaying: true
            }
        });

        $("#app_messager").removeClass("hide");
        $("#app_messager").addClass("show");

        setTimeout(() => {
            /* console.log("PLAYING"); */
            this.setState({
                message: {
                    value: message,
                    isPlaying: false
                }
            });

            $("#app_messager").removeClass("show");
            $("#app_messager").addClass("hide");
        }, 3000)
    }

    showSavedMemes() {
        this.setState({
            showSavedMemes: true
        });
    }

    showMemeCreation() {
        this.setState({
            showSavedMemes: false
        });
    }

    render() {
        let loginStateStyle = { background: "red" };
        let loginStateMessage = <p>Not currently logged in.</p>;

        if (this.state.user.userID) {
            loginStateStyle.background = "green";
            loginStateMessage = <p>Logged in as <b><i>{this.state.user.userName}</i></b></p>;
        }

        let leftHeaderOptions =
            <div className={styles.header__left}>
                <button onClick={this.toggleLoginScreen}>Login</button>
            </div>

        if (this.state.user.userID) {
            if (this.state.showSavedMemes) {
                leftHeaderOptions =
                    <div className={styles.header__left}>
                        <button onClick={this.logout}>Logout</button>
                        <button onClick={this.showMemeCreation}>Meme Generator</button>
                    </div>;
            } else {
                leftHeaderOptions =
                    <div>
                        <button onClick={this.logout}>Logout</button>
                        <button onClick={this.showSavedMemes}>Saved Memes</button>
                    </div>;
            }
        }

        return (
            <div id={styles.app}>
                <div className={styles.app__content}>
                    {this.state.showLoginScreen ? <LoginScreen setUser={this.setUser} playMessage={this.playMessage} toggleLoginScreen={this.toggleLoginScreen}></LoginScreen> : ""}
                    <nav id={styles.header}>
                        {leftHeaderOptions}

                        <div className={styles.header__right}>
                            <div className={styles.login_state}>
                                <div className={styles.login_state__icon} style={loginStateStyle}></div>
                                {loginStateMessage}
                            </div>
                        </div>
                    </nav>

                    {this.state.showSavedMemes ? <Profile userID={this.state.user.userID}></Profile> : <Generator userID={this.state.user.userID} playMessage={this.playMessage}></Generator>}
                </div>
                <div className={styles.app__doof}>
                    <div id="app_messager" className="app_messager">
                        <p>{this.state.message.value}</p>
                    </div>

                    <h2>Text-on-Image</h2>
                </div>
            </div>
        )
    }
}

export default App;