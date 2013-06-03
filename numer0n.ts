export class Call{
	constructor(public eat:number,public bite:number){
	}
	toString():string{
		return "E"+this.eat+"B"+this.bite;
	}
}
export class Numer0nState{
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
	filter(call:string,obj:Call):void{
		//あてはまるのをアレする
		this.alives=this.alives.filter((option:string)=>{
			var reca=this.calculateCall(call,option);
			return obj.eat===reca.eat && obj.bite===reca.bite;
		});
	}
	calculateCall(call:string,option:string):Call{
		var result=new Call(0,0);
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

}
export class Numer0nAI{
	private state:Numer0nState;
	constructor(private digitsnumber:number,private digits?:string[]){
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
		var fops=st.makeFullOptions();
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
		var foo=this.shuffleArray(fops);
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
	callResult(call:string,obj:Call):void{
		this.state.filter(call,obj);
	}
	private shuffleArray(arr:any[]):any[]{
		var result=[];
		var cp=arr.concat([]);
		var len=cp.length, nextidx=0;
		while(len>0){
			var index=Math.floor(Math.random()*len);
			result[nextidx]=arr[index];
			nextidx++,len--;
		}
		return result;
	}
}

