import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import styles from '../../App.module.css';
import $ from 'jquery';

let mouseX, mouseY;
let mousePressed = false;

class TextMoveable {
    constructor(font, textColor, text, x, y, id, ctx) {
        this.font = font;
        this.x = x;
        this.y = y;
        this.id = id;
        this.ctx = ctx;
        this.fontHeight = parseFloat(this.font.match(/[0-9]*/)[0]);

        this.pointSelected = false;
        this.pointSelectedIdx = 0;

        this.selected = false;
        this.selectedDistance = {
            x: 0,
            y: 0
        }

        this.setText(text, textColor);

        this.resizePoints = [
            { x: this.x - this.w / 2, y: this.y - this.fontHeight + this.h / 2 },
            { x: this.x + this.w / 2, y: this.y - this.fontHeight + this.h / 2 }
        ];

        this.resizePointRadius = 8;
    }

    getWrapTextHeight(text, x, y, maxWidth, lineHeight) {
        let height = lineHeight;
        let words = text.split(' ');
        let line = '';

        this.ctx.textAlign = "center";
        this.ctx.font = this.font;

        for (let n = 0; n < words.length; n++) {
            let testLine = line + words[n] + ' ';
            let metrics = this.ctx.measureText(testLine);
            let testWidth = metrics.width;

            if (testWidth > maxWidth && n > 0) {
                line = words[n] + ' ';
                height += lineHeight;
            }
            else {
                line = testLine;
            }
        }

        return height;
    }

    wrapText(text, x, y, maxWidth, lineHeight) {
        let height = lineHeight;
        let words = text.split(' ');
        let line = '';

        for (let n = 0; n < words.length; n++) {
            let testLine = line + words[n] + ' ';
            let metrics = this.ctx.measureText(testLine);
            let testWidth = metrics.width;

            if (testWidth > maxWidth && n > 0) {
                this.ctx.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
                height += lineHeight;
            }
            else {
                line = testLine;
            }
        }

        this.ctx.fillText(line, x, y);

        return height;
    }

    setText(newText, newColor, font) {
        this.text = newText;

        if (newColor) {
            this.textColor = newColor;

            if (font) {
                this.font = font;
                this.fontHeight = parseFloat(this.font.match(/[0-9]*/)[0]);
            }
        }

        this.w = 400;
        this.h = this.getWrapTextHeight(this.text, this.x, this.y, this.w, this.fontHeight);
    }

    isMouseInside() {
        return mouseX > this.x - this.w / 2 &&
            mouseX < this.x + this.w / 2 &&
            mouseY > this.y - this.fontHeight &&
            mouseY < this.y - this.fontHeight + this.h;
    }

    isMouseInsideResizePoint(point) {
        let distX = mouseX - point.x;
        let distY = mouseY - point.y;
        let mag = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));

        if (mag <= this.resizePointRadius) return true;
        return false;
    }

    handleResizePointSelection() {
        for (let i = 0; i < this.resizePoints.length; i++) {
            let point = this.resizePoints[i];

            if (this.isMouseInsideResizePoint(point) && mousePressed) {
                if (!this.pointSelected) {
                    this.pointSelectedIdx = i;
                    this.pointSelected = true;
                }
            }

            if (this.pointSelectedIdx === i) {
                if (this.pointSelected) {
                    if (mousePressed) {
                        let width = mouseX - this.x;
                        this.w = Math.abs(width) * 2;
                    } else {
                        this.pointSelected = false;
                    }
                }
            }
        }
    }

    handleSelectionAndMovementWhenSelected() {
        if (this.selected) {
            if (mousePressed) {
                this.moveToMouse();
            } else {
                this.selected = false;
            }
        }
    }

    moveToMouse() {
        this.x = mouseX - this.selectedDistance.x;
        this.y = mouseY - this.selectedDistance.y;
    }

    select() {
        this.selected = true;
        this.selectedDistance = {
            x: mouseX - this.x,
            y: mouseY - this.y
        };
    }

    update() {
        this.resizePoints = [
            { x: this.x - this.w / 2, y: this.y - this.fontHeight + this.h / 2 },
            { x: this.x + this.w / 2, y: this.y - this.fontHeight + this.h / 2 }
        ];

        this.handleResizePointSelection();

        if (!this.pointSelected) {
            this.handleSelectionAndMovementWhenSelected();
        }
    }

    show() {
        this.ctx.textAlign = "center";
        this.ctx.font = this.font;

        this.ctx.fillStyle = this.textColor;
        this.ctx.strokeStyle = "#000000";
        this.h = this.wrapText(this.text, this.x, this.y, this.w, this.fontHeight);


        if (this.isMouseInside(mouseX, mouseY, this.w, this.h) || this.pointSelected) {
            this.ctx.font = "18px Arial";
            this.ctx.fillText(`Text ${this.id}`, this.x, this.y - this.fontHeight - 10);

            this.ctx.setLineDash([6]);
            this.ctx.strokeStyle = this.textColor;
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(this.x - this.w / 2, this.y - this.fontHeight, this.w, this.h);

            for (let point of this.resizePoints) {
                this.ctx.fillStyle = this.textColor;
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, this.resizePointRadius, 0, 2 * Math.PI);
                this.ctx.fill();
            }
        }
    }
}

const ImageEditor = (props) => {
    const [counter, setCounter] = useState(0)
    const [shouldStop, setShouldStop] = useState(false)

    const texts = useRef([]);

    useLayoutEffect(() => {
        if (!shouldStop) {
            let timerId;

            const animate = () => {
                setCounter(c => c + 1);
                timerId = requestAnimationFrame(animate);
            }

            timerId = requestAnimationFrame(animate);
            return () => cancelAnimationFrame(timerId);
        }
    }, [shouldStop])

    useEffect(() => {
        function updateCanvasWithParentHeight() {
            let canvas = document.getElementById("myCanvas");
            canvas.width = props.width;
            canvas.height = props.height;
        }
        updateCanvasWithParentHeight();
    }, [props.width, props.height]);

    useEffect(() => {
        function handleTextRemoved() {
            let canvasIDs = texts.current.map(t => t.id);
            let textIDs = props.texts.map(t => t.id);

            let difference = canvasIDs.filter(i => !textIDs.includes(i));

            for (let i = difference.length - 1; i >= 0; i--) {
                let idx = texts.current.findIndex(t => t.id === difference[i]);
                texts.current.splice(idx, 1);
            }
        }

        function handleTextAdded() {
            let canvasIDs = texts.current.map(t => t.id);
            let textIDs = props.texts.map(t => t.id);

            let difference = textIDs.filter(i => !canvasIDs.includes(i));
            let canvas = document.getElementById("myCanvas");
            let ctx = canvas.getContext("2d");

            for (let text of props.texts) {
                console.log(text);
                if (difference.includes(text.id)) {
                    texts.current.push(new TextMoveable(`${text.fontSize}px ${text.font}`, text.color, text.value, canvas.width / 2, canvas.height / 2, text.id, ctx));
                }
            }
        }

        function handleTextUpdate() {
            for (let text of props.texts) {
                let textMoveable = texts.current.find(t => t.id === text.id);
                textMoveable.setText(text.value, text.color, `${text.fontSize}px ${text.font}`);
            }
        }

        function initializeTextArray() {
            let canvas = document.getElementById("myCanvas");
            let ctx = canvas.getContext("2d");

            for (let text of props.texts) {
                texts.current.push(new TextMoveable(`${text.fontSize}px ${text.font}`, text.color, text.value, canvas.width / 2, canvas.height / 2, text.id, ctx));
            }
        }

        function handleTextArrayUpdate() {
            if (texts.current.length !== 0) {
                if (texts.current.length > props.texts.length) {
                    handleTextRemoved();
                } else if (texts.current.length < props.texts.length) {
                    handleTextAdded();
                } else {
                    handleTextUpdate();
                }
            } else {
                initializeTextArray();
            }
        }

        handleTextArrayUpdate();
    }, [props.texts])

    useEffect(() => {
        $("#myCanvas").mousemove((e) => {
            let rect = document.getElementById("myCanvas").getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });
        $("#myCanvas").mousedown((e) => {
            mousePressed = true;
        })
        $("#myCanvas").mouseup((e) => {
            mousePressed = false;
        })
    }, []);

    useEffect(() => {
        function handleTextElements() {
            let textSelected = null;
            for(let i = texts.current.length - 1; i >= 0; i--) {
                let text = texts.current[i];
                
                if(text.selected) {
                    textSelected = text;
                }
            }

            for (let i = texts.current.length - 1; i >= 0; i--) {
                let text = texts.current[i];

                if (textSelected === text) {
                    text.update();
                }

                if(textSelected === null && text.isMouseInside() && mousePressed && !text.selected) {
                    text.select();
                }

                text.show();
            }
        }

        function drawImageWithTextOnCanvas (canvas, ctx) {
            let canvasImage = new Image();
            canvasImage.crossOrigin = 'Anonymous';
            canvasImage.src = props.imageSrc;

            canvasImage.onload = () => {
                // Draw Image con canvas
                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                let heightWidthRatio = canvasImage.width / canvasImage.height;
                if (heightWidthRatio > 1) {
                    let w = canvas.width;
                    let h = canvas.height / heightWidthRatio;
                    let x = 0;
                    let y = canvas.height / 2 - h / 2;
                    ctx.drawImage(canvasImage, x, y, w, h);
                } else {
                    let w = canvas.width * heightWidthRatio;
                    let h = canvas.height;
                    let x = canvas.width / 2 - w / 2;
                    let y = 0;
                    ctx.drawImage(canvasImage, x, y, w, h);
                }

                handleTextElements();
            };
        }

        if (props.imageSrc) {
            let canvas = document.getElementById("myCanvas");
            let ctx = canvas.getContext("2d");

            drawImageWithTextOnCanvas(canvas, ctx);
        }
    }, [counter, props.imageSrc])

    return (
        <canvas id="myCanvas" className={styles.myCanvas}></canvas>
    )
}

export default ImageEditor;