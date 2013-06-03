var Call = (function () {
    function Call(eat, bite) {
        this.eat = eat;
        this.bite = bite;
    }
    Call.prototype.toString = function () {
        return "E" + this.eat + "B" + this.bite;
    };
    return Call;
})();
exports.Call = Call;
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
        var result = new Call(0, 0);
        for(var i = 0, l = call.length; i < l; i++) {
            if(call[i] === option[i]) {
                result.eat++;
            } else if(option.indexOf(call[i]) >= 0) {
                result.bite++;
            }
        }
        return result;
    };
    return Numer0nState;
})();
exports.Numer0nState = Numer0nState;
var Numer0nAI = (function () {
    function Numer0nAI(digitsnumber, digits) {
        this.digitsnumber = digitsnumber;
        this.digits = digits;
        this.state = new Numer0nState(digitsnumber, digits);
    }
    Numer0nAI.prototype.makeCall = function () {
        var st = this.state;
        if(st.alives.length === 1) {
            return st.alives[0];
        }
        var remcl = {
        };
        var fops = st.makeFullOptions();
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
        var foo = this.shuffleArray(fops);
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
    Numer0nAI.prototype.shuffleArray = function (arr) {
        var result = [];
        var cp = arr.concat([]);
        var len = cp.length, nextidx = 0;
        while(len > 0) {
            var index = Math.floor(Math.random() * len);
            result[nextidx] = arr[index];
            nextidx++ , len--;
        }
        return result;
    };
    return Numer0nAI;
})();
exports.Numer0nAI = Numer0nAI;
