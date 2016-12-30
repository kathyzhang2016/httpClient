define(function (require, exports, module) {

    //初始化矩形树图的option
    var initInterestsTreeMap = function (data) {

        //function colorMappingChange(value) {
        //    var levelOption = getLevelOption(value);
        //    interestsTreeMap.setOption({
        //        series: [{
        //            levels: levelOption
        //        }]
        //    });
        //}
        var formatUtil = echarts.format;

        function getLevelOption() {
            return [
                {
                    color: ['#B67445', '#AB0B4A', '#61955D', '#075695', '#4A1D72'],
                    itemStyle: {
                        normal: {
                            borderWidth: 0,
                            gapWidth: 1
                        }
                    }
                },
                {
                    color: ['#F19149', '#B28A4C', '#BAB652', '#FFF45C'],
                    itemStyle: {
                        normal: {
                            gapWidth: 1
                        }
                    }
                },
                //{
                //    colorSaturation: [0.35, 0.5],
                //    itemStyle: {
                //        normal: {
                //            gapWidth: 1,
                //            borderColorSaturation: 0.6
                //        }
                //    }
                //}
            ];
        }

        var interestsOption = {
            roam: false,
            tooltip: {
                backgroundColor: 'none',
                formatter: function (info) {
                    var value = info.value;
                    var treePathInfo = info.treePathInfo;
                    var treePath = [];

                    for (var i = 1; i < treePathInfo.length; i++) {
                        treePath.push(treePathInfo[i].name);
                    }
                    var htmlContent = '<div class="tooltip_total"><span>' + formatUtil.encodeHTML(treePath.join('/')) + '</span><span>数量: ' + formatUtil.addCommas(value) + '</span></div>';

                    return htmlContent;
                    //return '数量' + value;
                }
            },

            series: [
                {
                    name: '消费品类',
                    type: 'treemap',
                    visibleMin: 300,
                    leafDepth: 1,
                    label: {
                        show: true,
                        //formatter: '{b}',
                        normal: {
                            position: [15, 15],
                            textStyle: {
                                fontSize: 24,
                                fontFamily: 'Microsoft YaHei',
                                color: '#ffffff'
                            }
                        }
                    },
                    roam: false,
                    itemStyle: {
                        normal: {
                            //borderColor: '#fff'
                        }
                    },
                    levels: getLevelOption(),
                    data: data,
                    breadcrumb: {
                        //bottom: 33,
                        height: 40,
                        itemStyle: {
                            normal: {
                                color: '#1D2949',
                                borderColor: '#fff',
                                //shadowBlur:0,
                                borderWidth: 0,
                                textStyle: {
                                    fontSize: 24,
                                    fontFamily: 'Microsoft YaHei',
                                    color: '#e9fdff',
                                    opacity: 1
                                }
                            },
                            emphasis: {
                                textStyle: {
                                    opacity: 0.4
                                }
                            }

                        }
                    }
                }
            ]
        };
        return interestsOption;

    };

    exports.initInterestsTreeMap = initInterestsTreeMap;

});