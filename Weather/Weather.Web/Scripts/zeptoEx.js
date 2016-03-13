
/*
zepto 扩展
*/
(function ($) {
    $.MsgBox = {
        Alert: function (title, msg) {
            GenerateHtml("alert", title, msg);
            btnOk();  //alert只是弹出消息，因此没必要用到回调函数callback
            btnNo();
        },
        Confirm: function (title, msg, callback) {
            GenerateHtml("confirm", title, msg);
            btnOk(callback);
            btnNo();
        }
    }
    //生成Html
    var GenerateHtml = function (type, title, msg) {
        var _html = "";
        _html += '<div id="mb_box"></div><div id="mb_con"><span id="mb_tit">' + title + '</span>';
        _html += '<a id="mb_ico">x</a><div id="mb_msg">' + msg + '</div><div id="mb_btnbox">';
        if (type == "alert") {
            _html += '<input id="mb_btn_ok" type="button" value="确定" />';
        }
        if (type == "confirm") {
            _html += '<input id="mb_btn_ok" type="button" value="确定" />';
            _html += '<input id="mb_btn_no" type="button" value="取消" />';
        }
        _html += '</div></div>';
        //必须先将_html添加到body，再设置Css样式
        $("body").append(_html); GenerateCss();
    }
    //生成Css
    var GenerateCss = function () {
        $("#mb_box").css({
            width: '100%', height: '100%', zIndex: '99999', position: 'fixed',
            filter: 'Alpha(opacity=60)', backgroundColor: 'black', top: '0', left: '0', opacity: '0.6'
        });
        $("#mb_con").css({
            zIndex: '999999', width: '400px', position: 'fixed',
            backgroundColor: 'White', borderRadius: '15px'
        });
        $("#mb_tit").css({
            display: 'block', fontSize: '14px', color: '#444', padding: '10px 15px',
            backgroundColor: '#DDD', borderRadius: '15px 15px 0 0',
            borderBottom: '3px solid #009BFE', fontWeight: 'bold'
        });
        $("#mb_msg").css({
            padding: '20px', lineHeight: '20px',
            borderBottom: '1px dashed #DDD', fontSize: '13px'
        });
        $("#mb_ico").css({
            display: 'block', position: 'absolute', right: '10px', top: '9px',
            border: '1px solid Gray', width: '18px', height: '18px', textAlign: 'center',
            lineHeight: '16px', cursor: 'pointer', borderRadius: '12px', fontFamily: '微软雅黑'
        });
        $("#mb_btnbox").css({ margin: '15px 0 10px 0', textAlign: 'center' });
        $("#mb_btn_ok,#mb_btn_no").css({ width: '85px', height: '30px', color: 'white', border: 'none' });
        $("#mb_btn_ok").css({ backgroundColor: '#168bbb' });
        $("#mb_btn_no").css({ backgroundColor: 'gray', marginLeft: '20px' });
        //右上角关闭按钮hover样式
        $("#mb_ico").hover(function () {
            $(this).css({ backgroundColor: 'Red', color: 'White' });
        }, function () {
            $(this).css({ backgroundColor: '#DDD', color: 'black' });
        });
        var _widht = document.documentElement.clientWidth;  //屏幕宽
        var _height = document.documentElement.clientHeight; //屏幕高
        var boxWidth = $("#mb_con").width();
        var boxHeight = $("#mb_con").height();
        //让提示框居中
        $("#mb_con").css({ top: (_height - boxHeight) / 2 + "px", left: (_widht - boxWidth) / 2 + "px" });
    }
    //确定按钮事件
    var btnOk = function (callback) {
        $("#mb_btn_ok").click(function () {
            $("#mb_box,#mb_con").remove();
            if (typeof (callback) == 'function') {
                callback();
            }
        });
    }
    //取消按钮事件
    var btnNo = function () {
        $("#mb_btn_no,#mb_ico").click(function () {
            $("#mb_box,#mb_con").remove();
        });
    }
})(Zepto);
(function ($) {
    $.axse = function (url, data, successfn, errorfn) {
        data = (data == null || data == "" || typeof (data) == "undefined") ? { "date": new Date().getTime() } : data;
        $.ajax({
            type: "post",
            data: data,
            url: url,
            dataType: "json",
            success: function (d) {
                successfn(d);
            },
            error: function (e) {
                errorfn(e);
            }
        });
    };
})(Zepto);
(function ($) {
    3     /**
 4      * 动态加载js文件
 5      * @param  {string}   url      js文件的url地址
 6      * @param  {Function} callback 加载完成后的回调函数
 7      */
    var _getScript = function (url, callback) {
        var head = document.getElementsByTagName('head')[0],
            js = document.createElement('script');

        js.setAttribute('type', 'text/javascript');
        js.setAttribute('src', url);

        head.appendChild(js);

        //执行回调
        var callbackFn = function () {
            if (typeof callback === 'function') {
                callback();
            }
        };

        if (document.all) { //IE
            js.onreadystatechange = function () {
                if (js.readyState == 'loaded' || js.readyState == 'complete') {
                    callbackFn();
                }
            }
        } else {
            js.onload = function () {
                callbackFn();
            }
        }
    }
    //添加扩展函数
    $.getScript = _getScript;
})(Zepto);
(function ($) {

    // 默认模板
    var _loadingTpl = '<div class="ui-loading-block showBox">' +
		    '<div class="ui-loading-cnt">' +
		      '<i class="ui-loading-bright"></i>' +
		      '<p><%=content%></p>' +
		   '</div>' +
		 '</div>';

    // 默认参数
    var defaults = {
        content: '加载中...'
    }
    // 构造函数
    var Loading = function (el, option, isFromTpl) {
        var self = this;
        this.element = $(el);
        this._isFromTpl = isFromTpl;
        this.option = $.extend(defaults, option);
        this.show();
    }
    Loading.prototype = {
        show: function () {
            var e = $.Event('loading:show');
            this.element.trigger(e);
            this.element.show();

        },
        hide: function () {
            var e = $.Event('loading:hide');
            this.element.trigger(e);
            this.element.remove();
        }
    }
    function Plugin(option) {

        return $.adaptObject(this, defaults, option, _loadingTpl, Loading, "loading");
    }
    $.fn.zLoading = $.zLoading = Plugin;
})(window.Zepto);


(function ($) {
    $.querycity = function (input, options) {
        var input = $(input);
        input.attr('autocomplete', 'off');
        var isSelected = false;

        var suggestMain = $("#suggestCity");
        var city_container = suggestMain.find('#citylst');
        var cityinput = $("#cityinput");

        suggestMain.bgIframe();

        //input.focus(function () {
        //    city_container.empty();
        //    if ($("#cancel").length == 0)
        //        cityinput.append("<span class='input-group-btn' id='cancel'><button  type='button' class='btn btn-info' >取消</button></span>");
        //    // cityinput.append("<span class='cancel input-group-btn' > <button id='cancel' type='button' class='btn btn-info' >取消</button></span>");
        //    suggestMain.show();
        //})

        input.click(function () {
            city_container.empty();
            input.focus();
            if ($("#cancel").length == 0)
                cityinput.append("<span class='cancel input-group-btn' id='cancel' ><button  type='button' class='btn btn-info' >取消</button></span>");
            suggestMain.show();
        });

        //input.keydown(function (event) {
        //}).keypress(function (event) {
        //    //queryCity();

        //}).keyup(function (event) {
        //    event = window.event || event;
        //    var keyCode = event.keyCode || event.which || event.charCode;
        //    if (keyCode != 13 && keyCode != 37 && keyCode != 39 && keyCode != 9 && keyCode != 38 && keyCode != 40) {
        //        //keyCode == 9是tab切换键
        //        queryCity();
        //    }
        //});

        input.bind("input propertychange", function () { queryCity(); });

        $(document).on('tap', '.dlcity dt', function () {
            selectedCity(this);
        });

        $(document).on('click', '#cancel', function () {
            suggestMain.hide();
            input.val('');
            this.remove();
        });

        function queryCity() {

            var value = input.val().toLowerCase().replace(/\s+/g, "");
            if (value.length == 0) {
                city_container.empty();
                return;
            }

            var isHave = false;
            var _tmp = new Array();
            for (var i = 0; i < options.cityList.CityList.length; i++) {

                var _data = options.cityList.CityList[i];
                if (typeof (_data) != 'undefined') {
                    if (_data.NameCn.indexOf(value) >= 0 || _data.NameEn.indexOf(value) >= 0) {
                        isHave = true;
                        _tmp.push(_data);
                    }
                }
            }
            ;
            if (isHave) {
                city_container.empty();
                for (var i = 0; i < _tmp.length; i++) {
                    var _data = _tmp[i];
                    city_container.append("<dt class='lx_bdb1 lx_pdtb10' id='" + _data.AreaID + "'data-areaname='" + _data.NameCn + "'><span class='cityfont'>" + _data.SuggesText + "</span></a></dt>");
                }

            } else {
                city_container.html("<dt><span>对不起,找不到" + value + "</span></dt>");
            }
            suggestMain.show();
        }

        function onSelect() {
            //if( typeof options.onSelect == 'function'){
            //alert(1);
            //}

            //options.onSelect();
        }


    }
    $.fn.querycity = function (options) {
        var defaults = {
            'cityList': {},
            'hotList': {}
        };
        var options = $.extend(defaults, options);
        this.each(function () {
            new $.querycity(this, options);
        });
        return this;
    };
})(Zepto);
(function ($) {
    $.fn.bgIframe = $.fn.bgiframe = function (s) {
        if ($.support && /6.0/.test(navigator.userAgent)) {
            s = $.extend({
                top: 'auto', // auto == .currentStyle.borderTopWidth
                left: 'auto', // auto == .currentStyle.borderLeftWidth
                width: 'auto', // auto == offsetWidth
                height: 'auto', // auto == offsetHeight
                opacity: true,
                src: 'javascript:false;'
            }, s || {});
            var prop = function (n) { return n && n.constructor == Number ? n + 'px' : n; },
                html = '<iframe class="bgiframe"frameborder="0"tabindex="-1"src="' + s.src + '"' +
                           'style="display:block;position:absolute;z-index:-1;' +
                               (s.opacity !== false ? 'filter:Alpha(Opacity=\'0\');' : '') +
                               'top:' + (s.top == 'auto' ? 'expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)||0)*-1)+\'px\')' : prop(s.top)) + ';' +
                               'left:' + (s.left == 'auto' ? 'expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth)||0)*-1)+\'px\')' : prop(s.left)) + ';' +
                               'width:' + (s.width == 'auto' ? 'expression(this.parentNode.offsetWidth+\'px\')' : prop(s.width)) + ';' +
                               'height:' + (s.height == 'auto' ? 'expression(this.parentNode.offsetHeight+\'px\')' : prop(s.height)) + ';' +
                        '"/>';
            return this.each(function () {
                // if ($('> iframe.bgiframe', this).length == 0)
                //this.insertBefore(document.createElement(html), this.firstChild);
            });
        }
        return this;
    };
})(Zepto);

var weatherList = {};

WeaherList =
    [{
        code: '00',
        en: 'Sunny',
        cn: '晴',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w0.png';
            else
                return '/Images/w30.png';
        }
    }, {
        code: '01',
        en: 'Cloudy',
        cn: '多云',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w1.png';
            else
                return '/Images/w31.png';
        }
    },
    {
        code: '02',
        en: 'Overcast',
        cn: '阴',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w2.png';
            else
                return '/Images/w2.png';
        }
    }, {
        code: '03',
        en: 'Shower',
        cn: '阵雨',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w77.png';
            else
                return '/Images/w77.png';
        }
    },
    {
        code: '04',
        en: 'Thundershower',
        cn: '雷阵雨',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w5.png';
            else
                return '/Images/w5.png';
        }
    }, {
        code: '05',
        en: 'Thundershower with hail',
        cn: '雷阵雨伴有冰雹',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w5.png';
            else
                return '/Images/w5.png';
        }
    },
    {
        code: '06',
        en: 'Sleet',
        cn: '雨夹雪',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w6.png';
            else
                return '/Images/w6.png';
        }
    }, {
        code: '07',
        en: 'Light rain',
        cn: '小雨',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w77.png';
            else
                return '/Images/w77.png';
        }
    },
    {
        code: '08',
        en: 'Moderate rain',
        cn: '中雨',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w7.png';
            else
                return '/Images/w7.png';
        }
    }, {
        code: '09',
        en: 'Heavy rain',
        cn: '大雨',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w8.png';
            else
                return '/Images/w8.png';
        }
    },
    {
        code: '10',
        en: 'Storm',
        cn: '暴雨',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w9.png';
            else
                return '/Images/w9.png';
        }
    }, {
        code: '11',
        en: 'Heavy storm',
        cn: '大暴雨',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w10.png';
            else
                return '/Images/w10.png';
        }
    },
    {
        code: '12',
        en: '特大暴雨',
        cn: 'Severe storm',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w10.png';
            else
                return '/Images/w10.png';
        }
    }, {
        code: '13',
        en: 'Snow flurry',
        cn: '阵雪',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w101.png';
            else
                return '/Images/w30.png';
        }
    },
    {
        code: '14',
        en: 'Light snow',
        cn: '小雪',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w0.png';
            else
                return '/Images/w30.png';
        }
    }, {
        code: '15',
        en: 'Moderate snow',
        cn: '中雪',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w0.png';
            else
                return '/Images/w30.png';
        }
    }, {
        code: '16',
        en: 'Heavy snow',
        cn: '大雪',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w0.png';
            else
                return '/Images/w30.png';
        }
    }, {
        code: '17',
        en: 'Snowstorm',
        cn: '暴雪',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w0.png';
            else
                return '/Images/w30.png';
        }
    },
    {
        code: '18',
        en: 'Foggy',
        cn: '雾',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w0.png';
            else
                return '/Images/w30.png';
        }
    }, {
        code: '19',
        en: 'Ice rain',
        cn: '冻雨',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w0.png';
            else
                return '/Images/w30.png';
        }
    },
    {
        code: '20',
        en: 'Duststorm',
        cn: '沙尘暴',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w0.png';
            else
                return '/Images/w30.png';
        }
    }, {
        code: '21',
        en: 'Light to moderate rain',
        cn: '小到中雨',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w0.png';
            else
                return '/Images/w30.png';
        }
    },
    {
        code: '22',
        en: 'Moderate to heavy rain',
        cn: '中到大雨',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w0.png';
            else
                return '/Images/w30.png';
        }
    }, {
        code: '23',
        en: 'Heavy rain to storm',
        cn: '小雨',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w0.png';
            else
                return '/Images/w30.png';
        }
    },
    {
        code: '24',
        en: 'Storm to heavy storm',
        cn: '暴雨到大暴雨',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w0.png';
            else
                return '/Images/w30.png';
        }
    }, {
        code: '25',
        en: 'Heavy to severe storm',
        cn: '大雨',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w0.png';
            else
                return '/Images/w30.png';
        }
    },
    {
        code: '26',
        en: 'Light to moderate snow',
        cn: '小到中雪',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w0.png';
            else
                return '/Images/w30.png';
        }
    }, {
        code: '27',
        en: 'Moderate to heavy snow',
        cn: '中到大雪',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w0.png';
            else
                return '/Images/w30.png';
        }
    },
    {
        code: '28',
        en: 'Heavy snow to snowstorm',
        cn: '大到暴雪',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w0.png';
            else
                return '/Images/w30.png';
        }
    }, {
        code: '29',
        en: 'Dust',
        cn: '浮尘',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w0.png';
            else
                return '/Images/w30.png';
        }
    },
    {
        code: '30',
        en: 'Sand',
        cn: '扬沙',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w0.png';
            else
                return '/Images/w30.png';
        }
    }, {
        code: '31',
        en: 'Sandstorm',
        cn: '强沙尘暴',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w0.png';
            else
                return '/Images/w30.png';
        }
    }, {
        code: '53',
        en: 'Haze',
        cn: '霾',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w0.png';
            else
                return '/Images/w30.png';
        }
    },
    {
        code: '99',
        en: 'Unknown',
        cn: '无',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w0.png';
            else
                return '/Images/w30.png';
        }
    }, {
        code: '32',
        en: 'Dense fog',
        cn: '浓雾',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w0.png';
            else
                return '/Images/w30.png';
        }
    },
    {
        code: '49',
        en: 'Strong fog',
        cn: '强浓雾',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w0.png';
            else
                return '/Images/w30.png';
        }
    }, {
        code: '54',
        en: 'Moderate haze',
        cn: '中度霾',
        imgsrc: '/Images/w30.png'
    },
    {
        code: '55',
        en: 'Severe haze',
        cn: '重度霾',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w0.png';
            else
                return '/Images/w30.png';
        }
    }, {
        code: '56',
        en: 'Severe haze',
        cn: '严重霾',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w0.png';
            else
                return '/Images/w30.png';
        }
    },
    {
        code: '57',
        en: 'Dense fog',
        cn: '大雾',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w0.png';
            else
                return '/Images/w30.png';
        }
    }, {
        code: '58',
        en: 'Extra heavy fog',
        cn: '大雨',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w0.png';
            else
                return '/Images/w30.png';
        }
    },
    {
        code: '301',
        en: 'rain',
        cn: '雨',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w0.png';
            else
                return '/Images/w30.png';
        }
    }, {
        code: '302',
        en: 'snow',
        cn: '雪',
        imgsrc: function (i) {
            if (i > 0)
                return '/Images/w0.png';
            else
                return '/Images/w30.png';
        }
    }];
(function ($) {
    WeaherList.findSingle = function (code) {
        //$.each(this, function (index, item) {
        //    if (item.code == code)
        //        return item;
        //});

        for (var i = 0; i < this.length; i++) {
            if (this[i].code == code)
                return this[i];
        }
    }
})($);

