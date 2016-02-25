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

        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 测试
        /// </summary>
        /// <param name="condition"></param>
        /// <returns></returns>
        public ActionResult Test(string condition)
        {

            return Json(CommonService.Test());
        }

    }
}
