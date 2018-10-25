const WIDTH=1280;
const HEIGHT=720;
let CONTAINER;

window.onload = function() {
    CONTAINER = document.getElementById("container");
    getQCPlayerByName("rapha")
    .then((x) => {
        DOMText(x.getWeaponAccuracy("LIGHTNING_GUN"), "display", 105, 100);
    })
    .catch((err) => console.error(err));
}
