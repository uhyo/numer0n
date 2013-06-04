var numer0n = require("./numer0n")
var Numer0nGame = numer0n.Numer0nGame;
var f = new Numer0nGame.Field(3);
f.addPlayer(new Numer0nGame.AI(f, "AI1"));
f.addPlayer(new Numer0nGame.AI(f, "AI2"));
f.start(0);
