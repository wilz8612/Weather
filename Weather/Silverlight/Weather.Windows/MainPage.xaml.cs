using System;
using System.Collections.Generic;
using System.Windows;
using System.Windows.Controls;

using App;
using App.Data;
using App.Services;
using App.Windows;
using App.Windows.Controls;


namespace Weather.Windows
{
    public partial class MainPage : MainPageBase
    {
        public MainPage()
        {
            InitializeComponent();
            SubscribeEvents();
        }


        public override string ProjectName
        {
            get
            {
                return SR.ProjectName;
            }
        }


        public override AddressBar AddressBar
        {
            get
            {
                return ab;
            }
        }

        public override Frame Frame
        {
            get
            {
                return frame;
            }
        }


        private void Refresh(object sender, RoutedEventArgs e)
        {
            Refresh();
        }


        private void ChangePassword(object sender, RoutedEventArgs e)
        {
            ChangePassword();
        }


        private void SignOut(object sender, RoutedEventArgs e)
        {
            SignOut();
        }


        protected override void OnSignIn(bool isSessionTimeout)
        {
            base.OnSignIn(isSessionTimeout);
            UserName.Text = SC.User.Name;
        }


        private void ShowAbout(object sender, AddressItemEventArgs e)
        {
            ShowAbout();
        }
    }
}
