const WIDTH=1280;
const HEIGHT=720;
let CONTAINER;

window.onload = function() {
    CONTAINER = document.getElementById("container");
    getQCPlayerByName("rapha")
    .then((x) => {
        const l = DOMImage(x.getIconPath(), 100, 100);
        const r = DOMText(x.getName(), "display", 105+l.getWidth(), 100);
        DOMText(x.getRank("duel"), "display", 100, 130);
    })
    .catch((err) => console.error(err));
}
