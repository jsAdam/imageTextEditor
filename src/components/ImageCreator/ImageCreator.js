import React, { Component } from "react";
import styles from '../../App.module.css';
import memeData from "../../data/memes.json";
import ImageEditor from "./ImageEditor";

class ImageCreator extends Component {
  constructor(props) {
    super(props);

    this.uploadImage = this.uploadImage.bind(this);
    this.generateImage = this.generateImage.bind(this);
  }

  uploadImage(e) {
    this.props.setImageSrc(URL.createObjectURL(e.target.files[0]));
  }

  generateImage() {
    this.props.setImageSrc(memeData[Math.floor(Math.random() * memeData.length)].url);
  }

  render() {
    let imageStyle = { display: "none" };
    let formStyle = { display: "none" };

    if (this.props.imageSrc) {
      imageStyle.display = "block";
      formStyle.display = "none";
    } else {
      imageStyle.display = "none";
      formStyle.display = "flex";
    }

    return (
      <div className={styles.meme_holder}>
        <div className={styles.meme_holder__img} id="imageHolder">
          {this.props.imageSrc ?
            <ImageEditor
              imageSrc={this.props.imageSrc}
              texts={this.props.texts}
              width={document.getElementById('imageHolder').clientWidth}
              height={document.getElementById('imageHolder').clientHeight}>
            </ImageEditor>
            :
            <div className={styles.create_image}>
              <div className={styles.create_image__upload}>
                <h2>Click here to upload image</h2>
                <input onChange={this.uploadImage} type="file" name="image" accept="image/*"></input>
              </div>
              <div className={styles.create_image__generate}>
                <button onClick={this.generateImage}>Click here to generate image</button>
              </div>
            </div>
          }
        </div>
      </div>
    )
  }
}

export default ImageCreator;