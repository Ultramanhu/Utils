/// <reference path="../jquery/jquery.d.ts" />
var IDENTITY;
(function (IDENTITY) {
    IDENTITY[IDENTITY["ID_UNKNOWN"] = 0] = "ID_UNKNOWN";
    IDENTITY[IDENTITY["ID_MAJOR"] = 1] = "ID_MAJOR";
    IDENTITY[IDENTITY["ID_MINOR"] = 2] = "ID_MINOR";
    IDENTITY[IDENTITY["ID_GHOST"] = 3] = "ID_GHOST";
})(IDENTITY || (IDENTITY = {}));
;
var IdenDict = {
    ID_MAJOR: "多数派",
    ID_MINOR: "少数派",
    ID_GHOST: "鬼",
    ID_UNKNOWN: ""
};
function Rand(n) {
    return Math.floor((Math.random() * n));
}
var Player = (function () {
    function Player(pos) {
        this.iden = IDENTITY.ID_UNKNOWN;
        this.words = "";
        this.pos = pos;
    }
    return Player;
})();
var GameManager = (function () {
    function GameManager() {
        this.list = [];
        this.players = [];
        this.init();
    }
    GameManager.prototype.init = function () {
        var _this = this;
        $.ajax({
            url: "./js/words.js",
            contentType: "application/javascript",
            dataType: 'json',
            success: function (res) {
                _this.list = res.words;
            },
            error: function (a, b, c) {
                alertMsg("获取词库数据失败");
            }
        });
    };
    GameManager.prototype.randWords = function () {
        if (this.list.length == 0) {
            alertMsg("词库无词条，无法随机");
            return;
        }
        var rand = Rand(this.list.length);
        this.current = this.list[rand];
    };
    GameManager.prototype.setCurrent = function (major, minor, ghost) {
        this.current = [major, minor, ghost];
    };
    GameManager.prototype.getCurrent = function () {
        return this.current;
    };
    GameManager.prototype.setPlayerNums = function (major, minor, ghost) {
        var total = major + minor + ghost;
        this.playerNums = [total, major, minor, ghost];
    };
    GameManager.prototype.doRand = function () {
        this.players = [];
        var idens = [];
        var cnt = 0, k = IDENTITY.ID_MAJOR, i = 0;
        for (i = 0; i < this.playerNums[0]; i++) {
            this.players.push(new Player(i + 1));
            while (this.playerNums[k] <= cnt && k < IDENTITY.ID_GHOST) {
                k++;
                cnt = 0;
            }
            cnt++;
            idens.push(k);
        }
        for (i = 0; i < this.players.length; i++) {
            var pos = Rand(idens.length);
            var iden = idens[pos];
            this.players[i].iden = iden;
            this.players[i].words = this.current[iden - 1];
            if (idens.length > 0) {
                idens[pos] = idens[idens.length - 1];
                idens.pop();
            }
        }
    };
    GameManager.prototype.getPlayerByPos = function (pos) {
        return this.players[pos - 1];
    };
    GameManager.prototype.getTotle = function () {
        return this.playerNums[0];
    };
    GameManager.Ins = new GameManager();
    return GameManager;
})();
//# sourceMappingURL=data.js.map