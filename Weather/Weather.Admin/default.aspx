<%@ Page Language="C#" AutoEventWireup="true" EnableSessionState="false" EnableViewState="false" Buffer="true"  CodeFile="default.aspx.cs" Inherits="_default" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
  <title>能装.运营调度管理</title>
  <style type="text/css">
  html, body {
	  height: 100%;
	  overflow: auto;
  }
  body {
	  padding: 0;
	  margin: 0;
  }
  #silverlightControlHost {
	  height: 100%;
	  text-align:center;
  }
  </style>
     <link href="http://cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.css" rel="stylesheet"/>
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="http://cdn.bootcss.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="http://cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
   <script language="javascript" type="text/javascript" src="/scripts/jquery-2.0.3.min.js" ></script>
  <script type="text/javascript" src="Silverlight.js"></script>
  <script type="text/javascript">
      function OpenHtmlPage(url) {
          window.open(url, "_blank");
      }
    function onSilverlightError(sender, args) {
      var appSource = "";
      if (sender != null && sender != 0) {
       appSource = sender.getHost().Source;
      }
      
      var errorType = args.ErrorType;
      var iErrorCode = args.ErrorCode;

      if (errorType == "ImageError" || errorType == "MediaError") {
       return;
      }

      var errMsg = "Silverlight 应用程序中未处理的错误 " + appSource + "\n" ;

      errMsg += "代码: "+ iErrorCode + "  \n";
      errMsg += "类别: " + errorType + "    \n";
      errMsg += "消息: " + args.ErrorMessage + "   \n";

      if (errorType == "ParserError") {
        errMsg += "文件: " + args.xamlFile + "   \n";
        errMsg += "行: " + args.lineNumber + "   \n";
        errMsg += "位置: " + args.charPosition + "   \n";
      }
      else if (errorType == "RuntimeError") {      
        if (args.lineNumber != 0) {
          errMsg += "行: " + args.lineNumber + "   \n";
          errMsg += "位置: " + args.charPosition + "   \n";
        }
        errMsg += "方法名称: " + args.methodName + "   \n";
      }

      throw new Error(errMsg);
    }
    function showWebPage(url, pagewidth, pageheight) {
        $("#btnModel").click();
    }
    function hideWebPage() {
        $('#iframe').css("visibility", "hidden");
        $('#gpsPage').attr("src", "");
    }
  </script>
</head>
<body>
  <form id="form1" runat="server" style="height:100%">
  <div id="silverlightControlHost">
    <object data="data:application/x-silverlight-2," type="application/x-silverlight-2" width="100%" height="100%">
		 <param name="source" value="/ClientBin/Weather.Windows.xap"/>
		 <param name="onError" value="onSilverlightError" />
		 <param name="background" value="white" />
          <%--<param name="windowless" value="true"/>--%>  
		 <param name="minRuntimeVersion" value="5.0.61118.0" />
		 <param name="autoUpgrade" value="true" />
		 <a href="http://go.microsoft.com/fwlink/?LinkID=149156&v=5.0.61118.0" style="text-decoration:none">
 			 <img src="http://go.microsoft.com/fwlink/?LinkId=161376" alt="获取 Microsoft Silverlight" style="border-style:none"/>
		 </a>
	  </object><iframe id="_sl_historyFrame" style="visibility:hidden;height:0px;width:0px;border:0px"></iframe></div>
  </form>
</body>
</html>
