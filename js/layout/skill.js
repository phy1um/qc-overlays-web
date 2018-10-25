const WIDTH=1280;
const HEIGHT=720;
let CONTAINER;



window.onload = function() {
    CONTAINER = document.getElementById("container");
    const lIcon = document.getElementById("icon").attributes;
    const lName = document.getElementById("name").attributes;
    const lRank = document.getElementById("rank").attributes;
    const lRankSub = document.getElementById("rank-delta").attributes;
    const name = urlParams.name;

    if(name === undefined) {
        DOMText("No name parameter supplied!", "error", 0, 0);
        return;
    }
    getQCPlayerByName(name).then((x) => {
        const icon = DOMImage(x.getIconPath(), lIcon.x.value, lIcon.y.value);
        DOMText(x.getName(), "display", lName.x.value, lName.y.value);
        const rankData = x.getRankData(lRank.mode.value);
        const rank =DOMText(
            rankData.rating,
            "display",
            lRank.x.value,
            lRank.y.value);
        const rankDelta = DOMText(
            `(${rankData.deviation})`,
            "display",
            lRankSub.x.value,
            lRankSub.y.value);
        const rankUpdate = function() {
            getQCPlayerByName(name).then((data) => {
                const r = data.getRankData(lRank.mode.value);
                rank.setText(r.rating);
                rankDelta.setText(`(${r.deviation})`);
                icon.dom.src = data.getIconPath();
                console.log("ping");
            }).catch((err) => {
                console.error(err);
                DOMText("Error updating rank!", "error", 0, 0);
            });
        };
        setInterval(rankUpdate, 2000);
    })
    .catch((err) => {
        console.error(err);
        DOMText("No player data for name: " + name, "error", 0, 0);
    });
}
