<%@ WebHandler Language="C#" Class="upload" %>

using System;
using System.IO;
using System.Text;
using System.Web;

using App.Data;
using App.Data.Storage;


public class upload : IHttpHandler
{

	public void ProcessRequest(HttpContext context)
	{
		context.Response.ContentType = "text/plain";
		
		string t = context.Request.Params["t"];
		if (context.Request.Files.Count > 0)
		{
			context.Response.ContentType = "text/html;charset=utf-8";
			StringBuilder buf = new StringBuilder(300);
			
			buf.Append("<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.0 Transitional//EN\" >");
			buf.Append("<html>");
			buf.Append("<head>");
			buf.Append("<title></title>");
			buf.Append("</head>");
			buf.Append("<body>");
			buf.Append("<RESULT>");
			try
			{
				int count = context.Request.Files.Count;
				for (int i = 0; i < count; i++)
				{
					if (!string.IsNullOrEmpty(context.Request.Files[i].FileName))
					{
						buf.Append("<FILE>" + FileStorer.Save(context.Request.Files[i], t) + "</FILE>");
						buf.Append("<FILENAME>" + context.Request.Files[i].FileName + "</FILENAME>");
					}
				}
			}
			catch (Exception ex)
			{
				buf.Append("<FAULT><![CDATA[" + ex.ToString() + "]]></FAULT>");
			}
			buf.Append("</RESULT>");
			buf.Append("</body>");
			buf.Append("</html>");

			context.Response.Write(buf.ToString());
		}
		else
		{
			string f = context.Request.Params["f"];
			if (!string.IsNullOrEmpty(f))
			{
				string basepath;
				string extension = Path.GetExtension(f);
				string fileName = FileStorer.GetRelativeFileName(t, extension, out basepath);
			
				using (FileStream fs = new FileStream(basepath + fileName, FileMode.Create, FileAccess.Write))
				{
					context.Request.InputStream.CopyTo(fs);
				}
			
				context.Response.Write(fileName);
			}
		}
	}
	
	
	public bool IsReusable
	{
		get
		{
			return true;
		}
	}
}