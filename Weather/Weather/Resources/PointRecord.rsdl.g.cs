﻿//------------------------------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Changes to this file may cause incorrect behavior and will be lost if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------------------------------

namespace Weather.Resources {
	using System;
	using App.Data;
	using Weather.Members;
	
	
	/// <summary>积分记录</summary>
	public partial class PointRecord : App.Data.Resource {
		
		private static App.Data.DataType _resourceType;
		

		partial void OnBeforeInitialize();

		partial void OnEndInitialize();

		
		static PointRecord() {
			Weather.Resources.PointRecord._resourceType = ((App.Data.DataType)(App.Data.DataType.GetByFullName("Weather.Resources.PointRecord")));
		}
		
		/// <summary>会员</summary>
		public Weather.Members.Member Member {
			get {
				return ((Weather.Members.Member)(base.GetValue(6)));
			}
			set {
				base.SetValue(6, value);
			}
		}
		
		/// <summary>积分类型</summary>
		public Weather.Resources.PointType PointType {
			get {
				return ((Weather.Resources.PointType)(base.GetValue(7)));
			}
			set {
				base.SetValue(7, value);
			}
		}
		
		/// <summary>积分值</summary>
		public int PointValue {
			get {
				return ((int)(base.GetValue(8)));
			}
			set {
				base.SetValue(8, value);
			}
		}
		
		/// <summary>描述</summary>
		public string Description {
			get {
				return ((string)(base.GetValue(9)));
			}
			set {
				base.SetValue(9, value);
			}
		}
		
		public static App.Data.DataType GetSchema() {
			return Weather.Resources.PointRecord._resourceType;
		}
		
		public override App.Data.DataType GetDataType() {
			return Weather.Resources.PointRecord._resourceType;
		}
		
		protected override void Initialize() {
			this.OnBeforeInitialize();
			base.Initialize();
			base.propertyValues[5].Value = false;
			base.propertyValues[7].Value = Weather.Resources.PointType.First;
			base.propertyValues[8].Value = 0;
			this.OnEndInitialize();
		}
	}
}


namespace Weather.Resources {
	using System;
	using App.Data;
	using Weather.Members;
	
	
	/// <summary>积分来源</summary>
	public enum PointType {
		
		/// <summary>首次</summary>
		First = 0,
		
		/// <summary>每日签到</summary>
		DaySign = 1,
		
		/// <summary>分享关注</summary>
		ShareSuccss = 2,
		
		/// <summary>刮刮乐</summary>
		Scratch = 3,
	}
}
