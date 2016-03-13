using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Weather.Web.Controllers
{
    public class WeixinController : ApiController
    {
        // GET api/weixin
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/weixin/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/weixin
        public void Post([FromBody]string value)
        {
        }

        // PUT api/weixin/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/weixin/5
        public void Delete(int id)
        {
        }
    }
}
