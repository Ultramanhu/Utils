using System;
using System.Collections.Generic;
using System.Net;
using System.IO;
using System.Text;
using System.Threading;
using NetLib;

namespace tester {
    class Program {
        static void Main(string[] args) {
            var request = new UltraHttpRequest("http://www.baidu.com/");
            request.RequestAsync((response, stream) => {
                var reader = new StreamReader(stream, Encoding.UTF8);
                Console.WriteLine(reader.ReadToEnd());
            });
            (new ManualResetEvent(false)).WaitOne();
            Console.ReadLine();
        }
    }
}
