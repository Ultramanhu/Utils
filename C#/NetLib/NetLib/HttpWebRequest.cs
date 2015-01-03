using System;
using System.Collections.Generic;
using System.Net;
using System.IO;

namespace NetLib {
    public class UltraHttpRequest {

        public delegate void RequestCallBack(Stream stream, HttpWebRequest request, HttpWebResponse response);

        protected HttpWebRequest _request;
        protected HttpWebResponse _response;

        protected string _base_url;

        public Dictionary<string, string> _get_args;

        public Dictionary<string, byte[]> _post_args;

        public string Url {
            get {
                return _base_url;
            }
        }

        public bool RequestAsync(RequestCallBack callback) {
            try {
                var request = WebRequest.Create(this.Url) as HttpWebRequest;
                if (request == null) {
                    return false;
                }
                request.BeginGetResponse(delegate(IAsyncResult result) {
                    var response = request.EndGetResponse(result);
                    var stream = response.GetResponseStream();
                    if (callback != null) {
                        callback(stream, request, response);
                    }
                }, null);
            } catch (Exception e) {
                return false;
            }
            return true;
        }
    }
}
