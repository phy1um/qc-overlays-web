let DOMText, DOMImage;//, DOMBlock;

(function() {
    let CONTAINER;
    function DOMElement(dom) {
        if(dom === undefined) {
            this.dom = document.createElement("div");
        }
        else {
            this.dom = dom;
        }
        this.dom.style.position = "absolute";
        if(CONTAINER === undefined) {
            CONTAINER = document.getElementById("container");
        }
        CONTAINER.appendChild(this.dom);
    }

    DOMElement.prototype.position = function(x, y) {
        this.dom.style.top = `${y}px`;
        this.dom.style.left = `${x}px`;
    };

    DOMElement.prototype.moveRightEdgeTo = function(x) {
        const w = this.dom.width;
        this.dom.style.left = x-w;
    };

    DOMElement.prototype.setText = function(text) {
        this.dom.innerText = text;
    };

    DOMElement.prototype.setClass = function(name) {
        this.dom.className = name;
    };

    DOMElement.prototype.getWidth = function() {
        return this.dom.width;
    }

    DOMElement.prototype.getHeight = function() {
        return this.dom.height;
    }

    DOMText = function(text, style, x, y) {
        const p = new DOMElement(document.createElement("p"));
        p.position(x, y);
        p.setClass(style);
        p.setText(text);
        return p;
    };

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


