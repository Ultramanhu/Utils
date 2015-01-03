var Counter = function (times, callback) {
    //�ַ�����ʽ��
    var formatDate = function(date) {
        if (!milo.base.isString(date)) date = "2013-01-01 00:00:00";
        if (/\d{4}-\d{2}-\d{2}/g.test(date)) {
            date += " 00:00:00";
        }
        return date;
    }
    //����һ��Date����
    var cloneDate = function(date) {
        var t = date.getTime();
        var s = new Date();
        s.setTime(t);
        return s;
    }
    //��Date��������
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
    
    //ǰ�պ����䣬������[begin, end]��timesչ��Ϊһ����������
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
    //���ûص�����
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
    //��ȡ���������߿ͻ���ʱ��
    var getTime = function(use_client) {
        if (use_client)
            return new Date();
        return milo.date.getSeverDateTime();
    }
    //�����ֵ
    var getDeltaTime = function(target, base) {
        var delta = Math.floor((target.getTime() - base.getTime()) / 1000);
        return delta;
    }
    //��ʼ��ʱ������������ص�������use_clientΪ�Ƿ�ʹ�÷�����ʱ��(ʹ�÷�����ʱ���������WebServer)���Լ�����һ��ʱ�����Ƿ��������һ��ʱ�䵹����
    this.beginCount = function(callback, use_client, circle) {
        //�������
        if (typeof(callback) == "function") handler = callback;
        if (!use_client) use_client = false;
        //������÷�����ʱ�䣬ֻ��ȡһ�η�����ʱ�䣬������ȡ2�οͻ���ʱ������ӵ�������ʱ��Ȼ����м���
        var base = getTime(use_client);
        var client_time = getTime(true);
        var delta = 0, base_delta = 0;
        target = null;
        //��tlist�л�ȡ���뵱ǰ����ĺ�һ�ڽڵ�
        for (var i = 0; i < tlist.length; i++) {
            if (base.compare(tlist[i]) < 0) {
                target = tlist[i];
                break;
            }
        }
        //δ��ȡtargetֱ���˳��������ȡ�����¼��Ĳ�ֵ
        if (target != null) {
            base_delta = getDeltaTime(target, base);
        } else {
            return ;
        }
        //��ʼ�ص�
        this.call(base_delta);
        var _this = this;
        //circle_flag��¼��ǰ�Ƿ��Ѿ�������circle
        var circle_flag = false;
        timer = window.setInterval(function () {
            //var t = milo.date.getSeverDateTime();
            //����ʱ��
            var now_time = getTime(true);
            delta = getDeltaTime(now_time, client_time);
            
            var left = base_delta - delta;
            left = Math.max(left, 0);
            
            _this.call(left);
            if (left <= 0) {
                //��ʱ��0�����ʱ�������ѭ������ͣ4-5��
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