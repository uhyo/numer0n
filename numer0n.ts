export interface CallObject{
	eat:number;
	bite:number;
}
export class Numer0nState{
	private alives:string[];	//まだ生き残っている数値
	constructor(private digitsnumber:number,private digits:string[]=["0","1","2","3","4","5","6","7","8","9"]){
		this.initialize();
	}
	private initialize():void{
		var d=this.digitsnumber;	//桁数
		var ds=this.digits.concat([]);
		this.alives=makeDigits(d,ds);
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
	filter(call:string,obj:CallObject):void{
		//あてはまるのをアレする
		this.alives=this.alives.filter((option:string)=>{
			var reca=this.calculateCall(call,option);
			return obj.eat===reca.eat && obj.bite===reca.bite;
		});
	}
	private calculateCall(call:string,option:string):CallObject{
		var result:CallObject={
			eat:0,bite:0,
		};
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

new Numer0nState(3);
