using App.Windows.Controls;
using System;
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
    public class PointRecordPage: App.Windows.Controls.Page
    {
        private DataGrid<PointRecord> dataGrid;
        public PointRecordPage()
        {
            this.dataGrid = new DataGrid<PointRecord>();
            this.dataGrid.AddColumns(r => new object[] { r.Member.Name,r.Member.Mobile,r.PointType,r.PointValue,r.Description});
            var ffb = this.dataGrid.FilterFormBuilder;
            this.dataGrid.FilterContent = new WrapPanel()
            {
                Children =
                {
                    ffb.Label(r=>r.Member),ffb.Input(r=>r.Member),
                    ffb.Label(r=>r.PointType),ffb.Input(r=>r.PointType),
                    ffb.Button(),
                }
            };
            this.Content = this.dataGrid;
        }
    }
}
