//温度转换成纵坐标
function transH(degree, max, min) {
    var maxRange = (max - min);
    var distance = Math.floor(150 / maxRange);
    return (max - degree) * distance + 300

}

//温度转换成纵坐标
function transL(degree, max, min) {
    var maxRange = (max - min);
    var distance = Math.floor(150 / maxRange);
    return 450 - ((degree - min) * distance);

}
function transformWeek(week) {
    switch (week.toLowerCase()) {
        case "monday":
            return 1;
        case "tuesday":
            return 2;
        case "wednesday":
            return 3;
        case "thursday":
            return 4;
        case "friday":
            return 5;
        case "saturday":
            return 6;
        case "sunday":
            return 0;
        default:
            break;
    }
}

//简单版绘制温度图表
function drawChart(canvasId, maxArr, minArr, dateArr, weekArr, sixw) {
    var weekString = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    var pi2 = Math.PI * 2;
    var canvas = document.getElementById("canvas_circle");
    canvas.width = window.innerWidth * 2;
    canvas.height = 700;
    var c = canvas.getContext("2d");
    // c.globalCompositeOperation = 'source-atop';

    c.font = "28px 微软雅黑";


    //设置背景渐变
    //var grd = c.createLinearGradient(0, 25, 0, 350);
    //grd.addColorStop(0, 'rgba(17, 34, 204,0.5)');
    //grd.addColorStop(0.5, 'rgba(17, 34, 204,0.5)');
    //grd.addColorStop(1, 'rgba(17, 34, 204,0.5)');
    //c.fillStyle = 'rgba(0,0,0,0.7)';
    //c.fillRect(0, 0, canvas.width, 350);
    //绘制文字
    c.fillStyle = "#ffffff";
    c.textAlign = "center";
    var step = Math.floor(canvas.width / 5)
    var x = Math.floor(step / 2);

    //绘制星期
    for (var i = 0; i < 5; i++) {
        c.fillText(weekString[weekArr[i]], x + step * i, 50);
    }
    //绘制日期
    for (var i = 0; i < 5; i++) {
        c.fillText(dateArr[i], x + step * i, 90);
    }

    //画线
    c.strokeStyle = "rgba(255,255,255,0.3)";
    //c.moveTo(x + step * 0.5, 25);
    //c.lineTo(x + step * 0.5, 700);
    //c.stroke();
    // c.beginPath();
    for (var i = 0; i < 4; i++) {
        c.moveTo(x + step * 0.5 + step * i, 25);
        c.lineTo(x + step * 0.5 + step * i, 700);
        c.stroke();
        c.beginPath();
    }


    var s = new Array();
    for (var i = 0; i < 5; i++) {
        (function (i) {

            s[i] = new Image();
            //s[i].src = "/Images/w0.png";
            var w = WeaherList.findSingle(sixw[i].fa);
            if (typeof (w) == 'undefined')
                s[i].src = "/Images/w0.png";
            else
                s[i].src = w.imgsrc(1);
            s[i].onload = function () { c.drawImage(s[i], x - (s[i].width / 4) + step * i, 120, 60, 60) };
        })(i)
    }


    //绘制最高温度
    var maxHighTemp = maxNum(maxArr);
    var minLowTemp = minNum(minArr);

    c.beginPath();
    c.lineWidth = 4;
    c.moveTo(x, transH(maxArr[0], maxHighTemp, minLowTemp));
    for (var i = 0; i < 5; i++) {
        var y = transH(maxArr[i], maxHighTemp, minLowTemp);
        c.fillText(maxArr[i] + "℃", x + step * i, y - 12);
        c.lineTo(x + step * i, y);
    }
    c.strokeStyle = "#ff4444";
    c.stroke();
    //绘制最低温度

    c.beginPath();
    c.lineWidth = 4;
    c.moveTo(x, transL(minArr[0], maxHighTemp, minLowTemp));

    for (var i = 0; i < 5; i++) {

        var y = transL(minArr[i], maxHighTemp, minLowTemp);
        c.fillText(minArr[i] + "℃", x + step * i, y + 40);
        c.lineTo(x + step * i, y);
    }

    var m = new Array();
    for (var i = 0; i < 5; i++) {
        (function (i) {
            m[i] = new Image();
            var w = WeaherList.findSingle(sixw[i].fb);
            if (typeof (w) == 'undefined')
                m[i].src = "/Images/w30.png";
            else
                m[i].src = w.imgsrc(0);
            m[i].onload = function () { c.drawImage(m[i], x - (m[i].width / 4) + step * i, 550, 60, 60); };
        })(i)
    }
    c.strokeStyle = "#d5d52b";
    c.stroke();

    //绘制点
    c.fillStyle = "ff4444";
    c.beginPath();
    for (var i = 0; i < 5; i++) {
        c.moveTo(x + step * i, transH(maxArr[i], maxHighTemp, minLowTemp));
        c.arc(x + step * i, transH(maxArr[i], maxHighTemp, minLowTemp), 8, 0, pi2);
    }
    c.fill();
    c.beginPath();
    c.fillStyle = "#d5d52b";
    for (var i = 0; i < 5; i++) {
        c.moveTo(x + step * i, transL(minArr[i], maxHighTemp, minLowTemp));
        c.arc(x + step * i, transL(minArr[i], maxHighTemp, minLowTemp), 8, 0, pi2);
    }
    c.fill();
}


function maxNum(arr) {
    var maxNum = 0;
    if (arr.length) {
        for (var i = 0, len = arr.length; i < len; i++) {
            if (i == 0) {
                maxNum = arr[0];
            } else if (maxNum < arr[i]) {
                maxNum = arr[i];
            }
        }
    }
    return maxNum;
}
function minNum(arr) {
    var minNum = 0;
    if (arr.length) {
        for (var i = 0, len = arr.length; i < len; i++) {
            if (i == 0) {
                minNum = arr[0];
            } else if (minNum > arr[i]) {
                minNum = arr[i];
            }
        }
    }
    return minNum;
}

var getLocation = {
    //浏览器原生获取经纬度方法
    latAndLon: function (callback, error) {
        var that = this;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                localStorage.setItem("latitude", latitude);
                localStorage.setItem("longitude", longitude);
                var data = {
                    latitude: latitude,
                    longitude: longitude
                };
                if (typeof callback == "function") {
                    callback(data);
                }
            },
				function () {
				    if (typeof error == "function") {
				        error();
				    }
				});
        } else {
            if (typeof error == "function") {
                error();
            }
        }
    },

    //微信JS-SDK获取经纬度方法
    weichatLatAndLon: function (callback, error) {
        var that = this;
        var timestamp = new Date().getTime() + "";
        timestamp = timestamp.substring(0, 10);
        var ranStr = randomString();

        //微信接口配置
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: 'XXXXXXXXXXXXXXXXX', // 必填，公众号的唯一标识
            timestamp: timestamp, // 必填，生成签名的时间戳
            nonceStr: ranStr, // 必填，生成签名的随机串
            signature: 'XXXXXXXXXXXXXXXXX',// 必填，签名，见附录1
            jsApiList: ['checkJsApi',
				'getLocation'
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });

        //参见微信JS SDK文档：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
        wx.ready(function () {

            wx.getLocation({
                success: function (res) {
                    var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                    var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                    var speed = res.speed; // 速度，以米/每秒计
                    var accuracy = res.accuracy; // 位置精度
                    localStorage.setItem("latitude", latitude);
                    localStorage.setItem("longitude", longitude);
                    var data = {
                        latitude: latitude,
                        longitude: longitude
                    };
                    if (typeof callback == "function") {
                        callback(data);
                    }
                },
                cancel: function () {
                    //这个地方是用户拒绝获取地理位置
                    if (typeof error == "function") {
                        error();
                    }
                }
            });

        });
        wx.error(function (res) {
            if (typeof error == "function") {
                error();
            }
        });
    },
    //将经纬度转换成城市名和街道地址，参见百度地图接口文档：http://developer.baidu.com/map/index.php?title=webapi/guide/webservice-geocoding
    cityname: function (latitude, longitude, callback) {
        $.ajax({
            url: 'http://api.map.baidu.com/geocoder/v2/?ak=lAjIrm7xUyV0y3KrMGkaP4FQ&callback=renderReverse&location=' + latitude + ',' + longitude + '&output=json&pois=1',
            type: "get",
            dataType: "jsonp",
            jsonp: "callback",
            success: function (data) {

                var province = data.result.addressComponent.province;
                var cityname = (data.result.addressComponent.city);
                var district = data.result.addressComponent.district;
                var street = data.result.addressComponent.street;
                var street_number = data.result.addressComponent.street_number;
                var formatted_address = data.result.formatted_address;
                localStorage.setItem("province", province);
                localStorage.setItem("cityname", cityname);
                localStorage.setItem("district", district);
                localStorage.setItem("street", street);
                //localStorage.setItem("street_number", street_number);
                //localStorage.setItem("formatted_address", formatted_address);
                //domTempe(cityname,latitude,longitude);
                var data = {
                    latitude: latitude,
                    longitude: longitude,
                    cityname: cityname
                };
                if (typeof callback == "function") {
                    callback(data);
                }

            }
        });
    },
    //设置默认城市
    setDefaultCity: function (callback) {
        alert("获取地理位置失败！");
        //默认经纬度
        var latitude = "39.9042140";
        var longitude = "116.4074130";
        var cityname = "北京";
        localStorage.setItem("latitude", latitude);
        localStorage.setItem("longitude", longitude);
        localStorage.setItem("cityname", cityname);
        //localStorage.setItem("province", "江苏省");
        //localStorage.setItem("district", "虎丘区");
        //localStorage.setItem("street", "珠江路");
        //localStorage.setItem("street_number", "88号");
        //localStorage.setItem("formatted_address", "江苏省苏州市虎丘区珠江路88号");
        var data = {
            latitude: latitude,
            longitude: longitude,
            cityname: cityname
        };
        if (typeof callback == "function") {
            callback(data);
        }
    },
    //更新地理位置
    refresh: function (callback) {
        var that = this;
        //重新获取经纬度和城市街道并设置到localStorage
        that.latAndLon(
			function (data) {
			    that.cityname(data.latitude, data.longitude, function (datas) {
			        if (typeof callback == "function") {
			            callback();
			        }
			    });
			},
			function () {
			    that.setDefaultCity(function () {
			        if (typeof callback == "function") {
			            callback();
			        }
			    });
			});
    }
};
