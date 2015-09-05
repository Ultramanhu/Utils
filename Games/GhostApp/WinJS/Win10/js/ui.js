/// <reference path="../jquery/jquery.d.ts" />
/// <reference path="../winjs/js/winjs.d.ts" />
"use strict";
var WORD_PREFIX = "player_word_";
var IDEN_PREFIX = "player_iden_";
var TPlayerDataSource = WinJS.Binding.define({
    show_iden: false,
    show_words: false,
    pos: 0,
    //    wordId: WORD_PREFIX,
    //    idenId: IDEN_PREFIX,
    data: Player
});
var nowPosition = 0;
var isAnimating = false;
function alertMsg(msg) {
    $("#msg-content").text(msg);
    $("#common-msg")[0].winControl.show();
}
function toggleShowWords() {
    if (!$("#showWordsToggle")[0].winControl.checked) {
        $(".words-control").attr("type", "password").addClass("win-password");
    }
    else {
        $(".words-control").attr("type", "text").removeClass("win-password");
        ;
    }
}
function playerToggleWord(e) {
    var control = e.currentTarget;
    var playerId = control.playerId;
    if (control.winControl.checked) {
        var playerData = GameManager.Ins.getPlayerByPos(parseInt(playerId));
        $("#" + WORD_PREFIX + playerId).text(playerData.words);
    }
    else {
        $("#" + WORD_PREFIX + playerId).text("-");
    }
}
function playerToggleIden(e) {
    var control = e.currentTarget;
    var playerId = control.playerId;
    if (control.winControl.checked) {
        var playerData = GameManager.Ins.getPlayerByPos(parseInt(playerId));
        $("#" + IDEN_PREFIX + playerId).text(IdenDict[IDENTITY[playerData.iden]]);
    }
    else {
        $("#" + IDEN_PREFIX + playerId).text("-");
    }
}
function randWords() {
    GameManager.Ins.randWords();
    var words = GameManager.Ins.getCurrent();
    $("#major_words").val(words[0]);
    $("#minor_words").val(words[1]);
    $("#ghost_words").val(words[2]);
}
function configNumChanges() {
    var value = $("#config_nums").val();
    var list = value.split("-");
    $("#major_nums").val(list[0]);
    $("#minor_nums").val(list[1]);
    $("#ghost_nums").val(list[2]);
}
WinJS.Namespace.define("GhostWinJS", {
    cancel: WinJS.UI.eventHandler(function (ev) {
        if (isAnimating)
            return;
        $("#pivotContent")[0].winControl.selectedIndex = 0;
        nowPosition = 0;
        isAnimating = true;
        $("#gamingContent").fadeOut("fast", function () {
            $("#pivotContent").fadeIn("fast", function () {
                isAnimating = false;
                $("#createAppBar")[0].winControl.getCommandById("cancel").hidden = true;
            });
        });
    }),
    readme: WinJS.UI.eventHandler(function (ev) {
        $("#help-msg")[0].winControl.show();
    })
});
function gamingShow() {
    if (isAnimating)
        return;
    var info = GameManager.Ins.getPlayerByPos(nowPosition);
    $("#gaming_words").text(info.words);
    isAnimating = true;
    $("#gamingHideContent").fadeOut("fast", function () {
        $("#gamingShowContent").fadeIn("fast", function () {
            isAnimating = false;
        });
    });
}
function gamingHide() {
    if (isAnimating)
        return;
    nowPosition = nowPosition + 1;
    if (nowPosition > GameManager.Ins.getTotle()) {
        $("#pivotContent")[0].winControl.selectedIndex = 1;
        isAnimating = true;
        $("#gamingContent").fadeOut("fast", function () {
            $("#pivotContent").fadeIn("fast", function () {
                isAnimating = false;
                $("#createAppBar")[0].winControl.getCommandById("cancel").hidden = true;
                showState();
            });
        });
        return;
    }
    $("#gaming_pos").text(nowPosition.toString());
    isAnimating = true;
    $("#gamingShowContent").fadeOut("fast", function () {
        $("#gamingHideContent").fadeIn("fast", function () {
            isAnimating = false;
        });
    });
}
var PlayerList = [];
function showState() {
    var container = $("#state_container");
    container.empty();
    var template = $("#playerStateTemplate")[0].winControl;
    for (var i = 0; i < GameManager.Ins.getTotle(); i++) {
        var playerData = GameManager.Ins.getPlayerByPos(i + 1);
        var pos = playerData.pos;
        var data = new TPlayerDataSource({
            show_iden: false,
            show_words: false,
            //            wordId: WORD_PREFIX + pos.toString(),
            //            idenId: IDEN_PREFIX + pos.toString(),
            data: playerData
        });
        PlayerList.push(data);
        template.render(data).then(function (e) {
            $(".player_word", e).attr("id", WORD_PREFIX + pos.toString());
            $(".player_iden", e).attr("id", IDEN_PREFIX + pos.toString());
            container.append(e);
        });
    }
}
function startGame() {
    var checker = function (id, msg) {
        if ($("#" + id).val() == "") {
            alertMsg(msg);
            $("#" + id).focus();
            return false;
        }
        return true;
    };
    if (!checker("major_words", "多数派词条未填写"))
        return;
    if (!checker("minor_words", "少数派词条未填写"))
        return;
    if (!checker("ghost_words", "鬼词条未填写"))
        return;
    GameManager.Ins.setCurrent($("#major_words").val(), $("#minor_words").val(), $("#ghost_words").val());
    GameManager.Ins.setPlayerNums(parseInt($("#major_nums").val()), parseInt($("#minor_nums").val()), parseInt($("#ghost_nums").val()));
    GameManager.Ins.doRand();
    nowPosition = 0;
    gamingHide();
    $("#pivotContent").fadeOut("fast", function () {
        $("#gamingContent").fadeIn("fast", function () {
            $("#createAppBar")[0].winControl.getCommandById("cancel").hidden = false;
        });
    });
}
function pageInit() {
    $("#createAppBar")[0].winControl.getCommandById("cancel").hidden = true;
}
WinJS.Utilities.markSupportedForProcessing(toggleShowWords);
WinJS.Utilities.markSupportedForProcessing(playerToggleWord);
WinJS.Utilities.markSupportedForProcessing(playerToggleIden);
WinJS.UI.processAll().then(function () {
    pageInit();
});
//# sourceMappingURL=ui.js.map