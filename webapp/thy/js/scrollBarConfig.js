define(function (require, exports) {

    //添加滚动条并设置样式
    var scrollBar = function (div, wrapperDiv) {
        var contentH = $(div).height();
        var contentW = $(div).width();
        console.log("contentH = " + contentH);
        console.log("contentW = " + contentW);

        if (contentH > 500) {
            //设置内容滚动样式
            $(div).slimScroll({
                //height: "435px",
                //height: contentH > 500 ? contentH - 200 + "px" : contentH,
                height: contentH - 200 + "px",
                width: contentW,
                wrapperClass: wrapperDiv,
                marginBottom: '0px',
                paddingTop: '59px',
                start: 'top',
                disableFadeOut: true, //是否 鼠标经过可滚动区域时显示组件，离开时隐藏组件
                //set the css for scrollBar
                color: 'url(../lib/img/scrollBar.png) no-repeat',
                size: '5px',
                alwaysVisible: true,
                borderRadius: '7px',
                opacity: 1,
                position: 'right', //组件位置：left/right
                distance: '10px' //组件与侧边之间的距离
            });
            if (wrapperDiv = "slimScrollDiv_list") {
                $('.devTotal_bg').css('height', contentH - 200);
                $('.' + wrapperDiv).css('position', 'absolute');
            }
        }

    };

    exports.scrollBar = scrollBar;

});
