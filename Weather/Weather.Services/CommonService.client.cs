﻿//------------------------------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Changes to this file may cause incorrect behavior and will be lost if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------------------------------

namespace Weather.Services {
	[App.Services.ServiceClientAttribute]
	public class CommonServiceClient {
		public static void ServiceMethod() {
			ServiceMethod(global::App.Services.SC.Current);
		}
		
		
		public static void ServiceMethod(global::App.Services.ServiceConnection __serviceConnection) {
			__serviceConnection.Invoke("Weather.Services.CommonService", "ServiceMethod", new global::System.Type[] {}, null);
		}
		
		
		public static void ServiceMethodAsync(global::System.Action callback) {
			ServiceMethodAsync(global::App.Services.SC.Current, callback);
		}
		
		
		public static void ServiceMethodAsync(global::App.Services.ServiceConnection __serviceConnection, global::System.Action callback) {
			__serviceConnection.InvokeAsync("Weather.Services.CommonService", "ServiceMethod", callback);
		}
		
		
		public static void ServiceMethodAsync(global::App.Services.ServiceClient __serviceClient, global::System.Action callback) {
			__serviceClient.InvokeAsync("Weather.Services.CommonService", "ServiceMethod", callback);
		}
		
		
		public static void ServiceMethodAsync(global::System.Action<global::App.Services.InvokeAsyncCompletedEventArgs> callback) {
			ServiceMethodAsync(global::App.Services.SC.Current, callback);
		}
		
		
		public static void ServiceMethodAsync(global::App.Services.ServiceConnection __serviceConnection, global::System.Action<global::App.Services.InvokeAsyncCompletedEventArgs> callback) {
			__serviceConnection.InvokeAsync("Weather.Services.CommonService", "ServiceMethod", callback);
		}
		
		
		public static object Test() {
			return Test(global::App.Services.SC.Current);
		}
		
		
		public static object Test(global::App.Services.ServiceConnection __serviceConnection) {
			return __serviceConnection.Invoke<object>("Weather.Services.CommonService", "Test", new global::System.Type[] {}, null);
		}
		
		
		public static void TestAsync(global::System.Action<object> callback) {
			TestAsync(global::App.Services.SC.Current, callback);
		}
		
		
		public static void TestAsync(global::App.Services.ServiceConnection __serviceConnection, global::System.Action<object> callback) {
			__serviceConnection.InvokeAsync<object>("Weather.Services.CommonService", "Test", callback);
		}
		
		
		public static void TestAsync(global::App.Services.ServiceClient __serviceClient, global::System.Action<object> callback) {
			__serviceClient.InvokeAsync<object>("Weather.Services.CommonService", "Test", callback);
		}
		
		
		public static void TestAsync(global::System.Action<global::App.Services.InvokeAsyncCompletedEventArgs<object>> callback) {
			TestAsync(global::App.Services.SC.Current, callback);
		}
		
		
		public static void TestAsync(global::App.Services.ServiceConnection __serviceConnection, global::System.Action<global::App.Services.InvokeAsyncCompletedEventArgs<object>> callback) {
			__serviceConnection.InvokeAsync<object>("Weather.Services.CommonService", "Test", callback);
		}
		
		
		public static string GetCityJsonStr() {
			return GetCityJsonStr(global::App.Services.SC.Current);
		}
		
		
		public static string GetCityJsonStr(global::App.Services.ServiceConnection __serviceConnection) {
			return __serviceConnection.Invoke<string>("Weather.Services.CommonService", "GetCityJsonStr", new global::System.Type[] {}, null);
		}
		
		
		public static void GetCityJsonStrAsync(global::System.Action<string> callback) {
			GetCityJsonStrAsync(global::App.Services.SC.Current, callback);
		}
		
		
		public static void GetCityJsonStrAsync(global::App.Services.ServiceConnection __serviceConnection, global::System.Action<string> callback) {
			__serviceConnection.InvokeAsync<string>("Weather.Services.CommonService", "GetCityJsonStr", callback);
		}
		
		
		public static void GetCityJsonStrAsync(global::App.Services.ServiceClient __serviceClient, global::System.Action<string> callback) {
			__serviceClient.InvokeAsync<string>("Weather.Services.CommonService", "GetCityJsonStr", callback);
		}
		
		
		public static void GetCityJsonStrAsync(global::System.Action<global::App.Services.InvokeAsyncCompletedEventArgs<string>> callback) {
			GetCityJsonStrAsync(global::App.Services.SC.Current, callback);
		}
		
		
		public static void GetCityJsonStrAsync(global::App.Services.ServiceConnection __serviceConnection, global::System.Action<global::App.Services.InvokeAsyncCompletedEventArgs<string>> callback) {
			__serviceConnection.InvokeAsync<string>("Weather.Services.CommonService", "GetCityJsonStr", callback);
		}
	}
}
