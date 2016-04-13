using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using App.Services;
using App.Data;

namespace Weather.Web
{
    public class CheckLoginAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            using (DataContext dc = HttpContext.Current.NewDataContext(false))
            {
                if (Resource.IsNullOrEmpty(dc.Session)) //没有登录，跳转授权登录
                {
                    Services.LogHelper.WriteLog("检查登录开始");
                    string sid = HttpContext.Current.GetSessionID();
                    Services.LogHelper.WriteLog(string.IsNullOrEmpty(sid) ? "sessionID为空" : "sessionID:" + sid);
                    //if (HttpContext.Current.Session["a"] == null)
                    //filterContext.HttpContext.Response.Redirect("Login/index2?controllName=Home&actionName=index");
                    string code = InfoLeader.Web.RequestHelper.GetString("code");
                    Services.LogHelper.WriteLog("CODE：" + code);
                    // filterContext.HttpContext.Response.RedirectToRoute(new { controller = "OAuthCom", action = "OAuthLogin", code = filterContext.HttpContext.Request.QueryString["code"].ToString(), ctlerName = filterContext.RouteData.Values["controller"].ToString(), actionName = filterContext.RouteData.Values["action"].ToString() });
                    filterContext.HttpContext.Response.Redirect(string.Format("/Member/OAuthLogin?code={0}", code));

                    //filterContext.HttpContext.Response.Redirect(string.Format("/OAuthCom/OAuthLogin?ctlerName={0}&actionName={1}",filterContext.RouteData.Values["controller"].ToString(), filterContext.RouteData.Values["action"].ToString()));
                }

                else {
                    Services.LogHelper.WriteLog("已登录");
                }
            }
            base.OnActionExecuting(filterContext);

        }
    }
}
