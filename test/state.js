var should=require("should");
var numer0n=require("../numer0n");

var Numer0nState=numer0n.Numer0nState;
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
	describe("attackItem",function(){
		it("HIGH&LOW",function(){
			var state=new Numer0nState(3,["0","1","2","3"]);
			state.high=["2","3"], state.low=["0","1"];	//あわせて上書きだ
			var hl=new numer0n.Item("HIGH&LOW");
			hl.result="HLH";
			state.attackItem(hl);
			["203","213","302","312"].forEach(function(ddd){
				state.alives.should.include(ddd);
			});
			state.alives.should.have.length(4);
		});
		it("TARGET - NO",function(){
			var state=new Numer0nState(3,["0","1","2","3"]);
			var ta=new numer0n.Item("TARGET","2");
			ta.result="NO";
			state.attackItem(ta);
			["013","031","103","130","301","310"].forEach(function(ddd){
				state.alives.should.include(ddd);
			});
			state.alives.should.have.length(6);
		});
		it("TARGET - YES",function(){
			var state=new Numer0nState(3,["0","1","2","3"]);
			var ta=new numer0n.Item("TARGET","2");
			ta.result="1";
			state.attackItem(ta);
			["201","203","210","213","230","231"].forEach(function(ddd){
				state.alives.should.include(ddd);
			});
			state.alives.should.have.length(6);
		});
		it("SLASH",function(){
			var state=new Numer0nState(3,["0","1","2","3"]);
			var sl=new numer0n.Item("SLASH");
			sl.result="3";
			state.attackItem(sl);
			["013","023","310","320","031","032","301","302","103","203","130","230"].forEach(function(ddd){
				state.alives.should.include(ddd);
			});
			state.alives.should.have.length(12);
		});
	});
	describe('defenceItem',function(){
		it("SHUFFLE",function(){
			var state=new Numer0nState(3,["0","1","2","3"]);
			state.alives=["012"];
			var de=new numer0n.Item("SHUFFLE");
			state.defenceItem(de);
			["012","021","102","120","201","210"].forEach(function(ddd){
				state.alives.should.include(ddd);
			});
			state.alives.should.have.length(6);
		});
		it("CHANGE1",function(){
			var state=new Numer0nState(3,["0","1","2","3"]);
			state.high=["2","3"], state.low=["0","1"];	//あわせて上書きだ
			state.alives=["012"];
			var de=new numer0n.Item("CHANGE","3H");
			state.defenceItem(de);
			["013"].forEach(function(ddd){
				state.alives.should.include(ddd);
			});
			state.alives.should.have.length(1);
		});
		it("CHANGE2",function(){
			var state=new Numer0nState(3,["0","1","2","3"]);
			state.high=["2","3"], state.low=["0","1"];	//あわせて上書きだ
			var de=new numer0n.Item("CHANGE","1L");
			state.defenceItem(de);
			["023","123","032","132"].forEach(function(ddd){
				state.alives.should.include(ddd);
			});
			state.alives.should.have.length(4);
		});
	});
});
describe("Numer0nAI",function(){
	describe("basic decision",function(){
		it("checks mate",function(){
			var ai=new numer0n.Numer0nGame.Attacker(3,["0","1","2","3"]);
			ai.state.alives=["230"];
			ai.makeCall().should.be.eql("230");
		});
	});
});
