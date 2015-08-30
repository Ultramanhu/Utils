
/// <reference path="../jquery/jquery.d.ts" />
/// <reference path="../winjs/js/winjs.d.ts" />

"use strict";

var nowPosition: number = 0;

function alertMsg(msg: string) {
    $("#msg-content").text(msg);
    $("#common-msg")[0].winControl.show();
}

function toggleWords() {
    if (!$("#showWordsToggle")[0].winControl.checked) {
        $(".words-control").attr("type", "password").addClass("win-password");
    } else {
        $(".words-control").attr("type", "text").removeClass("win-password");;
    }
}

function randWords() {
    GameManager.Ins.randWords();
    var words: WordTuple = GameManager.Ins.getCurrent();
    $("#major_words").val(words[0]);
    $("#minor_words").val(words[1]);
    $("#ghost_words").val(words[2]);
}

function configNumChanges() {
    var value: string = $("#config_nums").val();
    var list: Array<string> = value.split("-");
    $("#major_nums").val(list[0]);
    $("#minor_nums").val(list[1]);
    $("#ghost_nums").val(list[2]);
}

WinJS.Namespace.define("GhostWinJS", {
    cancel: WinJS.UI.eventHandler((ev) => {
        $("#pivotContent")[0].winControl.selectedIndex = 0;
        nowPosition = 0;
        $("#gamingContent").fadeOut("fast", () => {
            $("#pivotContent").fadeIn("fast", () => {
                $("#createAppBar")[0].winControl.getCommandById("cancel").hidden = true;
            });
        });
    }),
    readme: WinJS.UI.eventHandler((ev) => {
        $("#help-msg")[0].winControl.show();
    })
});

function gamingShow() {
    var info = GameManager.Ins.getPlayerByPos(nowPosition);
    $("#gaming_words").text(info.words);
    $("#gamingHideContent").fadeOut("fast", () => {
        $("#gamingShowContent").fadeIn("fast", () => {
        });
    });
}

function gamingHide() {
    nowPosition = nowPosition + 1;
    if (nowPosition > GameManager.Ins.getTotle()) {
        $("#pivotContent")[0].winControl.selectedIndex = 1;
        $("#gamingContent").fadeOut("fast", () => {
            $("#pivotContent").fadeIn("fast", () => {
                $("#createAppBar")[0].winControl.getCommandById("cancel").hidden = true;
            });
        });
        return;
    }
    $("#gaming_pos").text(nowPosition.toString());
    $("#gamingShowContent").fadeOut("fast", () => {
        $("#gamingHideContent").fadeIn("fast");
    });
}

function startGame() {
    var checker: (id: string, msg: string) => boolean = (id, msg) => {
        if ($("#" + id).val() == "") {
            alertMsg(msg);
            $("#" + id).focus();
            return false;
        }
        return true;
    }

    if (!checker("major_words", "多数派词条未填写")) return;
    if (!checker("minor_words", "少数派词条未填写")) return;
    if (!checker("ghost_words", "鬼词条未填写")) return;
    
    GameManager.Ins.setCurrent(
        $("#major_words").val(),
        $("#minor_words").val(),
        $("#ghost_words").val()
    );
    GameManager.Ins.setPlayerNums(
        parseInt($("#major_nums").val()),
        parseInt($("#minor_nums").val()),
        parseInt($("#ghost_nums").val())
    );
    GameManager.Ins.doRand();
    nowPosition = 0;
    gamingHide();

    $("#pivotContent").fadeOut("fast", () => {
        $("#gamingContent").fadeIn("fast", () => {
            $("#createAppBar")[0].winControl.getCommandById("cancel").hidden = false;
        });
    });
}

function pageInit() {
    $("#createAppBar")[0].winControl.getCommandById("cancel").hidden = true;
}

WinJS.Utilities.markSupportedForProcessing(toggleWords);
WinJS.UI.processAll().then(() => {
    pageInit();
});