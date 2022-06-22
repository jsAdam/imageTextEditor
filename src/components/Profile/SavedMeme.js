import React, { Component } from "react";
import styles from '../../App.module.css';

import close from '../../images/close.png';
import download from '../../images/download.png';

class SavedMeme extends Component {
    constructor(props) {
        super(props);

        this.state = {
            deleting: false
        };

        this.download = this.download.bind(this);
        this.startDelete = this.startDelete.bind(this);
        this.stopDelete = this.stopDelete.bind(this);
    }

    download() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
    
        var base_image = new Image();
        base_image.crossOrigin = 'Anonymous';
        base_image.src = "https://memeinator-images.s3.amazonaws.com/" + this.props.fileName;
        base_image.onload = function() {
            canvas.width = base_image.width;
            canvas.height = base_image.height;
    
            ctx.drawImage(base_image, 0, 0);
    
            let link = document.createElement("a");
            link.download = "meme.png";
            link.href = canvas.toDataURL('image/png');
            link.click();

            canvas.remove();
        }
    }

    startDelete() {
        this.setState({
            deleting: true
        });
    }

    stopDelete() {
        this.setState({
            deleting: false
        });
    }

    render() {
        return (
            <div className={styles.saved_meme}>
                { this.state.deleting ? 
                <div className={styles.saved_meme__delete}>
                    <p>Delete this meme?</p>
                    <div className={styles.saved_meme__delete__buttons}>
                        <button onClick={() => this.props.deleteMeme(this.props.fileName)}>Yes</button>
                        <button onClick={this.stopDelete}>No</button>
                    </div>
                </div>
                : "" }
                <div className={styles.saved_meme__actions}>
                    <img onClick={this.download} src={download}></img>
                    <img onClick={this.startDelete} src={close}></img>
                </div>
                <img src={"https://memeinator-images.s3.amazonaws.com/" + this.props.fileName}></img>
            </div>
        );
    }
}

export default SavedMeme;