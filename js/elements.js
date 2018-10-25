
let ELEMENTS = {};
let test_rating = 100;

(function() {
    
    // array of things to update each interval
    const updaters = [];
    // name of the player we are working on here
    let name = undefined;
    
    /**
    * add a function to be called each interval 
    * @param {Function} fn 
    */
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
    
    function handleText(player, elem) {
        DOMText(elem.content.value, "display", elem.x.value,
        elem.y.value);
    }
    
    // map types to functions which handle these elements
    const handlers = {
        "icon": handleIcon,
        "name": handleName,
        "rank": handleRank,
        "rank-delta": handleRankDelta,
        "acc": handleAcc,
        "text": handleText
    };
    
    /**
     * set the main update loop going for this framework
     * @param {int} i how long in milliseconds to wait between updates (API calls)
     */
    function setUpdateInterval(i) {
        // function called on each tick
        const updateAll = function() {
            if(name === undefined) return;
            // we get player and match data
            getQCPlayerByName(name).then((player) => {
                getQCMatchStatsByName(name).then((matches) => {
                    for(let f of updaters) {
                        // each updater is updated with this data
                        f(player, matches);
                    }
                }).catch((err) => {
                    // TODO: generalize this error handling
                    console.error(err);
                    DOMText("Error updating!", "error", 0, 0);
                });
            }).catch((err) => {
                console.error(err);
                DOMText("Error updating!", "error", 0, 0);
            });
        } 
        // run this upfront and then set it to run at an interval of i
        updateAll();
        setInterval(updateAll, i);
    };
    
    /**
     * parse each layout tag in a DOM tree into an element
     * @param {dom element} root 
     */
    ELEMENTS.init = function(root) {
        if(root === undefined) {
            root = document;
        }
        name = urlParams.name;
        // must supply an account name
        if(name === undefined) {
            console.error("No name provided in query!");
            DOMText("No name provided!", "error", 0, 0);
        }
        // TODO: test account name exists (supported in API)
        
        getQCPlayerByName(name).then((player) => {
            // with the player data, initialize each layout tag
            const layouts = root.getElementsByTagName("layout");
            for(let l of layouts) {
                const type = l.attributes.type.value;
                if(handlers[type] !== undefined) {
                    // get handler
                    handlers[type](player, l.attributes);
                }
                else {
                    console.log("Unknown layout type: " + l.id);
                }
            }
        }).catch((err) => {
            console.error(err);
        });
        setUpdateInterval(6000);
    }
})();
