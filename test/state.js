var should=require("should");
var numer0n=require("../numer0n");

var Numer0nState=numer0n.Numer0nState;
describe("Numer0nState",function(){
	describe("constructor",function(){
		it("initialize correctly",function(){
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
});