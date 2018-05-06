// 秒换算时分秒
export function sec_to_time(value,markOpts){
	markOpts = markOpts || {
		secmark:':',
		minmark:':',
		hormark:':'
	}
	var secondTime = parseInt(value,10);// 秒
	var minuteTime = 0;// 分
	var hourTime = 0;// 小时
	
	if(secondTime > 59) {//如果秒数大于60，将秒数转换成   整数
		//获取分钟，除以60取整数，得到整数分钟
		minuteTime = parseInt(secondTime / 60,10);
		//获取秒数，秒数取佘，得到整数秒数
		secondTime = parseInt(secondTime % 60,10);
		//如果分钟大于60，将分钟转换成小时
		if(minuteTime > 60) {
			//获取小时，获取分钟除以60，得到整数小时
			hourTime = parseInt(minuteTime / 60,10);
			//获取小时后取佘的分，获取分钟除以60取佘的分
			minuteTime = parseInt(minuteTime % 60,10);
		}
	}
	
	secondTime = secondTime>9?secondTime:'0'+secondTime;
	minuteTime = minuteTime>9?minuteTime:'0'+minuteTime;
	hourTime = hourTime>9?hourTime:'0'+hourTime;

	var result = "" + secondTime ;

	if(minuteTime > 0) {
		result = "" + minuteTime + markOpts.minmark + result;
	}
	if(hourTime > 0) {
		result = "" + hourTime + markOpts.hormark + result;
	}
	return result;
}