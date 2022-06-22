import React, { Component } from "react";
import $ from 'jquery';

import styles from '../../App.module.css';
import apiUrl from "../api";
import SavedMeme from "./SavedMeme";

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            savedMemes: []
        }

        this.deleteMeme = this.deleteMeme.bind(this);
    }

    componentDidMount() {
        let me = this;

        $.ajax({
            method: "GET",
            url: `${apiUrl}/memes?userID=${this.props.userID}`,
            dataType: "json",
            contentType: "application/json"
        }).then(function(response){
            
            if(response) {
                me.setState({
                    savedMemes: response
                });
            }
        });
    }

    deleteMeme(fileName) {
        let me = this;
        
        $.ajax({
            method: "DELETE",
            url: `${apiUrl}/memes?fileName=${fileName}&userID=${this.props.userID}`,
            dataType: "json",
            contentType: "application/json"
        }).then(function(response){
            let savedMemes = me.state.savedMemes;
            let idx = savedMemes.findIndex(m => m === fileName);
            savedMemes.splice(idx, 1);

            me.setState({
                savedMemes
            });
        }).catch(function(ex) {
            console.log(ex);
        });
    }

    render() {
        let savedMemes = this.state.savedMemes.map((fileName) => {
            return <SavedMeme key={fileName} fileName={fileName} deleteMeme={this.deleteMeme}></SavedMeme>;
        })

        return (
            <div id={styles.profile}>
                <div className={styles.profile__header}>
                    <h2>Saved Memes</h2>
                </div>
                <div className={styles.profile__memes}>
                    {savedMemes}
                </div>
            </div>
        );
    }
}

export default Profile;