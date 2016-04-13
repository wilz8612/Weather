using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Weather.Services;

namespace Weather.Web.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/
        public ActionResult Index(string cityCode, string cityName)
        {
            // var o= CommonService.Test();

            var s = CommonService.GetCityJsonStr();

            //string cityCode = Request["cityCode"].ToString();
            //string cityName = Request["cityName"].ToString();
            if (!string.IsNullOrEmpty(cityCode))
            {
                ViewBag.CityCode = cityCode;
                ViewBag.CityName = cityName;
                ViewBag.NeedLocation = 0;
            }
            else
            {
                ViewBag.NeedLocation = 1;
            }
            return View();
        }

        /// <summary>
        /// 获取天气
        /// </summary>
        /// <param name="condition"></param>
        /// <returns></returns>
        public ActionResult QueryWeather(string cityCode)
        {
            WeatherModel r = WeatherAPIService.GetWeatherData(cityCode);
            return Json(r);
        }

        public ActionResult CitySelect()
        {
            return View();
        }


        public ActionResult City()
        {

            return Content(CommonService.GetCityJsonStr());
        }

    }
}
