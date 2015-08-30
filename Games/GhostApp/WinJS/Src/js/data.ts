
/// <reference path="../jquery/jquery.d.ts" />

enum IDENTITY {
    ID_UNKNOWN = 0,
    ID_MAJOR = 1,
    ID_MINOR = 2,
    ID_GHOST = 3,
};

function Rand(n: number): number {
    return Math.floor((Math.random() * n));
}

class Player {

    public pos: number;
    public iden: IDENTITY = IDENTITY.ID_UNKNOWN;
    public words: string = "";

    public constructor(pos: number) {
        this.pos = pos;
    }
}

type WordTuple = [string, string, string];

class GameManager {

    protected list: Array<WordTuple> = [];
    protected current: WordTuple;
    protected players: Array<Player> = [];
    protected playerNums: [number, number, number, number];

    public static Ins: GameManager = new GameManager();

    constructor() {
        this.init();
    }

    public init(): void {
        $.ajax({
            url: "./js/words.js",
            contentType: "application/javascript",
            dataType: 'json',
            success: (res) => {
                this.list = res.words;
            },
            error: (a, b, c) => {
                alertMsg("获取词库数据失败");
            }
        });
    }

    public randWords(): void {
        if (this.list.length == 0) {
            alertMsg("词库无词条，无法随机");
            return;
        }
        var rand: number = Rand(this.list.length);
        this.current = this.list[rand];
    }

    public setCurrent(major: string, minor: string, ghost: string): void {
        this.current = [major, minor, ghost];
    }

    public getCurrent(): WordTuple {
        return this.current;
    }

    public setPlayerNums(major: number, minor: number, ghost: number): void {
        var total: number = major + minor + ghost;
        this.playerNums = [total, major, minor, ghost];
    }

    public doRand(): void {
        this.players = [];
        var idens: Array<IDENTITY> = [];
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
            var pos: number = Rand(idens.length);
            var iden: IDENTITY = idens[pos];
            this.players[i].iden = iden;
            this.players[i].words = this.current[iden - 1];
            if (idens.length > 0) {
                idens[pos] = idens[idens.length - 1];
                idens.pop();
            }
        }
    }

    public getPlayerByPos(pos: number): Player {
        return this.players[pos - 1];
    }

    public getTotle(): number {
        return this.playerNums[0];
    }
}
