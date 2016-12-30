/**
 * Created by zhangling14 on 2016/11/24.
 */
define(["./deviceDetails", "./scrollBarConfig"], function (require, exports, module) {

    var showDevs = function () {
        this.init();
    };

    var showDeviceDetails = require("./deviceDetails");
    var scrollBarConfig = require('./scrollBarConfig');

    showDevs.prototype.init = function () {
        this.loadData();
    };

    //获取设备列表
    showDevs.prototype.loadData = function () {
        var that = this;
        $.ajax({
            url: ctx + '/all/fetchDevs.do' + "?size=10",
            dataType: "json",
            type: "post",
            success: function (result) {
                if (result.msg == 'success') {
                    console.log(result.data);
                    var devTotalInfo = '';
                    $(result.data).each(function (ind, ele) {
                        $('.devTotal_content').append(devTotalInfo + '<div class="deviceItem" data-id="' + ele.id + '">' + ele.name + ' - ' + ele.model + '</div>');
                    });

                } else {
                    alert(result.msg);
                }
            }
        });
    };

    //计算设备列表宽高
    showDevs.prototype.countWL = function () {
        var contentH = $('.devTotal_content').height();
        var contentW = $('.devTotal_content').width();

    };


    //给搜索按钮添加click 事件
    $(document).on("click", "#devList .searchBtn", function () {
        $('.devTotal').removeClass('hidden');
        //添加滚动条
        scrollBarConfig.scrollBar('.devTotal_content', 'slimScrollDiv_list');

        $('.devDetails').addClass('hidden');
        if ($('#leftPanel').length == 0) {
            $('#devList_area').prepend('<div id="leftPanel"></div>');
        }

    });

    //点击具体设备, 显示设备详情
    $(document).on("click", ".devTotal .deviceItem", function () {
        $('#devList_area').addClass("bg");
        $('.devTotal').addClass('hidden');
        $('.devDetails').removeClass('hidden');

        var dataId = $(this).attr('data-id');
        var ss = $(this).text().split("-");
        if (ss.length > 0) {
            var name = ss[0];
            var model = ss[1];
            if (dataId != undefined && dataId != null) {
                public.deviceDetails = new showDeviceDetails(dataId, name, model);
            }
        }
    });

    //给关闭按钮添加click事件
    $(document).on("click", ".devDetails_close", function () {
        $('.devDetails').addClass('hidden');
    });

    module.exports = showDevs;
});
