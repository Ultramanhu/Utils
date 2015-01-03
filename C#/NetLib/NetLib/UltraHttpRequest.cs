using System;
using System.Collections.Generic;
using System.Net;
using System.IO;
using System.Text;

namespace NetLib {
    public class UltraHttpRequest {

        public delegate void RequestCallBack(HttpWebRequest request);
        public delegate void ResponseCallBack(HttpWebResponse response, Stream stream);
        public delegate void StreamCallBack(Stream stream);

        public UltraHttpRequest(string url = "") {
            this.Url = url;
            this._post_use_map = true;
            this.GetArgs = new Dictionary<string, string>();
            this._post_args = new Dictionary<string, byte[]>();
            this.RandomGetParamName = "random";
        }

        protected HttpWebRequest _request;
        protected HttpWebResponse _response;

        protected string _base_url;

        public Dictionary<string, string> GetArgs {
            get;
            set;
        }

        public string RandomGetParamName {
            get;
            set;
        }

        protected Dictionary<string, byte[]> _post_args;
        protected byte[] _post_buffer;

        protected bool _post_use_map;
        public bool PostUseDictionary {
            get {
                return _post_use_map;
            }
            set {
                _post_use_map = value;
                if (!value) {
                    _post_args.Clear();
                }
            }
        }

        public Dictionary<string, byte[]> PostArgs {
            get {
                //if (!this._post_use_map) return null;
                return this._post_args;
            }
        }

        public byte[] PostForm {
            get {
                return this._PackContent();
            }
            set {
                this.PostUseDictionary = false;
                _post_buffer = value;
            }
        }

        public string Url {
            get {
                return _PackUrl();
            }
            set {
                _base_url = value;
            }
        }

        protected string _PackUrl() {
            var builder = new StringBuilder(this._base_url);
            var random = new Random();
            builder.Append("?").Append(this.RandomGetParamName).Append("=").Append(random.Next());
            foreach (var arg in this.GetArgs) {
                builder.Append("&").Append(arg.Key).Append("=").Append(arg.Value);
            }
            return builder.ToString();
        }

        protected byte[] _PackContent() {
            if (!this._post_use_map) {
                return this._post_buffer;
            }
            var stream = new MemoryStream();
            var flag = false;
            foreach (var arg in this._post_args) {
                if (flag) {
                    stream.WriteByte(Convert.ToByte('&'));
                } else {
                    flag = true;
                }
                var key = Encoding.UTF8.GetBytes(arg.Key);
                stream.Write(key, (int)stream.Length, key.Length);
                stream.WriteByte(Convert.ToByte('='));
                stream.Write(arg.Value, (int)stream.Length, arg.Value.Length);
            }
            var buff = new byte[stream.Length];
            stream.Read(buff, 0, (int)stream.Length);
            return buff;
        }

        public bool SetPostArg(string key, byte[] value) {
            if (!this.PostUseDictionary) return false;
            this._post_args[key] = value;
            return true;
        }

        public bool SetPostArg(string key, string value, Encoding encoding = null) {
            if (encoding == null) encoding = Encoding.UTF8;
            return this.SetPostArg(key, encoding.GetBytes(value));
        }

        public bool RequestAsync(ResponseCallBack rsp = null, RequestCallBack req = null) {
            try {
                var request = WebRequest.Create(this.Url) as HttpWebRequest;
                if (request == null) {
                    return false;
                }

                request.BeginGetRequestStream((result) => {
                    using (var stream = request.EndGetRequestStream(result)) { 
                        var bytes = this._PackContent();
                        stream.Write(bytes, 0, bytes.Length);
                    }
                    if (req != null) {
                        req(request);
                    }

                    request.BeginGetResponse((res) => {
                        var response = request.EndGetResponse(res) as HttpWebResponse;
                        var stream = response.GetResponseStream();

                        if (rsp != null) {
                            rsp(response, stream);
                        }
                    }, null);
                }, null);
                
            } catch (Exception e) {
                return false;
            }
            return true;
        }
    }
}
