
const baseURL = "https://stats.quake.com/api/v2/";

// public functions
let getQCPlayerByName;
let getQCMatchStatsByName;

(function() {

    /**
     * construct a path to a resource in the API 
     * @param {string} path 
     * @param {Object} queries - keys and values are appended as query params,
     *  eg url?key=value&...
     */
    function api_path(path, queries) {
        url = baseURL + path;
        if(queries !== undefined) {
            // get all the components of the query params
            q = Object.keys(queries).map(x => `${x}=${queries[x]}`);
            url = `${url}?${q.join('&')}`;
        }
        return url;
    }

    /**
     * return a Promise for a QCPlayer object
     * @param {string} name the name of the QC player's account
     */
    getQCPlayerByName = function(name) {
        return fetch(api_path("Player/Stats", {name}))
         .then((res) => res.json())
         .then((json) => new QCPlayer(name, json));
    }

    /**
     * return a Promise for a player's QC match data
     */
    getQCMatchStatsByName = function(name) {
        return fetch(api_path("Player/GamesSummary", {name}))
         .then((res) => res.json())
    }

    /**
     * construct a new QCPlayer
     * @param {string} name the player's QC account name
     * @param {Object} model the JSON data from the API
     */
    function QCPlayer(name, model) {
        this.name = name;
        this.model = model;
    }

    /**
     * get an integer rank of this player's skill in a specific mode
     * @param {string} mode the name of the game mode according the API
     */
    QCPlayer.prototype.getRank = function(mode) {
        return this.model.playerRatings[mode].rating;
    }

    /**
     * get all ranking data about this player
     * @param {string} mode  the name of the game mode according to the API
     */
    QCPlayer.prototype.getRankData = function(mode) {
        return this.model.playerRatings[mode];
    }

    /**
     * get this player's name
     */
    QCPlayer.prototype.getName = function() {
        return this.name;
    }

    /**
     * get the path to the nameplate resource this player has equipped
     */
    QCPlayer.prototype.getNamePlatePath = function() {
        const res = this.model.playerLoadOut.namePlateId;
        return `https://stats.quake.com/nameplates/${res}.png`;
    }

    /**
     * get the path to the icon resource this player has equipped
     */
    QCPlayer.prototype.getIconPath = function() {
        const res = this.model.playerLoadOut.iconId;
        return `https://stats.quake.com/icons/${res}.png`;
    }

})();
