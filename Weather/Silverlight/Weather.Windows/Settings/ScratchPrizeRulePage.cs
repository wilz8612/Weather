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

namespace Weather.Windows
{
    public class ScratchPrizeRulePage: App.Windows.Controls.Page
    {
        private DataGrid<ScratchPrizeRule> dataGrid;
        public ScratchPrizeRulePage()
        {
            this.dataGrid = new DataGrid<ScratchPrizeRule>();
            this.dataGrid.AddColumns(r => new object[] { r.Name,r.PrizeType,r.PrizeValue,r.Chance,r.ConsumePoints,r.Description});
            this.dataGrid.Commands = new List<CommandInfo>()
            {
                new CommandInfo() { Content="新增",TargetOptions= CommandTargetOptions.Any,Handler =Add },
                new CommandInfo() { Content="修改",TargetOptions= CommandTargetOptions.Any,Handler =Edit },
                 new CommandInfo() { Content="删除",TargetOptions= CommandTargetOptions.Any,Handler =Delete }
            };
            var ffb = this.dataGrid.FilterFormBuilder;
            this.dataGrid.FilterContent = new WrapPanel()
            {
                Children =
                {
                    ffb.Label(r=>r.PrizeType),ffb.Input(r=>r.PrizeType),
                    ffb.Button(),
                }
            };
            this.Content = this.dataGrid;
        }

        public void Add()
        {
            FormBuilder<ScratchPrizeRule> formBuilder = new FormBuilder<ScratchPrizeRule>();
            var dlg = new TaskDialog
            {
                Title = "增加",
                Content = FormProvider.ScratchPrizeForm(formBuilder),
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
            FormBuilder<ScratchPrizeRule> formBuilder = new FormBuilder<ScratchPrizeRule>(this.dataGrid.SelectedItem);
            var dlg = new TaskDialog
            {
                Title = "修改",
                Content = FormProvider.ScratchPrizeForm(formBuilder),
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
            if (UI.Confirm("是否删除已选的货品？"))
            {
                SC.DirectDelete<ScratchPrizeRule>(r => r == this.dataGrid.SelectedItem);
                this.dataGrid.Refresh();
            }
        }
    }
}
