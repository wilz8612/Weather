using System;
using System.Collections.Generic;
using System.IO;
using System.IO.IsolatedStorage;
using System.Linq;
using System.Net;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;

using App;
using App.Data;
using App.Resources;
using App.Services;
using App.Windows;


namespace Weather.Windows
{
    public partial class Program : Application
    {
        public Program()
        {
            this.Startup += this.Application_Startup;
            this.Exit += this.Application_Exit;
            this.UnhandledException += this.Application_UnhandledException;

            InitializeComponent();
        }


        private void Application_Startup(object sender, StartupEventArgs e)
        {
            this.ProcessStartup();
            this.RootVisual = new MainPage();
        }


        private void Application_Exit(object sender, EventArgs e)
        {
            this.ProcessExit();
        }


        private void Application_UnhandledException(object sender, ApplicationUnhandledExceptionEventArgs e)
        {
            this.ProcessException(e);
        }
    }
}
