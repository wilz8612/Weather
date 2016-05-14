if (!window) this.window = this;
if (!window.console || !window.console.log) {window.console = {log: function() {}}}
if (!window.XMLHttpRequest) {
	window.XMLHttpRequest = function () {
		var progIDs = ["Microsoft.XMLHTTP", "Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP"];
		for (var i = 0, l = progIDs.length; i < l; i++) {
			try {return new ActiveXObject(progIDs[i]);} catch (ex) {}
		}
		return null;
	}
}

window.App = {};
window.Setting = App.Setting = {
	Version: "0.4.0.41",
	NewLine: "\r\n",
	ServerUrl: "",
	VirtualPath: "/",
	Language: navigator.language ? navigator.language : (navigator.systemLanguage ? navigator.systemLanguage : "en-US"),
	ExceptionHandler: function(msg, url, line) {
		var reportException = true;
		var reportUrl = true;
		var desc = null;
		var errorNumber = 0;
		var lastError = window.top.Error.lastError;
		window.top.Error.lastError = null;

		if (lastError != null) {
			errorNumber = lastError.number;
			if (errorNumber === Error.errorNumbers.unconnected) {
				msg = lastError.message;
				reportException = false;
				reportUrl = false;
			} else if (errorNumber === Error.errorNumbers.unauthorized) {
				var e = Json.toJsonObject(lastError.description);
				msg = e.Message;
				reportException = false;
				reportUrl = false;
			} else if (errorNumber === Error.errorNumbers.message) {
				var e = Json.toJsonObject(lastError.description);
				msg = e.Message;
				reportException = false;
				reportUrl = false;
			} else if (errorNumber === Error.errorNumbers.service) {
				var e = Json.toJsonObject(lastError.description);
				msg = e.Message;
				desc = e.StackTrace ? NewLine + e.StackTrace : "";
				reportException = false;
			} else if (errorNumber === Error.errorNumbers.server) {
				msg = lastError.message;
				desc = lastError.description;
			} else {
				msg = lastError.message;
				desc = lastError.description;
			}
		}
		if (reportException) {
			try {SC.invokeAsync("App.Services.SystemService", "ReportClientException", function(){}, msg, msg + NewLine + url + ", line " + line);} catch(ex){}
		}
		App.Setting.ShowException(msg, desc, reportUrl ? url : null, line, errorNumber);

		if (lastError && lastError.number === Error.errorNumbers.unconnected && App.Setting.ShowSignIn != null) {
			App.Setting.ShowSignIn();
		}

		return true;
	},
	ShowException: function(message, description, url, line, errorNumber) {
		alert(message + (String.isNullOrEmpty(description) ? "" : this.NewLine + description) + (String.isNullOrEmpty(url) ? "" : this.NewLine + url + ", line" + line));
	},
	ShowSignIn: null
};
if (parent != null && parent != window && typeof(parent.Setting) !== 'undefined') {
	for (var k in parent.Setting) App.Setting[k] = parent.Setting[k];
}
if (typeof(__setting) === "object") {
	for (var k in __setting) App.Setting[k] = __setting[k];
	delete __setting;
}
window.NewLine = App.Setting.NewLine;
window.VirtualPath = App.Setting.VirtualPath;

window.onerror = App.Setting.ExceptionHandler;

// #region extensions
Object.isUndefined = function(obj) {return typeof(obj) === 'undefined';};

Array.prototype.add = function(item) {
	this[this.length] = item;
};
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(item, start) {
		if (isNaN(start)) start = 0;
		for (var i = start; i < this.length; i++) {
			if (!Object.isUndefined(this[i]) && this[i] === item) return i;
		}
		return -1;
	};
}
Array.prototype.contains = function(item) {
	return this.indexOf(item, 0) >= 0;
};
Array.prototype.where = function(predicate) {
	var array = [];
	if (predicate == null) Array.copy(this, 0, array);
	else for (var i = 0; i < this.length; i++) if (predicate(this[i])) array[array.length] = this[i];
	return array;
};
Array.prototype.select = function(selector) {
	var array = [];
	for (var i = 0; i < this.length; i++) array[i] = selector(this[i]);
	return array;
};
Array.prototype.first = function(predicate) {
	var array = this.where(predicate);
	return array.length > 0 ? array[0] : null;
};
Array.copy = function(src, srcIndex, dest, destIndex, length) {
	destIndex = destIndex ? destIndex : 0;
	length = length ? length : src.length - srcIndex;
	for (var i = 0;i < length && i < src.length - srcIndex;i ++) {
		dest[i + destIndex] = src[i + srcIndex];
	}
};
Array.isNullOrEmpty = function(array) {return array == null || array.length === 0;};

Boolean.parse = function(value) {return String.equals(value, "true", true) ? true : (String.equals(value, "false", true) ? false : null);};

Error.New = function(message, description, number) {
	var e = new Error();
	e.message = message;
	e.description = description;
	if (number) e.number = number;
	window.top.Error.lastError = e;
	return e;
};
Error.Throw = function(message, description, number) {throw Error.New(message, description);};
Error.errorNumbers = {server: 9000, service: 9001, message: 9002, unconnected: 9003, unauthorized: 9004};

// #region Date
Date.TicksPerMillisecond = 10000;
Date.TicksPerSecond = Date.TicksPerMillisecond * 1000;
Date.TicksPerMinute = Date.TicksPerSecond * 60;
Date.TicksPerHour = Date.TicksPerMinute * 60;
Date.TicksPerDay = Date.TicksPerHour * 24;
Date.Ticks19700101 = 621355968000000000;
Date.DaysToMonth365 = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
Date.DaysToMonth366 = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366];

Date.now = function() {return new Date();};
Date.today = function() {
	var date = new Date();
	date.setTime(date.getTime() - (date.getTime() - date.getTimezoneOffset() * 60 * 1000) % (24 * 60 * 60 * 1000));
	return date;
};
Date.New = function() {
	if (arguments.length === 1) return new Date(Date.ticksToTime(arguments[0]));
	if (arguments.length === 3) return new Date(Date.ticksToTime(Date.dateToTicks(arguments[0], arguments[1], arguments[2])
			, new Date().getTimezoneOffsetTicks()));
	if (arguments.length === 6) return new Date(Date.ticksToTime(Date.dateToTicks(arguments[0], arguments[1], arguments[2])
			+ Date.timeToTicks(arguments[3], arguments[4], arguments[5])
			, new Date().getTimezoneOffsetTicks()));
	return new Date();
};
Date.isLeapYear = function(year) {return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);};
Date.daysInYear = function(year) {return Date.isLeapYear(year) ? 366 : 365;};
Date.daysInMonth = function(year, month) {return month == 2 ? (Date.isLeapYear(year) ? 29 : 28) : (month < 7 ? (month % 2 == 0 ? 30 : 31) : (month == 7 ? 31 : (month % 2 == 1 ? 30 : 31)));};
Date.dateToTicks = function(year, month, day) {
	if (year >= 1 && year <= 9999 && month >= 1 && month <= 12) {
		var days = Date.isLeapYear(year) ? Date.DaysToMonth366 : Date.DaysToMonth365;
		if (day >= 1 && day <= days[month] - days[month - 1]) {
			var y = year - 1;
			var n = y * 365 + parseInt(y / 4) - parseInt(y / 100) + parseInt(y / 400) + days[month - 1] + day - 1;
			return n * Date.TicksPerDay;
		}
	}
	throw Error.New("BadYearMonthDay");
};
Date.timeToTicks = function(hour, minute, second) {
	if (hour >= 0 && hour < 24 && minute >= 0 && minute < 60 && second >= 0	&& second < 60) {
		return hour * Date.TicksPerHour + minute * Date.TicksPerMinute + second * Date.TicksPerSecond;
	}
	throw Error.New("BadHourMinuteSecond");
};
Date.ticksToTime = function(ticks, offset) {offset = offset ? offset : 0; return parseInt((ticks + offset - Date.Ticks19700101) / Date.TicksPerMillisecond);};
Date.millisecondToTicks = function(time, offset) {offset = offset ? offset : 0; return time * Date.TicksPerMillisecond + offset + Date.Ticks19700101;};
Date.prototype.date = function() {return new Date(this.getTime() - (this.getTime() - this.getTimezoneOffset() * 60 * 1000) % (24 * 60 * 60 * 1000));};
Date.prototype.addSeconds = function(seconds) {return new Date(this.getTime() + (seconds * 1000));};
Date.prototype.addMinutes = function(minutes) {return this.addSeconds(minutes * 60);};
Date.prototype.addHours = function(hours) {return this.addMinutes(60 * hours);};
Date.prototype.addDays = function(days) {return this.addHours(days * 24);};
Date.prototype.addMonths = function(months) {
	var year = this.getFullYear();var month = this.getMonth() + 1;var day = this.getDate();
	var m = (month - 1) + months;
	if (m >= 0) {
		month = (m % 12) + 1;
		year += parseInt(m / 12);
	} else {
		month = 12 + ((m + 1) % 12);
        year += (m - 11) / 12;
	}
	var dim = Date.daysInMonth(year, month);
	day = day > dim ? dim : day;
	return new Date(year, month - 1, day, this.getHours(), this.getMinutes(), this.getSeconds());
};
Date.prototype.addYears = function(years) {return new Date(this.getFullYear() + years, this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds());};
Date.prototype.dayOfYear = function() {
	return (this - (new Date(this.getFullYear(), 0, 1))) / (3600000 * 24) + 1;
};
Date.prototype.getTimezoneOffsetTicks = function() {return this.getTimezoneOffset() * Date.TicksPerMinute;};
Date.prototype.getTicks = function() {return Date.millisecondToTicks(this.getTime(), this.getTimezoneOffsetTicks());};
Date.prototype.getUTCTicks = function() {return Date.millisecondToTicks(this.getTime());};
Date.prototype.setTicks = function(ticks) {this.setTime(Date.ticksToTime(ticks, this.getTimezoneOffsetTicks()));};
Date.prototype.setUTCTicks = function(ticks) {this.setTime(Date.ticksToTime(ticks));};
Date._appendPreOrPostMatch = function(preMatch, strBuilder) {
	var quoteCount = 0;
	var escaped = false;
	for (var i = 0, il = preMatch.length; i < il; i++) {
		var c = preMatch.charAt(i);
		switch (c) {
		case '\'':
			if (escaped) strBuilder.append("'");
			else quoteCount++;
			escaped = false;
			break;
		case '\\':
			if (escaped) strBuilder.append("\\");
			escaped = !escaped;
			break;
		default:
			strBuilder.append(c);
			escaped = false;
			break;
		}
	}
	return quoteCount;
};
Date._expandFormat = function(dtf, format) {
	if (!format) {
		format = "F";
	}
	var len = format.length;
	if (len === 1) {
		switch (format) {
		case "d":
			return dtf.ShortDatePattern;
		case "D":
			return dtf.LongDatePattern;
		case "t":
			return dtf.ShortTimePattern;
		case "T":
			return dtf.LongTimePattern;
		case "f":
			return dtf.LongDatePattern + " " + dtf.ShortTimePattern;
		case "F":
			return dtf.FullDateTimePattern;
		case "M": case "m":
			return dtf.MonthDayPattern;
		case "s":
			return dtf.SortableDateTimePattern;
		case "Y": case "y":
			return dtf.YearMonthPattern;
		default:
			throw Error.New(SR.get("FormatInvalidString"));
		}
	}
	else if ((len === 2) && (format.charAt(0) === "%")) {
		format = format.charAt(1);
	}
	return format;
};
Date._expandYear = function(dtf, year) {
	var now = new Date(),
		era = Date._getEra(now);
	if (year < 100) {
		var curr = Date._getEraYear(now, dtf, era);
		year += curr - (curr % 100);
		if (year > dtf.Calendar.TwoDigitYearMax) {
			year -= 100;
		}
	}
	return year;
};
Date._getEra = function(date, eras) {
	if (!eras) return 0;
	var start, ticks = date.getTime();
	for (var i = 0, l = eras.length; i < l; i += 4) {
		start = eras[i+2];
		if ((start === null) || (ticks >= start)) {
			return i;
		}
	}
	return 0;
};
Date._getEraYear = function(date, dtf, era, sortable) {
	var year = date.getFullYear();
	if (!sortable && dtf.eras) {
		year -= dtf.eras[era + 3];
	}    
	return year;
};
Date._getParseRegExp = function(dtf, format) {
	if (!dtf._parseRegExp) {
		dtf._parseRegExp = {};
	}
	else if (dtf._parseRegExp[format]) {
		return dtf._parseRegExp[format];
	}
	var expFormat = Date._expandFormat(dtf, format);
	expFormat = expFormat.replace(/([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g, "\\\\$1");
	var regexp = new App.StringBuilder("^");
	var groups = [];
	var index = 0;
	var quoteCount = 0;
	var tokenRegExp = Date._getTokenRegExp();
	var match;
	while ((match = tokenRegExp.exec(expFormat)) !== null) {
		var preMatch = expFormat.slice(index, match.index);
		index = tokenRegExp.lastIndex;
		quoteCount += Date._appendPreOrPostMatch(preMatch, regexp);
		if ((quoteCount%2) === 1) {
			regexp.append(match[0]);
			continue;
		}
		switch (match[0]) {
			case 'dddd': case 'ddd':
			case 'MMMM': case 'MMM':
			case 'gg': case 'g':
				regexp.append("(\\D+)");
				break;
			case 'tt': case 't':
				regexp.append("(\\D*)");
				break;
			case 'yyyy':
				regexp.append("(\\d{4})");
				break;
			case 'fff':
				regexp.append("(\\d{3})");
				break;
			case 'ff':
				regexp.append("(\\d{2})");
				break;
			case 'f':
				regexp.append("(\\d)");
				break;
			case 'dd': case 'd':
			case 'MM': case 'M':
			case 'yy': case 'y':
			case 'HH': case 'H':
			case 'hh': case 'h':
			case 'mm': case 'm':
			case 'ss': case 's':
				regexp.append("(\\d\\d?)");
				break;
			case 'zzz':
				regexp.append("([+-]?\\d\\d?:\\d{2})");
				break;
			case 'zz': case 'z':
				regexp.append("([+-]?\\d\\d?)");
				break;
			case '/':
				regexp.append("(\\" + dtf.DateSeparator + ")");
				break;
			default:
				throw Error.New("Invalid date format pattern");
		}
		groups.add(match[0]);
	}
	Date._appendPreOrPostMatch(expFormat.slice(index), regexp);
	regexp.append("$");
	var regexpStr = regexp.toString().replace(/\s+/g, "\\s+");
	var parseRegExp = {'regExp': regexpStr, 'groups': groups};
	dtf._parseRegExp[format] = parseRegExp;
	return parseRegExp;
};
Date._getTokenRegExp = function() {
	return /\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g;
};
Date.parse = function(value, formats) {
	return Date.parseLocale(value, formats);
};
Date.parseLocale = function(value, formats) {
	return Date._parse(value, App.CultureInfo.CurrentCulture, arguments);
};
Date.parseInvariant = function(value, formats) {
	return Date._parse(value, App.CultureInfo.InvariantCulture, arguments);
};
Date._parse = function(value, cultureInfo, args) {
	var i, l, date, format, formats, custom = false;
	for (i = 1, l = args.length; i < l; i++) {
		format = args[i];
		if (format) {
			custom = true;
			date = Date._parseExact(value, format, cultureInfo);
			if (date) return date;
		}
	}
	if (!custom) {
		formats = cultureInfo._getDateTimeFormats();
		for (i = 0, l = formats.length; i < l; i++) {
			date = Date._parseExact(value, formats[i], cultureInfo);
			if (date) return date;
		}
	}
	return null;
};
Date._parseExact = function(value, format, cultureInfo) {
	value = value.trim();
	var dtf = cultureInfo.dateTimeFormat,
		parseInfo = Date._getParseRegExp(dtf, format),
		match = new RegExp(parseInfo.regExp).exec(value);
	if (match === null) return null;
	
	var groups = parseInfo.groups,
		era = null, year = null, month = null, date = null, weekDay = null,
		hour = 0, hourOffset, min = 0, sec = 0, msec = 0, tzMinOffset = null,
		pmHour = false;
	for (var j = 0, jl = groups.length; j < jl; j++) {
		var matchGroup = match[j+1];
		if (matchGroup) {
			switch (groups[j]) {
				case 'dd': case 'd':
					date = parseInt(matchGroup, 10);
					if ((date < 1) || (date > 31)) return null;
					break;
				case 'MMMM':
					month = cultureInfo._getMonthIndex(matchGroup);
					if ((month < 0) || (month > 11)) return null;
					break;
				case 'MMM':
					month = cultureInfo._getAbbrMonthIndex(matchGroup);
					if ((month < 0) || (month > 11)) return null;
					break;
				case 'M': case 'MM':
					month = parseInt(matchGroup, 10) - 1;
					if ((month < 0) || (month > 11)) return null;
					break;
				case 'y': case 'yy':
					year = Date._expandYear(dtf,parseInt(matchGroup, 10));
					if ((year < 0) || (year > 9999)) return null;
					break;
				case 'yyyy':
					year = parseInt(matchGroup, 10);
					if ((year < 0) || (year > 9999)) return null;
					break;
				case 'h': case 'hh':
					hour = parseInt(matchGroup, 10);
					if (hour === 12) hour = 0;
					if ((hour < 0) || (hour > 11)) return null;
					break;
				case 'H': case 'HH':
					hour = parseInt(matchGroup, 10);
					if ((hour < 0) || (hour > 23)) return null;
					break;
				case 'm': case 'mm':
					min = parseInt(matchGroup, 10);
					if ((min < 0) || (min > 59)) return null;
					break;
				case 's': case 'ss':
					sec = parseInt(matchGroup, 10);
					if ((sec < 0) || (sec > 59)) return null;
					break;
				case 'tt': case 't':
					var upperToken = matchGroup.toUpperCase();
					pmHour = (upperToken === dtf.PMDesignator.toUpperCase());
					if (!pmHour && (upperToken !== dtf.AMDesignator.toUpperCase())) return null;
					break;
				case 'f':
					msec = parseInt(matchGroup, 10) * 100;
					if ((msec < 0) || (msec > 999)) return null;
					break;
				case 'ff':
					msec = parseInt(matchGroup, 10) * 10;
					if ((msec < 0) || (msec > 999)) return null;
					break;
				case 'fff':
					msec = parseInt(matchGroup, 10);
					if ((msec < 0) || (msec > 999)) return null;
					break;
				case 'dddd':
					weekDay = cultureInfo._getDayIndex(matchGroup);
					if ((weekDay < 0) || (weekDay > 6)) return null;
					break;
				case 'ddd':
					weekDay = cultureInfo._getAbbrDayIndex(matchGroup);
					if ((weekDay < 0) || (weekDay > 6)) return null;
					break;
				case 'zzz':
					var offsets = matchGroup.split(/:/);
					if (offsets.length !== 2) return null;
					hourOffset = parseInt(offsets[0], 10);
					if ((hourOffset < -12) || (hourOffset > 13)) return null;
					var minOffset = parseInt(offsets[1], 10);
					if ((minOffset < 0) || (minOffset > 59)) return null;
					tzMinOffset = (hourOffset * 60) + (matchGroup.startsWith('-')? -minOffset : minOffset);
					break;
				case 'z': case 'zz':
					hourOffset = parseInt(matchGroup, 10);
					if ((hourOffset < -12) || (hourOffset > 13)) return null;
					tzMinOffset = hourOffset * 60;
					break;
				case 'g': case 'gg':
					var eraName = matchGroup;
					if (!eraName || !dtf.eras) return null;
					eraName = eraName.toLowerCase().trim();
					for (var i = 0, l = dtf.eras.length; i < l; i += 4) {
						if (eraName === dtf.eras[i + 1].toLowerCase()) {
							era = i;
							break;
						}
					}
					if (era === null) return null;
					break;
			}
		}
	}
	var result = new Date(), defaults, convert = dtf.Calendar.convert;
	if (convert) {
		defaults = convert.fromGregorian(result);
	}
	if (!convert) {
		defaults = [result.getFullYear(), result.getMonth(), result.getDate()];
	}
	if (year === null) {
		year = defaults[0];
	}
	else if (dtf.eras) {
		year += dtf.eras[(era || 0) + 3];
	}
	if (month === null) {
		month = defaults[1];
	}
	if (date === null) {
		date = defaults[2];
	}
	if (convert) {
		result = convert.toGregorian(year, month, date);
		if (result === null) return null;
	}
	else {
		result.setFullYear(year, month, date);
		if (result.getDate() !== date) return null;
		if ((weekDay !== null) && (result.getDay() !== weekDay)) {
			return null;
		}
	}
	if (pmHour && (hour < 12)) {
		hour += 12;
	}
	result.setHours(hour, min, sec, msec);
	if (tzMinOffset !== null) {
		var adjustedMin = result.getMinutes() - (tzMinOffset + result.getTimezoneOffset());
		result.setHours(result.getHours() + parseInt(adjustedMin/60, 10), adjustedMin%60);
	}
	return result;
};
Date.prototype.toString = function(format, cultureInfo) {
	if (String.isNullOrEmpty(format)) {
		format = (this.getTime() - this.getTimezoneOffset() * 60 * 1000) % (24 * 60 * 60 * 1000) === 0 ? "yyyy-MM-dd" : "yyyy-MM-dd HH:mm:ss";
	}
	return this._toFormattedString(format, cultureInfo ? cultureInfo : App.CultureInfo.CurrentCulture);
};
Date.prototype.format = function(format) {
	return this._toFormattedString(format, App.CultureInfo.InvariantCulture);
};
Date.prototype.localeFormat = function(format) {
	return this._toFormattedString(format, App.CultureInfo.CurrentCulture);
};
Date.prototype._toFormattedString = function(format, cultureInfo) {
	var dtf = cultureInfo.dateTimeFormat,
		convert = dtf.Calendar.convert;
	if (!format || !format.length || (format === 'i')) {
		if (cultureInfo && cultureInfo.name.length) {
			if (convert) {
				return this._toFormattedString(dtf.FullDateTimePattern, cultureInfo);
			}
			else {
				var eraDate = new Date(this.getTime());
				var era = Date._getEra(this, dtf.eras);
				eraDate.setFullYear(Date._getEraYear(this, dtf, era));
				return eraDate.toLocaleString();
			}
		}
		else {
			return this.toString();
		}
	}
	var eras = dtf.eras,
		sortable = (format === "s");
	format = Date._expandFormat(dtf, format);
	var ret = new App.StringBuilder();
	var hour;
	function addLeadingZero(num) {
		if (num < 10) {
			return '0' + num;
		}
		return num.toString();
	}
	function addLeadingZeros(num) {
		if (num < 10) {
			return '00' + num;
		}
		if (num < 100) {
			return '0' + num;
		}
		return num.toString();
	}
	function padYear(year) {
		if (year < 10) {
			return '000' + year;
		}
		else if (year < 100) {
			return '00' + year;
		}
		else if (year < 1000) {
			return '0' + year;
		}
		return year.toString();
	}
	
	var foundDay, checkedDay, dayPartRegExp = /([^d]|^)(d|dd)([^d]|$)/g;
	function hasDay() {
		if (foundDay || checkedDay) {
			return foundDay;
		}
		foundDay = dayPartRegExp.test(format);
		checkedDay = true;
		return foundDay;
	}
	
	var quoteCount = 0,
		tokenRegExp = Date._getTokenRegExp(),
		converted;
	if (!sortable && convert) {
		converted = convert.fromGregorian(this);
	}
	for (;;) {
		var index = tokenRegExp.lastIndex;
		var ar = tokenRegExp.exec(format);
		var preMatch = format.slice(index, ar ? ar.index : format.length);
		quoteCount += Date._appendPreOrPostMatch(preMatch, ret);
		if (!ar) break;
		if ((quoteCount%2) === 1) {
			ret.append(ar[0]);
			continue;
		}
		
		function getPart(date, part) {
			if (converted) {
				return converted[part];
			}
			switch (part) {
				case 0: return date.getFullYear();
				case 1: return date.getMonth();
				case 2: return date.getDate();
			}
		}
		switch (ar[0]) {
		case "dddd":
			ret.append(dtf.DayNames[this.getDay()]);
			break;
		case "ddd":
			ret.append(dtf.AbbreviatedDayNames[this.getDay()]);
			break;
		case "dd":
			foundDay = true;
			ret.append(addLeadingZero(getPart(this, 2)));
			break;
		case "d":
			foundDay = true;
			ret.append(getPart(this, 2));
			break;
		case "MMMM":
			ret.append((dtf.MonthGenitiveNames && hasDay())
				? dtf.MonthGenitiveNames[getPart(this, 1)]
				: dtf.MonthNames[getPart(this, 1)]);
			break;
		case "MMM":
			ret.append((dtf.AbbreviatedMonthGenitiveNames && hasDay())
				? dtf.AbbreviatedMonthGenitiveNames[getPart(this, 1)]
				: dtf.AbbreviatedMonthNames[getPart(this, 1)]);
			break;
		case "MM":
			ret.append(addLeadingZero(getPart(this, 1) + 1));
			break;
		case "M":
			ret.append(getPart(this, 1) + 1);
			break;
		case "yyyy":
			ret.append(padYear(converted ? converted[0] : Date._getEraYear(this, dtf, Date._getEra(this, eras), sortable)));
			break;
		case "yy":
			ret.append(addLeadingZero((converted ? converted[0] : Date._getEraYear(this, dtf, Date._getEra(this, eras), sortable)) % 100));
			break;
		case "y":
			ret.append((converted ? converted[0] : Date._getEraYear(this, dtf, Date._getEra(this, eras), sortable)) % 100);
			break;
		case "hh":
			hour = this.getHours() % 12;
			if (hour === 0) hour = 12;
			ret.append(addLeadingZero(hour));
			break;
		case "h":
			hour = this.getHours() % 12;
			if (hour === 0) hour = 12;
			ret.append(hour);
			break;
		case "HH":
			ret.append(addLeadingZero(this.getHours()));
			break;
		case "H":
			ret.append(this.getHours());
			break;
		case "mm":
			ret.append(addLeadingZero(this.getMinutes()));
			break;
		case "m":
			ret.append(this.getMinutes());
			break;
		case "ss":
			ret.append(addLeadingZero(this.getSeconds()));
			break;
		case "s":
			ret.append(this.getSeconds());
			break;
		case "tt":
			ret.append((this.getHours() < 12) ? dtf.AMDesignator : dtf.PMDesignator);
			break;
		case "t":
			ret.append(((this.getHours() < 12) ? dtf.AMDesignator : dtf.PMDesignator).charAt(0));
			break;
		case "f":
			ret.append(addLeadingZeros(this.getMilliseconds()).charAt(0));
			break;
		case "ff":
			ret.append(addLeadingZeros(this.getMilliseconds()).substr(0, 2));
			break;
		case "fff":
			ret.append(addLeadingZeros(this.getMilliseconds()));
			break;
		case "z":
			hour = this.getTimezoneOffset() / 60;
			ret.append(((hour <= 0) ? '+' : '-') + Math.floor(Math.abs(hour)));
			break;
		case "zz":
			hour = this.getTimezoneOffset() / 60;
			ret.append(((hour <= 0) ? '+' : '-') + addLeadingZero(Math.floor(Math.abs(hour))));
			break;
		case "zzz":
			hour = this.getTimezoneOffset() / 60;
			ret.append(((hour <= 0) ? '+' : '-') + addLeadingZero(Math.floor(Math.abs(hour))) +
				":" + addLeadingZero(Math.abs(this.getTimezoneOffset() % 60)));
			break;
		case "g":
		case "gg":
			if (dtf.eras) {
				ret.append(dtf.eras[Date._getEra(this, eras) + 1]);
			}
			break;
		case "/":
			ret.append(dtf.DateSeparator);
			break;
		default:
			throw Error.New("Invalid date format pattern");
		}
	}
	return ret.toString();
};
// #endregion Date

window.TimeSpan = function() {
	this.ticks = 0;
	if (arguments.length === 1) this.ticks = arguments[0];
	if (arguments.length === 3) this.ticks = (arguments[0] * 3600 + arguments[1] * 60 + arguments[2]) * Date.TicksPerSecond;
	if (arguments.length === 4) this.ticks = (arguments[0] * 24 * 3600 + arguments[1] * 3600 + arguments[2] * 60 + arguments[3]) * Date.TicksPerSecond;
	if (arguments.length === 5) 
		this.ticks = (arguments[0] * 24 * 3600 + arguments[1] * 3600 + arguments[2] * 60 + arguments[3]) * Date.TicksPerSecond + arguments[4] * Date.TicksPerMillisecond;
};
TimeSpan.Zero = new TimeSpan(0);
TimeSpan.prototype = {
	getTicks: function() {return this.ticks;},
	getDays: function() {return Math.floor(this.ticks / Date.TicksPerDay);},
	getHours: function() {return Math.floor(this.ticks / Date.TicksPerHour % 24);},
	getMinutes: function() {return Math.floor(this.ticks / Date.TicksPerMinute % 60);},
	getSeconds: function() {return Math.floor(this.ticks / Date.TicksPerSecond % 60);},
	getMilliseconds: function() {return Math.floor(this.ticks / Date.TicksPerMillisecond % 1000);},
	getTotalDays: function() {return this.ticks / Date.TicksPerDay;},
	getTotalHours: function() {return this.ticks / Date.TicksPerHour;},
	getTotalMinutes: function() {return this.ticks / Date.TicksPerMinute;},
	getTotalSeconds: function() {return this.ticks / Date.TicksPerSecond;},
	getTotalMilliseconds: function() {return this.ticks / Date.TicksPerMillisecond;},
	toString: function() {
		var buf = this.ticks < 0 ? "-" : "";
		if (this.getDays() > 0) buf += this.getDays().toString() + " ";
		buf += this.getHours().toString() + ":";
		buf += this.getMinutes().toString() + ":";
		buf += this.getSeconds().toString();
		if (this.ticks % Date.TicksPerSecond > 0) {
			var s = (this.ticks % Date.TicksPerSecond / Date.TicksPerSecond).toString();
			buf += s.substr(1, s.length - 1);
		}
		return buf;
	}
};

Function.Empty = function(){};

// #region Number
Number.prototype.In = function() {for (var i = 0;i < arguments.length;i ++) {if (this === arguments[i]) return true;} return false;};
Number.MaxInt16 = 32767;
Number.MinInt16 = -32768;
Number.MaxInt32 = 2147483647;
Number.MinInt32 = -2147483648;
Number.MaxInt64 = 9223372036854775807;
Number.MinInt64 = -9223372036854775808;
Number.parse = function(value, cultureInfo) {
	value = value.trim();
	if (cultureInfo == null) cultureInfo = App.CultureInfo.CurrentCulture;

	if (value.match(/^[+-]?infinity$/i)) {
		return parseFloat(value);
	}
	if (value.match(/^0x[a-f0-9]+$/i)) {
		return parseInt(value);
	}
	var numFormat = cultureInfo.numberFormat;
	var signInfo = Number._parseNumberNegativePattern(value, numFormat, numFormat.NumberNegativePattern);
	var sign = signInfo[0];
	var num = signInfo[1];
	
	if ((sign === '') && (numFormat.NumberNegativePattern !== 1)) {
		signInfo = Number._parseNumberNegativePattern(value, numFormat, 1);
		sign = signInfo[0];
		num = signInfo[1];
	}
	if (sign === '') sign = '+';
	
	var exponent;
	var intAndFraction;
	var exponentPos = num.indexOf('e');
	if (exponentPos < 0) exponentPos = num.indexOf('E');
	if (exponentPos < 0) {
		intAndFraction = num;
		exponent = null;
	}
	else {
		intAndFraction = num.substr(0, exponentPos);
		exponent = num.substr(exponentPos + 1);
	}
	
	var integer;
	var fraction;
	var decimalPos = intAndFraction.indexOf(numFormat.NumberDecimalSeparator);
	if (decimalPos < 0) {
		integer = intAndFraction;
		fraction = null;
	}
	else {
		integer = intAndFraction.substr(0, decimalPos);
		fraction = intAndFraction.substr(decimalPos + numFormat.NumberDecimalSeparator.length);
	}
	
	integer = integer.split(numFormat.NumberGroupSeparator).join('');
	var altNumGroupSeparator = numFormat.NumberGroupSeparator.replace(/\u00A0/g, " ");
	if (numFormat.NumberGroupSeparator !== altNumGroupSeparator) {
		integer = integer.split(altNumGroupSeparator).join('');
	}
	
	var p = sign + integer;
	if (fraction !== null) {
		p += '.' + fraction;
	}
	if (exponent !== null) {
		var expSignInfo = Number._parseNumberNegativePattern(exponent, numFormat, 1);
		if (expSignInfo[0] === '') {
			expSignInfo[0] = '+';
		}
		p += 'e' + expSignInfo[0] + expSignInfo[1];
	}
	if (p.match(/^[+-]?\d*\.?\d*(e[+-]?\d+)?$/)) {
		return parseFloat(p);
	}
	return Number.NaN;
};
Number._parseNumberNegativePattern = function(value, numFormat, numberNegativePattern) {
	var neg = numFormat.NegativeSign;
	var pos = numFormat.PositiveSign;    
	switch (numberNegativePattern) {
		case 4: 
			neg = ' ' + neg;
			pos = ' ' + pos;
		case 3: 
			if (value.endsWith(neg)) {
				return ['-', value.substr(0, value.length - neg.length)];
			}
			else if (value.endsWith(pos)) {
				return ['+', value.substr(0, value.length - pos.length)];
			}
			break;
		case 2: 
			neg += ' ';
			pos += ' ';
		case 1: 
			if (value.startsWith(neg)) {
				return ['-', value.substr(neg.length)];
			}
			else if (value.startsWith(pos)) {
				return ['+', value.substr(pos.length)];
			}
			break;
		case 0: 
			if (value.startsWith('(') && value.endsWith(')')) {
				return ['-', value.substr(1, value.length - 2)];
			}
			break;
		default:
			throw Error.New("fail.");
	}
	return ['', value];
};
Number.parseInt16 = function(value, cultureInfo) {
	return Number._parseInteger(value, cultureInfo, Number.MinInt16, Number.MaxInt16);
};
Number.parseInt32 = function(value, cultureInfo) {
	return Number._parseInteger(value, cultureInfo, Number.MinInt32, Number.MaxInt32);
};
Number.parseInt64 = function(value, cultureInfo) {
	return Number._parseInteger(value, cultureInfo, Number.MinInt64, Number.MaxInt64);
};
Number.parseUInt16 = function(value, cultureInfo) {
	return Number._parseInteger(value, cultureInfo, 0, Number.MaxInt16);
};
Number.parseUInt32 = function(value, cultureInfo) {
	return Number._parseInteger(value, cultureInfo, 0, Number.MaxInt32);
};
Number.parseUInt64 = function(value, cultureInfo) {
	return Number._parseInteger(value, cultureInfo, 0, Number.MaxInt64);
};
Number.parseFloat = function(value, cultureInfo) {
	var v = Number.parse(value, cultureInfo);
	return !isNaN(v) && v != null ? v : null;
};
Number.parseDecimal = function(value, cultureInfo) {
	var v = Number.parse(value, cultureInfo);
	return !isNaN(v) && v != null ? v : null;
};
Number.parseDouble = function(value, cultureInfo) {
	var v = Number.parse(value, cultureInfo);
	return !isNaN(v) && v != null ? v : null;
};
Number._parseInteger = function(value, cultureInfo, min, max) {
	var v = Number.parse(value, cultureInfo);
	if (!isNaN(v) && v != null) {
		return v % 1 === 0 && v < max && v > min ? v : null;
	}
	return null;
};
Number.prototype.format = function(format, cultureInfo) {
	if (!cultureInfo) cultureInfo = App.CultureInfo.CurrentCulture;
	if (!format || (format.length === 0) || (format === 'i')) {
		if (cultureInfo && (cultureInfo.name.length > 0)) {
			return this.toLocaleString();
		}
		else {
			return this.toString();
		}
	}
	if (format.indexOf('#') >= 0 || format.indexOf('0') >= 0) return this._customFormat(format, cultureInfo);

	var _percentPositivePattern = ["n %", "n%", "%n" ];
	var _percentNegativePattern = ["-n %", "-n%", "-%n"];
	var _numberNegativePattern = ["(n)","-n","- n","n-","n -"];
	var _currencyPositivePattern = ["$n","n$","$ n","n $"];
	var _currencyNegativePattern = ["($n)","-$n","$-n","$n-","(n$)","-n$","n-$","n$-","-n $","-$ n","n $-","$ n-","$ -n","n- $","($ n)","(n $)"];
	function zeroPad(str, count, left) {
		for (var l=str.length; l < count; l++) {
			str = (left ? ('0' + str) : (str + '0'));
		}
		return str;
	}
	
	var nf = cultureInfo.numberFormat;
	var number = Math.abs(this);
	if (!format)
		format = "D";
	var precision = -1;
	if (format.length > 1) precision = parseInt(format.slice(1), 10);
	var pattern;
	switch (format.charAt(0)) {
		case "d":
		case "D":
			pattern = 'n';
			if (precision !== -1) {
				number = zeroPad(""+number, precision, true);
			}
			if (this < 0) number = -number;
			break;
		case "c":
		case "C":
			if (this < 0) pattern = _currencyNegativePattern[nf.CurrencyNegativePattern];
			else pattern = _currencyPositivePattern[nf.CurrencyPositivePattern];
			if (precision === -1) precision = nf.CurrencyDecimalDigits;
			number = expandNumber(Math.abs(this), precision, nf.CurrencyGroupSizes, nf.CurrencyGroupSeparator, nf.CurrencyDecimalSeparator);
			break;
		case "n":
		case "N":
			if (this < 0) pattern = _numberNegativePattern[nf.NumberNegativePattern];
			else pattern = 'n';
			if (precision === -1) precision = nf.NumberDecimalDigits;
			number = expandNumber(Math.abs(this), precision, nf.NumberGroupSizes, nf.NumberGroupSeparator, nf.NumberDecimalSeparator);
			break;
		case "p":
		case "P":
			if (this < 0) pattern = _percentNegativePattern[nf.PercentNegativePattern];
			else pattern = _percentPositivePattern[nf.PercentPositivePattern];
			if (precision === -1) precision = nf.PercentDecimalDigits;
			number = expandNumber(Math.abs(this) * 100, precision, nf.PercentGroupSizes, nf.PercentGroupSeparator, nf.PercentDecimalSeparator);
			break;
		default:
			throw Error.New(SR.get("BadFormatSpecifier"));
	}
	var regex = /n|\$|-|%/g;
	var ret = "";
	for (;;) {
		var index = regex.lastIndex;
		var ar = regex.exec(pattern);
		ret += pattern.slice(index, ar ? ar.index : pattern.length);
		if (!ar)
			break;
		switch (ar[0]) {
			case "n":
				ret += number;
				break;
			case "$":
				ret += nf.CurrencySymbol;
				break;
			case "-":
				if (/[1-9]/.test(number)) {
					ret += nf.NegativeSign;
				}
				break;
			case "%":
				ret += nf.PercentSymbol;
				break;
			default:
				throw Error.New("Invalid number format pattern");
		}
	}
	return ret;

	function expandNumber(number, precision, groupSizes, sep, decimalChar) {
		var curSize = groupSizes[0];
		var curGroupIndex = 1;
		var factor = Math.pow(10, precision);
		var rounded = (Math.round(number * factor) / factor);
		if (!isFinite(rounded)) {
			rounded = number;
		}
		number = rounded;
		
		var numberString = number.toString();
		var right = "";
		var exponent;
		
		
		var split = numberString.split(/e/i);
		numberString = split[0];
		exponent = (split.length > 1 ? parseInt(split[1]) : 0);
		split = numberString.split('.');
		numberString = split[0];
		right = split.length > 1 ? split[1] : "";
		
		var l;
		if (exponent > 0) {
			right = zeroPad(right, exponent, false);
			numberString += right.slice(0, exponent);
			right = right.substr(exponent);
		}
		else if (exponent < 0) {
			exponent = -exponent;
			numberString = zeroPad(numberString, exponent+1, true);
			right = numberString.slice(-exponent, numberString.length) + right;
			numberString = numberString.slice(0, -exponent);
		}
		if (precision > 0) {
			if (right.length > precision) {
				right = right.slice(0, precision);
			}
			else {
				right = zeroPad(right, precision, false);
			}
			right = decimalChar + right;
		}
		else { 
			right = "";
		}
		var stringIndex = numberString.length-1;
		var ret = "";
		while (stringIndex >= 0) {
			if (curSize === 0 || curSize > stringIndex) {
				if (ret.length > 0)
					return numberString.slice(0, stringIndex + 1) + sep + ret + right;
				else
					return numberString.slice(0, stringIndex + 1) + right;
			}
			if (ret.length > 0)
				ret = numberString.slice(stringIndex - curSize + 1, stringIndex+1) + sep + ret;
			else
				ret = numberString.slice(stringIndex - curSize + 1, stringIndex+1);
			stringIndex -= curSize;
			if (curGroupIndex < groupSizes.length) {
				curSize = groupSizes[curGroupIndex];
				curGroupIndex++;
			}
		}
		return numberString.slice(0, stringIndex + 1) + sep + ret + right;
	}
};
Number.prototype._customFormat = function(format, cultureInfo) {
	var ds = cultureInfo.numberFormat.NumberDecimalSeparator;
	var gs = cultureInfo.numberFormat.NumberGroupSeparator;

	var pattern = format.match(/[0#,.]{1,}/g)[0];
	var numberString = this.toString();
	var patterns = pattern.split(ds);
	var numberStrings = numberString.split(ds);

	var z = patterns[0].indexOf(gs) == -1 ? -1 : patterns[0].length - patterns[0].indexOf(gs);
	var num1 = _format(patterns[0].replace(",", ""), numberStrings[0], 0);
	var num2 = _format(patterns[1] ? patterns[1].split('').reverse().join('') : "", numberStrings[1] ? numberStrings[1].split('').reverse().join('') : "", 1);
	num1 = num1.split("").reverse().join('');
	var reCat = eval("/[0-9]{" + (z - 1) + "," + (z - 1) + "}/g");
	var arrdata = z > -1 ? num1.match(reCat) : undefined;
	if (arrdata && arrdata.length > 0) {
		var w = num1.replace(arrdata.join(''), '');
		num1 = arrdata.join(gs) + (w == "" ? "" : gs) + w;
	}
	num1 = num1.split("").reverse().join("");
	return format.replace(pattern, (num1 == "" ? "0" : num1) + (num2 != "" ? ds + num2.split("").reverse().join('') : ""));
	
	function _format(pattern, num, z) {
		var j = pattern.length >= num.length ? pattern.length : num.length;
		var p = pattern.split("");
		var n = num.split("");
		var bool = true, nn = "";
		for (var i = 0; i < j; i++) {
			var x = n[n.length - j + i];
			var y = p[p.length - j + i];
			if (z == 0) {
				if (bool) {
					if ((x && y && (x != "0" || y == "0")) || (x && x != "0" && !y) || (y && y == "0" && !x)) {
						nn += x ? x : "0";
						bool = false;
					}
				} else {
					nn += x ? x : "0";
				}
			} else {
				if (y && (y == "0" || (y == "#" && x)))
					nn += x ? x : "0";
			}
		}
		return nn;
	}
};
Number._toStringFunction = Number.prototype.toString;
Number.prototype.toString = function(format, cultureInfo) {
	if (String.isNullOrEmpty(format) || typeof format !== "string") return Number._toStringFunction.call(this);
	return this.format(format, cultureInfo);
};
// #endregion Number

// #region String
String.prototype.endsWith = function(suffix, ignoreCase) {return String.equals(this.substr(this.length - suffix.length), suffix, ignoreCase);};
String.prototype.startsWith = function(prefix, ignoreCase) {return String.equals(this.substr(0, prefix.length), prefix, ignoreCase);};
if (!String.prototype.trim) {
	String.prototype.trim = function() {return this.replace(/^\s+|\s+$/g, '');};
}
String.prototype.trimEnd = function() {return this.replace(/\s+$/, '');};
String.prototype.trimStart = function() {return this.replace(/^\s+/, '');};
String.prototype.padLeft = function(totalWidth, paddingChar) {if (paddingChar == null) paddingChar = ' ';var result = new String(this);for (var i = 0;i < totalWidth - this.length;i ++) {result = paddingChar + result;} return result};
String.prototype.padRight = function(totalWidth, paddingChar) {if (paddingChar == null) paddingChar = ' ';var result = new String(this);for (var i = 0;i < totalWidth - this.length;i ++) {result += paddingChar;} return result};
String.prototype.In = function() {for (var i = 0;i < arguments.length;i ++) {if (this === arguments[i]) return true;} return false;};
String.isNullOrEmpty = function(s) {return s == null || s.length === 0;};
String.equals = function(a, b, ignoreCase) {
	if (a === null) return b === null;
	if (b === null) return false;
	ignoreCase = ignoreCase == null ? false : ignoreCase;
	return ignoreCase ? a.toLowerCase() === b.toLowerCase() : a === b;
};
if (Object.isUndefined(String.format)) {
String.format = function(format) {
	var result = '';
	var args = arguments;
	for (var i=0;true;) {
		var open = format.indexOf('{', i);
		var close = format.indexOf('}', i);
		if ((open < 0) && (close < 0)) {
			result += format.slice(i);
			break;
		}
		if ((close > 0) && ((close < open) || (open < 0))) {
			if (format.charAt(close + 1) !== '}') {
				throw Error.New(SR.get("StringFormatBraceMismatch"));
			}
			result += format.slice(i, close + 1);
			i = close + 2;
			continue;
		}
		result += format.slice(i, open);
		i = open + 1;
		if (format.charAt(i) === '{') {
			result += '{';
			i++;
			continue;
		}
		if (close < 0) throw Error.New(SR.get('StringFormatBraceMismatch'));
		var brace = format.substring(i, close);
		var colonIndex = brace.indexOf(':');
		var argNumber = parseInt((colonIndex < 0)? brace : brace.substring(0, colonIndex), 10) + 1;
		if (isNaN(argNumber)) throw Error.New(SR.get('StringFormatInvalid'));
		var argFormat = (colonIndex < 0)? '' : brace.substring(colonIndex + 1);
		var arg = args[argNumber];
		if (Object.isUndefined(arg) || arg === null) arg = '';
		if (arg.toFormattedString) {
			result += arg.toFormattedString(argFormat);
		} else {
			result += arg.toString();
		}
		i = close + 1;
	}
	return result;
}};
// #endregion String
// #endregion extensions

// #region cookie
window.setCookie = function(name, value, expires, domain, path, secure) {
	document.cookie = name + "=" + value + (expires == null ? "" : "; expires=" + expires.toUTCString())
			+ (domain == null ? "" : "; domain=" + domain) + (path == null ? "; path=/" : "; path=" + path) + (secure ? "secure" : "");
};
window.getCookie = function(name, domain, path) {
	var cookies = document.cookie;
	var index = cookies.indexOf(name + '=');
	if (index > 0) {
		name = " " + name;
		index = cookies.indexOf(name + '=');
	}

	if (index >= 0) {
		var start = index + name.length + 1;
		var end = cookies.indexOf(';', start);
		if (end < start) end = cookies.length;
		return unescape(cookies.substring(start, end));
	}
	return "";
};
window.deleteCookie = function(name, domain, path) {
	var expires = new Date();
	expires.setTime (expires.getTime() - 60000);
	setCookie(name , "Delete Cookie", expires, domain, path, false);
};
// #endregion cookie

window.getQueryString = function(name) {
	var str = window.location.search;
	if (str.indexOf("?" + name + "=") != -1 || str.indexOf("&" + name + "=") != -1) {
		var pos_start = (str.indexOf("?" + name + "=") >= 0 ? str.indexOf("?" + name + "=") : str.indexOf("&" + name + "=")) + name.length + 2;
		var pos_end = str.indexOf("&", pos_start);
		return pos_end == -1 ? str.substring(pos_start) : str.substring(pos_start,pos_end);
	} else {
		return null;
	}
};

window.Json = {
	_charsToEscapeRegExs: [],
	_charsToEscape: [],
	_escapeChars: {},
	_escapeRegEx : new RegExp('["\\\\\\x00-\\x1F\'\"]', 'i'),
	_escapeRegExGlobal: new RegExp('["\\\\\\x00-\\x1F\'\"]', 'g'),
	_init: function() {
		var replaceChars = ['\\u0000','\\u0001','\\u0002','\\u0003','\\u0004','\\u0005','\\u0006','\\u0007',
							'\\b','\\t','\\n','\\u000b','\\f','\\r','\\u000e','\\u000f','\\u0010','\\u0011',
							'\\u0012','\\u0013','\\u0014','\\u0015','\\u0016','\\u0017','\\u0018','\\u0019',
							'\\u001a','\\u001b','\\u001c','\\u001d','\\u001e','\\u001f'];
		Json._charsToEscape[0] = '\\';
		Json._charsToEscapeRegExs['\\'] = new RegExp('\\\\', 'g');
		Json._escapeChars['\\'] = '\\\\';
		Json._charsToEscape[1] = '\'';
		Json._charsToEscapeRegExs['\''] = new RegExp('\\\'', 'g');
		Json._escapeChars['\''] = '\\\'';
		Json._charsToEscape[2] = '"';
		Json._charsToEscapeRegExs['"'] = new RegExp('"', 'g');
		Json._escapeChars['"'] = '\\"';
		for (var i = 0; i < 32; i++) {
			var c = String.fromCharCode(i);
			Json._charsToEscape[i + 3] = c;
			Json._charsToEscapeRegExs[c] = new RegExp(c, 'g');
			Json._escapeChars[c] = replaceChars[i];
		}
	},
	definiteType: function(value, type) {return value != null && value.constructor === Json._definiteType ? value : new Json._definiteType(value, type)},
	toJsonString: function(obj, indent, stringWrapChar) {
		if (obj == null) return "null";
		switch (obj.constructor) {
			case Array : 
				var complex = obj.length > 0 && obj[0] instanceof Object ? true : false;
				var s = "[" + (complex ? NewLine : "");
				indent = indent ? indent : "";
				for (var i = 0;i < obj.length;i ++) {
					if (i > 0) s += ", " + (complex ? NewLine : "");
					s += (complex ? indent + "	" : "") + Json.toJsonString(obj[i], indent + "	", stringWrapChar);
				}
				s += (complex ? NewLine + indent : "") + "]";
				return s;
			case Boolean : 
				return obj ? "true" : "false";
				break;
			case Date : 
				return obj.getUTCTicks().toString();
			case Number : 
				return obj.toString();
			case String : 
				stringWrapChar = stringWrapChar ? stringWrapChar : '"';
				return stringWrapChar + Json.encode(obj) + stringWrapChar;
			case Json._definiteType : 
				indent = indent ? indent : "";
				return indent + obj.type + " " + Json.toJsonString(obj.value, indent + "	", stringWrapChar);
			default :
				if (obj.toJsonString) {
					return obj.toJsonString(indent, stringWrapChar);
				} else {
					var s = "{" + NewLine;
					var isFirst = true;
					indent = indent ? indent : "";
					for (var k in obj) {
						if (typeof(obj[k]) !== "function" && (k.constructor != String || !k.startsWith('__'))) {
							if (isFirst) isFirst = false; else s += "," + NewLine;
							s += indent + "	\"" + k + "\" : " + Json.toJsonString(obj[k], indent + "	", stringWrapChar);
						}
					}
					s += NewLine + indent + "}";
					return s;
				}
		}
	},
	toJsonObject: function(s) {
		return s != null && s.constructor === String ? (window.JSON ? JSON.parse(s) : eval("(" + s + ")")) : s;
	},
	encode: function(str) {
		if (Json._escapeRegEx.test(str)) {
			if (Json._charsToEscape.length === 0) {
				Json._init();
			}
			if (str.length < 128) {
				str = str.replace(Json._escapeRegExGlobal, function(x) { return Json._escapeChars[x]; });
			} else {
				for (var i = 0; i < 35; i++) {
					var c = Json._charsToEscape[i];
					if (str.indexOf(c) !== -1) {
						str = str.replace(Json._charsToEscapeRegExs[c], Json._escapeChars[c]);
					}
				}
			}
		}
		return str;
	},
	_definiteType: function(value, type) {
		this.value = value;
		this.type = type == null ? Json._getType(value) : (type.constructor == String ? type : type.toString());
	},
	_getType: function(value) {
		if (value == null) return "object";
		switch (value.constructor) {
			case Array : 
				return value.length > 0 ? Json._getType(value[0]) + "[]" : "object[]";
			case Boolean : 
				return "bool";
			case Date : 
				return "System.DateTime";
			case Number : 
				return value % 1 === 0 ? (value > Number.MaxInt32 ? (value> Number.MaxInt64 ? "decimal" : "long") : "int") : "decimal";
			case String :
				return "string";
			default :
				if (value.constructor.getDataType) {
					return value.constructor.getDataType().FullName;
				} else {
					return "object";
				}
		}
	}
};

App.StringBuilder = function(initialText) {
	this._parts = (typeof(initialText) !== 'undefined' && initialText !== null && initialText !== '') ? [initialText.toString()] : [];
	this._value = {};
	this._len = 0;
};
App.StringBuilder.prototype = {
	append: function(text) {
		this._parts[this._parts.length] = text;
	},
	appendLine: function(text) {
		this._parts[this._parts.length] =
			((typeof(text) === 'undefined') || (text === null) || (text === '')) ? '\r\n' : text + '\r\n';
	},
	clear: function() {
		this._parts = [];
		this._value = {};
		this._len = 0;
	},
	isEmpty: function() {
		if (this._parts.length === 0) return true;
		return this.toString() === '';
	},
	toString: function(separator) {
		separator = separator || '';
		var parts = this._parts;
		if (this._len !== parts.length) {
			this._value = {};
			this._len = parts.length;
		}
		var val = this._value;
		if (typeof(val[separator]) === 'undefined') {
			if (separator !== '') {
				for (var i = 0; i < parts.length;) {
					if ((typeof(parts[i]) === 'undefined') || (parts[i] === '') || (parts[i] === null)) {
						parts.splice(i, 1);
					} else {
						i++;
					}
				}
			}
			val[separator] = this._parts.join(separator);
		}
		return val[separator];
	}
};

// #region CultureInfo
App.CultureInfo = function(name, numberFormat, dateTimeFormat) {
	this.name = name;
	this.numberFormat = numberFormat;
	this.dateTimeFormat = dateTimeFormat;
	if (App.CultureInfo.cultures.first(function(i) {return i.name === name;}) == null) {
		App.CultureInfo.cultures.add(this);
	}
};
App.CultureInfo.cultures = [];
App.CultureInfo.getCulture = function(name) {
	var ci = App.CultureInfo.cultures.first(function(i) {return i.name === name;});
	if (ci != null) return ci;
	var parent = SR.getParentCulture(name);
	return parent === null ? null : App.CultureInfo.getCulture(parent);
};
App.CultureInfo.prototype = {
	_getDateTimeFormats: function() {
		if (!this._dateTimeFormats) {
			var dtf = this.dateTimeFormat;
			this._dateTimeFormats =
			  [ dtf.MonthDayPattern,
				dtf.YearMonthPattern,
				dtf.ShortDatePattern,
				dtf.ShortTimePattern,
				dtf.LongDatePattern,
				dtf.LongTimePattern,
				dtf.FullDateTimePattern,
				dtf.ShortDatePattern + " " + dtf.ShortTimePattern,
				dtf.ShortDatePattern + " " + dtf.LongTimePattern,
				dtf.RFC1123Pattern,
				dtf.SortableDateTimePattern,
				dtf.UniversalSortableDateTimePattern ];
		}
		return this._dateTimeFormats;
	},
	_getIndex: function(value, a1, a2) {
		var upper = this._toUpper(value),
			i = a1.indexOf(upper);
		if (i === -1) {
			i = a2.indexOf(upper);
		}
		return i;
	},
	_getMonthIndex: function(value) {
		if (!this._upperMonths) {
			this._upperMonths = this._toUpperArray(this.dateTimeFormat.MonthNames);
			this._upperMonthsGenitive = this._toUpperArray(this.dateTimeFormat.MonthGenitiveNames);
		}
		return this._getIndex(value, this._upperMonths, this._upperMonthsGenitive);
	},
	_getAbbrMonthIndex: function(value) {
		if (!this._upperAbbrMonths) {
			this._upperAbbrMonths = this._toUpperArray(this.dateTimeFormat.AbbreviatedMonthNames);
			this._upperAbbrMonthsGenitive = this._toUpperArray(this.dateTimeFormat.AbbreviatedMonthGenitiveNames);
		}
		return this._getIndex(value, this._upperAbbrMonths, this._upperAbbrMonthsGenitive);
	},
	_getDayIndex: function(value) {
		if (!this._upperDays) {
			this._upperDays = this._toUpperArray(this.dateTimeFormat.DayNames);
		}
		return this._upperDays.indexOf(this._toUpper(value));
	},
	_getAbbrDayIndex: function(value) {
		if (!this._upperAbbrDays) {
			this._upperAbbrDays = this._toUpperArray(this.dateTimeFormat.AbbreviatedDayNames);
		}
		return this._upperAbbrDays.indexOf(this._toUpper(value));
	},
	_toUpperArray: function(arr) {
		var result = [];
		for (var i = 0, il = arr.length; i < il; i++) {
			result[i] = this._toUpper(arr[i]);
		}
		return result;
	},
	_toUpper: function(value) {
		return value.split("\u00A0").join(' ').toUpperCase();
	},
	constructor: App.CultureInfo
};
App.CultureInfo._parse = function(value) {
	var dtf = value.dateTimeFormat;
	if (dtf && !dtf.eras) {
		dtf.eras = value.eras;
	}
	return new App.CultureInfo(value.name, value.numberFormat, dtf);
};
App.CultureInfo.InvariantCulture = App.CultureInfo._parse({"name":"","numberFormat":{"CurrencyDecimalDigits":2,"CurrencyDecimalSeparator":".","IsReadOnly":true,"CurrencyGroupSizes":[3],"NumberGroupSizes":[3],"PercentGroupSizes":[3],"CurrencyGroupSeparator":",","CurrencySymbol":"\u00A4","NaNSymbol":"NaN","CurrencyNegativePattern":0,
		"NumberNegativePattern":1,"PercentPositivePattern":0,"PercentNegativePattern":0,"NegativeInfinitySymbol":"-Infinity","NegativeSign":"-","NumberDecimalDigits":2,"NumberDecimalSeparator":".","NumberGroupSeparator":",","CurrencyPositivePattern":0,"PositiveInfinitySymbol":"Infinity","PositiveSign":"+","PercentDecimalDigits":2,
		"PercentDecimalSeparator":".","PercentGroupSeparator":",","PercentSymbol":"%","PerMilleSymbol":"\u2030","NativeDigits":["0","1","2","3","4","5","6","7","8","9"],"DigitSubstitution":1},
		"dateTimeFormat":{"AMDesignator":"AM","Calendar":{"MinSupportedDateTime":"@-62135568000000@","MaxSupportedDateTime":"@253402300799999@","AlgorithmType":1,"CalendarType":1,"Eras":[1],"TwoDigitYearMax":2029,"IsReadOnly":true},"DateSeparator":"/","FirstDayOfWeek":0,"CalendarWeekRule":0,
		"FullDateTimePattern":"dddd, dd MMMM yyyy HH:mm:ss","LongDatePattern":"dddd, dd MMMM yyyy","LongTimePattern":"HH:mm:ss","MonthDayPattern":"MMMM dd","PMDesignator":"PM","RFC1123Pattern":"ddd, dd MMM yyyy HH\':\'mm\':\'ss \'GMT\'","ShortDatePattern":"MM/dd/yyyy","ShortTimePattern":"HH:mm"
		,"SortableDateTimePattern":"yyyy\'-\'MM\'-\'dd\'T\'HH\':\'mm\':\'ss","TimeSeparator":":","UniversalSortableDateTimePattern":"yyyy\'-\'MM\'-\'dd HH\':\'mm\':\'ss\'Z\'","YearMonthPattern":"yyyy MMMM","AbbreviatedDayNames":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"ShortestDayNames":["Su","Mo","Tu","We","Th","Fr","Sa"],
		"DayNames":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"AbbreviatedMonthNames":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""],"MonthNames":["January","February","March","April","May","June","July","August","September","October","November","December",""],"IsReadOnly":true,
		"NativeCalendarName":"Gregorian Calendar","AbbreviatedMonthGenitiveNames":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""],"MonthGenitiveNames":["January","February","March","April","May","June","July","August","September","October","November","December",""]},"eras":[1,"A.D.",null,0]});
App.CultureInfo.CurrentCulture	 = App.CultureInfo._parse(
	{
		"name": "zh-CN",
		"numberFormat":
		{
			CurrencyDecimalDigits : 2,
			CurrencyDecimalSeparator : ".",
			IsReadOnly : true,
			CurrencyGroupSizes : [3],
			NumberGroupSizes : [3],
			PercentGroupSizes : [3],
			CurrencyGroupSeparator : ",",
			CurrencySymbol : "￥",
			NaNSymbol : "非数字",
			CurrencyNegativePattern : 2,
			NumberNegativePattern : 1,
			PercentPositivePattern : 1,
			PercentNegativePattern : 1,
			NegativeInfinitySymbol : "负无穷大",
			NegativeSign : "-",
			NumberDecimalDigits : 2,
			NumberDecimalSeparator : ".",
			NumberGroupSeparator : ",",
			CurrencyPositivePattern : 0,
			PositiveInfinitySymbol : "正无穷大",
			PositiveSign : "+",
			PercentDecimalDigits : 2,
			PercentDecimalSeparator : ".",
			PercentGroupSeparator : ",",
			PercentSymbol : "%",
			PerMilleSymbol : "‰",
			NativeDigits : ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
			DigitSubstitution : 1
		},
		"dateTimeFormat":
		{
			AMDesignator : "上午",
			Calendar : {
					MinSupportedDateTime : 0,
					MaxSupportedDateTime : 3155378687999999999,
					AlgorithmType : 1,
					CalendarType : 1,
					Eras : [1],
					TwoDigitYearMax : 2029,
					IsReadOnly : true
			},
			DateSeparator : "-",
			FirstDayOfWeek : 0,
			CalendarWeekRule : 0,
			FullDateTimePattern : "yyyy'年'M'月'd'日' HH:mm:ss",
			LongDatePattern : "yyyy'年'M'月'd'日'",
			LongTimePattern : "HH:mm:ss",
			MonthDayPattern : "M'月'd'日'",
			PMDesignator : "下午",
			RFC1123Pattern : "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'",
			ShortDatePattern : "yyyy-MM-dd",
			ShortTimePattern : "HH:mm",
			SortableDateTimePattern : "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
			TimeSeparator : ":",
			UniversalSortableDateTimePattern : "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
			YearMonthPattern : "yyyy'年'M'月'",
			AbbreviatedDayNames : ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
			ShortestDayNames : ["日", "一", "二", "三", "四", "五", "六"],
			DayNames : ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
			AbbreviatedMonthNames : ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月", ""],
			MonthNames : ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月", ""],
			IsReadOnly : true,
			NativeCalendarName : "公历",
			AbbreviatedMonthGenitiveNames : ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月", ""],
			MonthGenitiveNames : ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月", ""]
		}
	});
App.CultureInfo._parse({"name":"en-US","numberFormat":{"CurrencyDecimalDigits":2,"CurrencyDecimalSeparator":".","IsReadOnly":false,"CurrencyGroupSizes":[3],"NumberGroupSizes":[3],"PercentGroupSizes":[3],"CurrencyGroupSeparator":",","CurrencySymbol":"$","NaNSymbol":"NaN","CurrencyNegativePattern":0,
		"NumberNegativePattern":1,"PercentPositivePattern":0,"PercentNegativePattern":0,"NegativeInfinitySymbol":"-Infinity","NegativeSign":"-","NumberDecimalDigits":2,"NumberDecimalSeparator":".","NumberGroupSeparator":",","CurrencyPositivePattern":0,"PositiveInfinitySymbol":"Infinity","PositiveSign":"+","PercentDecimalDigits":2,
		"PercentDecimalSeparator":".","PercentGroupSeparator":",","PercentSymbol":"%","PerMilleSymbol":"\u2030","NativeDigits":["0","1","2","3","4","5","6","7","8","9"],"DigitSubstitution":1},
		"dateTimeFormat":{"AMDesignator":"AM","Calendar":{"MinSupportedDateTime":"@-62135568000000@","MaxSupportedDateTime":"@253402300799999@","AlgorithmType":1,"CalendarType":1,"Eras":[1],"TwoDigitYearMax":2029,"IsReadOnly":false},"DateSeparator":"/","FirstDayOfWeek":0,"CalendarWeekRule":0,
		"FullDateTimePattern":"dddd, MMMM dd, yyyy h:mm:ss tt","LongDatePattern":"dddd, MMMM dd, yyyy","LongTimePattern":"h:mm:ss tt","MonthDayPattern":"MMMM dd","PMDesignator":"PM","RFC1123Pattern":"ddd, dd MMM yyyy HH\':\'mm\':\'ss \'GMT\'","ShortDatePattern":"M/d/yyyy",
		"ShortTimePattern":"h:mm tt","SortableDateTimePattern":"yyyy\'-\'MM\'-\'dd\'T\'HH\':\'mm\':\'ss","TimeSeparator":":","UniversalSortableDateTimePattern":"yyyy\'-\'MM\'-\'dd HH\':\'mm\':\'ss\'Z\'","YearMonthPattern":"MMMM, yyyy","AbbreviatedDayNames":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"ShortestDayNames":["Su","Mo","Tu","We","Th","Fr","Sa"],
		"DayNames":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"AbbreviatedMonthNames":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""],"MonthNames":["January","February","March","April","May","June","July","August","September","October","November","December",""],"IsReadOnly":false,
		"NativeCalendarName":"Gregorian Calendar","AbbreviatedMonthGenitiveNames":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""],"MonthGenitiveNames":["January","February","March","April","May","June","July","August","September","October","November","December",""]},"eras":[1,"A.D.",null,0]});
// #endregion CultureInfo

window.SR = App.SR = {
	localizedObjects: {},
	getCulture: function() {return SC.user != null && !String.isNullOrEmpty(SC.user.Location) ? SC.user.Location : Setting.Language;},
	getParentCulture: function(culture) {return String.isNullOrEmpty(culture) ? null : culture.indexOf('-') < 0 ? "" : culture.substr(0, culture.indexOf('-'));},
	set: function(key, value, culture) {
		culture = culture ? culture : SR.getCulture();
		if (culture.constructor === App.CultureInfo) culture = culture.name;
		var v = this.localizedObjects[key];
		if (v === null) v = this.localizedObjects[key] = [];
		for (var i = 0; i < v.length; i++) {
			var item = v[i];
			if (String.equals(item[0], culture, true)) {
				item[1] = value;
				return;
			}
		}
		v[v.length] = [culture, value];
	},
	get: function(keyOrValues, culture, tryParents) {
		culture = culture == null ? SR.getCulture() : culture;
		if (culture.constructor === App.CultureInfo) culture = culture.name;
		tryParents = tryParents == null ? true : tryParents;
		if (keyOrValues.constructor === String) {
			var v = this.localizedObjects[keyOrValues];
			return v == null ? null : this.get(v, culture, tryParents);
		} else {
			if (keyOrValues.Invariant) {
				if (culture.length === 0) return keyOrValues.Invariant;
				var member = eval("keyOrValues." + culture.replace("-", "_"));
				if (member) return member;
			} else {
				for (var i = 0; i < keyOrValues.length; i++) {
					var item = keyOrValues[i];
					if (String.equals(item[0], culture, true)) return item[1];
				}
			}
			return (!tryParents || culture.length === 0) ? null : SR.get(keyOrValues, SR.getParentCulture(culture), tryParents);
		}
	},
	load: function(content) {
		if (content.constructor === String && !content.startsWith('{')) {
			content = SC.get(content);
		}
		var v = content.constructor === String ? Json.toJsonObject(content) : content;
		for (key in v) this.localizedObjects[key] = v[key];
	},
	_data: {
		'About': [["", "About"], ["zh-CN", "关于"]],
		'Add': [["", "Add"], ["zh-CN", "增加"]],
		'Cancel': [["", "Cancel"], ["zh-CN", "取消"]],
		'CancelConfirm': [["", "You sure you want to cancel the selected item?"], ["zh-CN", "确定要取消您选中的项目？"]],
		'CancelEditConfirm': [["", "Cancel"], ["zh-CN", "确认放弃更改？"]],
		'ChangePassword': [["", "Change Password"], ["zh-CN", "修改密码"]],
		'Close': [["", "Close"], ["zh-CN", "关闭"]],
		'Code': [["", "Code"], ["zh-CN", "编码"]],
		'Copy': [["", "Copy"], ["zh-CN", "拷贝"]],
		'CopyNew': [["", "Copy New"], ["zh-CN", "拷贝新增"]],
		'Confirm': [["", "Confirm"], ["zh-CN", "确认"]],
		'Delete': [["", "Delete"], ["zh-CN", "删除"]],
		'DeleteConfirm': [["", "You sure you want to delete the selected item?"], ["zh-CN", "确定要删除您选中的项目？"]],
		'Description': [["", "Description"], ["zh-CN", "描述"]],
		'Desktop': [["", "Desktop"], ["zh-CN", "桌面"]],
		'Edit': [["", "Edit"], ["zh-CN", "修改"]],
		'Export': [["", "Export"], ["zh-CN", "导出"]],
		'False': [["", "False"], ["zh-CN", "否"]],
		'Import': [["", "Import"], ["zh-CN", "导入"]],
		'Loading': [["", "Loading..."], ["zh-CN", "正在载入..."]],
		'Name': [["", "Name"], ["zh-CN", "名称"]],
		'New': [["", "New"], ["zh-CN", "新增"]],
		'No': [["", "No"], ["zh-CN", "否"]],
		'NonOperationalStaff': [["", "'{0}' non-operational staff."], ["zh-CN", "'{0}' 非业务操作人员。"]],
		'OK': [["", "OK"], ["zh-CN", "确定"]],
		'Paste': [["", "Paste"], ["zh-CN", "粘贴"]],
		'Password': [["", "Password"], ["zh-CN", "密码"]],
		'Permission': [["", "Permission"], ["zh-CN", "权限"]],
		'PropertyPathCaptionSeperator': [["", " "], ["zh-CN", ""]],
		'Refresh': [["", "Refresh"], ["zh-CN", "刷新"]],
		'Remove': [["", "Remove"], ["zh-CN", "移除"]],
		'Save': [["", "Save"], ["zh-CN", "保存"]],
		'Search': [["", "Search"], ["zh-CN", "查询"]],
		'SignIn': [["", "Sign In"], ["zh-CN", "登录"]],
		'SignOut': [["", "Sign Out"], ["zh-CN", "退出"]],
		'SuccessfullyChanged': [["", "Successfully changed"], ["zh-CN", "成功修改。"]],
		'TrueKey': [["", "True"], ["zh-CN", "是"]],
		'Yes': [["", "Yes"], ["zh-CN", "是"]],
		'FieldIsRequired': [["", "The '{0}' field is required."], ["zh-CN", "'{0}' 不能为空。"]],
		'IsNotValidValue': [["", "'{0}' is not a valid value."], ["zh-CN", "'{0}' 为无效值。"]],
		'MaximumLength': [["", "The maximum length is '{0}'."], ["zh-CN", "最大长度为 '{0}'。"]],

		'StringFormatBraceMismatch': [['', 'The format string contains an unmatched opening or closing brace.']],
		'StringFormatInvalid': [['', 'The format string is invalid.'],['zh-CN', '非法字符串格式。']],
		'FormatInvalidString':[['', 'Input string was not in a correct format.']],
		'BadFormatSpecifier': [['', 'Format specifier was invalid.']],

		'IllegalDataReturned': [['', 'Illegal data returned.'], ['zh-CN', '返回不合法的数据。']],
		'PageTimeoutOrNotSignIn': [['', 'Page timeout or is not sign in, please sign in again.'], ['zh-CN', '页面超时或未登录，请重新登录。']]
	}
};
SR.load(SR._data);

//#region data
App.Data = {};
window.DataType = App.Data.DataType = function(info, serverSideValidate) {
	this.Namespace = null;
	this.Name = null;
	this.IsEnum = false;
	this.Fields = [];
	this.Properties = [];
	this.ServerSideValidate = false;
	this._init(info, serverSideValidate);
	this.FullName = this.Namespace + "." + this.Name;
	this.__inited = false;
};
DataType.prototype = {
	toString: function() {return this.FullName},
	toJsonString: function() {return Json.toJsonString(this.toString())},
	getDisplayName: function() {var c = SR.get(this.Caption); return String.isNullOrEmpty(c) ? this.Name : c;},
	getCaption: function() {return SR.get(this.Caption);},
	isDomainResource: function() {
		this.ensureInfoCompleted();
		return !Object.isUndefined(this.Properties) && this.Properties.length > 6 && this.Properties[6].Name === "Directory";
	},
	getField: function(fieldName) {
		this.ensureInfoCompleted();
		return this.Fields.first(function(i) {return i.Name === fieldName;});
	},
	getProperty: function(propertyName) {
		this.ensureInfoCompleted();
		return this.Properties.first(function(i) {return i.Name === propertyName;});
	},
	getRuntimeType: function() {
		return using(this.Namespace)[this.Name];
	},
	getEnumDisplayName: function(value) {
		var buf = "";
		value = isNaN(value) ? this.parseEnum(value) : parseInt(value, 10);
		for (var i = 0; i < this.Fields.length; i++) {
			var field = this.Fields[i];
			if (this.EnumFlags) {
				if ((field.Value & value) != 0) {
					if (buf.length > 0) buf += ", ";
					buf += field.getDisplayName();
				}
			} else {
				if (field.Value == value) return field.getDisplayName();
			}
		}
		return buf;
	},
	parseEnum: function(nameOrCaption) {
		for (var i = 0; i < this.Fields.length; i++) {
			var field = this.Fields[i];
			if (field.Name === nameOrCaption || field.getCaption() == nameOrCaption) return field.Value;
		}
		return 0;
	},
	ensureInfoCompleted: function() {
		if (!this.__inited) {
			var info = SC.invoke("App.Services.ResourceService", "GetDataType", this.FullName);
			this._init(info[0], info[1]);
			this.__inited = true;
		}
	},
	_init: function(info, serverSideValidate) {
		if (info != null) {
			for (var key in info) {
				if (key === "Fields") {
					this.Fields = [];
					for (var i = 0; i < info[key].length; i++) {
						this.Fields[i] = new App.Data.DataField(info[key][i]);
					}
				} else if (key === "Properties") {
					this.Properties = [];
					for (var i = 0; i < info[key].length; i++) {
						this.Properties[i] = new App.Data.DataProperty(info[key][i]);
					}
				} else {
					this[key] = info[key];
				}
			}
		}
		if (serverSideValidate === true) this.ServerSideValidate = true;
	},
	constructor: DataType
};
DataType.getType = function(type) {
	if (type.constructor === DataType) return type;
	if (type.getDataType) return type.getDataType();
	
	if (!DataType.isValidTypeName(type)) return null;
	var ns = window;
	var parts = type.split('.');
	if (parts.length > 1) ns = using(parts.slice(0, -1).join("."));
	var t = ns[parts[parts.length - 1]];
	return t != null && t.getDataType != null ? t.getDataType() : null;
};
DataType.getRuntimeType = function(type) {
	var t = DataType.getType(type);
	return t == null ? null : t.getRuntimeType();
};
DataType.registerNamespace = function(namespace) {
	if (!DataType.isValidTypeName(namespace)) return null;
	var nsparent = window;
	var nsparts = namespace.split('.');
	for (var i = 0; i < nsparts.length; i++) {
		var part = nsparts[i];
		var ns = nsparent[part];
		if (!ns) ns = nsparent[part] = {};
		nsparent = ns;
	}
};
DataType.isValidTypeName = function(name) {return name.indexOf('<') < 0 && name.indexOf('[') < 0 && name.indexOf(':') < 0;};

App.Data.DataField = function(info) {
	for (var key in info) {this[key] = info[key];}
};
App.Data.DataField.prototype = {
	getDisplayName: function() {var c = SR.get(this.Caption); return String.isNullOrEmpty(c) ? this.Name : c;},
	getCaption: function() {return SR.get(this.Caption);},
	constructor: App.Data.DataField
};
App.Data.DataProperty = function(info) {
	for (var key in info) {this[key] = info[key];}
};
App.Data.DataProperty.prototype = {
	getDisplayName: function() {var c = SR.get(this.Caption); return String.isNullOrEmpty(c) ? this.Name : c;},
	getCaption: function() {return SR.get(this.Caption);},
	getDefaultValue: function() {
		switch (this.Type) {
			case "bool" :
				return this.Default == null ? null : Boolean.parse(this.Default);
			case "datetime" : 
				return this.Default == null ? null : 
					(this.Default.endsWith("Now") ? new Date() : (this.Default.ends("Today") ? Date.today() : Date.New(parseFloat(this.Default))));
			case "short" : 
			case "int" : 
				return this.Default == null ? null : parseInt(this.Default, 10);
			case "decimal" : 
			case "double" : 
			case "long": 
			case "float" : 
			case "timespan" : 
				return this.Default == null ? null : parseFloat(this.Default);
			case "key" : 
			case "string" : 
				return this.Default == null ? null : this.Default;
			default : 
				var pt = DataType.getType(this.Type);
				if (pt != null) {
					return pt.IsEnum === true && this.Default != null ? this._parseEnumDefault(pt, this.Default) : {};
				}
		}
		return null;
	},
	_parseEnumDefault: function(type, value) {
		if (value.indexOf(".") > 0) value = value.substr(value.lastIndexOf(".") + 1);
		return type.parseEnum(value);
	},
	constructor: App.Data.DataProperty
};
App.Data.PropertyPath = function(type, path) {
	this.type = DataType.getType(type);
	this.path = path;
	this.property = this.type.getProperty(path.indexOf('.') > 0 ? path.substr(path.lastIndexOf('.') + 1) : path);
};
App.Data.PropertyPath.prototype  = {
	getParent: function() {
		return this.path.indexOf('.') > 0 ? new App.Data.PropertyPath(this.type, this.path.substr(0, this.path.indexOf('.'))) : null;
	},
	getDisplayName: function() {
		var parent = this.getParent();
		return (parent == null ? "" : parent.getDisplayName()) + SR.get("PropertyPathCaptionSeperator") + this.property.getDisplayName();
	},
	toString: function() {return this.path;},
	constructor: App.Data.PropertyPath
};
App.Data.DataObject = function(value) {
};
App.Data.DataObject.prototype = {
	getDataType: function() {
		if (this.constructor.__type) {
			this.constructor.__type.ensureInfoCompleted();
			return this.constructor.__type;
		} else {
			return null;
		}
	},
	getValue: function(propertyName) {return this[propertyName];},
	setValue: function(propertyName, value) {
		var oldValue = this[propertyName];
		if (oldValue !== value) {
			if (this.propertyChanged !== null) this.propertyChanged(propertyName, oldValue, value);
		}
		this[propertyName] = value;
	},
	clone: function() {
		var n = new this.constructor;
		for (var k in this) {
			if (typeof(this[k]) !== "function") n[k] = this[k];
		}
		return n;
	},
	validate: function(vc, path, value) {
		if (arguments.length === 0) vc = new App.Data.ValidationContext();
		else if (arguments[0].constructor !== App.Data.ValidationContext) {
			value = path;path = vc;
			vc = new App.Data.ValidationContext();
		}
		var type = this.getDataType();
		if (path == null) {	// validate object
			var count = type.Properties.length;
			for (var i = 0;i < count;i ++) {
				var property = type.Properties[i];
				this.validate(vc, new App.Data.PropertyPath(type, property.Name), Object.isUndefined(this[property.Name]) ? property.getDefaultValue() : this[property.Name]); 
			}
		} else {			// validate property
			path = path.constructor === App.Data.PropertyPath ? path : new App.Data.PropertyPath(type, path);
			var p = path.property;
			if (p.AllowNull == false && (p.PropertyIndex > (type.isDomainResource() ? 6 : 5))) {
				if (value == null || ((typeof(value) === "object" || App.Data.DataObject.isResource(value)) && String.isNullOrEmpty(value.Key))) {
					vc.addError(path, String.format(SR.get("FieldIsRequired"), path.getDisplayName()));
				}
				if (p.Type === "string" && value == '') {
					vc.addError(path, String.format(SR.get("FieldIsRequired"), path.getDisplayName()));
				}
			}
			if (value != null && p.Type !== "string" && value.constructor === String) {
				switch (p.Type) {
					case "bool" : 
						if (Boolean.parse(value) == null) vc.addError(path, String.format(SR.get("IsNotValidValue"), value));
						break;
					case "datetime" : 
						if (Date.parseLocale(value) == null) vc.addError(path, String.format(SR.get("IsNotValidValue"), value));
						break;
					case "short" : 
						if (Number.parseInt16(value) == null) vc.addError(path, String.format(SR.get("IsNotValidValue"), value));
						break;
					case "int" : 
						if (Number.parseInt32(value) == null) vc.addError(path, String.format(SR.get("IsNotValidValue"), value));
						break;
					case "long" : 
						if (Number.parseInt64(value) == null) vc.addError(path, String.format(SR.get("IsNotValidValue"), value));
						break;
					case "float" : 
						if (Number.parseFloat(value) == null) vc.addError(path, String.format(SR.get("IsNotValidValue"), value));
						break;
					case "double" : 
						if (Number.parseDouble(value) == null) vc.addError(path, String.format(SR.get("IsNotValidValue"), value));
						break;
					case "decimal" : 
						if (Number.parseDecimal(value) == null) vc.addError(path, String.format(SR.get("IsNotValidValue"), value));
						break;
				}
			}
			if (value != null && p.Type === "string" && !Object.isUndefined(p.Length) && p.Length > 0) {
				if (value.length > p.Length) {
					vc.addError(path, String.format(SR.get("MaximumLength"), p.Length));
				}
			}
		}
		return vc;
	},
	getBase: function() {return App.Data.DataObject.prototype;},
	_init: function(value) {
		if (typeof(value) === "object") for (var k in value) this[k] = value[k];
	},
	constructor: App.Data.DataObject
};
App.Data.DataObject.isResource = function(value) {
	return value != null && value.constructor.__type != null && value.constructor.__type.constructor == App.Data.DataType;
};
App.Data.ValidationError = function(pathOrMessage, message) {
	this.path = arguments.length === 2 ? pathOrMessage : null;
	this.message = arguments.length === 1 ? pathOrMessage : message;
};
App.Data.ValidationContext = function() {this.errors = [];};
App.Data.ValidationContext.prototype = {
	isValid: function() {return Array.isNullOrEmpty(this.errors);},
	isInvalid: function() {return !this.isValid();},
	getErrorMessage: function() {return this.errors.select(function(i){return i.message;}).join(NewLine);},
	addError: function() {
		if (arguments.length === 1 && arguments[0] != null) {
			if (arguments[0].constructor === App.Data.ValidationError) this.errors[this.errors.length] = arguments[0];
			else this.errors[this.errors.length] = new App.Data.ValidationError(arguments[0]);
		}
		if (arguments.length === 2) this.errors[this.errors.length] = new App.Data.ValidationError(arguments[0], arguments[1]);
	},
	raiseExceptionIfNecessary: function() {if (this.isInvalid()) throw Error.New(this.getErrorMessage());},
	constructor: App.Data.ValidationContext
};
//#endregion data

//#region Query
window.Query = App.Data.Query = function(from, where) {
	this.from = from;
	this.whereExpression = where;
	this.spanItems = null;
	this.grouping = null;
	this.havingExpression = null;
	this.orderByItems = null;
	this.selection = null;
	this.isDistinct = false;
	this.selectRange = {offset: 0, count: 0};
	this.rightsValue = 1;
	this.optionsValue = null;
};
Query.prototype = {
	where: function(where) {this.whereExpression = where;return this;},
	whereAnd: function(where) {this.whereExpression = String.isNullOrEmpty(this.whereExpression) ? where : "(" + this.whereExpression + ") && (" + where + ")";return this;},
	whereOr: function(where) {this.whereExpression = String.isNullOrEmpty(this.whereExpression) ? where : "(" + this.whereExpression + ") || (" + where + ")";return this;},
	span: function(span) {this.spanItems = span;return this;},
	orderBy: function(orderBy) {this.orderByItems = orderBy;return this;},
	groupBy: function(groupBy) {this.grouping = groupBy;return this;},
	having: function(having) {this.havingExpression = having;return this;},
	select: function(selection) {this.selection = selection;return this;},
	distinct: function() {this.isDistinct = true;return this;},
	paging: function(turnOn) {
		if (turnOn == null) turnOn = true;
		if (!turnOn) this.range(0); else this.range(Query.DefaultPageSize);
		return this;
	},
	isPaging: function() {return this.selectRange != null && this.selectRange.count > 0;},
	pageSize: function(pageSize) {
		if (Object.isUndefined(pageSize)) {
			return this.selectRange.count;
		} else {
			this.selectRange.count = pageSize;
			return this;
		}
	},
	pageIndex: function(pageIndex) {
		if (Object.isUndefined(pageIndex)) {
			return this.isPaging() ? parseInt(this.selectRange.offset / this.selectRange.count) : -1;
		} else {
			if (this.isPaging()) this.selectRange.offset = this.selectRange.count * (pageIndex < 0 ? 0 : pageIndex);
			return this;
		}
	},
	range: function(offsetOrCount, count) {
		if (arguments.length === 1) this.selectRange.count = offsetOrCount;
		if (arguments.length === 2) this.selectRange = {offset: offsetOrCount, count: count};
		return this;
	},
	nextPage: function() {
		if (this.isPaging()) this.selectRange.offset += this.selectRange.count;
		return this;
	},
	rights: function(value) {this.rightsValue = value;return this;},
	options: function(value) {this.optionsValue = value;return this;},
	dataSource: function(value) {this.dataSourceValue = value;return this;},
	getSourceType: function() {
		return this.from == null ? null : (this.from.constructor == Query ? this.from.getSourceType() : (this.from.GetDataType ? this.from.GetDataType() : DataType.getType(this.from.toString())));
	},
	toString: function(stringWrapChar) {
		var buf = "from ";
		buf += this.from.constructor == Query ? "(" + this.from.toString(stringWrapChar) + ")" : this.from.toString();
		buf += String.isNullOrEmpty(this.whereExpression) ? "" : " where " + this.whereExpression;
		buf += String.isNullOrEmpty(this.grouping) ? "" : " group by " + this.grouping;
		buf += String.isNullOrEmpty(this.havingExpression) ? "" : " having " + this.havingExpression;
		buf += String.isNullOrEmpty(this.orderByItems) ? "" : " order by " + this.orderByItems;
		if (!String.isNullOrEmpty(this.spanItems)) {
			buf += " span " + this.spanItems;
		} else if (!String.isNullOrEmpty(this.selection)) {
			buf += " select " + this.selection;
		}
		buf += this.isDistinct === true ? " distinct" : "";
		buf += this.isPaging() ? " range " + this.selectRange.offset + ", " + this.selectRange.count : "";
		buf += this.rightsValue != 1 ? " rights " + this.rightsValue : "";
		if (!String.isNullOrEmpty(this.optionsValue)) {
			buf += " options " + this.optionsValue;
		}
		if (!String.isNullOrEmpty(this.dataSourceValue)) {
			buf += " in " + this.dataSourceValue;
		}
		return buf;
	},
	toJsonString: function(indent, stringWrapChar) {return Json.toJsonString(this.toString(stringWrapChar))},
	constructor: Query
};
Query.DefaultPageSize = 24;
Query.buildQuery = function(args) {
	var q;
	var len = Query._containsCallback(args) ? args.length - 1 : args.length;
	if (len === 1) q = args[0] == null ? null : (args[0].constructor === Query ? args[0] : (args[0].constructor === String && args[0].indexOf("from ") >= 0 ? args[0] : new Query(args[0])));
	if (len === 2) q = new Query(args[0]).where(args[1]);
	if (len === 3) q = new Query(args[0]).where(args[1]).span(args[2]);
	if (len === 4) q = new Query(args[0]).where(args[1]).span(args[2]).orderBy(args[3]);
	return q;
};
Query.buildDataQuery = function(args) {
	var q;
	var len = Query._containsCallback(args) ? args.length - 1 : args.length;
	if (len === 1) q = args[0] == null ? null : (args[0].constructor === Query ? args[0] : (args[0].constructor === String && args[0].indexOf("from ") >= 0 ? args[0] : new Query(args[0])));
	if (len === 2) q = new Query(args[0]).select(args[1]);
	if (len === 3) q = new Query(args[0]).select(args[1]).where(args[2]);
	if (len === 4) q = new Query(args[0]).select(args[1]).where(args[2]).orderBy(args[3]);
	return q;
};
Query.Const = function(value, trim) {
	if (value == null) return "null";
	if (trim == null) trim = true;
	switch (value.constructor) {
		case Array : 
			return value.select(function(i) {return Query.Const(i, trim);}).join(", ");
		case Date : 
			return value.getUTCTicks().toString();
		case String : 
			if (trim === true) value = value.trim();
			return "'" + value.replace(/'/g, "''") + "'";
		default : 
			return value.toString();
	}
};
Query._containsCallback = function(args) {return args.length > 0 && typeof(args[args.length - 1]) === "function" && !args[args.length -1].__type;};

window.InsertQuery = App.Data.InsertQuery = function(type) {
	this.type = type;
};
InsertQuery.prototype = {
	assign: function(assignments) {this.assignments = assignments;return this;},
	from: function(query) {this.fromQuery = Query.buildDataQuery(query);return this;},
	dataSource: function(value) {this.dataSourceValue = value;return this;},
	toString: function(stringWrapChar) {
		return "insert " + this.type.toString() + (String.isNullOrEmpty(this.assignments) ? "" : "{" + this.assignments + "}") +  
			(String.isNullOrEmpty(this.fromQuery) ? "" : Query.buildDataQuery(this.fromQuery).toString()) +
			(String.isNullOrEmpty(this.dataSourceValue) ? "" : " in " + this.dataSourceValue);
	},
	toJsonString: function(indent, stringWrapChar) {return Json.toJsonString(this.toString(stringWrapChar));},
	constructor: InsertQuery
};
InsertQuery.buildQuery = function(args) {
	var q;
	var len = Query._containsCallback(args) ? args.length - 1 : args.length;
	if (len === 1) q = args[0] == null ? null : (args[0].constructor === InsertQuery ? args[0] : (args[0].constructor === String && args[0].indexOf("insert ") >= 0 ? args[0] : new InsertQuery(args[0])));
	if (len === 2) q = (args[1] != null && args[1].inddexOf("from ") >= 0 ? new InsertQuery(args[0]).from(args[1]) : new InsertQuery(args[0]).assign(args[1]));
	return q;
};
window.UpdateQuery = App.Data.UpdateQuery = function(type, assignments, where) {
	this.type = type;
	this.assignments = assignments;
	this.whereExpression = where;
};
UpdateQuery.prototype = {
	assign: function(assignments) {this.assignments = assignments;return this;},
	where: function(where) {this.whereExpression = where;return this;},
	whereAnd: function(where) {this.whereExpression = String.isNullOrEmpty(this.whereExpression) ? where : "(" + this.whereExpression + ") && (" + where + ")";return this;},
	whereOr: function(where) {this.whereExpression = String.isNullOrEmpty(this.whereExpression) ? where : "(" + this.whereExpression + ") || (" + where + ")";return this;},
	dataSource: function(value) {this.dataSourceValue = value;return this;},
	toString: function(stringWrapChar) {
		return "update " + this.type.toString() + " {" + this.assignments + "}" + 
			(String.isNullOrEmpty(this.whereExpression)  ? "" : " where " + this.whereExpression) +
			(String.isNullOrEmpty(this.dataSourceValue) ? "" : " in " + this.dataSourceValue);
	},
	toJsonString: function(indent, stringWrapChar) {return Json.toJsonString(this.toString(stringWrapChar));},
	constructor: UpdateQuery
};
UpdateQuery.buildQuery = function(args) {
	var q;
	var len = Query._containsCallback(args) ? args.length - 1 : args.length;
	if (len === 1) q = args[0] == null ? null : (args[0].constructor === UpdateQuery ? args[0] : (args[0].constructor === String && args[0].indexOf("update ") >= 0 ? args[0] : new UpdateQuery(args[0])));
	if (len === 2) q = new UpdateQuery(args[0]).assign(args[1]);
	if (len === 3) q = new UpdateQuery(args[0]).assign(args[1]).where(args[2]);
	return q;
};
window.DeleteQuery = App.Data.DeleteQuery = function(type, where) {
	this.type = type;
	this.whereExpression = where;
};
DeleteQuery.prototype = {
	where: function(where) {this.whereExpression = where;return this;},
	whereAnd: function(where) {this.whereExpression = String.isNullOrEmpty(this.whereExpression) ? where : "(" + this.whereExpression + ") && (" + where + ")";return this;},
	whereOr: function(where) {this.whereExpression = String.isNullOrEmpty(this.whereExpression) ? where : "(" + this.whereExpression + ") || (" + where + ")";return this;},
	dataSource: function(value) {this.dataSourceValue = value;return this;},
	toString: function(stringWrapChar) {
		return "delete " + this.type.toString() + (String.isNullOrEmpty(this.whereExpression) ? "" : " where " + this.whereExpression) +
			(String.isNullOrEmpty(this.dataSourceValue) ? "" : " in " + this.dataSourceValue);
	},
	toJsonString: function(indent, stringWrapChar) {return Json.toJsonString(this.toString(stringWrapChar));},
	constructor: DeleteQuery
};
DeleteQuery.buildQuery = function(args) {
	var q;
	var len = Query._containsCallback(args) ? args.length - 1 : args.length;
	if (len === 1) q = args[0] == null ? null : (args[0].constructor === DeleteQuery ? args[0] : (args[0].constructor === String && args[0].indexOf("delete ") >= 0 ? args[0] : new DeleteQuery(args[0])));
	if (len === 2) q = new DeleteQuery(args[0]).where(args[1]);
	return q;
};
//#endregion Query

App.Services = {};
App.Services.ServiceClient = function() {
	this.throwOnError = false;
	this._callback = null;
	this._xhr = null;
};
App.Services.ServiceClient.prototype = {
	invoke: function(s, m) {
		var content = Json.toJsonString(App.Services.ServiceClient.getMessage.apply(null, arguments));
		
		var xhr = new XMLHttpRequest();
		xhr.open("post", App.Services.ServiceClient.getServiceUrl() + "?rnd=" + Math.random(), false);
		xhr.setRequestHeader("Content-Type","text/plain;charset=utf8");
		xhr.send(content);
		var rt = xhr.responseText;
		
		var r;
		try {
			r = Json.toJsonObject(rt);
		} catch (e) {
			throw Error.New(SR.get('IllegalDataReturned'), rt, Error.errorNumbers.server);
		}
		if (r != null && r.StackTrace) {
			if (r.ErrorCode === Error.errorNumbers.unconnected) {
				SC.closeCompleted();
				SC.restore();
				throw Error.New(SR.get('PageTimeoutOrNotSignIn'), null, Error.errorNumbers.unconnected);
			} else if (r.ErrorCode === Error.errorNumbers.message) {
				throw Error.New(null, rt, Error.errorNumbers.message);
			} if (r.ErrorCode === Error.errorNumbers.unauthorized) {
				throw Error.New(null, rt, Error.errorNumbers.unauthorized);
			} else {
				throw Error.New(null, rt, Error.errorNumbers.service);
			}
		}
		return r;
	},
	invokeAsync: function(s, m, callback) {
		if (arguments[2] !== null && typeof(arguments[2]) === "function") this._callback = arguments[2];
		var content = Json.toJsonString(App.Services.ServiceClient.getMessage.apply(null, arguments));
		
		var that = this;
		this._xhr = new XMLHttpRequest();
		this._xhr.open("post", App.Services.ServiceClient.getServiceUrl() + "?rnd=" + Math.random(), true);
		this._xhr.onreadystatechange = (function() {
			if (that._xhr.readyState === 4) {
				var e = null;
				var r = null;
				try {
					if (Object.isUndefined(that._xhr.status)) return;
				} catch(ex) {
					e = ex;
				}
				if (e === null) {
					var rt = that._xhr.responseText;
					try {
						r = Json.toJsonObject(rt);
					} catch (e) {
						e = Error.New(SR.get('IllegalDataReturned'), rt, Error.errorNumbers.server);
					}
					if (r != null && r.StackTrace) {
						if (r.ErrorCode === Error.errorNumbers.unconnected) {
							SC.closeCompleted();
							SC.restore();
							e = Error.New(SR.get('PageTimeoutOrNotSignIn'), null, Error.errorNumbers.unconnected);
						} else if (r.ErrorCode === Error.errorNumbers.message) {
							e = Error.New(null, rt, Error.errorNumbers.message);
						} if (r.ErrorCode === Error.errorNumbers.unauthorized) {
							e = Error.New(null, rt, Error.errorNumbers.unauthorized);
						} else {
							e = Error.New(null, rt, Error.errorNumbers.service);
						}
					}
				}
				if (that._callback != null) {
					that._callback({
						result: r,
						error: e,
						hasError: e !== null,
						cancelled: false,
						success: e === null,
						ensureSuccess: function() {if (this.error !== null) throw this.error;return !this.cancelled}
					});
				}
				if (that.throwOnError && e !== null) throw e;
				
				that._xhr.onreadystatechange = null;
				that._xhr = null;
			}
		});
		this._xhr.setRequestHeader("Content-Type","text/json;charset=utf8");
		this._xhr.send(content);
	},
	abort: function() {
		if (this._xhr != null) {
			this._xhr.abort();
			this._xhr = null;
			if (this._callback != null) {
				this._callback({
					result: null,
					error: null,
					hasError: false,
					cancelled: true,
					success: false,
					ensureSuccess: function() {if (this.error !== null) throw this.error;return !this.cancelled}
				});
			}
		}
	},
	constructor: App.Services.ServiceClient
};
App.Services.ServiceClient.getServiceUrl = function(s, m) {
	if (s != null && m != null) {
		var args = arguments;
		var p = null;
		if (arguments.length > 2) {
			p = [];
			Array.copy(arguments, 2, p);
			if (p != null && p.length === 1) p = p[0];
		}
		return window.Setting.ServerUrl + VirtualPath + "service.ashx/" + 
			s + "/" + m + (p == null ? "" : "?" + escape(Json.toJsonString(p)));
	} else {
		return window.Setting.ServerUrl + VirtualPath + "service.ashx";
	}
};
App.Services.ServiceClient.getMessage = function(s, m) {
	var args = arguments;
	s = args[0];
	m = args[1];
	var hasCallback = (args.length > 2 && args[2] !== null && typeof(args[2]) === "function" && !args[2].__type) ? true : false;
	
	var p = [];
	if (args.length > 2) Array.copy(args, hasCallback ? 3 : 2, p);
	var message = {Service: s, Method: m};
	if (p.length === 1) message.Parameters = p[0]; else if (p.length > 1) message.Parameters = p; 
	if (!String.isNullOrEmpty(SC.sessionID)) message.SessionID = SC.sessionID;
	return message;
};

window.SC = App.Services.SC = {
	sessionID: null,
	user: null,
	connect: function () {
		var r = SC.invoke("App.Services.SystemService", "Connect");
		SC.connectCompleted(r[0], r[1]);
		return r;
	},
	connectCompleted: function(sessionID, user) {
		SC.sessionID = sessionID;
		SC.user = user;
		setCookie("App_SessionID", SC.sessionID);
		App.CultureInfo.CurrentCulture = App.CultureInfo.getCulture(SR.getCulture());
		SC._syncWindowState();
	},
	close: function() {
		try { SC.invoke("App.Services.SystemService", "Close"); } catch (e) { }
		SC.closeCompleted();
	},
	closeCompleted: function() {
		SC.sessionID = null;
		SC.user = null;
		deleteCookie("App_SessionID");
		App.CultureInfo.CurrentCulture = App.CultureInfo.getCulture(SR.getCulture());
		SC._syncWindowState();
	},
	isAlive: function (detect) {
		detect = detect ? detect : true;
		if (!String.isNullOrEmpty(getCookie("App_SessionID"))) {
			if (detect) {
				try { SC.invoke("App.Services.SystemService", "CurrentUser"); }
				catch (e) { return false; }
			}
			return true;
		}
		return false;
	},
	restore: function (quickRestore) {
		SC.sessionID = getCookie("App_SessionID");
		quickRestore = Object.isUndefined(quickRestore) ? false : quickRestore;
		if (quickRestore && !String.isNullOrEmpty(SC.sessionID)) return true;
		var r = SC.invoke("App.Services.SystemService", "Connect");
		var changed = SC.sessionID !== r[0];
		SC.connectCompleted(r[0], r[1]);
		return !changed;
	},
	signIn: function (domain, user, password, checkcode) {
		var r = SC.invoke("App.Services.SystemService", "SignIn", domain, user, password, checkcode);
		if (r[0] == 0 || r[0] == 1) SC.connectCompleted(r[1], r[2]);
		return r;
	},
	signOut: function () {
		try { SC.invoke("App.Services.SystemService", "SignOut"); } catch (e) { }
		SC.signOutCompleted();
	},
	signOutCompleted: function () {
		SC.user = null;
		App.CultureInfo.CurrentCulture = App.CultureInfo.getCulture(SR.getCulture());
		SC._syncWindowState();
	},
	now: function () {
		if (SC._useLocalDate) {
			return new Date();
		} else {
			var date = Date.New(SC.invoke("App.Services.SystemService", "Now"));
			SC._useLocalDate = Math.abs(date.getTime() - new Date().getTime()) < 10000;
		}
	},
	today: function () {
		if (SC._useLocalDate) {
			return Date.today();
		} else {
			return Date.New(SC.invoke("App.Services.SystemService", "Today"));
		}
	},
	execute: function(content) {
		return SC.invoke("App.Services.ResourceService", "Execute", content);
	},
	executeAsync: function(query, callback) {
		return SC.invokeAsync("App.Services.ResourceService", "Execute", callback, query);
	},
	select: function (from, where, span, orderby) {
		var q = Query.buildQuery(arguments);
		var ret = SC.invoke("App.Services.ResourceService", "Select", q);
		if (q.getSourceType) {
			var t = q.getSourceType();
			if (t != null && ret != null) {
				var items = [];
				for (var i = 0; i < ret.Items.length; i++) {
					items[i] = new (t.getRuntimeType())(ret.Items[i]);
				}
				ret.Items = items;
			}
		}
		return ret;
	},
	selectAsync: function (from, where, span, orderby, callback) {
		var q = Query.buildQuery(arguments);
		var args = arguments;
		SC.invokeAsync("App.Services.ResourceService", "Select",
			function (e) {
				if (e.success && q.getSourceType) {
					var t = q.getSourceType();
					if (t != null && e.result != null && e.result.Items) {
						var items = [];
						for (var i = 0; i < e.result.Items.length; i++) {
							items[i] = new (t.getRuntimeType())(e.result.Items[i]);
						}
						e.result.Items = items;
					}
				}
				SC._getCallback(args)(e);
			}, q);
	},
	selectOne: function (from, where, span, orderby) {
		var q = Query.buildQuery(arguments);
		var ret = SC.invoke("App.Services.ResourceService", "SelectOne", q);
		if (q.getSourceType) {
			var t = q.getSourceType();
			if (ret != null && t != null) ret = new (t.getRuntimeType())(ret);
		}
		return ret;
	},
	selectOneAsync: function (from, where, span, orderby, callback) {
		var q = Query.buildQuery(arguments);
		var args = arguments;
		SC.invokeAsync("App.Services.ResourceService", "SelectOne",
			function (e) {
				if (e.success && q.getSourceType) {
					var t = q.getSourceType();
					if (e.result != null && t != null) e.result = new (t.getRuntimeType())(e.result);
				}
				SC._getCallback(args)(e);
			}, q);
	},
	selectScalar: function (from, selection, where, orderby) {
		return SC.invoke("App.Services.ResourceService", "SelectScalar", Query.buildDataQuery(arguments));
	},
	selectScalarAsync: function (from, selection, where, orderby, callback) {
		SC.invokeAsync("App.Services.ResourceService", "SelectScalar", SC._getCallback(arguments), Query.buildDataQuery(arguments));
	},
	selectData: function (from, selection, where, orderby) {
		return SC.invoke("App.Services.ResourceService", "SelectData", Query.buildDataQuery(arguments));
	},
	selectDataAsync: function (from, selection, where, orderby, callback) {
		SC.invokeAsync("App.Services.ResourceService", "SelectData", SC._getCallback(arguments), Query.buildDataQuery(arguments));
	},
	selectByKey: function (type, key) {
		var q = new Query(type).where("Key == " + Query.Const(key));
		var ret = SC.invoke("App.Services.ResourceService", "SelectOne", q);
		if (ret != null) {
			ret = new (q.getSourceType().getRuntimeType())(ret);
		}
		return ret;
	},
	selectByKeyAsync: function (type, key, callback) {
		var args = arguments;
		var q = new Query(type).where("Key == " + Query.Const(key));
		SC.invokeAsync("App.Services.ResourceService", "SelectOne",
			function (e) {
				if (e.success && e.result != null) {
					e.result = new (q.getSourceType().getRuntimeType())(e.result);
				}
				SC._getCallback(args)(e);
			}, q);
	},
	exists: function (type, where) {
		return SC.selectOne(type, where) !== null;
	},
	validate: function (r, path, value) {
		var result = SC.invoke("App.Services.ResourceService", "Validate", Json.definiteType(r, r.getDataType()), path, path == null ? null : Json.definiteType(value));
		return result.length > 0 ? result.select(function (i) { return new App.Data.ValidationError(new App.Data.PropertyPath(i.PropertyRootType, i.PropertyPath), i.Message) }) : result;
	},
	validateAsync: function (r, pathOrCallback, value, callback) {
		callback = arguments.length == 2 ? pathOrCallback : callback;
		var result = SC.invokeAsync("App.Services.ResourceService", "Validate", function (e) {
			if (callback == null) {
				e.ensureSuccess();
				return;
			}
			var result = e.result.length > 0 ? e.result.select(function (i) { new App.Data.ValidationError(new App.Data.PropertyPath(i.PropertyRootType, i.PropertyPath), i.Message) }) : e.result;
			e.result = result;
			callback(e);
		}, Json.definiteType(r, r.getDataType()), path != null && path.constructor === String ? path : null, path != null && path.constructor === String ? Json.definiteType(value) : null);
	},
	insert: function (r) {
		if (r.getDataType) {
			var ret = SC.invoke("App.Services.ResourceService", "Insert", Json.definiteType(r, r.getDataType()));
			if (ret) for (var k in ret) r[k] = ret[k];
			return r;
		} else {
			return SC.invoke("App.Services.ResourceService", "DirectInsert", UpdateQuery.buildQuery(arguments));
		}
	},
	insertAsync: function (r, callback) {
		if (r.getDataType) {
			var args = arguments;
			SC.invokeAsync("App.Services.ResourceService", "Insert",
				function (e) {
					if (e.success && e.result != null) {
						for (var k in e.result) r[k] = e.result[k];
						e.result = r;
					}
					SC._getCallback(args)(e);
				}, Json.definiteType(r, r.getDataType()));
		} else {
			SC.invoke("App.Services.ResourceService", "DirectInsert", SC._getCallback(arguments), InsertQuery.buildQuery(arguments));
		}
	},
	update: function () {
		if (arguments.length == 1 && App.Data.DataObject.isResource(arguments[0])) {
			var r = arguments[0];
			var ret = SC.invoke("App.Services.ResourceService", "UpdateResource", Json.definiteType(r, r.getDataType()));
			if (ret) for (var k in ret[1]) r[k] = ret[1][k];
			return ret[0];
		}
		return SC.invoke("App.Services.ResourceService", "Update", UpdateQuery.buildQuery(arguments));
	},
	updateAsync: function () {
		if (arguments.length == 1 && App.Data.DataObject.isResource(arguments[0])) {
			var args = arguments;
			var r = args[0];
			SC.invokeAsync("App.Services.ResourceService", "UpdateResource",
				function (e) {
					if (e.success && e.result != null) {
						for (var k in e.result) r[k] = e.result[k];
						e.result = r;
					}
					SC._getCallback(args)(e);
				}, Json.definiteType(r, r.getDataType()));
		}
		SC.invokeAsync("App.Services.ResourceService", "Update", SC._getCallback(arguments), UpdateQuery.buildQuery(arguments));
	},
	directUpdate: function () {
		return SC.invoke("App.Services.ResourceService", "DirectUpdate", UpdateQuery.buildQuery(arguments));
	},
	directUpdateAsync: function () {
		SC.invoke("App.Services.ResourceService", "DirectUpdate", SC._getCallback(arguments), UpdateQuery.buildQuery(arguments));
	},
	Delete: function () {
		if (arguments.length == 1 && App.Data.DataObject.isResource(arguments[0])) {
			SC.invoke("App.Services.ResourceService", "DeleteResource", arguments[0].getDataType(), arguments[0].Key);
		} else if (arguments.length == 2 && arguments[1].constructor === Array) {
			SC.invoke("App.Services.ResourceService", "DeleteResources", arguments[0], arguments[1]);
		} else {
			return SC.invoke("App.Services.ResourceService", "Delete", DeleteQuery.buildQuery(arguments));
		}
	},
	deleteAsync: function () {
		if (arguments.length == 1 && App.Data.DataObject.isResource(arguments[0])) {
			SC.invokeAsync("App.Services.ResourceService", "DeleteResource", SC._getCallback(arguments), arguments[0].getDataType(), arguments[0].Key);
		} else if (arguments.length == 2 && arguments[1].constructor === Array) {
			SC.invokeAsync("App.Services.ResourceService", "DeleteResources", SC._getCallback(arguments), arguments[0], arguments[1]);
		} else {
			SC.invokeAsync("App.Services.ResourceService", "Delete", SC._getCallback(arguments), DeleteQuery.buildQuery(arguments));
		}
	},
	deleteByKeys: function (type, keys) {
		SC.invoke("App.Services.ResourceService", keys != null && keys.constructor === Array ? "DeleteResources" : "DeleteResource", type, keys);
	},
	deleteByKeysAsync: function (type, keys, callback) {
		SC.invokeAsync("App.Services.ResourceService", keys != null && keys.constructor === Array ? "DeleteResources" : "DeleteResource", SC._getCallback(arguments), type, keys);
	},
	directDelete: function (type, where) {
		return SC.invoke("App.Services.ResourceService", "DirectDelete", DeleteQuery.buildQuery(arguments));
	},
	directDeleteAsync: function (type, where, callback) {
		SC.invokeAsync("App.Services.ResourceService", "DirectDelete", SC._getCallback(arguments), DeleteQuery.buildQuery(arguments));
	},
	invoke: function (s, m) {
		var sc = new App.Services.ServiceClient();
		return sc.invoke.apply(sc, arguments);
	},
	invokeAsync: function (s, m, callback) {
		var sc = new App.Services.ServiceClient();
		if (Object.isUndefined(callback) || callback === Function.Empty) sc.throwOnError = true;
		sc.invokeAsync.apply(sc, arguments);
	},
	get: function () {
		var args = arguments;
		var url;
		if (args.length === 1) {
			url = args[0];
			url = (url.startsWith("http", true) ? "" : (url.startsWith('/') ? VirtualPath.substr(0, VirtualPath.length - 1) : "")) + url;
		} else {
			url = SC.getServiceUrl.apply(SC, arguments);
		}
		var xhr = new XMLHttpRequest();
		xhr.open("get", url, false);
		xhr.setRequestHeader("Content-Type", "text/plain;charset=utf8");
		xhr.send();
		return args.length > 1 ? Json.toJsonObject(xhr.responseText) : xhr.responseText;
	},
	download: function(path, filename, target, view) {
		window.open("/download.ashx?p=" + escape(path) + (filename == null ? "" : "&f=" + escape(filename)) + 
			(target == null ? "" : "&t=" + escape(target)) + (view == null ? "" : "&v=" + escape(view)));
	},
	getServiceUrl: function (s, m) { return App.Services.ServiceClient.getServiceUrl.apply(App.Services.ServiceClient, arguments); },
	getMessage: function (s, m) { return App.Services.ServiceClient.getMessage.apply(App.Services.ServiceClient, arguments); },
	_syncWindowState: function () {
		if (parent != null && parent != window && !Object.isUndefined(parent.SC) && !Object.isUndefined(parent.App)) {
			parent.SC.sessionID = SC.sessionID;
			parent.SC.user = SC.user;
			parent.App.CultureInfo.CurrentCulture = parent.App.CultureInfo.getCulture(SR.getCulture());
		}
		if (!Object.isUndefined(window.document.frames)) {
			for (var i = 0; i < window.document.frames.length; i++) {
				var frame = window.document.frames[i];
				if (!Object.isUndefined(frame.SC) && !Object.isUndefined(frame.App)) {
					frame.SC.sessionID = SC.sessionID;
					frame.SC.user = SC.user;
					frame.App.CultureInfo.CurrentCulture = parent.App.CultureInfo.getCulture(SR.getCulture());
				}
			}
		} else {
			var frms = document.getElementsByTagName("IFRAME");
			for (var i = 0; i < frms.length; i++) {
				var frame = frms[i].contentWindow;
				if (!Object.isUndefined(frame.SC) && !Object.isUndefined(frame.App)) {
					frame.SC.sessionID = SC.sessionID;
					frame.SC.user = SC.user;
					frame.App.CultureInfo.CurrentCulture = parent.App.CultureInfo.getCulture(SR.getCulture());
				}
			}
		}
	},
	_getCallback: function (args) { return args.length > 0 && typeof (args[args.length - 1]) === "function" ? args[args.length - 1] : Function.Empty; }
};

window.using = function(namespace, getOnDemand) {
	if (!DataType.isValidTypeName(namespace)) return null;
	var nsparent = window;
	var nsparts = namespace.split('.');
	for (var i = 0; i < nsparts.length; i++) {
		var part = nsparts[i];
		var ns = nsparent[part];
		if (!ns) {
			ns = nsparent[part] = {};
			if (i === nsparts.length - 1) {
				if (getOnDemand == true) {
					var typeNames = SC.invoke("App.Services.ResourceService", "GetDataTypeNamesByNamespace", namespace);
					var enums = [];
					for (var i = 0; i < typeNames.length; i++) {
						var item = typeNames[i];
						var typeName = item[0];
						var type = ns[typeName] = function(value) {this._init(value);};
						type.__type = new App.Data.DataType({Namespace: namespace, Name : typeName});
						type.getDataType = function() {this.__type.ensureInfoCompleted();return this.__type;};
						type.toString = function() {return this.__type.toString();};
						type.toJsonString = function() {return Json.toJsonString(this.toString());};
						if (item[1]) {		// is enum
							enums.add(typeName);
						} else {
							type.prototype = new App.Data.DataObject();
							type.prototype.constructor = type;
						}
					}
					if (enums.length > 0) {
						var types = SC.invoke("App.Services.ResourceService", "GetDataTypes", enums);
						addTypes(types);
					}
				} else {
					var types = SC.invoke("App.Services.ResourceService", "GetDataTypesByNamespace", namespace);
					addTypes(types);
				}
			}
		}
		nsparent = ns;
	}
	return nsparent;

	function addTypes(types) {
		for (var i = 0; i < types.length; i++) {
			var item = types[i];
			var typeName = item[0].Name;
			var type = ns[typeName] = function(value) {this._init(value);};
			type.__type = new App.Data.DataType(item[0], item[1]);
			type.__type.__inited = true;
			type.getDataType = function() {this.__type.ensureInfoCompleted();return this.__type;};
			type.toString = function() {return this.__type.toString();};
			type.toJsonString = function() {return Json.toJsonString(this.toString());};
			if (type.__type.IsEnum) {
				var fields = type.__type.Fields;
				for (var fi = 0; fi < fields.length; fi++) {
					var field = fields[fi];
					type[field.Name] = field.Value;
				}
			} else if (type.__type.IsDataObject) {
				type.prototype = new App.Data.DataObject();
				type.prototype.constructor = type;
			}
		}
	}
};

if (parent != null && parent != window && !Object.isUndefined(parent.SC)) {
	SC.sessionID = parent.SC.sessionID;
	SC.user = parent.SC.user;
};