/**
 * Created by zhangling14 on 2016/12/15.
 */
define(['./citiesScatterConfig.js', './interestsTreemapConfig.js'], function (require, exports, module) {

    var citiesScatter = require('./citiesScatterConfig.js');
    var interestsTreeMap = require('./interestsTreemapConfig.js');
    var myCitiesChart = echarts.init($('#citiesChart')[0]);
    var citiesOption = {};
    var selectYear = "";
    var selectMonth = '';
    var dataResult = '';

    var showData = function () {
        this.init();
    };

    showData.prototype.init = function () {
        $('.totalContainer').show();

        //市场洞察信息添加动画
        $('.totalContainer').addClass('animated pulse');
        setTimeout(function () {
            $('.totalContainer').removeClass('pulse');
        }, 1000);

        $('.totalContainer_bg').show();
        $('.main').hide();
        this.initDateTime();
        this.changeDate();

        $('.chartsContainer').fullpage({
            //sectionsColor: ['#ffffff', '#F7F7F7', '#FFFFFF'],
            //anchors: ['citiesChart', 'agePanel', 'interestsPanel'],
            scrollOverflow: false,
            verticalCentered: false
        });

    };

    //点击关闭时间控件
    $('#close_btn').bind('click', function () {
        $('.totalContainer').hide();
        $('.totalContainer_bg').hide();
        $('.main').show();
    });

    $('#yearOption img').bind('click', function () {
        $('.yearArea').removeClass('hidden');
    });

    //点击选择年
    $('.yearArea li').bind('click', function () {
        selectYear = $(this).text();
        $('.yearArea').addClass('hidden');
        $('#yearOption').find('span').text(selectYear);
        dataOverview.changeDate();
    });

    //点击选择月
    $(document).on('click', '.monthList li', function () {
        selectMonth = $(this).text();
        $(this).addClass('monthList_li_click');
        dataOverview.changeDate();
    });

    //给矩形树图的3 个tab 添加点击事件
    $('.tabs li').bind('click', function () {
        //修改选中标签文字的透明度, 选中时透明度为1, 默认为0.2
        if (!$(this).hasClass('li_opacity_big')) {
            $(this).addClass('li_opacity_big');
        }
        if ($(this).siblings().hasClass('li_opacity_big')) {
            $(this).siblings().removeClass('li_opacity_big');
        }

        //选择显示的图表内容并修改背景图片
        if ($(this)[0].id == 'tab1') {
            $('#interestsPanel').removeClass('appBg');
            $('#interestsPanel').removeClass('locationBg');
            $('#interestsPanel').addClass('consumeBg');

            $('#consumeCharts').show();
            $('#appCharts').hide();
            $('#locationCharts').hide();
        } else if ($(this)[0].id == 'tab2') {
            $('#interestsPanel').removeClass('consumeBg');
            $('#interestsPanel').removeClass('locationBg');
            $('#interestsPanel').addClass('appBg');

            $('#consumeCharts').hide();
            $('#appCharts').show();
            $('#locationCharts').hide();
        } else if ($(this)[0].id == 'tab3') {
            $('#interestsPanel').removeClass('consumeBg');
            $('#interestsPanel').removeClass('appBg');
            $('#interestsPanel').addClass('locationBg');

            $('#consumeCharts').hide();
            $('#appCharts').hide();
            $('#locationCharts').show();
        }
    });


    showData.prototype.changeDate = function () {

        var defaultYear = '2016',
            defaultMonth = '12';

        selectYear = selectYear != '' ? selectYear : defaultYear;
        selectMonth = selectMonth != '' ? selectMonth : defaultMonth;
        console.log('selectYear:' + selectYear);
        console.log('selectMonth:' + selectMonth);
        var that = this;

        $.ajax({
            url: ctx + '/all/fetReport.do' + "?year=" + selectYear + "?month=" + selectMonth,
            dataType: "json",
            type: "post",
            success: function (result) {
                if (result.msg == 'success') {
                    dataResult = result.data;
                    that.initCitiesOption(result.data.cities);
                    myCitiesChart.setOption(citiesOption);

                    //生成中间背景信息
                    if ($('.citiesBg_item').length == 0) {
                        for (var i = 0; i < result.data.cities.length; i++) {
                            $('#citiesBg').append('<div class="citiesBg_item"></div>')
                        }
                    }

                    //生成右侧数量,占比率信息
                    that.initChartLabel(result.data.cities);

                    //生成年龄图表信息
                    that.initAgeCharts(result.data.ageInfor);

                    //生成右侧地图散点信息
                    citiesScatter.initCitiesScatter(result.data.cities);

                    //生成消费分布矩形阵图
                    var consumeTreeMap = echarts.init($("#consumeCharts")[0]);
                    var appTreeMap = echarts.init($("#appCharts")[0]);
                    var locationTreeMap = echarts.init($("#locationCharts")[0]);
                    consumeTreeMap.setOption(interestsTreeMap.initInterestsTreeMap(result.data.interestsInfor));
                    appTreeMap.setOption(interestsTreeMap.initInterestsTreeMap(result.data.appsInfor));
                    locationTreeMap.setOption(interestsTreeMap.initInterestsTreeMap(result.data.frequentLocationInfor));

                }
            }
        });

    };

    /*
     初始化城市列表数据
     * */
    showData.prototype.initCitiesOption = function (data) {
        var xData = [],
            yData = [],
            bgData = [];
        data = data ? data : [];
        $(data).each(function (ind, item) {
            yData.push('');
            xData.push(item.num);
            bgData.push({value: 1, label: item.num});
        });
        // 将数据翻转，让图表从高到低显示
        yData && yData.reverse();
        xData && xData.reverse();
        bgData && bgData.reverse();
        citiesOption = {
            color: ['#54caef'],
            tooltip: {
                show: false,
                showContent: false
            },
            legend: {
                show: false
            },
            grid: {
                left: '50',
                right: '20%', //设置图表右侧的距离，便于显示数量
                top: '10',
                bottom: '0',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01],
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                //显示x轴文字
                axisLabel: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'category',
                data: yData,
                axisLine: {
                    show: false
                },
                //隐藏坐标轴刻度
                axisTick: {
                    show: false
                },
                //隐藏坐标轴标签
                axisLabel: {
                    show: false
                },
                //隐藏图表柱间的分割线
                splitLine: {
                    show: false
                }
            },
            series: [{
                type: 'bar',
                barWidth: 8,
                barMinHeight: 8,
                itemStyle: {
                    normal: {
                        barBorderRadius: 4,
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#1cffe7'},
                                {offset: 1, color: '#46c9ff'}
                            ]
                        )
                    }
                },
                barCategoryGap: 30,
                data: xData
            }]
        };
    };

    //生成常驻城市分布表格的文字提示信息
    showData.prototype.initChartLabel = function (data) {

        //需要解决每次点击继续添加城市信息的问题
        if ($('.citiesLabel').length == 0) {
            var totalCitiesLabel = '<div id="citiesLabelTitle"><span>城市</span></div>';
            for (var i = 0; i < data.length; i++) {
                totalCitiesLabel += '<div class="citiesLabel"><span>' + data[i].name + '</span></div>';
            }
            $('#citiesChartLabel').html(totalCitiesLabel);

        }

        //添加占有率信息
        if ($('.citiesPer').length == 0) {
            var totalCitiesPer = '<div id="citiesPerTitle"><span>占比率</span></div>';
            for (var i = 0; i < data.length; i++) {
                totalCitiesPer += '<div class="citiesPer"><span>' + data[i].numPercent + '</span></div>';
            }
            $('#citiesChartPer').html(totalCitiesPer);
        }

        //添加数量信息
        if ($('.citiesNum').length == 0) {
            var totalCitiesNum = '<div id="citiesNumTitle"><span>数量</span></div>';
            for (var i = 0; i < data.length; i++) {
                totalCitiesNum += '<div class="citiesNum"><span>' + data[i].num + '</span></div>';
            }
            $('#citiesChartNum').html(totalCitiesNum);
        }

    };

    showData.prototype.initDateTime = function () {

        var wrapper = $(".monthScroll");
        var prev = $(".prev");
        var next = $(".next");
        var ul = $(".monthList").find('ul');
        var w = ul.find('li').outerWidth(true);
        next.click(function () {
            //ul.animate({'margin-left': w}, function () {
            //    ul.find('li').eq(0).appendTo(ul);
            //    ul.css({'margin-left': 0});
            //});
            ul.find('li').eq(0).appendTo(ul);

        });
        prev.click(function () {
            ul.find('li:last').prependTo(ul);
            //ul.css({'margin-left': -w});
            //ul.animate({'margin-left': w});

        });
    };

    //生成年龄分布柱状图
    showData.prototype.initAgeCharts = function (data) {
        var ageChart = echarts.init($("#ageCharts")[0]);
        var barOption = {
            color: ['#ffffff'],
            tooltip: {
                trigger: 'axis',
                position: function (point, params, dom) {
                    // 固定在顶部
                    return [point[0], '10%'];
                },
                //trigger: 'item',
                //position:'top',
                backgroundColor: 'none',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    /*axisTick: {
                     alignWithLabel: true
                     },*/
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#0af5f8',
                            width: 2
                        }
                    },
                    //axisLine: {
                    //    show: false
                    //},
                    //隐藏图表柱间的分割线
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            fontSize: 24,
                            color: '#e9fdff',
                            fontFamily: 'Microsoft YaHei'
                        }
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    //type: 'category',
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#0af5f8',
                            width: 2
                        }
                    },
                    data: ['20', '30', '40', '50', '10', '20', '30'],
                    //显示坐标轴刻度
                    axisTick: {
                        show: true
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            fontSize: 24,
                            color: '#e9fdff',
                            fontFamily: 'Microsoft YaHei'
                        }
                    },
                    //显示图表柱间的分割线
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#16bdee',
                            width: 1,
                            opacity: 0.2
                        }
                    }
                }
            ],
            series: [
                {
                    name: '数值',
                    type: 'bar',
                    //barWidth: '30%',
                    barWidth: 60,
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#1cffe7'},
                                    {offset: 1, color: '#13c3f6'}
                                ]
                            )
                            //color: new echarts.graphic.RadialGradient(0.5, 0.5, 0.5, [
                            //    {offset: 0, color: '#1cffe7'},
                            //    {offset: 1, color: '#13c3f6'}
                            //], false)
                        },
                        emphasis: {
                            color: '#17e8fa',
                            opacity: 0.3
                        }
                    },
                    //label: {
                    //    normal: {
                    //        position: 'top',
                    //        show: true
                    //    },
                    //    emphasis: {
                    //        show: true
                    //    }
                    //},
                    data: ['555', '55', '63', '12']
                }

            ]
        };
        var xAxisData = [],
            yAxisData = [],
            seriesData = [],
            countPer = [],
            countSum = 0;

        $(data).each(function (ind, item) {
            xAxisData.push(item.agePeriod);
            yAxisData.push(item.num);
            seriesData.push(item.num);
            countSum = countSum + item.num;
        });

        barOption.xAxis[0].data = xAxisData;
        barOption.yAxis.data = yAxisData;
        barOption.series[0].data = seriesData;
        barOption.tooltip.formatter = (function () {
            return function (params, ticket, callback) {
                var countRate = Math.round(params[0].value / countSum * 100) + '%';
                var html = '<div class ="ageArea"><div class = "ageTitle">' + params[0].name + '</div>';
                var htmlContent = '<div class="ageContent">' + '总量:' + countSum + '</div><div class="ageContent">数量:' + params[0].value + '</div><div class="ageContent">百分比:' + countRate + '</div></div>';

                return html + htmlContent;
            }
        })(barOption.series[0]);

        ageChart.setOption(barOption);

    };

    module.exports = showData;

});
