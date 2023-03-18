<template>

  <div>
    <el-row>
      <el-col :span="12">
        <el-card class="picture-card">
          <div id="temperature-change" class="picture">
            <el-empty :image-size="150" v-if="tc"></el-empty>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="picture-card">
          <div id="report-address" class="picture">
            <el-empty :image-size="150" v-if="ra"></el-empty>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-card class="picture-card">
          <div id="infected-days" class="picture">
            <el-empty :image-size="150" v-if="inf"></el-empty>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="picture-card">
          <div id="eo-days" class="picture">
            <el-empty :image-size="150" v-if="eo"></el-empty>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>

</template>

<script>
import * as echarts from 'echarts';
import { temperatureLine, infectedSpanBar, locationPie, numOutEnterBar } from '@/api/statistics/statistics'
import { parseTime } from '@/utils/common'

export default {
  name: 'index',

  data() {
    return {
      tc: true,
      ra: true,
      inf: true,
      eo: true,

    }
  },

  created() {
    this.temperatureLine();
    this.infectedSpanBar();
    this.locationPie();
    this.numOutEnterBar();
  },

  mounted() {
  },

  methods: {


    //获取体温信息并渲染折线图
    temperatureLine() {
      let label = [], value = [];
      temperatureLine().then(response => {
        if (response.data.length !== 0 && response.data !== undefined) {
          this.tc = false
          response.data.forEach(item => {
            label.unshift(parseTime(item.createTime, '{m}-{d}'));
            value.unshift(item.temperature);
          });
          this.myLine(label, value);
        }

      });
    },

    //获取报备地址信息并渲染饼图
    locationPie() {
      let pieData = [];
      locationPie().then(response => {
          if (response.data.length !== 0 && response.data !== undefined) {
            this.ra = false
            response.data.forEach(item => {
              let obj = {}
              obj.value = item.num;
              obj.name = item.location
              pieData.push(obj)
            });
            this.myPie(pieData);
          }

      });
    },

    //获取感染信息并渲染柱状图
    infectedSpanBar() {
      let label = [], value = [];
      infectedSpanBar().then(response => {
        if (response.data.length !== 0 && response.data !== undefined) {
            this.inf = false
            response.data.forEach(item => {
              let ct = parseTime(item.createTime, '{y}-{m}-{d}')
              let rt = parseTime(item.recoveryTime, '{m}-{d}');
              rt = rt === null? "" : rt
              label.push(ct + "→" + rt);
              value.push(item.infectedSpan);
            });
            this.myBar("infected-days", '感染起恢复康复天数', '持续天数', ['#05d3a3'], label, value)
          }
      });
    },

    numOutEnterBar() {
      let label = ['出校', '入校'], value = [];
      numOutEnterBar().then(response => {
          if (response.data[0] !== 0 || response.data[1] !== 0) {
            this.eo = false
            value = response.data
            this.myBar("eo-days", "今日出入校情况", "次数", ['#01a4b7'], label, value)
          }

      });
    },

    // 绘制柱状图
    myBar(dom, title, seriesName, color, label, value) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById(dom));

      // 绘制图表
      let option = {
        title: {
          text: title,
          textStyle: {
            fontSize: 15
          }
        },
        tooltip: {},
        xAxis: {
          data: label
        },
        yAxis: {},
        series: [
          {
            name: seriesName,
            type: 'bar',
            data: value
          }
        ],
        color: color
      };

      myChart.setOption(option);
    },

    // 绘制饼图
    myPie(pieDate) {
      let myChart = echarts.init(document.getElementById("report-address"));

      let option = {
        title: {
          text: '报备地址统计',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '地址:频率',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            labelLine: {
              show: false
            },
            data: pieDate
          }
        ]
      };

      myChart.setOption(option);
    },

    // 绘制折线图
    myLine(label, value) {

      let myChart = echarts.init(document.getElementById("temperature-change"));

      let option = {
        title: {
          text: '近七天体温变化/°C',
          textStyle: {
            fontSize: 15
          }
        },
        xAxis: {
          type: 'category',
          data: label
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          trigger: 'axis'
        },
        series: [
          {
            data: value,
            type: 'line',
            smooth: true
          }
        ],
        color: ['#65b6cb']
      };

      myChart.setOption(option);
    }
  }
}
</script>

<style scoped>
.picture-card {
  margin: 10px;
  height: 310px;
}
.picture {
  height: 310px;
  width: 100%;
}
</style>
