define(['./deviceList', './mapConfig'], function (require, exports, module) {

    //初始化页面:初始化左侧设备列表和地图
    var initMap = function (point) {
        if (!point) {
            point = new BMap.Point(116.404, 39.915);
        }
        map.centerAndZoom(point, 5);
        map.enableScrollWheelZoom(true);
        map.setMapStyle({style: 'dark'});

        //添加地图上的放大缩小控件
        var myZoomControl = require('./mapConfig').createZoomControl();
        map.addControl(myZoomControl);

        require.async('./deviceList', function (app) {
            var sd = new app()
        });
    };
    exports.initMap = initMap;

});
