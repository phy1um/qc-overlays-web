// public functions
let DOMText, DOMImage;//, DOMBlock;

(function() {
    // element which stores our display
    let container;

    /**
     * create a new dom element with absolute positioning in the container
     * @param dom - optional existing dom element this represents
     */
    function DOMElement(dom) {
        if(dom === undefined) {
            this.dom = document.createElement("div");
        }
        else {
            this.dom = dom;
        }
        this.dom.style.position = "absolute";
        if(container === undefined) {
            container = document.getElementById("container");
        }
        container.appendChild(this.dom);
    }

    /**
     * reposition this element to (x, y)
     * @param {int} x 
     * @param {int} y 
     */
    DOMElement.prototype.position = function(x, y) {
        this.dom.style.top = `${y}px`;
        this.dom.style.left = `${x}px`;
    };

    /**
     * reposition this element so its right edge aligns to x 
     * @param {int} x 
     */
    DOMElement.prototype.moveRightEdgeTo = function(x) {
        const w = this.dom.width;
        this.dom.style.left = x-w;
    };

    /**
     * set this element's inner text
     * @param {string} text 
     */
    DOMElement.prototype.setText = function(text) {
        this.dom.innerText = text;
    };

    /**
     * set the class of this element
     * @param {string} name
     */
    DOMElement.prototype.setClass = function(name) {
        this.dom.className = name;
    };

    DOMElement.prototype.getWidth = function() {
        return this.dom.width;
    }

    DOMElement.prototype.getHeight = function() {
        return this.dom.height;
    }

    /**
     * construct a DOM element with an inner text node
     */
    DOMText = function(text, style, x, y) {
        const p = new DOMElement(document.createElement("p"));
        p.position(x, y);
        p.setClass(style);
        p.setText(text);
        return p;
    };

    /**
     * construct a DOM image with a given source and optional
     * width/height
     */
    DOMImage = function(src, x, y, sx, sy) {
        const i = document.createElement("img");
        i.src = src;
        const dom = new DOMElement(i);
        dom.position(x, y);
        if(sx !== undefined) {
            i.width = sx;
        }
        if(sy !== undefined) {
            i.height = sy;
        }
        return dom;
    };

})();


