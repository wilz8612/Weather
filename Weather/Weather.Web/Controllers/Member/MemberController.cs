using App.Data;
using App.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Weather.Web.Controllers
{
    public class MemberController : ControllerBase
    {
        [CheckLogin]
        public ActionResult MemberCenter()
        {
            if (Resource.IsNullOrEmpty(base.LoginMember))
            {
                Services.LogHelper.WriteLog("用户为空！");
            }
            return View(base.LoginMember);
        }

        /// <summary>
        /// 登录授权
        /// </summary>
        /// <returns></returns>
        public ActionResult OAuthLogin(string code = "")
        {
            using (DataContext dc = System.Web.HttpContext.Current.NewDataContext(false))
            {
                if (!string.IsNullOrEmpty(code))//微信入口
                {
                    if (Resource.IsNullOrEmpty(base.LoginMember))//未登录
                    {
                        if (base.WeiXinLogin(dc, code))//微信登录成功
                        {
                            Services.LogHelper.WriteLog(this.LoginMember.NickName);
                            return View("MemberCenter",this.LoginMember);
                        }
                        else //普通登录
                        {
                            return RedirectToAction("Login", "Member");
                        }

                    }
                    else //已经登录直接返回原地址
                    {
                        return View("MemberCenter", this.LoginMember);
                    }
                }
                else //普通登录入口
                {

                    return RedirectToAction("Login", "Member");
                }
            }

        }

        public ActionResult Login()
        {
            return View();
        }
    }
}
