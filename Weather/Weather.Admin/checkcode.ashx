<%@ WebHandler Language="C#" Class="checkcode" %>

using System;
using System.Drawing;
using System.Web;

using App;
using App.Data;
using App.Resources;
using App.Services;


public class checkcode : IHttpHandler {
	
	public void ProcessRequest (HttpContext context) {
		string purpose = context.Request["p"] ?? "Password";
		int length = 4;
		if (context.Request["l"] != null)
		{
			int.TryParse(context.Request["l"], out length);
		}
		string cc = this.CreateRandomCode(length);
		using (DataContext dc = context.NewDataContext(false))
		{
			if (!Resource.IsNullOrEmpty(dc.Session))
			{
				dc.Session.SetState(dc, purpose + "Checkcode", cc);
			}
		}
		CreateImage(context, cc);
	}
	
	
	public bool IsReusable {
		get {
			return true;
		}
	}


	private string CreateRandomCode(int codeCount)
	{
		string allChar = "0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";
		string[] allCharArray = allChar.Split(',');
		string randomCode = "";
		int temp = -1;

		Random rand = new Random();
		for (int i = 0; i < codeCount; i++)
		{
			if (temp != -1)
			{
				rand = new Random(i * temp * ((int)DateTime.Now.Ticks));
			}
			int t = rand.Next(36);
			if (temp != -1 && temp == t)
			{
				return CreateRandomCode(codeCount);
			}
			temp = t;
			randomCode += allCharArray[t];
		}
		return randomCode;
	}

	
	private void CreateImage(HttpContext context, string checkCode)
	{
		System.Drawing.Bitmap image = new System.Drawing.Bitmap(Convert.ToInt32(Math.Ceiling((decimal)(checkCode.Length * 14))), 22);
		Graphics g = Graphics.FromImage(image);

		try
		{
			Random random = new Random();
			g.Clear(Color.AliceBlue);

			for (int i = 0; i < 25; i++)
			{
				int x1 = random.Next(image.Width);
				int x2 = random.Next(image.Width);
				int y1 = random.Next(image.Height);
				int y2 = random.Next(image.Height);

				g.DrawLine(new Pen(Color.Silver), x1, y1, x2, y2);
			}

			Font font = new System.Drawing.Font("Comic Sans MS", 12, System.Drawing.FontStyle.Bold);
			System.Drawing.Drawing2D.LinearGradientBrush brush = new System.Drawing.Drawing2D.LinearGradientBrush(new Rectangle(0, 0, image.Width, image.Height), Color.Blue, Color.DarkRed, 1.2f, true);
			g.DrawString(checkCode, font, new SolidBrush(Color.Red), 2, 2);

			for (int i = 0; i < 100; i++)
			{
				int x = random.Next(image.Width);
				int y = random.Next(image.Height);

				image.SetPixel(x, y, Color.FromArgb(random.Next()));
			}
			g.DrawRectangle(new Pen(Color.Silver), 0, 0, image.Width - 1, image.Height - 1);

			System.IO.MemoryStream ms = new System.IO.MemoryStream();
			image.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
			
			context.Response.ClearContent();
			context.Response.ContentType = "image/Png";
			context.Response.BinaryWrite(ms.ToArray());
		}
		finally
		{
			g.Dispose();
			image.Dispose();
		}
	} 
	
	
}