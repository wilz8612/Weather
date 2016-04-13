using InfoLeader.Web.Request;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Weather.Services
{
    public class WeiXinHelper
    {
        public const string Appid = "wx871db3d63f0b2e76";
        public const string appsecret = "2b5573e7a279e709ad20448affde9631";

        /// <summary>
        /// 获取用户授权Token  
        /// </summary>
        /// <param name="Code"></param>
        /// <returns></returns>
        public static OAuth_Token Get_token(string Code)
        {
            WebRequestConfig config = new WebRequestConfig()
            {
                ContentType = "text/html;Charset=UTF8",
            };
            string jsonStr = WebRequestClient.Instance.SendGet("https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + Appid + "&secret=" + appsecret + "&code=" + Code + "&grant_type=authorization_code", config, Encoding.UTF8);

            OAuth_Token Oauth_Token_Model = JsonConvert.DeserializeObject<OAuth_Token>(jsonStr);//HttpClientHelper.GetResponse<OAuth_Token>("https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + Appid + "&secret=" + appsecret + "&code=" + Code + "&grant_type=authorization_code");
            LogHelper.WriteLog("微信token：" + Oauth_Token_Model.access_token);
            return Oauth_Token_Model;
        }

        /// <summary>
        /// 获取用户信息
        /// </summary>
        /// <param name="TOKEN"></param>
        /// <param name="OPENID"></param>
        /// <returns></returns>
        public static OAuthUser Get_UserInfo(string TOKEN, string OPENID)
        {
            WebRequestConfig config = new WebRequestConfig()
            {
                ContentType = "text/html;Charset=UTF8",
            };
            string jsonStr = WebRequestClient.Instance.SendGet("https://api.weixin.qq.com/sns/userinfo?access_token=" + TOKEN + "&openid=" + OPENID + "&lang=zh_CN", config, Encoding.UTF8);
            var jsonSetting = new JsonSerializerSettings() { NullValueHandling = NullValueHandling.Ignore };
            OAuthUser OAuthUser_Model = JsonConvert.DeserializeObject<OAuthUser>(jsonStr);//HttpClientHelper.GetResponse<OAuthUser>("https://api.weixin.qq.com/sns/userinfo?access_token=" + TOKEN + "&openid=" + OPENID + "&lang=zh_CN");
            return OAuthUser_Model;
        }
    }
}
