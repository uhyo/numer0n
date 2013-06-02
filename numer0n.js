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
    return Numer0nState;
})();
exports.Numer0nState = Numer0nState;
new Numer0nState(3);
