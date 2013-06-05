import numer0n=module("numer0n");

var Numer0nGame=numer0n.Numer0nGame;
var f=new Numer0nGame.Field(3);

f.addPlayer(new Numer0nGame.Human(f,"Player"));
f.addPlayer(new Numer0nGame.AI(f,"AI"));
f.start(0);
