<%@ Application Language="C#" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Web.Hosting" %>
<%@ Import Namespace="App" %>
<%@ Import Namespace="App.Diagnostics" %>
<%@ Import Namespace="App.Configuration" %>
<%@ Import Namespace="App.Services" %>


<script runat="server">
	LoggingWriter consoleWriter;
	
    void Application_Start(Object sender, EventArgs e) {
		ServiceEnvironment.SetApplication(new WebApplication());
		
		consoleWriter = new LoggingWriter("console");
		Console.SetOut(consoleWriter);
		
		ServiceRuntime.Instance.Start();
    }
    
    void Application_End(Object sender, EventArgs e) {
        ServiceRuntime.Instance.Stop();
        consoleWriter.Close();
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
</script>
