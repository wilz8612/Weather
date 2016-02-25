using System;
using System.Collections.Generic;
using System.Globalization;
using System.Resources;
using System.Reflection;
using System.Threading;

using App.Services;


namespace Weather.Windows
{
    internal sealed class SR : App.SRShared
    {
        private static SR sr;
        private ResourceManager rm;


        #region Constructors ===========================================================================
        static SR()
        {
            sr = new SR();
        }


        SR()
        {
            Assembly assembly = this.GetType().Assembly;
            rm = new ResourceManager(assembly.FullName.Substring(0, assembly.FullName.IndexOf(',')) + ".Strings", this.GetType().Assembly);
        }


        #endregion	====================================================================================


        #region Public Properties ======================================================================
        public static string ProjectName
        {
            get
            {
                return SR.Get("ProjectName");
            }
        }


        #endregion	====================================================================================


        #region Private Static  Properties =============================================================


        #endregion	====================================================================================


        #region Public Static Methods ==================================================================
        public static string Get(string name)
        {
            return sr.rm.GetString(name, SC.Culture);
        }


        public static string Get(string name, CultureInfo culture)
        {
            return sr.rm.GetString(name, culture);
        }


        public static string Get(string name, params object[] args)
        {
            return Get(name, SC.Culture, args);
        }


        public static string Get(string name, CultureInfo culture, params object[] args)
        {
            string content = Get(name, culture);
            if ((args == null) || (args.Length <= 0))
            {
                return content;
            }
            for (int i = 0; i < args.Length; i++)
            {
                string arg = args[i] as string;
                if ((arg != null) && (arg.Length > 0x400))
                {
                    args[i] = arg.Substring(0, 0x3fd) + "...";
                }
            }
            return string.Format(culture, content, args);
        }


        #endregion	====================================================================================


        #region Internal Methods =======================================================================


        #endregion	====================================================================================


        #region Private Static Methods =================================================================


        #endregion	====================================================================================


    }

}
