var Counter = function (times, callback) {
    //字符串格式化
    var formatDate = function(date) {
        if (!milo.base.isString(date)) date = "2013-01-01 00:00:00";
        if (/\d{4}-\d{2}-\d{2}/g.test(date)) {
            date += " 00:00:00";
        }
        return date;
    }
    //复制一个Date对象
    var cloneDate = function(date) {
        var t = date.getTime();
        var s = new Date();
        s.setTime(t);
        return s;
    }
    //对Date数组排序
    var sortDateArray = function(list) {
        for (var i = 0; i < list.length; i++) {
            for (var j = 0; j < i; j++) {
                if (list[i].compare(list[j]) < 0) {
                    var t = list[i];list[i] = list[j];list[j] = t;
                }
            }
        }
    }
    
    this.setTimesList = function(times) {
        if (milo.base.isDate(times)) times = [times];
        if (milo.base.isString(times)) times = [times];
        if (!milo.base.isArray(times)) times = [];
        
        tlist = [];
        for (var i = 0; i < times.length; i++) {
            var t = times[i];
            if (milo.base.isString(t)) t = Date.parse(times[i]);
            tlist.push(t);
        }
        sortDateArray(tlist);
    }
    
    //前闭后开区间，将输入[begin, end]的times展开为一个数组序列
    this.setTimesWithRange = function(begin, end, times) {
        if (milo.base.isString(times)) times = [times];
        if (!milo.base.isArray(times)) times = [];
    
        tlist = [];
        var t = [];
        if (milo.base.isDate(begin))
            begin = begin.format("");
        if (milo.base.isString(end))
            end = Date.parse(end);
        for (var i = 0; i < times.length; i++) {
            t.push(Date.parse(begin + " " + times[i]));
        }
        sortDateArray(t);
        while (true) {
            for (var i = 0; i < times.length; i++) {
                if (t[i].compare(end) < 0) {
                    tlist.push(cloneDate(t[i]));
                    t[i].dateAdd(1, "d");
                } else {
                    return ;
                }
            }
        }
    }
    //调用回调函数
    this.call = function(count) {
        count = Math.floor(count);
        var second = count;
        var minute = Math.floor(second / 60);
        second %= 60;
        var hour = Math.floor(minute / 60);
        minute %= 60;
        var day = Math.floor(hour / 24);
        hour %= 24;
        if (typeof(handler) == "function") handler(count, second, minute, hour, day);
    }
    //获取服务器或者客户端时间
    var getTime = function(use_client) {
        if (use_client)
            return new Date();
        return milo.date.getSeverDateTime();
    }
    //计算差值
    var getDeltaTime = function(target, base) {
        var delta = Math.floor((target.getTime() - base.getTime()) / 1000);
        return delta;
    }
    //开始计时主函数，传入回调函数，use_client为是否使用服务器时间(使用服务器时间必须启用WebServer)，以及到第一个时间点后是否继续对下一个时间倒计算
    this.beginCount = function(callback, use_client, circle) {
        //输入兼容
        if (typeof(callback) == "function") handler = callback;
        if (!use_client) use_client = false;
        //如果调用服务器时间，只读取一次服务器时间，接下来取2次客户端时间相减加到服务器时间然后进行计算
        var base = getTime(use_client);
        var client_time = getTime(true);
        var delta = 0, base_delta = 0;
        target = null;
        //从tlist中获取到离当前最近的后一期节点
        for (var i = 0; i < tlist.length; i++) {
            if (base.compare(tlist[i]) < 0) {
                target = tlist[i];
                break;
            }
        }
        //未获取target直接退出，否则获取两个事件的差值
        if (target != null) {
            base_delta = getDeltaTime(target, base);
        } else {
            return ;
        }
        //初始回调
        this.call(base_delta);
        var _this = this;
        //circle_flag记录当前是否已经启用了circle
        var circle_flag = false;
        timer = window.setInterval(function () {
            //var t = milo.date.getSeverDateTime();
            //更新时间
            var now_time = getTime(true);
            delta = getDeltaTime(now_time, client_time);
            
            var left = base_delta - delta;
            left = Math.max(left, 0);
            
            _this.call(left);
            if (left <= 0) {
                //计时到0清除定时器，如果循环则暂停4-5秒
                window.clearInterval(timer);
                if (circle && !circle_flag) {
                    circle_flag = true;
                    window.setTimeout(function () {
                        _this.beginCount(callback, use_client, circle);
                    }, 4000);
                }
            }
        }, 1000);
    }
    
    if (!callback) callback = function() {};
    var timer, tlist, target;
    var handler = callback;
    this.setTimesList(times);
}