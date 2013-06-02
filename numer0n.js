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
        this.alives = makeDigits(d, ds);
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
        var result = {
            eat: 0,
            bite: 0
        };
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
new Numer0nState(3);
