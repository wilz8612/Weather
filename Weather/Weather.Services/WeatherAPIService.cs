using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using InfoLeader;
using InfoLeader.Web;
using InfoLeader.Web.Request;
using System.Security.Cryptography;

namespace Weather.Services
{
    public static class WeatherAPIService
    {
        private const string Weaher_APIPath = "http://open.weather.com.cn/data/";
        private const string appid = "b173434a632aad58";
        private const string key = "weixinapp_webapi_data";

        public static string GetWeatherData()
        {
            var enc = Encoding.UTF8;
            HMACSHA1 hmac = new HMACSHA1(enc.GetBytes(key));
            hmac.Initialize();
            byte[] buffer = enc.GetBytes(Weaher_APIPath + "?areaid=101010100&type=forecast5d&date=201603021402&appid=" + appid);
            string k = System.Web.HttpUtility.UrlEncode(Convert.ToBase64String(hmac.ComputeHash(buffer)));

            WebRequestConfig config = new WebRequestConfig()
           {
               ContentType = "text/xml;Charset=UTF-8",
           };
            string r = InfoLeader.Web.Request.WebRequestClient.Instance.SendGet(Weaher_APIPath + "?areaid=101010100&type=forecast5d&date=201603021402&appid=b17343" + "&key=" + k, config);
            return r;
        }

    }
}
