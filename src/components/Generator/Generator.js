import React, { Component } from "react";
import $ from 'jquery';

import styles from '../../App.module.css';
import apiUrl from "../api";
import TextMoveableEditor from "./TextMoveableEditor";
import ImageCreator from "../ImageCreator/ImageCreator";

import DownloadIcon from '@mui/icons-material/Download';
import SaveIcon from '@mui/icons-material/Save';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';

class Generator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fontNames: [],
            textIDCounter: 2,
            texts: [
                {
                    value: "Text 0",
                    font: "Arial",
                    fontSize: 30,
                    color: "#FFFFFF",
                    selected: false,
                    id: 0
                },
                {
                    value: "Text 1",
                    font: "Arial",
                    fontSize: 30,
                    color: "#FFFFFF",
                    selected: false,
                    id: 1
                }
            ],
            imageSrc: null
        }
        
        this.deleteText = this.deleteText.bind(this);
        this.updateText = this.updateText.bind(this);
        this.addText = this.addText.bind(this);

        this.setImageSrc = this.setImageSrc.bind(this);
        this.clearImage = this.clearImage.bind(this);
        this.downloadMeme = this.downloadMeme.bind(this);
        this.saveMeme = this.saveMeme.bind(this);
    }

    clearImage(e) {
        e.preventDefault();

        this.setState({
            imageSrc: null,
            memeTextTop: "",
            memeTextBottom: ""
        });
    }

    setImageSrc(imageSrc) {
        this.setState({
            imageSrc
        });
    }

    componentDidMount() {
        fetch('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyDaxw5i-WUQ3POSNhkqWF1LWAjcUDgSCSM&sort=popularity')
            .then(response => response.json())
            .then(data => {
                /*  console.log(data.items); */
                let fontNames = [];
                let googleFontUrl = "https://fonts.googleapis.com/css2?family=Open+Sans";

                for (let i = 0; i < (data.items.length > 100 ? 100 : data.items.length); i++) {
                    let font = data.items[i];
                    fontNames.push(font.family);

                    let fontFamilyName = font.family.replaceAll(" ", "+");
                    googleFontUrl += `&family=${fontFamilyName}`;
                }
                googleFontUrl += "&display=swap";

                /*  console.log(googleFontUrl); */
                //googleFontUrl = "https://fonts.googleapis.com/css2?family=Dongle:wght@300&family=Neonderthaw&family=Open+Sans:wght@300&display=swap"

                let link = document.createElement('link');
                link.setAttribute('rel', 'stylesheet');
                link.setAttribute('href', googleFontUrl);
                document.head.appendChild(link);

                fontNames.sort();
                this.setState({
                    fontNames
                });
            });
    }

    downloadMeme(e) {
        e.preventDefault();

        let dataURL = $("#myCanvas")[0].toDataURL();
        let link = document.createElement("a");
        link.download = "meme.png";
        link.href = dataURL;
        link.click();
    }

    saveMeme(e) {
        e.preventDefault();

        let me = this;
        console.log(this.props.userID);

        if (this.props.userID) {
            console.log("Making ajax call");
            let dataURL = $("#myCanvas")[0].toDataURL();

            $.ajax({
                method: "POST",
                url: `${apiUrl}/memes`,
                data: JSON.stringify({
                    dataURL,
                    userID: this.props.userID
                }),
                dataType: "json",
                contentType: "application/json"
            }).then(function (response) {
                me.props.playMessage("Meme saved!");
                console.log(response);
            }).catch(function (ex) {
                console.log(ex);
            });
        } else {
            this.props.playMessage("Need to login!");
        }
    }

    addText(e) {
        e.preventDefault();

        let id = this.state.textIDCounter + 1;

        let texts = [...this.state.texts];
        texts.push({
            value: `Text ${id}`,
            font: this.state.fontNames[0],
            fontSize: 30,
            color: "#FFFFFF",
            selected: false,
            id: id
        });

        this.setState({
            texts,
            textIDCounter: id
        });
    }

    deleteText(textId) {
        let texts = [...this.state.texts];

        let textIndex = texts.findIndex(text => text.id == textId);
        texts.splice(textIndex, 1);

        this.setState({
            texts
        }, () => {
            /*  console.log(this.state.texts); */
        });
    }

    updateText(textId, value, color, fontSize, font) {
        if(value == "" || value == null) {
            this.props.playMessage("Text cannot be empty!");
            return;
        }
        let texts = [...this.state.texts];

        let textIndex = texts.findIndex(text => text.id == textId);
        
        texts[textIndex] = {
            value,
            font,
            fontSize,
            color,
            id: textId
        };

        this.setState({
            texts
        }, () => {
              console.log(this.state.texts); 
        });
    }

    render() {
        let textFontOptions = this.state.fontNames.map(fontName => {
            return (<option key={fontName} value={fontName} style={{ fontFamily: fontName }}>{fontName}</option>);
        })

        let texts = this.state.texts.map((t, idx) => {
            return (
                <TextMoveableEditor key={idx} textObject={t} textFontOptions={textFontOptions} updateText={this.updateText} deleteText={this.deleteText}></TextMoveableEditor>
            );
        })

        return (
            <div id={styles.meme_generator}>
                <ImageCreator
                    texts={this.state.texts}
                    imageSrc={this.state.imageSrc}
                    setImageSrc={this.setImageSrc}>
                </ImageCreator>
                <div className={styles.meme_form}>
                    <form>
                        <div>
                            <Tooltip title="Download Meme">
                                <IconButton onClick={this.downloadMeme}>
                                    <DownloadIcon fontSize="large" color="secondary" />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Save Meme">
                                <IconButton onClick={this.saveMeme}>
                                    <SaveIcon fontSize="large" color="secondary" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Reset Meme">
                                <IconButton onClick={this.clearImage}>
                                    <SettingsBackupRestoreIcon fontSize="large" color="secondary" />
                                </IconButton>
                            </Tooltip>
                        </div>

                        <div className={styles.meme_texts}>
                            {texts}
                        </div>

                        <div className={styles.meme_form__buttons}>
                            <div className={styles.editor_buttons}>
                                <button onClick={this.addText}>ADD TEXT</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default Generator;