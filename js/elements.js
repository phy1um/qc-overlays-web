
let ELEMENTS = {};
let test_rating = 100;

(function() {


    const updaters = [];
    let name = undefined;

    function addUpdater(fn) {
        updaters.push(fn);
    }

    function handleIcon(player, elem) {
        const insert = DOMImage(player.getIconPath(), elem.x.value,
            elem.y.value);
        addUpdater((p) => {
            insert.dom.src = p.getIconPath();
        });
    }

    function handleName(player, elem) {
        const insert = DOMText(player.getName(), "display",
            elem.x.value, elem.y.value);
/*        addUpdater((p) => {
            insert.setText(p.getName());
        });*/
    }

    function handleRank(player, elem) {
        const insert = DOMText("????", "display", elem.x.value,
            elem.y.value);
        addUpdater((p) => {
            insert.setText(p.getRankData(elem.mode.value).rating);
        });
    }

    function fmtHex(r,g,b) {
        const out = `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}00`;
        console.log(out);
        return out;
    }
    function handleRankDelta(player, elem) {
        const insert = DOMText("+- ?", "display", elem.x.value,
            elem.y.value);
        addUpdater((p) => {
            const number = parseInt(p.getRankData(elem.mode.value).deviation);
            //const number = test_rating;
            const scale = Math.min(1, Math.abs(number / 300));
            let fmt;
            let r = 0;
            let g = 0;
            if(number > 0) {
                fmt = `+${number}`;
                g = Math.floor(255 * scale);
            }
            else {
                fmt = `-${number}`;
                r = Math.floor(255 * scale);
            }
            insert.setText(fmt);
            insert.dom.style.setProperty("color", fmtHex(r,g,0))
        });
    }

    function handleAcc(player, elem) {
        const insert = DOMText("x%", "display", elem.x.value,
            elem.y.value);
        const gun = elem.gun.value;
        addUpdater((p, m) => {
            let acc = 0;
            let c = 0;
            for(let match of m.matches) {
                const localAcc = match.weaponAccuracy[gun];
                if(localAcc > 0) {
                    acc += localAcc;
                    c += 1;
                }
            }
            insert.setText(`${Math.round(acc/c)}%`);
        });
    }

    const handlers = {
            "icon": handleIcon,
            "name": handleName,
            "rank": handleRank,
            "rank-delta": handleRankDelta,
            "acc": handleAcc
    };

    function setUpdateInterval(i) {
        const updateAll = function() {
            if(name === undefined) return;
            getQCPlayerByName(name).then((player) => {
                getQCMatchStatsByName(name).then((matches) => {
                    for(let f of updaters) {
                        f(player, matches);
                    }
                }).catch((err) => {
                    console.error(err);
                });
            }).catch((err) => {
                console.error(err);
                DOMText("Error updating!", "error", 0, 0);
            });
        }
        updateAll();
        setInterval(updateAll, i);
    };

    ELEMENTS.init = function(root) {
        if(root === undefined) {
            root = document;
        }
        name = urlParams.name;
        if(name === undefined) {
            console.error("No name provided in query!");
            DOMText("No name provided!", "error", 0, 0);
        }
        getQCPlayerByName(name).then((player) => {
//            getQCMatchStatsByName(name).then((matches) => {
                const layouts = root.getElementsByTagName("layout");
                for(let l of layouts) {
                    if(handlers[l.id] !== undefined) {
                        handlers[l.id](player, l.attributes);
                    }
                    else {
                        console.log("Unknown layout type: " + l.id);
                    }
                }
/*            }).catch((err) => {
                console.error(err);
            });*/
        }).catch((err) => {
            console.error(err);
        });
        setUpdateInterval(6000);
    }

})();
