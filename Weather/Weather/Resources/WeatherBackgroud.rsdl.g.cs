﻿//------------------------------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Changes to this file may cause incorrect behavior and will be lost if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------------------------------

namespace Weather.Resources
{
    using System;
    using App.Data;


    /// <summary>背景图</summary>
    public partial class WeatherBackgroud : App.Data.Resource
    {

        private static App.Data.DataType _resourceType;


        partial void OnBeforeInitialize();

        partial void OnEndInitialize();


        static WeatherBackgroud()
        {
            Weather.Resources.WeatherBackgroud._resourceType = ((App.Data.DataType)(App.Data.DataType.GetByFullName("Weather.Resources.WeatherBackgroud")));
        }

        /// <summary>适用于</summary>
        public Weather.Resources.AvilableTime AvilableTime
        {
            get
            {
                return ((Weather.Resources.AvilableTime)(base.GetValue(6)));
            }
            set
            {
                base.SetValue(6, value);
            }
        }

        /// <summary>名称</summary>
        public string Name
        {
            get
            {
                return ((string)(base.GetValue(7)));
            }
            set
            {
                base.SetValue(7, value);
            }
        }

        /// <summary>图片路径</summary>
        public string Path
        {
            get
            {
                return ((string)(base.GetValue(8)));
            }
            set
            {
                base.SetValue(8, value);
            }
        }

        public static App.Data.DataType GetSchema()
        {
            return Weather.Resources.WeatherBackgroud._resourceType;
        }

        public override App.Data.DataType GetDataType()
        {
            return Weather.Resources.WeatherBackgroud._resourceType;
        }

        protected override void Initialize()
        {
            this.OnBeforeInitialize();
            base.Initialize();
            base.propertyValues[5].Value = false;
            base.propertyValues[6].Value = Weather.Resources.AvilableTime.Day;
            this.OnEndInitialize();
        }
    }
}


namespace Weather.Resources
{
    using System;
    using App.Data;


    /// <summary>适用时间</summary>
    public enum AvilableTime
    {

        /// <summary>白天</summary>
        Day = 0,

        /// <summary>黑天</summary>
        Night = 1,
    }
}
