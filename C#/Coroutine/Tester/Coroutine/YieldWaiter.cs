using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace Coroutine {
    public class YieldWaiter : IEnumerator {

        public object Current {
            get {
                return this;
            }
        }

        public bool MoveNext() {
            return true;
        }

        public void Reset() {
        }
        

    }
}
