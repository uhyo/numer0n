export interface Strategy{
	hasteMakesWaste?:bool;	//E3B0のない手を許す
}
export class CallResult{
	constructor(public eat:number,public bite:number){
	}
	toString():string{
		return "E"+this.eat+"B"+this.bite;
	}
}
//アイテム
export class Item{
	type:string=null;	//6種類?
	argument:string=null;	//追加情報
	result:string=null;	//結果
	constructor(type,argument?){
		this.type=type;
		if(argument){
			this.argument=argument;
		}
	}
}
export class Numer0nState{
	private low:string[]=["0","1","2","3","4"];
	private high:string[]=["5","6","7","8","9"];
	public alives:string[];	//まだ生き残っている数値
	constructor(private digitsnumber:number,private digits:string[]=["0","1","2","3","4","5","6","7","8","9"]){
		this.initialize();
	}
	private initialize():void{
		var d=this.digitsnumber;	//桁数
		var ds=this.digits.concat([]);
		this.alives=this.makeFullOptions();
	}
	makeFullOptions():string[]{
		return makeDigits(this.digitsnumber,this.digits.concat([]));
		function makeDigits(keta:number,digits:string[]):string[]{
			//keta桁の候補一覧を作る
			if(keta<=0){
				return [""];
			}
			return digits.map((digit:string)=>{
				return makeDigits(keta-1,digits.filter((x:string)=>{
					return x!==digit;	//重複だめ
				})).map((result:string)=>{
					return digit+result;
				});
			}).reduce((sum:string[],current:string[])=>{
				return sum.concat(current);
			},[]);
		}
	}
	filter(call:string,obj:CallResult):void{
		//あてはまるのをアレする
		this.alives=this.alives.filter((option:string)=>{
			var reca=this.calculateCall(call,option);
			return obj.eat===reca.eat && obj.bite===reca.bite;
		});
	}
	calculateCall(call:string,option:string):CallResult{
		var result=new CallResult(0,0);
		for(var i=0,l=call.length;i<l;i++){
			//計算
			if(call[i]===option[i]){
				result.eat++;
			}else if(option.indexOf(call[i])>=0){
				result.bite++;
			}
		}
		return result;
	}
	//アイテム結果
	attackItem(item:Item):void{
		if(item.type==="HIGH&LOW"){
			//item.result: "HLH"とか
			var r=item.result, l=r.length;
			this.alives=this.alives.filter((option:string)=>{
				for(var i=0;i<l;i++){
					if(r[i]==="H"){
						if(this.high.indexOf(option[i])===-1)return false;
					}else if(r[i]==="L"){
						if(this.low.indexOf(option[i])===-1)return false;
					}else{
						throw new Error("gwaaaaa");
					}
				}
				return true;
			});
		}else if(item.type==="TARGET"){
			//item.argument:きいた数字(1つ)
			//item.result: 桁（左から1,2,...）または"NO"
			if(item.result==="NO"){
				this.alives=this.alives.filter((option:string)=>{
					for(var i=0,l=option.length;i<l;i++){
						if(option[i]===item.argument)return false;
					}
					return true;
				});
			}else{
				var kt=parseInt(item.result)-1;
				this.alives=this.alives.filter((option:string)=>{
					return option[kt]===item.argument;
				});
			}
		}else if(item.type==="SLASH"){
			//item.result:スラッシュナンバー
			var slash=parseInt(item.result)-0;
			this.alives=this.alives.filter((option:string)=>{
				var numarr=option.split("").map((str)=>{return parseInt(str);});
				var sl=Math.max.apply(Math,numarr)-Math.min.apply(Math,numarr);
				return slash===sl;
			});
		}
	}
	defenceItem(item:Item):void{
		//ディフェンスアイテムを使った場合
		if(item.type==="SHUFFLE"){
			var news=[];
			this.alives.forEach((option:string)=>{
				news=news.concat(allPatterns(option));

				function allPatterns(option:string):string[]{
					if(option.length<=1)return [option];
					var result=[];
					for(var i=0,l=option.length;i<l;i++){
						var took=option.slice(0,i)+option.slice(i+1);
						result=result.concat(allPatterns(took).map((pat)=>{
							return option[i]+pat;
						}));
					}
					return result;
				}
			});
			this.alives=this.unique(news);
		}else if(item.type==="CHANGE"){
			//item.argument: 桁→ H/L ex)2H
			var koh = item.argument[1]==="H" ? this.high : this.low;
			var news=[], kt=item.argument[0]-1;
			this.alives.forEach((option:string)=>{
				if(koh.indexOf(option[kt])===-1){
					//これは候補じゃない
					//news.push(option);
				}else{
					//変わる
					koh.forEach((dig)=>{
						var br;
						if(dig===option[kt])return;	//同じにはならない
						//いったん空白に
						br=option.slice(0,kt)+" "+option.slice(kt+1);
						if(br.indexOf(dig)>=0){
							//入れたら2重になる!だめ
							return;
						}
						br=option.slice(0,kt)+dig+option.slice(kt+1);
						news.push(br);
					});
				}
			});
			this.alives=this.unique(news);
		}
	}
	private unique(arr:string[]):string[]{
		var obj=<{[index:string]:bool;}>{};
		return arr.filter((str)=>{
			if(obj[str]){
				return false;
			}
			obj[str]=true;
			return true;
		});
	}

}
export module Numer0nGame{
	declare var require:any, process:any;
	//場
	export class Field{
		private players:Player[]=[];
		private turn:number;
		private endCallback:(turn:number,player:Player)=>void;
		constructor(public digitsnumber:number,public digits?:string[]=["0","1","2","3","4","5","6","7","8","9"]){
		}
		addPlayer(player:Player):void{
			if(this.players.length<2){
				this.players.push(player);
				return;
			}
			throw new Error("Too much players");
		}
		//ゲーム開始
		setCallback(endc:(winindex:number,player:Player)=>void):void{
			this.endCallback=endc;
		}
		start(turn?:number=0):void{
			if(this.players.length<2){
				throw new Error("2 players are required");
			}
			if(turn!==0 && turn!==1){
				throw new Error("Unknown turn:"+turn);
			}
			this.turn=turn;
			this.startTurn();
		}
		//ターンのはじめ
		private startTurn():void{
			var turn=this.turn, oppt=turn^1;
			var turnPlayer=this.players[turn], oppPlayer=this.players[oppt];
			turnPlayer.makeCall((call:string)=>{
				oppPlayer.gotCall(call,(result:CallResult)=>{
					turnPlayer.gotCallResult(call,result);
					//次のターンへ
					if(result.eat===3 && result.bite===0){
						//勝敗決した
						if(this.endCallback)this.endCallback(turn,turnPlayer);
						return;
					}
					this.turn=oppt;
					this.startTurn();
				});
			});
			delete turnPlayer;
			delete oppPlayer;
		}
		//しゃべる
		say(player:Player,message:string):void{
			if(this.players.indexOf(player)===-1){
				//えっ
				throw new Error("Unknown message");
			}
			console.log(player.name+" says: "+message);
		}
	}
	//しずかだ
	export class SilentField extends Field{
		constructor(digitsnumber:number,digits?:string[]){
			super(digitsnumber,digits);
		}
		say(player:Player,message:string):void{
		}
	}
	//プレイヤー
	export class Player{
		constructor(private field:Field,public name:string){
		}
		//攻撃する
		makeCall(callback:(call:string)=>void):void{
		}
		//攻撃結果きた
		gotCallResult(call:string,result:CallResult):void{
		}
		//攻撃された
		gotCall(call:string,callback:(result:CallResult)=>void):void{
		}
		//いう
		say(message:string):void{
			this.field.say(this,message);
		}
	}
	//AI
	export class AI extends Player{
		private attacker:Attacker;
		private defender:Defender;
		constructor(private field:Field,public name:string,private strategy?:Strategy){
			super(field,name);
			if(strategy==null){
				this.strategy=strategy={};
			}
			this.attacker=new Attacker(field.digitsnumber,field.digits,strategy);
			this.defender=new Defender(field.digitsnumber,field.digits,strategy);
			this.defender.setNumber();
		}
		makeCall(callback:(call:string)=>void):void{
			var call=this.attacker.makeCall();
			this.say(call);
			callback(call);
		}
		gotCallResult(call:string,result:CallResult):void{
			if(result.eat===3 && result.bite===0){
				this.say("YES!!");
			}
			this.attacker.callResult(call,result);
		}
		gotCall(call:string,callback:(result:CallResult)=>void):void{
			var callre=this.defender.gotCall(call);
			this.say(callre.eat+"EAT "+callre.bite+"BITE");
			callback(callre);
		}
	}
	//相手の数字をあてたりする
	export class Attacker{
		private state:Numer0nState;
		constructor(private digitsnumber:number,private digits:string[],private strategy:Strategy){
			this.state=new Numer0nState(digitsnumber,digits);
		}
		makeCall():string{
			//攻撃する
			var st=this.state;
			if(st.alives.length===1){
				//とどめをさす
				return st.alives[0];
			}
			var remcl=<{
				[index:number]:number;
			}>{};
			var fops= this.strategy.hasteMakesWaste ? st.makeFullOptions() : st.alives;
			fops.forEach((call:string)=>{
				//選択肢を検討する
				var resultCollections=<{
					[index:number]:number;
				}>{};
				st.alives.forEach((option:string)=>{
					var resca=st.calculateCall(call,option);
					var rescst=resca.toString();
					if(resultCollections[rescst]==null){
						resultCollections[rescst]=1;
					}else{
						resultCollections[rescst]++;
					}
				});
				//最大候補数
				remcl[call]=Math.max.apply(Math,values(resultCollections));
			});
			var minCall=Math.min.apply(Math,values(remcl));
			//探す
			var foo=shuffleArray(fops);
			for(var i=0,l=foo.length;i,l;i++){
				if(remcl[foo[i]]===minCall){
					return foo[i];
				}
			}
			function values(obj:any):any[]{
				return Object.keys(obj).map((key:string)=>{
					return obj[key];
				});
			}
		}
		callResult(call:string,obj:CallResult):void{
			this.state.filter(call,obj);
		}
		itemResult(item:Item):void{
			this.state.attackItem(item);
		}
	}
	export class Defender{
		private state:Numer0nState;
		private myNumber:string;	//自分の数字
		constructor(private digitsnumber:number,private digits:string[],private strategy:Strategy){
			this.state=new Numer0nState(digitsnumber,digits);
		}
		setNumber(num?:string):void{
			if(num==null){
				//番号を自動で作る
				var opts=shuffleArray(this.state.makeFullOptions());
				num=opts[0];
			}
			if(num.length!==this.digitsnumber){
				throw new Error("Invalid number:"+num);
			}
			if(num.split("").some((x:string)=>{
				return this.digits.indexOf(x)===-1;
			})){
				throw new Error("Invalid number:"+num);
			}
			this.myNumber=num;
		}

		//コールされたら結果返す
		gotCall(call:string):CallResult{
			//相手の状況を把握
			var result=this.state.calculateCall(call,this.myNumber);
			this.state.filter(call,result);
			return result;
		}
	}
	//人
	//What!? No defence!
	export class Human extends Player{
		private ui:UserInterface;
		constructor(private field:Field,public name:string){
			super(field,name);
			this.ui=new UserInterface;	//抽象的インターフェース
		}
		makeCall(callback:(call:string)=>void):void{
			this.ui.question("Make your call:",callback);
		}
		gotCallResult(call:string,result:CallResult):void{
		}
		gotCall(call:string,callback:(result:CallResult)=>void):void{
			this.ui.question("Enter EAT then BITE ex)3 0 :",(str:string)=>{
				var aas=str.split(/\s/);
				callback(new CallResult(parseInt(aas[0]),parseInt(aas[1])));
			});
		}
	}
	export class UserInterface{
		//node的実装
		private inte:any;
		constructor(){
			var readline=require('readline');
			this.inte=readline.createInterface({
				input:process.stdin,
				output:process.stdout,
			});
			this.inte.pause();
		}
		question(q:string,callback:(result:string)=>void):void{
			this.inte.question(q,(result:string)=>{
				this.inte.pause();
				callback(result);
			});
		}
	}
}
function shuffleArray(arr:any[]):any[]{
	var result=[];
	var cp=arr.concat([]);
	var len=cp.length, nextidx=0;
	while(len>0){
		var index=Math.floor(Math.random()*len);
		result[nextidx]=cp[index];
		cp.splice(index,1);
		nextidx++,len--;
	}
	return result;
}
