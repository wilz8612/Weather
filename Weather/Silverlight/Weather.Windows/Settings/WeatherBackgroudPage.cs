using App.Resources.Windows;
using App.Services;
using App.Windows;
using App.Windows.Controls;
using System;
using System.Collections.Generic;
using System.Net;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Ink;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;
using Weather.Resources;

namespace Weather.Windows.Settings
{
    public class WeatherBackgroudPage: App.Windows.Controls.Page
    {
        private DataGrid<WeatherBackgroud> dataGrid;
        public WeatherBackgroudPage()
        {
            this.dataGrid = new DataGrid<WeatherBackgroud>();
            this.dataGrid.AddColumns(r => new object[] { r.Name, r.Path, r.AvilableTime });
            this.dataGrid.Commands = new List<CommandInfo>()
            {
                new CommandInfo() { Content="新增",TargetOptions= CommandTargetOptions.Any,Handler =Add },
                new CommandInfo() { Content="修改",TargetOptions= CommandTargetOptions.Any,Handler =Edit },
                 new CommandInfo() { Content="删除",TargetOptions= CommandTargetOptions.Any,Handler =Delete }
            };
            this.Content = this.dataGrid;
        }

        public void Add()
        {
            FormBuilder<WeatherBackgroud> formBuilder = new FormBuilder<WeatherBackgroud>();
            var dlg = new TaskDialog
            {
                Title = "增加",
                Content = FormProvider.WeatherBackgroudForm(formBuilder),
            };
            dlg.Buttons = TaskDialogButton.OK;
            dlg.OK += (src, arg) =>
            {
                if (formBuilder.Save())
                {
                    this.dataGrid.Refresh();
                    dlg.Close();
                }
            };
            dlg.Show();
        }

        public void Edit()
        {
            FormBuilder<WeatherBackgroud> formBuilder = new FormBuilder<WeatherBackgroud>(this.dataGrid.SelectedItem);
            var dlg = new TaskDialog
            {
                Title = "修改",
                Content = FormProvider.WeatherBackgroudForm(formBuilder),
            };
            dlg.Buttons = TaskDialogButton.OK;
            dlg.OK += (src, arg) =>
            {
                if (formBuilder.Save())
                {
                    this.dataGrid.Refresh();
                    dlg.Close();
                }
            };
            dlg.Show();
        }

        public void Delete()
        {
            if (UI.Confirm("是否删除已选？"))
            {
                SC.DirectDelete<ScratchPrizeRule>(r => r == this.dataGrid.SelectedItem);
                this.dataGrid.Refresh();
            }
        }
    }
}
