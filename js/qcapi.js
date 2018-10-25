
const baseURL = "https://stats.quake.com/api/v2/";
let getQCPlayerByName;

(function() {

    function api_path(path, queries) {
        url = baseURL + path;
        if(queries !== undefined) {
            q = Object.keys(queries).map(x => `${x}=${queries[x]}`);
            url = `${url}?${q.join('&')}`;
        }
        return url;
    }

    getQCPlayerByName = function(name) {
        let p = fetch(api_path("Player/GamesSummary", {name}));
        return fetch(api_path("Player/Stats", {name}))
         .then((res) => res.json())
         .then((json) => new QCPlayer(name, json))
         .then((qc) => {
            p.then((res) => res.json())
            .then((json) => qc.setMatchInfo(json))
            return qc;
         });
    }

    function QCPlayer(name, model) {
        this.name = name;
        this.model = model;
    }

    QCPlayer.prototype.setMatchInfo = function(p) {
        this.matchInfo = json;
    }

    QCPlayer.prototype.getRank = function(mode) {
        return this.model.playerRatings[mode].rating;
    }

    QCPlayer.prototype.getRankData = function(mode) {
        return this.model.playerRatings[mode];
    }

    QCPlayer.prototype.getName = function() {
        return this.name;
    }

    QCPlayer.prototype.getWeaponAccuracy = function(weaponName) {
        if(typeof this.matchInfo === "string") {
            console.log(this.matchInfo);
        }
        let acc = 0;
        let c = 0;
        for(let m of this.matchInfo.matches) {
            const localAcc = m.weaponAccuracy[weaponName];
            if(localAcc > 0) {
                acc += m.weaponAccuracy[weaponName]
                c += 1;
            }
        }
        return acc/c;
    }

    QCPlayer.prototype.getNamePlatePath = function() {
        const res = this.model.playerLoadOut.namePlateId;
        return `https://stats.quake.com/nameplates/${res}.png`;
    }

    QCPlayer.prototype.getIconPath = function() {
        const res = this.model.playerLoadOut.iconId;
        return `https://stats.quake.com/icons/${res}.png`;
    }

})();
