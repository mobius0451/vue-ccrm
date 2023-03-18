<template>

  <div>
    <el-row>
      <el-col :span="24">
        <el-card class="picture-card">
          <div id="eo-frequency" class="picture"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-card class="picture-card">
          <div id="out-time" class="picture"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { dayOutEnterLine, typeOutEnterRadar } from '@/api/statistics/statistics'

export default {
  name: 'index',

  data() {
    return {
      yi:'双折线图每日出入校人次',
      er: '出校时间散点图',
    }
  },

  created() {
    this.dayOutEnterLine();
    this.typeOutEnterRadar()
  },

  mounted() {
  },

  methods: {

    dayOutEnterLine() {
      let label = [], value1 = [], value2 = []
      dayOutEnterLine().then(response => {
        response.data[0].forEach(item => {
          label.unshift(item)
        });
        response.data[1].forEach(item => {
          value1.unshift(item)
        });;
        response.data[2].forEach(item => {
          value2.unshift(item)
        });;
        this.myLine(label, value1, value2);
      })
    },

    typeOutEnterRadar() {
      let label = [], value = []
      typeOutEnterRadar().then(response => {
        response.data[0].forEach(item => {
          let obj = {}
          if (item.out_type === '0') {
            obj.name = '临时出校'
          } else {
            obj.name = '固定出校'
          }
          obj.max = 10
          label.push(obj)
          value.push(item.num)
        });
        response.data[1].forEach(item => {
          let obj = {}
          if (item.enter_type === '0') {
            obj.name = '临时访校'
          } else if (item.enter_type === '1') {
            obj.name = '出校过期'
          } else {
            obj.name = '假期返校'
          }
          obj.max = 10
          label.push(obj)
          value.push(item.num)
        });
        this.myRadar(label, value)
      })
    },

    myLine(label, value1, value2) {
      let myChart = echarts.init(document.getElementById("eo-frequency"));

      let option = {
        title: {
          text: '近七日出入校人次情况'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {},
        toolbox: {
          show: false,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: label
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '出校人次',
            type: 'line',
            data: value1,
            smooth: true
          },
          {
            name: '入校人次',
            type: 'line',
            data: value2,
            smooth: true
          }
        ],
        color: ['#ff8b24', '#68ff30']
      };

      myChart.setOption(option);
    },

    myRadar(label, value) {
      let myChart = echarts.init(document.getElementById("out-time"));

      let option = {
        title: {
          text: '各类别分布情况'
        },
        radar: {
          // shape: 'circle',
          indicator: label
        },
        tooltip: {},
        series: [
          {
            name: 'Budget vs spending',
            type: 'radar',
            data: [
              {
                value: value,
                name: '人次'
              }
            ]
          }
        ],
        color: ['#757474']
      };

      myChart.setOption(option);
    },

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

