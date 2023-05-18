/**
 * @method
 * 格式化时间
 *
 * @param {*} date 格林威治时间
 * @param {string} type
 * 'yyyy-MM-dd h:i:s'
 * 'yyyy-MM-dd h:i'
 * 'yyyy-MM-dd'
 * 'yyyy-MM'
 *
 * use: formatDate(new Date().getTime()) 返回日期 2018-06-09
 */
 var formatDate = function(date, type, isCH = false) {
	if (!date) return '';
	let a
	if (date !== undefined) {
		a = new Date(date)
	} else {
		a = new Date()
	}
	var yearS = isCH ? '年' : '-',
		monthS = isCH ? '月' : '-',
		dayS = isCH ? '日' : '';
	var y = a.getFullYear()
	var m = a.getMonth() + 1
	m = m < 10 ? '0' + m : m
	var d = a.getDate()
	d = d < 10 ? '0' + d : d
	var h = a.getHours()
	var i = a.getMinutes()
	var s = a.getSeconds()
	// eslint-disable-next-line
	h.toString().length === 1 ? (h = '0' + h) : ''
	// eslint-disable-next-line
	i.toString().length === 1 ? (i = '0' + i) : ''
	// eslint-disable-next-line
	s.toString().length === 1 ? (s = '0' + s) : ''
	var result = ''
	switch (type) {
		case 'yyyy-MM':
			result = y + yearS + m + (isCH ? monthS : '')
			break
		case 'yyyy-MM-dd':
			result = y + yearS + m + monthS + d + dayS
			break
		case 'yyyy-MM-dd h:i':
			result = y + yearS + m + monthS + d + dayS + ' ' + h + ':' + i
			break
		case 'yyyy-MM-dd h:i:s':
			result = y + yearS + m + monthS + d + dayS + ' ' + h + ':' + i + ':' + s
			break
		default:
			result = y + yearS + m + monthS + d + dayS
			break
	}
	return result
}


/**
 * @method 获取未来/过去的月份数
 * @param {string}{Date} date 起始时间(禁止输入 2020-1-1 这种格式，ios上会出现不识别的问题)
 * @param {number} num 月份数(可负数)(默认0)
 * @param {string} type 输出的格式(默认 yyyy-MM-dd)
 * 'yyyy-MM-dd h:i:s'
 * 'yyyy-MM-dd h:i'
 * 'yyyy-MM-dd'
 * 'yyyy-MM'
 */
function getNextMonth(e) {
	if (!e.hasOwnProperty('num')) {
		e['num'] = 0;
	}
	if (!e.hasOwnProperty('date')) {
		e['date'] = new Date();
	}
	if (!e.hasOwnProperty('type')) {
		e['type'] = 'yyyy-MM-dd h:i:s'
	}
	var currentTime = new Date(e.date);
	window.currentTime11 = currentTime;
	var currentYear = currentTime.getFullYear();
	var currentMonth = currentTime.getMonth() + 1;
	var currentDate = currentTime.getDate();
	var currentHour = currentTime.getHours();
	var currentMinute = currentTime.getMinutes();
	var currentSecond = currentTime.getSeconds();
	var futureDayNum = new Date(currentYear, currentMonth + e.num, 0).getDate();
	var futureMonth = currentMonth + e.num;
	var futureYear, futureDate;
	// 判断日期是否大于未来月份的日期
	if (currentDate > futureDayNum) {
		futureDate = futureDayNum;
	} else {
		futureDate = currentDate;
	}
	// 判断月份是否超出了12,超出的话计算超出了几年
	if (futureMonth > 12) {
		futureYear = currentYear + Math.floor(futureMonth / 12);
		futureMonth = futureMonth % 12;
	} else if (futureMonth < 1) {
		futureMonth = futureMonth - 1
		futureYear = currentYear + Math.floor(futureMonth / 12);
		futureMonth = (futureMonth % 12) + 12;
	} else {
		futureYear = currentYear;
	}
	if (Number(futureMonth) < 10) {
		futureMonth = '0' + futureMonth;
	}
	if (Number(futureDate) < 10) {
		futureDate = '0' + futureDate;
	}
	if (Number(currentHour) < 10) {
		currentHour = '0' + currentHour;
	}
	if (Number(currentMinute) < 10) {
		currentMinute = '0' + currentMinute;
	}
	if (Number(currentSecond) < 10) {
		currentSecond = '0' + currentSecond;
	}
	var result = futureYear + '-' + futureMonth;
	switch (e.type) {
		case 'yyyy-MM-dd h:i:s':
			// result += `-${futureDate} ${currentHour}:${currentMinute}:${currentSecond}`;
			result += '-' + futureDate + ' ' + currentHour + ':' + currentMinute + ':' + currentSecond;
			break;
		case 'yyyy-MM-dd h:i':
			result += '-' + futureDate + ' ' + currentHour + ':' + currentMinute;
			break;
		case 'yyyy-MM-dd':
			result += '-' + futureDate;
			break;
	}
	return result
}


/**
 * @method 获取未来/过去的天数
 * @param {string}{Date} date 起始时间(禁止输入 2020-1-1 这种格式，ios上会出现不识别的问题)
 * @param {number} num 天数(可负数)(默认0)
 * @param {string} type 输出的格式(默认 yyyy-MM-dd)
 * 'yyyy-MM-dd h:i:s'
 * 'yyyy-MM-dd h:i'
 * 'yyyy-MM-dd'
 * 'yyyy-MM'
 */
function getNextDay(e) {
	if (!e.hasOwnProperty('num')) {
		e['num'] = 0;
	}
	if (!e.hasOwnProperty('date')) {
		e['date'] = new Date();
	}
	if (!e.hasOwnProperty('type')) {
		e['type'] = 'yyyy-MM-dd h:i:s'
	}
	var date1 = new Date(e.date)
	var date2 = new Date(date1)
	date2.setDate(date1.getDate() + e.num);
	var currentYear = date2.getFullYear();
	var currentMonth = date2.getMonth() + 1;
	var currentDate = date2.getDate();
	var currentHour = date2.getHours();
	var currentMinute = date2.getMinutes();
	var currentSecond = date2.getSeconds();
	if (Number(currentMonth) < 10) {
		currentMonth = '0' + currentMonth;
	}
	if (Number(currentDate) < 10) {
		currentDate = '0' + currentDate;
	}
	if (Number(currentHour) < 10) {
		currentHour = '0' + currentHour;
	}
	if (Number(currentMinute) < 10) {
		currentMinute = '0' + currentMinute;
	}
	if (Number(currentSecond) < 10) {
		currentSecond = '0' + currentSecond;
	}

	var result = currentYear + '-' + currentMonth;
	switch (e.type) {
		case 'yyyy-MM-dd h:i:s':
			result += '-' + currentDate + ' ' + currentHour + ':' + currentMinute + ':' + currentSecond;
			break;
		case 'yyyy-MM-dd h:i':
			result += '-' + currentDate + ' ' + currentHour + ':' + currentMinute;
			break;
		case 'yyyy-MM-dd':
			result += '-' + currentDate;
			break;
	}
	return result
}


/**
 * @method 二维数组根据字段排序
 * @param {*} arr 数组 Array
 * @param {*} field 字段 String
 * @param {*} desc 排序规则 String desc esc
 */
function numSort(arr, field, desc) {
	if (typeof arr !== 'object' || field === undefined || !field) {
		return
	}

	function toSort(propertyName, desc) {
		// eslint-disable-next-line
		desc === undefined || desc === '' ? (desc = 'esc') : ''
		if (desc === 'esc') {
			if (typeof arr[0][propertyName] !== 'number') {
				// 属性值为非数字
				return function(object1, object2) {
					var value1 = object1[propertyName]
					var value2 = object2[propertyName]
					return value1.localeCompare(value2)
				}
			} else {
				return function(object1, object2) {
					// 属性值为数字
					var value1 = object1[propertyName]
					var value2 = object2[propertyName]
					return value1 - value2
				}
			}
		} else if (desc === 'desc') {
			if (typeof arr[0][propertyName] !== 'number') {
				// 属性值为非数字
				return function(object1, object2) {
					var value1 = object1[propertyName]
					var value2 = object2[propertyName]
					return value2.localeCompare(value1)
				}
			} else {
				return function(object1, object2) {
					// 属性值为数字
					var value1 = object1[propertyName]
					var value2 = object2[propertyName]
					return value2 - value1
				}
			}
		}
	}
	return arr.sort(toSort(field, desc))
}

/**
 * @method 根据身份证号查询出生日期/性别/年龄
 * @param UUserCard 身份证号
 * @num 1返回出生日期 2返回性别汉字 3获取年龄
 * */
function IdCard(UUserCard, num) {
	if (num == 1) {
		//获取出生日期
		birth = UUserCard.substring(6, 10) + "-" + UUserCard.substring(10, 12) + "-" + UUserCard.substring(12, 14);
		return birth;
	}
	if (num == 2) {
		//获取性别
		if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
			//男
			return "男";
		} else {
			//女
			return "女";
		}
	}
	if (num == 3) {
		//获取年龄
		var myDate = new Date();
		var month = myDate.getMonth() + 1;
		var day = myDate.getDate();
		var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
		if (UUserCard.substring(10, 12) < month || UUserCard.substring(10, 12) == month && UUserCard.substring(12,
				14) <= day) {
			age++;
		}
		return age;
	}
}


function random32(len = 16) {
	var guid = '';
	for (var i = 1; i <= len; i++) {
		var n = Math.floor(Math.random() * 16.0).toString(16);
		guid += n;
		if (i === 8 || i === 12 || i === 16 || i === 20) guid += '-';
	}
	return guid
}

/*
	工具包
	use:Utils.numberToChinese(30000)
*/
var Utils = {
	/*
		单位
	*/
	units: '个十百千万@#%亿^&~',
	/*
		字符
	*/
	chars: '零一二三四五六七八九',
	/*
		数字转中文
		@number {Integer} 形如123的数字
		@return {String} 返回转换成的形如 一百二十三 的字符串
	*/
	numberToChinese: function(number) {
		var a = (number + '').split(''),
			s = [],
			t = this;
		if (a.length > 12) {
			throw new Error('too big');
		} else {
			for (var i = 0, j = a.length - 1; i <= j; i++) {
				if (j == 1 || j == 5 || j == 9) { //两位数 处理特殊的 1*
					if (i == 0) {
						if (a[i] != '1') s.push(t.chars.charAt(a[i]));
					} else {
						s.push(t.chars.charAt(a[i]));
					}
				} else {
					s.push(t.chars.charAt(a[i]));
				}
				if (i != j) {
					s.push(t.units.charAt(j - i));
				}
			}
		}
		//return s;
		return s.join('').replace(/零([十百千万亿@#%^&~])/g, function(m, d, b) { //优先处理 零百 零千 等
			b = t.units.indexOf(d);
			if (b != -1) {
				if (d == '亿') return d;
				if (d == '万') return d;
				if (a[j - b] == '0') return '零'
			}
			return '';
		}).replace(/零+/g, '零').replace(/零([万亿])/g, function(m, b) { // 零百 零千处理后 可能出现 零零相连的 再处理结尾为零的
			return b;
		}).replace(/亿[万千百]/g, '亿').replace(/[零]$/, '').replace(/[@#%^&~]/g, function(m) {
			return {
				'@': '十',
				'#': '百',
				'%': '千',
				'^': '十',
				'&': '百',
				'~': '千'
			} [m];
		}).replace(/([亿万])([一-九])/g, function(m, d, b, c) {
			c = t.units.indexOf(d);
			if (c != -1) {
				if (a[j - c] == '0') return d + '零' + b
			}
			return m;
		});
	}
};

/**
 * 计算实际年龄，精确到天
 * @param {*} birthday array [year, month, day]
 * @return array
 */
function getAge(birthday) {
	// 新建日期对象
	let date = new Date()
	// 今天日期，数组，同 birthday
	let today = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
	// 分别计算年月日差值
	let age = today.map((value, index) => {
		return value - birthday[index]
	})
	// 当天数为负数时，月减 1，天数加上月总天数
	if (age[2] < 0) {
		// 简单获取上个月总天数的方法，不会错
		let lastMonth = new Date(today[0], today[1], 0)
		age[1]--
		age[2] += lastMonth.getDate()
	}
	// 当月数为负数时，年减 1，月数加上 12
	if (age[1] < 0) {
		age[0]--
		age[1] += 12
	}
	return age[0] || ''
}
