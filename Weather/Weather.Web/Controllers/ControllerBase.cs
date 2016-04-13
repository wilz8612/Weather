using App.Data;
using App.Resources;
using App.Services;
using Weather.Members;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Weather.Services;

namespace Weather.Web.Controllers
{
    /// <summary>
    /// 基础类
    /// </summary>
    public class ControllerBase : Controller
    {
        public User LoginUser;
        public Member LoginMember;

        public ControllerBase()
        {
            using (DataContext dc = System.Web.HttpContext.Current.NewDataContext(false))
            {
                if (!Resource.IsNullOrEmpty(dc.User))
                {
                    this.LoginMember = dc.SelectOne<Member>(r => r.Key == dc.User.Actor.Key);
                    this.LoginUser = dc.User;
                }
            }
        }

        /// <summary>
        /// 微信登录
        /// </summary>
        /// <param name="code"></param>
        public bool WeiXinLogin(DataContext dc, string code)
        {
            try
            {
                OAuth_Token token = WeiXinHelper.Get_token(code);
                OAuthUser OAuthUser_Model = WeiXinHelper.Get_UserInfo(token.access_token, token.openid);


                LogHelper.WriteLog("openID：" + OAuthUser_Model.openid);
                LogHelper.WriteLog("判断用户是否绑定微信开始");
                Member member = dc.SelectOne<Member>(r => r.WxOpenID == OAuthUser_Model.openid);
                LogHelper.WriteLog("判断用户是否绑定微信结束");
                if (Resource.IsNullOrEmpty(member))//第一次绑定
                {
                    member = new Member()
                    {
                        WxOpenID = OAuthUser_Model.openid,
                        City = OAuthUser_Model.city,
                        Country = OAuthUser_Model.country,
                        NickName = OAuthUser_Model.nickname,
                        Province = OAuthUser_Model.province,
                        Sex = OAuthUser_Model.sex,
                        Headimgurl = OAuthUser_Model.headimgurl
                    };

                    if (UserService.ResiterUser(dc, member))//授权注册成功
                    {
                        LogHelper.WriteLog("用户授权注册成功！");
                        if (UserService.SignIn(dc, member.WxOpenID,"111111"))//登录一次
                        {
                            LogHelper.WriteLog("用户登录成功！");
                            this.LoginMember = dc.SelectOne<Member>(r => r.WxOpenID == member.WxOpenID);
                           // this.LoginUser = dc.User;
                            return true;
                        }
                        else
                        {
                            LogHelper.WriteLog("用户登录失败！");
                            return false;
                        }

                    }
                    else
                    {
                        LogHelper.WriteLog("用户授权注册失败！");
                    }
                }
                else//授权绑定过 直接登录
                {
                    if (UserService.SignIn(dc, member.WxOpenID, "111111"))//openID直接登录
                    { 
                        LogHelper.WriteLog("用户直接登录成功！");
                        //if (Resource.IsNullOrEmpty(dc.Session.User))
                        //{
                        //    LogHelper.WriteLog("用户直接登录成功！但是dc的user为空");
                        //}
                        this.LoginMember = dc.SelectOne<Member>(r => r.Key == dc.Session.User.Actor.Key);
                        //this.LoginUser = dc.Session.User;
                        return true;
                    }
                }

                return false;
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog("微信授权登录异常：" + ex.Message);
                return false; ;
            }
        }

        /// <summary>
        /// 发生异常写Log
        /// </summary>
        /// <param name="filterContext"></param>
        protected override void OnException(ExceptionContext filterContext)
        {
            base.OnException(filterContext);
            var e = filterContext.Exception;
            string actionName = (string)filterContext.RouteData.Values["action"];
            string controllerName = (string)filterContext.RouteData.Values["controller"];
            LogHelper.WriteLog("控制器" + controllerName + "的Action（" + actionName + ")执行异常" + e.Message + "--" + e.StackTrace);
        }
    }
}
