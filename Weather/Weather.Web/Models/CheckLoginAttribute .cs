using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using App.Services;
using App.Data;
using Weather.Services;

namespace Weather.Web
{
    public class CheckLoginAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            string domainName = filterContext.HttpContext.Request.Url.Authority;
            //FileLogHelper.WriteLog("域名：" + domainName);
            string controllerName = filterContext.RouteData.Values["controller"].ToString();
            string actionName = filterContext.RouteData.Values["action"].ToString();
            string redirectURI = System.Web.HttpUtility.UrlEncode($"http://{domainName}/{controllerName}/{actionName}");
            using (DataContext dc = HttpContext.Current.NewDataContext(false))
            {
                if (Resource.IsNullOrEmpty(dc.Session)) //没有登录，找微信openID
                {
                    LogHelper.WriteLog("检查登录开始");
                    string sid = HttpContext.Current.GetSessionID();
                    LogHelper.WriteLog(string.IsNullOrEmpty(sid) ? "sessionID为空" : "sessionID:" + sid);
                    string weixinOpenID = InfoLeader.Web.CookieHelper.GetCookie("WeixinOpenID");
                    if (!string.IsNullOrEmpty(weixinOpenID))//cookie找到微信openID，自动登录
                    {
                        LogHelper.WriteLog("从cookie里找到微信openid");
                        UserService.SignIn(dc, weixinOpenID);
                        filterContext.Result = new RedirectResult($"http://{domainName}/{controllerName}/{actionName}?wxopenID={weixinOpenID}");
                    }
                    else
                    {
                        LogHelper.WriteLog("没有从cookie里找到微信openid");
                        string code = InfoLeader.Web.RequestHelper.GetString("code");
                        string wxopenID = InfoLeader.Web.RequestHelper.GetString("wxopenID");
                        if (string.IsNullOrEmpty(wxopenID))
                        {
                            if (!string.IsNullOrEmpty(code))// 微信授权跳转回来
                            {
                                var res = UserService.WeiXinLogin(dc, code);
                                // string finalURI = string.Format("http://{0}/{1}/{2}?wxopenID={3}", domainName, controllerName, actionName, res.Item2);
                                filterContext.Result = new RedirectResult(redirectURI);
                            }

                            filterContext.Result = new RedirectResult($"https://{WeiXinHelper.WeiXin_Domain}/connect/oauth2/authorize?appid={WeiXinHelper.Appid}&redirect_uri={redirectURI}&response_type=code&scope=snsapi_base&state=hsx#wechat_redirect");
                        }
                    }
                }

                else {
                    LogHelper.WriteLog("已登录");
                }
            }

        }
    }
}
