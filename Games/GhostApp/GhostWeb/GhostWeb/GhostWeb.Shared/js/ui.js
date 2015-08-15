
var inGaming = false;

function changePanel(id) {
    if (inGaming) {
        return;
    }
    $(".panel").hide();
    $("#" + id).show();
    inGaming = false;
}

var wordShown = true;
function showHideWords() {
    if (wordShown) {
        $("#words_group").hide(500);
        $("#words_show_btn").text("显示词汇");
        wordShown = false;
    } else {
        $("#words_group").show(500);
        $("#words_show_btn").text("隐藏词汇");
        wordShown = true;
    }
}

function randWords() {
    GameManagerIns.randWords();
    var words = GameManagerIns.getCurrent();
    $("#major_words").val(words[0]);
    $("#minor_words").val(words[1]);
    $("#ghost_words").val(words[2]);
}

var nowPosition = 0;

function startGame() {
    if ($("#major_words").val() == "" ||
        $("#minor_words").val() == "" ||
        $("#ghost_words").val() == "") return;
    GameManagerIns.setCurrent($("#major_words").val(), $("#minor_words").val(), $("#ghost_words").val());
    GameManagerIns.setPlayerNums($("#major_nums").val(), $("#minor_nums").val(), $("#ghost_nums").val());
    GameManagerIns.doRand();
    nowPosition = 1;
    changePanel("nav_gaming");
    inGaming = true;
    $("#gaming_pos").text(nowPosition);
    $("#gaming_hiden").show();
}

function gamingShow() {
    $("#gaming_hiden").hide();
    var info = GameManagerIns.getPlayerByPos(nowPosition);
    $("#gaming_words").text(info.words);
    $("#gaming_shown").show();
}

function gamingHide() {
    $("#gaming_shown").hide();
    nowPosition++;
    if (nowPosition > GameManagerIns.getTotle()) {
        inGaming = false;
        showState();
        return;
    }
    $("#gaming_pos").text(nowPosition);
    $("#gaming_hiden").show();
}

var resultIdenMap = [], resultWordsMap = [];
function showState() {
    resultIdenMap = [], resultWordsMap = [];
    var container = $("#result_container");
    $(container).empty();
    resultIdenMap[0] = false;
    resultWordsMap[0] = false;
    for (var i = 1; i <= GameManagerIns.getTotle() ; i++) {
        resultIdenMap[i] = false;
        resultWordsMap[i] = false;
        var p = document.createElement("p");
        var div, span, button;

        div = document.createElement("div");
        $(div).addClass("input-group").addClass("input-group-lg").css("width", "100%");

        span = document.createElement("span");
        $(span).addClass("input-group-addon").text("第");
        div.appendChild(span);

        span = document.createElement("span");
        $(span).addClass("form-control").attr("id", "result_pos_" + i).text(i);
        div.appendChild(span);

        span = document.createElement("span");
        $(span).addClass("input-group-addon").text("位玩家");
        div.appendChild(span);

        p.appendChild(div);

        div = document.createElement("div");
        $(div).addClass("input-group").addClass("input-group-lg").css("width", "100%");

        span = document.createElement("span");
        $(span).addClass("input-group-addon").text("身份");
        div.appendChild(span);

        span = document.createElement("span");
        $(span).addClass("form-control").attr("id", "result_iden_" + i).text("-");
        div.appendChild(span);

        span = document.createElement("span");
        $(span).addClass("input-group-btn");
        button = document.createElement("button");
        $(button).addClass("btn").addClass("btn-warning").addClass("btn-lg").attr("type", "button")
            .attr("id", "result_iden_btn_" + i).text("显示").attr("onclick", "changeIdenResultState(" + i + ", 0)");
        span.appendChild(button);
        div.appendChild(span);

        p.appendChild(div);

        div = document.createElement("div");
        $(div).addClass("input-group").addClass("input-group-lg").css("width", "100%");

        span = document.createElement("span");
        $(span).addClass("input-group-addon").text("词汇");
        div.appendChild(span);

        span = document.createElement("span");
        $(span).addClass("form-control").attr("id", "result_words_" + i).text("-");
        div.appendChild(span);

        span = document.createElement("span");
        $(span).addClass("input-group-btn");
        button = document.createElement("button");
        $(button).addClass("btn").addClass("btn-warning").addClass("btn-lg").attr("type", "button")
            .attr("id", "result_words_btn_" + i).text("显示").attr("onclick", "changeWordsResultState(" + i + ", 0)");
        span.appendChild(button);
        div.appendChild(span);

        p.appendChild(div);

        container[0].appendChild(p);
//        var str = '<p>' +
//            '<div class="input-group input-group-lg" style="width: 100%">' +
//            '<span class="input-group-addon">第</span>' +
//            '<span class="form-control" id="result_pos_' + i + '">' + i + '</span>' +
//            '<span class="input-group-addon">位玩家</span>' +
//            '</div>' +
//            '<div class="input-group input-group-lg" style="width: 100%">' +
//            '<span class="input-group-addon">身份</span>' +
//            '<span class="form-control" id="result_iden_' + i + '">-</span>' +
//            '<span class="input-group-btn">' +
//            '<button class="btn btn-warning btn-lg" type="button" onclick="changeIdenResultState(' + i + ', 0)" id="result_iden_btn_' + i + '">显示</button>' +
//            '</span>' +
//            '</div>' +
//            '<div class="input-group input-group-lg" style="width: 100%">' +
//            '<span class="input-group-addon">词汇</span>' +
//            '<span class="form-control" id="result_words_' + i + '">-</span>' +
//            '<span class="input-group-btn">' +
//            '<button class="btn btn-warning btn-lg" type="button" onclick="changeWordsResultState(' + i + ', 0)" id="result_words_btn_' + i + '">显示</button>' +
//            '</span>' +
//            '</div>' +
//            '</p>';
//        $(container).append(str);
    }
    changePanel("nav_result");
}

function changeIdenResultState(i, force) {
    if (force == 1 || force == 0 && resultIdenMap[i]) {
        $("#result_iden_" + i).text("-");
        $("#result_iden_btn_" + i).text("显示");
        resultIdenMap[i] = false;
        return;
    }
    var idens = ["", "多数派", "少数派", "鬼"];
    var info = GameManagerIns.getPlayerByPos(i);
    var iden = idens[info.iden];
    $("#result_iden_" + i).text(iden);
    $("#result_iden_btn_" + i).text("隐藏");
    resultIdenMap[i] = true;
}

function changeWordsResultState(i, force) {
    if (force == 1 || force == 0 && resultWordsMap[i]) {
        $("#result_words_" + i).text("-");
        $("#result_words_btn_" + i).text("显示");
        resultWordsMap[i] = false;
        return;
    }
    var info = GameManagerIns.getPlayerByPos(i);
    var words = info.words;
    $("#result_words_" + i).text(words);
    $("#result_words_btn_" + i).text("隐藏");
    resultWordsMap[i] = true;
}

function changeAllIdenResultState() {
    for (var i = 1; i <= GameManagerIns.getTotle() ; i++) {
        changeIdenResultState(i, resultIdenMap[0] ? 1 : 2);
    }
    $("#result_iden_btn_all").text((resultIdenMap[0] ? "显示" : "隐藏") + "所有身份");
    resultIdenMap[0] = !resultIdenMap[0];
}

function changeAllWordsResultState() {
    for (var i = 1; i <= GameManagerIns.getTotle() ; i++) {
        changeWordsResultState(i, resultWordsMap[0] ? 1 : 2);
    }
    $("#result_words_btn_all").text((resultWordsMap[0] ? "显示" : "隐藏") + "所有词汇");
    resultWordsMap[0] = !resultWordsMap[0];
}

changePanel("nav_newgame");
//changePanel("nav_gaming");

function PageInit() {
    $("#config_nums").change(function() {
        var value = $("#config_nums").val();
        var list = value.split("-");
        $("#major_nums").val(list[0]);
        $("#minor_nums").val(list[1]);
        $("#ghost_nums").val(list[2]);
    });
}

PageInit();
