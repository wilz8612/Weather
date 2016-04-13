using App.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace Weather.Web
{
    // 注意: 有关启用 IIS6 或 IIS7 经典模式的说明，
    // 请访问 http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            ServiceEnvironment.SetApplication(new WebApplication());

            ServiceRuntime.Instance.Start();
        }
        void Application_End(Object sender, EventArgs e)
        {
            ServiceRuntime.Instance.Stop();
        }

        class WebApplication : ServiceApplication
        {
            public override ServiceHostingType HostingType
            {
                get
                {
                    return ServiceHostingType.Web;
                }
            }
        }
    }
}