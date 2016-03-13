using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Weather.Services
{
    [Serializable]
    public class CitysEntity
    {
        public List<City> HotCityList { get; set; }

        public List<City> CityList { get; set; }
    }

    public class City
    {
        /// <summary>
        /// ID
        /// </summary>
        public string AreaID { get; set; }
        /// <summary>
        /// 英文名
        /// </summary>
        public string NameEn { get; set; }

        /// <summary>
        /// 中文名
        /// </summary>
        public string NameCn { get; set; }

        /// <summary>
        /// 区/县(英文)
        /// </summary>
        public string DistrictEn { get; set; }

        /// <summary>
        /// 区/县（中文）
        /// </summary>
        public string DistrictCn { get; set; }

        /// <summary>
        /// 省英文
        /// </summary>
        [Newtonsoft.Json.JsonIgnore]
        public string ProvEn { get; set; }


        /// <summary>
        /// 省中文
        /// </summary>
        [Newtonsoft.Json.JsonIgnore]
        public string ProvCn { get; set; }


        /// <summary>
        /// 国家中文
        /// </summary>
        [Newtonsoft.Json.JsonIgnore]
        public string NationEn { get; set; }

        /// <summary>
        ///国家英文
        /// </summary>
        [Newtonsoft.Json.JsonIgnore]
        public string NationCn { get; set; }

        /// <summary>
        /// 区县市组合（eg.北京-朝阳）
        /// </summary>
        public string SuggesText
        {
            get
            {
                if (this.NameCn == this.DistrictCn && this.NameCn == this.ProvCn)
                    return this.NameCn;
                else if (this.DistrictCn == this.ProvCn)
                    return this.DistrictCn + "-" + this.NameCn;
                else if (this.NameCn == this.DistrictCn && this.NameCn != this.ProvCn)
                    return this.ProvCn + "-" + this.DistrictCn;
                else
                    return this.ProvCn + "-" + this.DistrictCn + "-" + this.NameCn;
            }
        }
    }
}
