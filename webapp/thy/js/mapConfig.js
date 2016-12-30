/**
 * Created by zhangling14 on 2016/11/23.
 */
define(["./dataOverview.js"],function (require, exports, module) {
    var showData = require('./dataOverview.js');

    //添加地图上的marker 和信息窗口信息
    var createInfoWindow = function (lat, lng, cityName, count) {

        //var point = new BMap.Point(lat, lng);
        //map.centerAndZoom(point, zoomRange);
        map.enableScrollWheelZoom(true);

        function ComplexCustomOverlay(point, mouseoverText, count) {
            this._point = point;
            this._mouseoverText = mouseoverText;
            this._count = count;
        }

        ComplexCustomOverlay.prototype = new BMap.Overlay();

        ComplexCustomOverlay.prototype.initialize = function (map) {
            this._map = map;
            var div = this._div = document.createElement("div");
            div.className = "mapLocation_div";
            div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);

            var that = this;
            var arrow = this._arrow = document.createElement("div");
            arrow.className = "mapLocation_marker";
            arrow.style.top = "0px";
            arrow.style.left = "0px";
            div.appendChild(arrow);

            var mapLocation_count = document.createElement("div");
            mapLocation_count.className = "mapLocation_count";

            var mapLocation_footer = document.createElement("div");
            mapLocation_footer.className = "mapLocation_footer";

            var mapLocation_top = document.createElement("div");
            mapLocation_top.className = "mapLocation_top";

            var mapLocation_content = document.createElement("div");
            mapLocation_content.className = "mapLocation_content";

            mapLocation_count.appendChild(mapLocation_top);
            mapLocation_count.appendChild(mapLocation_content);
            mapLocation_count.appendChild(mapLocation_footer);
            var countTop = -80 - that._count *40 + 'px';
            mapLocation_count.style.top = countTop;

            arrow.onmouseover = function () {
                div.appendChild(mapLocation_count);
                $(arrow).addClass('animated bounce');
                $(mapLocation_count).addClass('animated zoomIn');

                //$(arrow).addClass('animated bounce').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                //    $(this).removeClass();
                //});
                $(mapLocation_content).append(that._mouseoverText);
            };

            arrow.onmouseout = function () {
                $(arrow).removeClass('animated bounce');
                $(mapLocation_count).removeClass('animated zoomIn');
                $(mapLocation_content).empty();
                $(mapLocation_count).remove();
            };

            map.getPanes().labelPane.appendChild(div);
            return div;
        };

        ComplexCustomOverlay.prototype.draw = function () {
            var map = this._map;
            var pixel = map.pointToOverlayPixel(this._point);
            this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
            this._div.style.top = pixel.y - 30 + "px";
        };

        var myCompOverlay = new ComplexCustomOverlay(new BMap.Point(lat, lng), cityName, count);
        map.addOverlay(myCompOverlay);

    };

    //设置市场信息分析的图标
    var createDataInfor = function () {
        function DataAnalyzeControl() {
            // 默认停靠位置和偏移量
            this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
            this.defaultOffset = new BMap.Size(22, 15);
        }

        DataAnalyzeControl.prototype = new BMap.Control();
        DataAnalyzeControl.prototype.initialize = function (map) {
            var div = document.createElement("div");
            div.className = "data_div";
            var data_icon = document.createElement("img");
            data_icon.setAttribute("src", "../lib/img/market_analyze.png");

            //点击icon, 出现市场分析数据
            data_icon.onclick = function () {
                window.dataOverview= new showData();
            };
            div.appendChild(data_icon);

            map.getContainer().appendChild(div);
            return div;
        };

        var myDataCtrl = new DataAnalyzeControl();
        map.addControl(myDataCtrl);
    };

    //设置地图上的放大缩小控件
    var createZoomControl = function () {
        function ZoomControl() {
            // 默认停靠位置和偏移量
            this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
            this.defaultOffset = new BMap.Size(40, 25);
        }

        ZoomControl.prototype = new BMap.Control();

        ZoomControl.prototype.initialize = function (map) {
            var div = document.createElement("div");
            div.className = "zoom_div";
            var img_plus = document.createElement("img");
            img_plus.setAttribute("src", "../lib/img/zoom_out.png");
            img_plus.style.paddingBottom = '18px';

            img_plus.onclick = function () {
                map.zoomTo(map.getZoom() + 1);
            };

            var img_minus = document.createElement("img");
            img_minus.setAttribute("src", "../lib/img/zoom_in.png");
            img_minus.onclick = function () {
                map.zoomTo(map.getZoom() - 1);
            };

            div.appendChild(img_plus);
            div.appendChild(document.createElement("br"));
            div.appendChild(img_minus);
            map.getContainer().appendChild(div);
            return div;
        }
        var myZoomCtrl = new ZoomControl();
        return myZoomCtrl;
    };

    module.exports = {
        createInfoWindow: createInfoWindow,
        createDataInfor: createDataInfor,
        createZoomControl: createZoomControl
    }
});
