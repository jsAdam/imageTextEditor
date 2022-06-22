import React, { Component } from "react";

import styles from '../../App.module.css';

class TextMoveableEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.textObject.value,
            color: props.textObject.color,
            font: props.textObject.font,
            fontSize: props.textObject.fontSize
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.updateText = this.updateText.bind(this);
        this.deleteText = this.deleteText.bind(this);
    }

    handleInputChange(event) {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
  
      this.setState({
        [name]: value
      });
    }

    updateText(event) {
        event.preventDefault();
        this.props.updateText(this.props.textObject.id, this.state.value, this.state.color, this.state.fontSize, this.state.font);
    }

    deleteText(event) {
        event.preventDefault();
        this.props.deleteText(this.props.textObject.id);
    }

    render() {
        return (
            <div className={styles.meme_text}>
                <h4>Text {this.props.textObject.id}</h4>
                <div className={styles.meme_text_options}>
                    <div className={styles.meme_text_option}>
                        <label>Text</label>
                        <input name="value" type="text" value={this.state.value} onChange={this.handleInputChange}></input>
                    </div>
                    <div className={styles.meme_text_option}>
                        <label>Text Font</label>
                        <select name="font" value={this.state.font} onChange={this.handleInputChange}>
                            {this.props.textFontOptions}
                        </select>
                    </div>
                    <div className={styles.meme_text_option}>
                        <label>Font Size &amp; Text Color</label>
                        <div className={styles.text_style_group_input}>
                            <input type="range" min="1" max="100" name="fontSize" value={this.state.fontSize} onChange={this.handleInputChange}></input>
                            <input type="color" name="color" value={this.state.color} onChange={this.handleInputChange}></input>
                        </div>
                    </div>
                    <div className={styles.meme_text_option}>
                        <button onClick={this.updateText}>UPDATE</button>
                        <button onClick={this.deleteText}>DELETE</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default TextMoveableEditor;