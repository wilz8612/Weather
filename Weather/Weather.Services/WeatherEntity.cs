using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Weather.Services
{
    public class C
    {
        /// <summary>
        /// 区域 ID
        /// </summary>
        public string c1 { get; set; }
        /// <summary>
        /// 城市英文名
        /// </summary>
        public string c2 { get; set; }
        /// <summary>
        /// 城市中文名
        /// </summary>
        public string c3 { get; set; }
        /// <summary>
        /// 城市所在市英文名
        /// </summary>
        public string c4 { get; set; }
        /// <summary>
        /// 城市所在市中文名
        /// </summary>
        public string c5 { get; set; }
        /// <summary>
        /// 城市所在省英文名
        /// </summary>
        public string c6 { get; set; }
        /// <summary>
        /// 城市所在省中文名
        /// </summary>
        public string c7 { get; set; }
        /// <summary>
        /// 城市所在国家英文名
        /// </summary>
        public string c8 { get; set; }
        /// <summary>
        /// 城市所在国家中文名
        /// </summary>
        public string c9 { get; set; }
        /// <summary>
        /// 城市级别
        /// </summary>
        public string c10 { get; set; }
        /// <summary>
        /// 区号
        /// </summary>
        public string c11 { get; set; }
        /// <summary>
        /// 邮编
        /// </summary>
        public string c12 { get; set; }
        /// <summary>
        /// 经度
        /// </summary>
        public double c13 { get; set; }
        /// <summary>
        /// 纬度
        /// </summary>
        public double c14 { get; set; }
        /// <summary>
        /// 海拔
        /// </summary>
        public string c15 { get; set; }
        /// <summary>
        /// 雷达站号
        /// </summary>
        public string c16 { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string c17 { get; set; }
    }

    public class F1Item
    {
        /// <summary>
        /// 白天天气现象编号
        /// </summary>
        public string fa { get; set; }
        /// <summary>
        /// 晚上天气现象编号
        /// </summary>
        public string fb { get; set; }
        /// <summary>
        /// 白天天气温度（摄氏度)
        /// </summary>
        public string fc { get; set; }
        /// <summary>
        /// 晚上天气温度（摄氏度）
        /// </summary>
        public string fd { get; set; }
        /// <summary>
        /// 白天风向编号
        /// </summary>
        public string fe { get; set; }
        /// <summary>
        /// 晚上风向编号
        /// </summary>
        public string ff { get; set; }
        /// <summary>
        /// 白天风力编号
        /// </summary>
        public string fg { get; set; }
        /// <summary>
        /// 晚上风力编号
        /// </summary>
        public string fh { get; set; }
        /// <summary>
        /// 日出日落时间
        /// </summary>
        public string fi { get; set; }
    }

    public class F
    {
        /// <summary>
        /// 
        /// </summary>
        public List<F1Item> f1 { get; set; }
        /// <summary>
        /// 预报发布时间
        /// </summary>
        public string f0 { get; set; }
    }

    [Serializable]
    public class WeatherModel
    {
        /// <summary>
        /// 
        /// </summary>
        public C c { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public F f { get; set; }
    }
}
