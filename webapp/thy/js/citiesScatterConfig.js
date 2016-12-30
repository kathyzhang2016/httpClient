/**
 * Created by zhangling14 on 2016/12/22.
 */
define(function (require, exports, module) {

    var initCitiesScatter = function (citiesData) {
        var citiesScatter = echarts.init($("#citiesScatter")[0]);
        var convertData = function (citiesData) {
            var res = [];
            for (var i = 0; i < citiesData.length; i++) {
                var locationDetails = citiesData[i].location;
                console.log(locationDetails);
                res.push({
                    name: citiesData[i].name,
                    value: locationDetails.concat(citiesData[i].num)
                });
            }
            return res;
        };

        //取数量最大的三个数放进数组以排序
        var topThreeValue =[];
        for(var i = 0, l = citiesData.length; i < l; i++) {
            for(var j = i + 1; j < l; j++)
                if (citiesData[i].num === citiesData[j].num) j = ++i;
            topThreeValue.push(citiesData[i].num);
        }
        var topThree = (topThreeValue.sort(function (a, b) {
            return b - a ;
        }).slice(0, 3));

        console.log("topThree=" + topThree);

        var option = {
            //backgroundColor: '#404a59',
            title: {
                left: 'center',
                textStyle: {
                    color: '#fff'
                }
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                y: 'bottom',
                x: 'right',
                textStyle: {
                    color: '#fff'
                }
            },
            geo: {
                map: 'china',
                label: {
                    emphasis: {
                        show: false
                    }
                },
                //roam: true,//设置地图是否可缩放
                itemStyle: {
                    normal: {
                        areaColor: '#0a3d60',
                        borderColor: '#1fdffb',
                        borderWidth: 1
                    },
                    emphasis: {
                        areaColor: '#0a3d60'
                    }
                }
            },
            series: [
                {
                    name: '常驻城市',
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    data: convertData(citiesData),

                    //symbolSize: [11, 11],
                    symbolSize: function (val) {
                        if (val[2] == topThree[0]) {
                            return [37, 37];
                        } else if (val[2] == topThree[1]) {
                            return [21, 21];
                        } else if (val[2] == topThree[2]) {
                            return [17, 17];
                        } else {
                            return [11, 11];
                        }
                    },

                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#fffd3f',
                            opacity: '1.0'
                        }
                    }
                },
                //{
                //    name: 'Top 3',
                //    type: 'effectScatter',
                //    coordinateSystem: 'geo',
                //    data: convertData(data.sort(function (a, b) {
                //        return b.value - a.value;
                //    }).slice(0, 3)),
                //
                //    symbolSize: function (val) {
                //        if (val[2] == topThree[0]) {
                //            return [37, 37];
                //        } else if (val[2] == topThree[1]) {
                //            return [21, 21];
                //        } else if (val[2] == topThree[2]) {
                //            return [17, 17];
                //        }
                //        //return val[2] / 10;
                //    },
                //    showEffectOn: 'render',
                //    rippleEffect: {
                //        brushType: 'stroke'
                //    },
                //    hoverAnimation: true,
                //    label: {
                //        normal: {
                //            formatter: '{b}',
                //            position: 'right',
                //            show: true
                //        }
                //    },
                //    itemStyle: {
                //        normal: {
                //            color: '#f4e925',
                //            shadowBlur: 10,
                //            shadowColor: '#333'
                //        }
                //    },
                //    zlevel: 1
                //}
            ]
        };

        citiesScatter.setOption(option);
    };

    exports.initCitiesScatter = initCitiesScatter;
});