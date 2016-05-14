using System;

using App;
using App.Services;


public partial class _default : System.Web.UI.Page
{
	protected void Page_Load(object sender, EventArgs e)
	{
		string i = Request.Params["i"];
		string r = Request.Params["r"];
		if (!RandomID.IsLegal(i))
		{
			i = RandomID.New();
			Response.Redirect("default.aspx?i=" + i + (string.IsNullOrEmpty(r) ? string.Empty : "&r=" + Server.UrlEncode(r)));
		}
	}
}
