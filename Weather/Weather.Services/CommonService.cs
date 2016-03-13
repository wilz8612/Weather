using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using App;
using App.Data;
using App.Services;
using App.Resources;
using System.Data;


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
            try
            {
                using (DataContext dc = new DataContext())
                {
                    ResSet<User> r = dc.Select<User>();

                    //dc.Commit();
                    return new object();
                }
            }
            catch (Exception ex)
            {

                throw;
            }

        }

        public static string GetCityJsonStr()
        {
            DataTable dt = NPOIHelper.ExcelToDataTable("d:\\1.xls", "Sheet1");
            CitysEntity c = new CitysEntity() { CityList = new List<City>(), HotCityList = new List<City>() };
            foreach (DataRow dr in dt.Rows)
            {
                var city = new City()
                    {
                        NameCn = dr["NAMECN"].ToString(),
                        NameEn = dr["NAMEEN"].ToString(),
                        DistrictEn = dr["DISTRICTEN"].ToString(),
                        DistrictCn = dr["DISTRICTCN"].ToString(),
                        AreaID = dr["AREAID"].ToString(),
                        ProvCn = dr["PROVCN"].ToString(),
                        ProvEn = dr["PROVEN"].ToString(),
                        NationCn = dr["NATIONCN"].ToString(),
                        NationEn = dr["NATIONEN"].ToString()
                    };
                if (dr["hot"] != null && dr["hot"].ToString() == "1")//热门城市
                {
                    c.HotCityList.Add(city);
                }


                c.CityList.Add(city);



            }
            string r = Newtonsoft.Json.JsonConvert.SerializeObject(c);
            return r;
        }
    }
}