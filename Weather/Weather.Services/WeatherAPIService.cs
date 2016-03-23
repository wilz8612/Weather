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
    public class WeatherAPIService
    {
        private const string Weaher_APIPath = "http://open.weather.com.cn/data/";
        private const string appid = "b173434a632aad58";
        private const string key = "weixinapp_webapi_data";

        /// <summary>
        /// 
        /// </summary>
        /// <param name="areaId"></param>
        /// <returns></returns>
        public static WeatherModel GetWeatherData(string areaId = "101010100")
        {
            var enc = Encoding.UTF8;
            var date = DateTime.Now;//ToString("yyyyMMddHHmm");
            string queryDate = string.Empty;
            //if (date.Hour >= 18)
            //    queryDate = date.AddDays(-1).ToString("yyyyMMdd10mm");//date.ToString("yyyyMMdd11mm");
            //else
            queryDate = date.ToString("yyyyMMddhhmm");
            HMACSHA1 hmac = new HMACSHA1(enc.GetBytes(key));
            hmac.Initialize();
            byte[] buffer = enc.GetBytes(Weaher_APIPath + "?areaid=" + areaId + "&type=forecast5d&date=" + queryDate + "&appid=" + appid);
            string k = System.Web.HttpUtility.UrlEncode(Convert.ToBase64String(hmac.ComputeHash(buffer)));
            var m = HttpClientHelper.GetResponse<WeatherModel>(Weaher_APIPath + "?areaid=" + areaId + "&type=forecast5d&date=" + queryDate + "&appid=" + appid.Substring(0, 6) + "&key=" + k);
            return m;
        }

    }
}
