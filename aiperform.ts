/* not compatible */
import numer0n=module("numer0n");

/* node things*/
declare var require:{
	(name:string):any;
};
declare var process:any;

var readline=require('readline');
var rl=readline.createInterface({
	input:process.stdin,
	output:process.stdout,
});

rl.question("Decide 3 digits. Don't tell me!! Press Enter:",(answer)=>{
	//dummy
	var ai=new numer0n.Numer0nGame.Attacker(3,["0","1","2","3","4","5","6","7","8","9"]);
	nextDecide();

	function nextDecide():void{
		var call=ai.makeCall();
		rl.write("AI says: "+call+"\n");
		ask();
		function ask():void{
			rl.question("Input EAT then BITE: ex)3 0\n",(answer)=>{
				var res=answer.split(/\s+/);
				if(res.length!==2){
					//変
					rl.write("Invalid input.\n");
					ask();
					return;
				}
				var eat=parseInt(res[0]), bite=parseInt(res[1]);
				if(isNaN(eat) || isNaN(bite)){
					rl.write("Invalid input.\n");
					ask();
					return;
				}
				ai.callResult(call,new numer0n.CallResult(eat,bite));
				if(eat===3 && bite===0){
					rl.write("AI says: YES!!\n");
					rl.close();
					return;
				}
				nextDecide();
			});
		}
	}
});
