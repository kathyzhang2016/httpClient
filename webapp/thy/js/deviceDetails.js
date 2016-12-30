/**
 * Created by zhangling14 on 2016/11/23.
 */
define(["./scrollBarConfig", "./mapConfig"], function (require, exports, module) {

    var scrollBarConfig = require('./scrollBarConfig');
    var mapConfig = require('./mapConfig');

    var showDetails = function (devId, name, model) {
        this.showDevInfo(devId, name, model);
    };

    //家庭地址, 工作场所, 常去场所绑定点击事件
    $(document).on("click", "#devList .details_location", function (e) {
        var lat = $(this).attr('lat');
        var lng = $(this).attr('lng');
        var type = $(this).text().split(":");
        if (lat != undefined && lng != undefined & type != undefined) {
            public.deviceDetails.showLocation(lat, lng, type);

        } else {
            alert("error: no location information")
        }
    });

    //显示根据具体设备获取到的设备持有人信息
    showDetails.prototype.showDevInfo = function showDevInfo(devId, name, model) {
        var _this = this;
        $.ajax({
            url: ctx + '/all/fetchDevInfo.do' + "?devId=" + devId,
            dataType: "json",
            type: "post",
            success: function (result) {
                console.log(result);
                if (result.msg == 'success') {
                    var devs = '';
                    if (name != undefined && model != undefined) {
                        $('.devices_title').html(name + ' - ' + model);
                        devs += '<div class="devices_content">';
                    }

                    $(result.data).each(function (ind, ele) {
                        if (ele.sex !== null && ele.sex !== undefined && ele.sex !== '') {
                            devs += '<div>性别：' + ele.sex + '</div>';
                        }
                        if (ele.age !== null && ele.age !== undefined && ele.age !== '') {
                            devs += '<div>年龄：' + ele.age + '</div>';
                        }

                        if (ele.wed !== null && ele.wed !== undefined && ele.wed !== '') {
                            devs += '<div>婚姻情况：' + ele.wed + '</div>';
                        }
                        if (ele.car !== null && ele.car !== undefined && ele.car !== '') {
                            devs += '<div>车辆情况：' + ele.car + '</div>';
                        }

                        if (ele.alwaysCities != null && ele.alwaysCities != undefined && ele.alwaysCities != '') {
                            devs += '<div><img src="../lib/img/location_icon.png"><span>常驻城市</span>: ' + ele.alwaysCities + '</div>';
                        }
                        if (ele.comp != null && ele.comp != undefined && ele.comp.name != '') {
                            devs += '<div class="details_location" lat="' + ele.comp.lat + '" lng="' + ele.comp.lng + '"><img src="../lib/img/location_icon.png"><span>工作场所</span>: ' + ele.comp.name + '</div>';
                        }
                        if (ele.home != null && ele.home != undefined && ele.home.name != '') {
                            devs += '<div class="details_location" lat="' + ele.home.lat + '" lng="' + ele.home.lng + '"><img src="../lib/img/location_icon.png"><span>家庭地址</span>：' + ele.home.name + '</div>';
                        }

                        //添加常去场所
                        var locationContent = '';
                        for (var i = 0; i < ele.location.length; i++) {
                            if (ele.location[i].name != undefined) {
                                locationContent += ele.location[i].name + ',';
                            }
                        }
                        if (locationContent.length > 0) {
                            locationContent = locationContent.substr(0, locationContent.length - 1);
                            devs += '<div><img src="../lib/img/location_icon.png"><span>常去场所</span>：' + locationContent + '</div>';
                        }

                        devs = devs + '</div>';

                        _this.loadMapData(map, ele);

                        map.addEventListener("zoomend", function () {
                            _this.loadMapData(map, ele)
                        });

                        if (ele.tags != null && ele.tags != undefined && ele.tags != '') {
                            devs = devs + '<div class="interests"><div class="interests_header"><span>兴趣爱好</span></div><div class="interests_content">';
                            var tmp = _this.parseTags(ele.tags);
                            devs += tmp;

                        }
                        devs = devs + '</div></div>';
                        $('.devDetails_content').html(devs);
                        //添加滚动条
                        scrollBarConfig.scrollBar('.devDetails_content', 'slimScrollDiv_details');
                    });
                } else {
                    alert(result.msg);
                }
            }
        });
    };

    //显示兴趣爱好信息:appinterest-应用兴趣 gameinterest-游戏兴趣 demography-人口属性 deviceinfo-设备属性
    // location-地理位置 consumption-消费偏好gamedepth-游戏深度industry-行业属性
    showDetails.prototype.parseTags = function (tags) {
        var tagObj;
        var tagDescStr = '<div class="interest_info">';
        var category = ['appinterest', 'gameinterest', 'consumption', 'gamedepth', 'industry'];

        for (var i = 0; i < category.length; i++) {
            var tagType = category[i];
            tagObj = tags[tagType];
            if (tagObj != null && tagObj.length > 0) {
                if (tagType == 'appinterest') {
                    tagDescStr = tagDescStr + '<div class="interest_info_head">应用类</div><div class="interest_info_body">';
                } else if (tagType == 'gameinterest') {
                    tagDescStr = tagDescStr + '<div class="interest_info_head">游戏类</div><div class="interest_info_body">';
                } else if (tagType == 'consumption') {
                    tagDescStr = tagDescStr + '<div class="interest_info_head">消费类</div><div class="interest_info_body">';
                } else if (tagType == 'gamedepth') {
                    tagDescStr = tagDescStr + '<div class="interest_info_head">游戏深度</div><div class="interest_info_body">';

                } else if (tagType == 'industry') {
                    tagDescStr = tagDescStr + '<div class="interest_info_head">行业属性</div><div class="interest_info_body">';
                }
                $(tagObj).each(function (ind, ele) {
                    tagDescStr = tagDescStr + '<div><div><img src="../lib/img/icon.png"></div><span>' + ele.name + '</span><span class="weight_de">' + ele.weight + '</span></div>';
                });
                tagDescStr = tagDescStr + "</div>";
            }

        }
        return tagDescStr;

    };

    //根据省级城市列表和市级信息, 显示到达某个城市的次数
    showDetails.prototype.loadMapData = function (map, ele) {
        var zoomRange = map.getZoom();
        map.clearOverlays();
        mapConfig.createDataInfor();

        //国家:4 省级:8 市级:12 街:17
        if (zoomRange > 4 && zoomRange < 9) {

            for (var i = 0; i < ele.provinceLoc.length; i++) {
                var citiesName = '';
                var countCities = 0;

                for (var j = 0; j < ele.provinceLoc[i].citys.length; j++) {
                    var citiesInfor = ele.provinceLoc[i].citys;
                    if (citiesInfor[j].name != undefined && citiesInfor[j].name != null) {
                        countCities++;
                        citiesName = citiesName + '<div class="maplocationItem"><span class="maplocationText">' + citiesInfor[j].name + ":&nbsp到过" + citiesInfor[j].cnt + "次" + '</span></div>';
                    }
                }
                //创建省级地图上的marker 和信息窗口
                mapConfig.createInfoWindow(ele.provinceLoc[i].lat, ele.provinceLoc[i].lng, citiesName, countCities);
            }
        }

        //获取市级信息
        if (zoomRange > 8) {
            for (var i = 0; i < ele.cityLoc.length; i++) {
                citiesName = '<div class="maplocationItem"><span class="maplocationText">' + "到过次数:&nbsp" + ele.cityLoc[i].cnt + "次" + '</span></div>';
                //创建市级地图上的marker 和信息窗口
                mapConfig.createInfoWindow(ele.cityLoc[i].lat, ele.cityLoc[i].lng, citiesName, ele.cityLoc.length);
            }
        }
    };

    //点击常去场所,工作场所,家庭地址时显示信息窗口
    showDetails.prototype.showLocation = function (lat, lng, type) {
        var point = new BMap.Point(lat, lng);
        //map.centerAndZoom(point,5);
        var myIcon = new BMap.Icon("../lib/img/arriving_location.png", new BMap.Size(46, 46));
        var marker = new BMap.Marker(point, {icon: myIcon});
        map.addOverlay(marker);
        if (type != undefined) {
            var label = new BMap.Label(type, {offset: new BMap.Size(20, -10)});
            marker.setLabel(label);
        }
    };

    module.exports = showDetails;
});