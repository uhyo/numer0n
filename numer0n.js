var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CallResult = (function () {
    function CallResult(eat, bite) {
        this.eat = eat;
        this.bite = bite;
    }
    CallResult.prototype.toString = function () {
        return "E" + this.eat + "B" + this.bite;
    };
    return CallResult;
})();
exports.CallResult = CallResult;
var Item = (function () {
    function Item(type, argument) {
        this.type = null;
        this.argument = null;
        this.result = null;
        this.type = type;
        if(argument) {
            this.argument = argument;
        }
    }
    return Item;
})();
exports.Item = Item;
var Numer0nState = (function () {
    function Numer0nState(digitsnumber, digits) {
        if (typeof digits === "undefined") { digits = [
            "0", 
            "1", 
            "2", 
            "3", 
            "4", 
            "5", 
            "6", 
            "7", 
            "8", 
            "9"
        ]; }
        this.digitsnumber = digitsnumber;
        this.digits = digits;
        this.low = [
            "0", 
            "1", 
            "2", 
            "3", 
            "4"
        ];
        this.high = [
            "5", 
            "6", 
            "7", 
            "8", 
            "9"
        ];
        this.initialize();
    }
    Numer0nState.prototype.initialize = function () {
        var d = this.digitsnumber;
        var ds = this.digits.concat([]);
        this.alives = this.makeFullOptions();
    };
    Numer0nState.prototype.makeFullOptions = function () {
        return makeDigits(this.digitsnumber, this.digits.concat([]));
        function makeDigits(keta, digits) {
            if(keta <= 0) {
                return [
                    ""
                ];
            }
            return digits.map(function (digit) {
                return makeDigits(keta - 1, digits.filter(function (x) {
                    return x !== digit;
                })).map(function (result) {
                    return digit + result;
                });
            }).reduce(function (sum, current) {
                return sum.concat(current);
            }, []);
        }
    };
    Numer0nState.prototype.filter = function (call, obj) {
        var _this = this;
        this.alives = this.alives.filter(function (option) {
            var reca = _this.calculateCall(call, option);
            return obj.eat === reca.eat && obj.bite === reca.bite;
        });
    };
    Numer0nState.prototype.calculateCall = function (call, option) {
        var result = new CallResult(0, 0);
        for(var i = 0, l = call.length; i < l; i++) {
            if(call[i] === option[i]) {
                result.eat++;
            } else if(option.indexOf(call[i]) >= 0) {
                result.bite++;
            }
        }
        return result;
    };
    Numer0nState.prototype.attackItem = function (item) {
        var _this = this;
        if(item.type === "HIGH&LOW") {
            var r = item.result, l = r.length;
            this.alives = this.alives.filter(function (option) {
                for(var i = 0; i < l; i++) {
                    if(r[i] === "H") {
                        if(_this.high.indexOf(option[i]) === -1) {
                            return false;
                        }
                    } else if(r[i] === "L") {
                        if(_this.low.indexOf(option[i]) === -1) {
                            return false;
                        }
                    } else {
                        throw new Error("gwaaaaa");
                    }
                }
                return true;
            });
        } else if(item.type === "TARGET") {
            if(item.result === "NO") {
                this.alives = this.alives.filter(function (option) {
                    for(var i = 0, l = option.length; i < l; i++) {
                        if(option[i] === item.argument) {
                            return false;
                        }
                    }
                    return true;
                });
            } else {
                var kt = parseInt(item.result) - 1;
                this.alives = this.alives.filter(function (option) {
                    return option[kt] === item.argument;
                });
            }
        } else if(item.type === "SLASH") {
            var slash = parseInt(item.result) - 0;
            this.alives = this.alives.filter(function (option) {
                var numarr = option.split("").map(function (str) {
                    return parseInt(str);
                });
                var sl = Math.max.apply(Math, numarr) - Math.min.apply(Math, numarr);
                return slash === sl;
            });
        }
    };
    Numer0nState.prototype.defenceItem = function (item) {
        if(item.type === "SHUFFLE") {
            var news = [];
            this.alives.forEach(function (option) {
                news = news.concat(allPatterns(option));
                function allPatterns(option) {
                    if(option.length <= 1) {
                        return [
                            option
                        ];
                    }
                    var result = [];
                    for(var i = 0, l = option.length; i < l; i++) {
                        var took = option.slice(0, i) + option.slice(i + 1);
                        result = result.concat(allPatterns(took).map(function (pat) {
                            return option[i] + pat;
                        }));
                    }
                    return result;
                }
            });
            this.alives = this.unique(news);
        } else if(item.type === "CHANGE") {
            var koh = item.argument[1] === "H" ? this.high : this.low;
            var news = [], kt = item.argument[0] - 1;
            this.alives.forEach(function (option) {
                if(koh.indexOf(option[kt]) === -1) {
                } else {
                    koh.forEach(function (dig) {
                        var br;
                        if(dig === option[kt]) {
                            return;
                        }
                        br = option.slice(0, kt) + " " + option.slice(kt + 1);
                        if(br.indexOf(dig) >= 0) {
                            return;
                        }
                        br = option.slice(0, kt) + dig + option.slice(kt + 1);
                        news.push(br);
                    });
                }
            });
            this.alives = this.unique(news);
        }
    };
    Numer0nState.prototype.unique = function (arr) {
        var obj = {
        };
        return arr.filter(function (str) {
            if(obj[str]) {
                return false;
            }
            obj[str] = true;
            return true;
        });
    };
    return Numer0nState;
})();
exports.Numer0nState = Numer0nState;
(function (Numer0nGame) {
    var Field = (function () {
        function Field(digitsnumber, digits) {
            if (typeof digits === "undefined") { digits = [
                "0", 
                "1", 
                "2", 
                "3", 
                "4", 
                "5", 
                "6", 
                "7", 
                "8", 
                "9"
            ]; }
            this.digitsnumber = digitsnumber;
            this.digits = digits;
            this.players = [];
        }
        Field.prototype.addPlayer = function (player) {
            if(this.players.length < 2) {
                this.players.push(player);
                return;
            }
            throw new Error("Too much players");
        };
        Field.prototype.setCallback = function (endc) {
            this.endCallback = endc;
        };
        Field.prototype.start = function (turn) {
            if (typeof turn === "undefined") { turn = 0; }
            if(this.players.length < 2) {
                throw new Error("2 players are required");
            }
            if(turn !== 0 && turn !== 1) {
                throw new Error("Unknown turn:" + turn);
            }
            this.turn = turn;
            this.startTurn();
        };
        Field.prototype.startTurn = function () {
            var _this = this;
            var turn = this.turn, oppt = turn ^ 1;
            var turnPlayer = this.players[turn], oppPlayer = this.players[oppt];
            turnPlayer.makeCall(function (call) {
                oppPlayer.gotCall(call, function (result) {
                    turnPlayer.gotCallResult(call, result);
                    if(result.eat === 3 && result.bite === 0) {
                        if(_this.endCallback) {
                            _this.endCallback(turn, turnPlayer);
                        }
                        return;
                    }
                    _this.turn = oppt;
                    _this.startTurn();
                });
            });
            delete turnPlayer;
            delete oppPlayer;
        };
        Field.prototype.say = function (player, message) {
            if(this.players.indexOf(player) === -1) {
                throw new Error("Unknown message");
            }
            console.log(player.name + " says: " + message);
        };
        return Field;
    })();
    Numer0nGame.Field = Field;    
    var SilentField = (function (_super) {
        __extends(SilentField, _super);
        function SilentField(digitsnumber, digits) {
                _super.call(this, digitsnumber, digits);
        }
        SilentField.prototype.say = function (player, message) {
        };
        return SilentField;
    })(Field);
    Numer0nGame.SilentField = SilentField;    
    var Player = (function () {
        function Player(field, name) {
            this.field = field;
            this.name = name;
        }
        Player.prototype.makeCall = function (callback) {
        };
        Player.prototype.gotCallResult = function (call, result) {
        };
        Player.prototype.gotCall = function (call, callback) {
        };
        Player.prototype.say = function (message) {
            this.field.say(this, message);
        };
        return Player;
    })();
    Numer0nGame.Player = Player;    
    var AI = (function (_super) {
        __extends(AI, _super);
        function AI(field, name, strategy) {
                _super.call(this, field, name);
            this.field = field;
            this.name = name;
            this.strategy = strategy;
            if(strategy == null) {
                this.strategy = strategy = {
                };
            }
            this.attacker = new Attacker(field.digitsnumber, field.digits, strategy);
            this.defender = new Defender(field.digitsnumber, field.digits, strategy);
            this.defender.setNumber();
        }
        AI.prototype.makeCall = function (callback) {
            var call = this.attacker.makeCall();
            this.say(call);
            callback(call);
        };
        AI.prototype.gotCallResult = function (call, result) {
            if(result.eat === 3 && result.bite === 0) {
                this.say("YES!!");
            }
            this.attacker.callResult(call, result);
        };
        AI.prototype.gotCall = function (call, callback) {
            var callre = this.defender.gotCall(call);
            this.say(callre.eat + "EAT " + callre.bite + "BITE");
            callback(callre);
        };
        return AI;
    })(Player);
    Numer0nGame.AI = AI;    
    var Attacker = (function () {
        function Attacker(digitsnumber, digits, strategy) {
            this.digitsnumber = digitsnumber;
            this.digits = digits;
            this.strategy = strategy;
            this.state = new Numer0nState(digitsnumber, digits);
        }
        Attacker.prototype.makeCall = function () {
            var st = this.state;
            if(st.alives.length === 1) {
                return st.alives[0];
            }
            var remcl = {
            };
            var fops = this.strategy.hasteMakesWaste ? st.makeFullOptions() : st.alives;
            fops.forEach(function (call) {
                var resultCollections = {
                };
                st.alives.forEach(function (option) {
                    var resca = st.calculateCall(call, option);
                    var rescst = resca.toString();
                    if(resultCollections[rescst] == null) {
                        resultCollections[rescst] = 1;
                    } else {
                        resultCollections[rescst]++;
                    }
                });
                remcl[call] = Math.max.apply(Math, values(resultCollections));
            });
            var minCall = Math.min.apply(Math, values(remcl));
            var foo = shuffleArray(fops);
            for(var i = 0, l = foo.length; i , l; i++) {
                if(remcl[foo[i]] === minCall) {
                    return foo[i];
                }
            }
            function values(obj) {
                return Object.keys(obj).map(function (key) {
                    return obj[key];
                });
            }
        };
        Attacker.prototype.callResult = function (call, obj) {
            this.state.filter(call, obj);
        };
        Attacker.prototype.itemResult = function (item) {
            this.state.attackItem(item);
        };
        return Attacker;
    })();
    Numer0nGame.Attacker = Attacker;    
    var Defender = (function () {
        function Defender(digitsnumber, digits, strategy) {
            this.digitsnumber = digitsnumber;
            this.digits = digits;
            this.strategy = strategy;
            this.state = new Numer0nState(digitsnumber, digits);
        }
        Defender.prototype.setNumber = function (num) {
            var _this = this;
            if(num == null) {
                var opts = shuffleArray(this.state.makeFullOptions());
                num = opts[0];
            }
            if(num.length !== this.digitsnumber) {
                throw new Error("Invalid number:" + num);
            }
            if(num.split("").some(function (x) {
                return _this.digits.indexOf(x) === -1;
            })) {
                throw new Error("Invalid number:" + num);
            }
            this.myNumber = num;
        };
        Defender.prototype.gotCall = function (call) {
            var result = this.state.calculateCall(call, this.myNumber);
            this.state.filter(call, result);
            return result;
        };
        return Defender;
    })();
    Numer0nGame.Defender = Defender;    
    var Human = (function (_super) {
        __extends(Human, _super);
        function Human(field, name) {
                _super.call(this, field, name);
            this.field = field;
            this.name = name;
            this.ui = new UserInterface();
        }
        Human.prototype.makeCall = function (callback) {
            this.ui.question("Make your call:", callback);
        };
        Human.prototype.gotCallResult = function (call, result) {
        };
        Human.prototype.gotCall = function (call, callback) {
            this.ui.question("Enter EAT then BITE ex)3 0 :", function (str) {
                var aas = str.split(/\s/);
                callback(new CallResult(parseInt(aas[0]), parseInt(aas[1])));
            });
        };
        return Human;
    })(Player);
    Numer0nGame.Human = Human;    
    var UserInterface = (function () {
        function UserInterface() {
            var readline = require('readline');
            this.inte = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            this.inte.pause();
        }
        UserInterface.prototype.question = function (q, callback) {
            var _this = this;
            this.inte.question(q, function (result) {
                _this.inte.pause();
                callback(result);
            });
        };
        return UserInterface;
    })();
    Numer0nGame.UserInterface = UserInterface;    
})(exports.Numer0nGame || (exports.Numer0nGame = {}));
var Numer0nGame = exports.Numer0nGame;
function shuffleArray(arr) {
    var result = [];
    var cp = arr.concat([]);
    var len = cp.length, nextidx = 0;
    while(len > 0) {
        var index = Math.floor(Math.random() * len);
        result[nextidx] = cp[index];
        cp.splice(index, 1);
        nextidx++ , len--;
    }
    return result;
}
