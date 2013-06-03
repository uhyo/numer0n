var should=require("should");
var numer0n=require("../numer0n");

var Numer0nState=numer0n.Numer0nState;
var Numer0nAI=numer0n.Numer0nAI;
describe("Numer0nState",function(){
	describe("constructor",function(){
		it("initializes correctly",function(){
			var state=new Numer0nState(3,["0","1","2"]);
			["012","021","102","120","201","210"].forEach(function(ddd){
				state.alives.should.include(ddd);
			});
			state.alives.should.have.length(6);
			//
			state=new Numer0nState(2,["0","1","2","3","4","5"]);
			var results=["01","02","03","04","05","10","12","13","14","15","20","21","23","24","25","30","31","32","34","35","40","41","42","43","45","50","51","52","53","54"];
			results.forEach(function(ddd){
				state.alives.should.include(ddd);
			});
			state.alives.should.have.length(results.length);
		});
	});
	describe("filter",function(){
		it("filters correctly",function(){
			var state=new Numer0nState(3,["0","1","2","3"]);
			state.filter("012",{
				eat:1, bite:2,
			});
			//この3つが残る
			var results=["021","210","102"];
			results.forEach(function(ddd){
				state.alives.should.include(ddd);
			});
			state.alives.should.have.length(results.length);
			
			state=new Numer0nState(3,["0","1","2","3"]);
			state.filter("012",{
				eat:3, bite:0,
			});
			state.alives.should.include("012");
			state.alives.should.have.length(1);
		});
	});
});
describe("Numer0nAI",function(){
	describe("basic decision",function(){
		it("checks mate",function(){
			var ai=new Numer0nAI(3,["0","1","2","3"]);
			ai.state.alives=["230"];
			ai.makeCall().should.be.eql("230");
		});
	});
});
