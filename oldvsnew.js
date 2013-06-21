var numer0n = require("./numer0n")
var Numer0nGame = numer0n.Numer0nGame;
var wins_count = [
    0, 
    0
], count = 0;
oneGame();
function oneGame() {
    var f = new Numer0nGame.SilentField(3);
    f.addPlayer(new Numer0nGame.AI(f, "投機家"));
    f.addPlayer(new Numer0nGame.AI(f, "投資家", {
        hasteMakesWaste: true
    }));
    f.setCallback(function (turn, turnPlayer) {
        wins_count[turn]++;
        count++;
        process.stdout.write(count + ".");
        if(count < 100) {
            oneGame();
        } else {
            console.log("");
            console.log("投機家 " + wins_count[0]);
            console.log("投資家 ", wins_count[1]);
        }
    });
    f.start(0);
}
