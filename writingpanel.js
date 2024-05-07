"use strict"

/**
 * @Author - Adam In Tae Gerard - https://www.linkedin.com/in/adamintaegerard/
 *
 * Scratch-built handwriting lib for HTML5 Canvas.
 * 
 * Helpful examples for drawing circles and curved lines: https://github.com/os1ma/handwriting-canvas/blob/main/LICENSE
 */

const RED = '#ff0000'
const WHITE = '#ffffff'
const BLK = '#000000'
const CLICK_DRAW = 'Click to Draw'
const CLICK_ERASE = 'Click to Erase'
const CLICK_BIG = 'Make Bigger'
const CLICK_SM = 'Make Smaller'

const reset = that => {
    that.context.strokeStyle = RED
    that.context.lineCap = 'round'
    that.context.lineJoin = 'round'
    that.context.lineWidth = 5
    that.isEraser = false
    that.eraseButton = CLICK_ERASE
    that.sizeButton = CLICK_BIG
}

var WritingPanel = function (els) {
    this.lastX = 0
    this.lastY = 0
    this.isDown = false
    this.initialized = false
    this.isEraser = false

    if (els.length > 1) new Error("Element not uniquely specified!")

    this.el = els[0]
    this.context = this.el.getContext("2d")

    this.eraseButton = CLICK_ERASE
    this.sizeButton = CLICK_BIG
}

WritingPanel.prototype.getMousePos = function (e) {
    const R = this.el.getBoundingClientRect()
    const M = {}
    M["X"] = parseInt(e.clientX - R.left)
    M["Y"] = parseInt(e.clientY - R.top)
    return M
}

WritingPanel.prototype.drawLine = function (startX, startY, endX, endY) {
    this.context.beginPath()
    this.context.moveTo(startX, startY)
    this.context.lineTo(endX, endY)
    this.context.stroke()
    this.context.closePath()
}

WritingPanel.prototype.toBlobRect = function() {
    // For generating CNN images
}

WritingPanel.prototype.changeSize = function() {
    if (this.context.lineWidth === 5) {
        this.context.lineWidth = 15
        this.sizeButton = CLICK_SM
    } else {
        this.context.lineWidth = 5
        this.sizeButton = CLICK_BIG
    }
}

WritingPanel.prototype.changeColor = function() {
    if (this.isEraser) {
        this.isEraser = !this.isEraser
        this.eraseButton = CLICK_ERASE
    }
    if (this.context.strokeStyle === RED || this.context.strokeStyle === WHITE) this.context.strokeStyle = BLK
    else this.context.strokeStyle = RED
}

WritingPanel.prototype.toPng = function() {
    let img = this.context.getImageData(0,0,2500,2500)

    for (let i = 0; i < img.data.length; i+= 4) {
        let r = img.data[i]
        let g = img.data[i+1]
        let b = img.data[i+2]

        if (r === 255 && g === 255 && b === 255) {
            img.data[i] = 255
            img.data[i+1] = 255
            img.data[i+2] = 255
            img.data[i+3] = 0
        }
    }

    this.context.putImageData(img, 0, 0)
    return this.el.toDataURL("image/png")
}

WritingPanel.prototype.erase = function() {

    this.isEraser = !this.isEraser

    if (this.isEraser) {
        this.context.strokeStyle = WHITE
        this.eraseButton = CLICK_DRAW
    } else {
        this.context.strokeStyle = RED
        this.eraseButton = CLICK_ERASE
    }
}

WritingPanel.prototype.init = function () {
    if (!this.initialized) {
        reset(this)
        this.initialized = !this.initialized

        this.el.addEventListener('mousedown', e => {
            this.isDown = true
            const M = this.getMousePos(e)
            this.lastX = M.X
            this.lastY = M.Y
            e.preventDefault
        })

        this.el.addEventListener('mouseup', e => {
            if (this.isDown) {
                const M = this.getMousePos(e)
                this.drawLine(this.lastX, this.lastY, M.X, M.Y)
                this.isDown = !this.isDown
            }
        })

        this.el.addEventListener('mousemove', e => {
            if (this.isDown) {
                const M = this.getMousePos(e)
                this.drawLine(this.lastX, this.lastY, M.X, M.Y)
                this.lastX = M.X
                this.lastY = M.Y
            }
        })
    }
}

WritingPanel.prototype.clear = function() {
    this.context.clearRect(
        0, 
        0, 
        this.context.canvas.width, 
        this.context.canvas.height
    )
    reset(this)
}