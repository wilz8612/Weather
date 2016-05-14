<%@ WebHandler Language="C#" Class="service" %>

using System;
using System.IO;
using System.Text;
using System.Web;
using System.Web.Routing;

using App.Data.Serialization;
using App.Services;


public class service : ServiceHttpHandler, IHttpHandler
{

}