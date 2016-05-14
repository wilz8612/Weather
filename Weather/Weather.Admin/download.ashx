<%@ WebHandler Language="C#" Class="download" %>

using System;
using System.Collections;
using System.IO;
using System.Globalization;
using System.Text;
using System.Web;

using App;
using App.Configuration;
using App.Data.Storage;
using App.Web;


public class download : IHttpHandler
{
	private static Hashtable LimitedDir;
	
	static download()
	{
		LimitedDir = new Hashtable(10, StringComparer.CurrentCultureIgnoreCase);
		LimitedDir.Add("bin", true);
		LimitedDir.Add("config", true);
		LimitedDir.Add("log", true);
		LimitedDir.Add("obj", true);
		LimitedDir.Add("Properties", true);
		LimitedDir.Add("template", true);
		LimitedDir.Add("testing", true);	
	}
	
	
	public void ProcessRequest(HttpContext context)
	{
		var Request = context.Request;
		var Response = context.Response;
		
		string p = Request.QueryString["p"];
		string t = Request.QueryString["t"];
		string f = Request.QueryString["f"];
		string v = Request.QueryString["v"];
		string path;
		if (string.IsNullOrEmpty(t))
		{
			t = "attachments";
		}
		else
		{
			t = ProcessTarget(t);
		}
		
		if (!CanAccess(t.ToLower()))
		{
			Response.StatusCode = (int)System.Net.HttpStatusCode.NotFound;
			return;
		}
		
		path = FileStorer.GetDataDirectory(t) + Path.DirectorySeparatorChar + p;
		
		if (File.Exists(path))
		{
			FileInfo file = new FileInfo(path);
			if (f == null || f.Length == 0)
			{
				f = Path.GetFileName(path);
			}
			
			string charset = IsTextFile(file) ? GetTextFileEncoding(file).WebName : "utf-8";
			Response.ContentType = App.Web.MimeMapping.GetMime(f) + ";charset=" + charset;
			if (!string.IsNullOrEmpty(v) && v == "1")
			{
				Response.AddHeader("content-disposition", "filename=" + HttpUtility.UrlEncode(f, Encoding.UTF8));
			}
			else
			{
				Response.AddHeader("content-disposition", "attachment; filename=" + HttpUtility.UrlEncode(f, Encoding.UTF8));
			}
			
			int size = 1024;
			byte[] buf = new byte[size];
			int len;
			using (FileStream fs = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read))
			{
				Response.AddHeader("Content-Length", file.Length.ToString()); 
			    while ((len = fs.Read(buf, 0, size)) > 0)
			    {
					Response.OutputStream.Write(buf, 0, len);
			    }
			}
		}
		else
		{
			Response.StatusCode = (int)System.Net.HttpStatusCode.NotFound;
		}
	}
		
	
	public bool IsReusable
	{
		get
		{
			return true;
		}
	}
	
	
	private string ProcessTarget(string t)
	{
		string temp = t.Trim();
		int index;
		for (index = 0;index < temp.Length;index ++)
		{
			if (char.IsLetterOrDigit(temp[index])) break;
		}
		if (index > 0) temp = temp.Substring(index);
		for (index = temp.Length - 1;index >= 0;index --)
		{
			if (char.IsLetterOrDigit(temp[index])) break;
		}
		if (index != temp.Length - 1) temp = temp.Substring(0, index + 1);
		
		return temp;
	}
	
	
	private bool CanAccess(string t)
	{
		return LimitedDir[t] == null;
	}
	
	
	private bool IsTextFile(FileInfo file)
	{
		return file.Extension.ToUpper().Equals(".TXT");
	}
	
	
	private Encoding GetTextFileEncoding(FileInfo file)
	{
		using (StreamReader reader = new StreamReader(file.FullName, Encoding.Default, true))
		{
			reader.Read();
			return reader.CurrentEncoding;
		}
	}
}