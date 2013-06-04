var numer0n = require("./numer0n")
var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question("Decide 3 digits. Don't tell me!! Press Enter:", function (answer) {
    var ai = new numer0n.Numer0nGame.Attacker(3, [
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
    ]);
    nextDecide();
    function nextDecide() {
        var call = ai.makeCall();
        rl.write("AI says: " + call + "\n");
        ask();
        function ask() {
            rl.question("Input EAT then BITE: ex)3 0\n", function (answer) {
                var res = answer.split(/\s+/);
                if(res.length !== 2) {
                    rl.write("Invalid input.\n");
                    ask();
                    return;
                }
                var eat = parseInt(res[0]), bite = parseInt(res[1]);
                if(isNaN(eat) || isNaN(bite)) {
                    rl.write("Invalid input.\n");
                    ask();
                    return;
                }
                ai.callResult(call, new numer0n.CallResult(eat, bite));
                if(eat === 3 && bite === 0) {
                    rl.write("Ai says: YES!!\n");
                    rl.close();
                    return;
                }
                nextDecide();
            });
        }
    }
});
