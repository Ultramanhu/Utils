
var ID_UNKNOWN = 0;
var ID_MAJOR = 1;
var ID_MINOR = 2;
var ID_GHOST = 3;

function Rand(n) {
    return parseInt(Math.random() * n);
}

var Player = function(pos) {
    this.pos = pos || 0;
    this.iden = ID_UNKNOWN;
    this.words = "";
}

var GameManager = function () {
    var list = [];
    var current = ["", "", ""];
    var players = [];
    var playerNums = [0, 0, 0, 0];
    this.init = function() {
        $.ajax({
            url: "./js/words.json",
            contentType: "application/json",
            dataType: 'json',
            success: function (res) {
                list = res.words;
            },
            error: function (a, b, c) {
                throw "get json error";
            }
        });
    }

    this.randWords = function() {
        if (list.length == 0) throw "list length 0";
        var rand = Rand(list.length);
        current = list[rand];
    }

    this.setCurrent = function(major, minor, ghost) {
        current = [major, minor, ghost];
    }

    this.getCurrent = function() {
        return current;
    }

    this.setPlayerNums = function (major, minor, ghost) {
        var total = parseInt(major) + parseInt(minor) + parseInt(ghost);
        playerNums = [total, major, minor, ghost];
    }

    this.doRand = function() {
        players = [];
        var idens = [];
        var cnt = 0, k = ID_MAJOR, i = 0;
        for (i = 0; i < playerNums[0]; i++) {
            players.push(new Player(i + 1));
            while (playerNums[k] <= cnt && k < ID_GHOST) {
                k++;
                cnt = 0;
            }
            cnt++;
            idens.push(k);
        }
        for (i = 0; i < players.length; i++) {
            var pos = Rand(idens.length);
            var iden = idens[pos];
            players[i].iden = iden;
            players[i].words = current[iden - 1];
            if (idens.length > 0) {
                idens[pos] = idens[idens.length - 1];
                idens.pop();
            }
        }
    }

    this.getPlayerByPos = function(pos) {
        return players[pos - 1];
    }

    this.getTotle = function() {
        return playerNums[0];
    }

    this.init();
}

var GameManagerIns = new GameManager();
