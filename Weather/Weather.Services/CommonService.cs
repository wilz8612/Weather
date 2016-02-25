using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using App;
using App.Data;
using App.Services;
using App.Resources;


namespace Weather.Services
{
    [Service]
    public static class CommonService
    {

        public static void ServiceMethod(DataContext dc)
        {

        }


        public static object Test()
        {
            using (DataContext dc = new DataContext())
            {
                ResSet<User> r = dc.Select<User>();
                //dc.Commit();
                return new object();
            }
        }
    }
}