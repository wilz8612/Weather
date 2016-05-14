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
using Weather.Members;

namespace Weather.Windows
{
    public class MemberPage:App.Windows.Controls.Page
    {
        private DataGrid<Member> dataGrid;
        public MemberPage()
        {
            this.dataGrid = new DataGrid<Member>();
            this.dataGrid.AddColumns(r => new object[] { r.Code, r.Name, r.NickName,r.Mobile,r.Email,r.City,r.PointsValueTotal,r.PointsValueConsume});
            var ffb= this.dataGrid.FilterFormBuilder;
            this.dataGrid.FilterContent = new WrapPanel()
            {
                Children =
                {
                    ffb.Label(r=>r.Mobile),ffb.Input(r=>r.Mobile),
                    ffb.Label(r=>r.City),ffb.Input(r=>r.City),
                    ffb.Button(),
                }
            };
            this.Content = this.dataGrid;
        }
    }
}
