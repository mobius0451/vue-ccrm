<template>
  <div class="main-class" v-if="showList == false" v-loading="formLoading">

    <el-steps :active="active" align-center style="margin-top: 20px">
      <el-step title="填写" description="请填写相关信息"></el-step>
      <el-step title="确认" description="确认信息无误"></el-step>
      <el-step title="完成" description="完成健康报备"></el-step>
    </el-steps>

    <div class="content">
      <div v-show="active === 1" style="text-align: center">
        <el-form ref="form" :model="form" :rules="rules" style="display: inline-block">
          <el-form-item label="1. 当前身体健康状况：" prop="bodyCondition">
            <el-radio-group v-model="form.bodyCondition">
              <el-radio :label=0><span>正常</span></el-radio>
              <el-radio :label=1><span>有发热咳嗽</span></el-radio>
              <el-radio :label=2><span>其他不正常状况</span></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="2. 当前体温/°C：" prop="temperature">
            <el-input v-model="form.temperature" placeholder="请输入当前体温" clearable />
          </el-form-item>
          <el-form-item label="3. 抗原或核酸检测情况是否异常：" prop="testing">
            <el-radio-group v-model="form.testing">
              <el-radio :label=0><span>否</span></el-radio>
              <el-radio :label=1><span>是</span></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="4. 是否接触新冠阳性患者：" prop="touch" style="width: 460px">
            <el-radio-group v-model="form.touch">
              <el-radio :label=0><span>否</span></el-radio>
              <el-radio :label=1><span>是</span></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="5. 请选择报备所在的位置信息：" prop="location">
            <el-cascader
              ref="ownArea"
              @change="selectArea"
              :props="{value:'label', label: 'label', children: 'children'}"
              :options="areaCity" v-model="form.location"
              props.expandTrigger="hover"
              clearable placeholder="请选择地区位置">
            </el-cascader>
          </el-form-item>
        </el-form>
      </div>

      <div v-show="active === 2" style="text-align: center">
        <el-form ref="form" :model="form" :rules="rules" style="display: inline-block">
          <el-form-item label="1. 当前身体健康状况：" prop="bodyCondition">
            <el-radio-group v-model="form.bodyCondition" disabled>
              <el-radio :label=0><span>正常</span></el-radio>
              <el-radio :label=1><span>有发热咳嗽</span></el-radio>
              <el-radio :label=2><span>其他不正常状况</span></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="2. 当前体温/°C：" prop="temperature">
            <el-input v-model="form.temperature" placeholder="请输入当前体温" clearable disabled />
          </el-form-item>
          <el-form-item label="3. 抗原或核酸检测情况是否异常：" prop="testing">
            <el-radio-group v-model="form.testing" disabled>
              <el-radio :label=0><span>否</span></el-radio>
              <el-radio :label=1><span>是</span></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="4. 是否接触新冠阳性患者：" prop="touch" style="width: 460px">
            <el-radio-group v-model="form.touch" disabled>
              <el-radio :label=0><span>否</span></el-radio>
              <el-radio :label=1><span>是</span></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="5. 请选择打卡时所在的位置信息：" prop="location">
            <el-cascader
              ref="ownArea"
              @change="selectArea"
              :props="{value:'label', label: 'label', children: 'children'}"
              :options="areaCity" v-model="form.location"
              props.expandTrigger="hover"
              clearable placeholder="请选择地区位置">
            </el-cascader>
          </el-form-item>
        </el-form>
      </div>

      <div v-show="active === 3">
        <el-result v-if="code === 200" icon="success" title="今日报备成功" subTitle="请根据提示进行操作">
        </el-result>
        <el-result v-else icon="error" title="报备失败" subTitle="请根据提示进行操作">
        </el-result>
      </div>
    </div>

    <div class="group">
      <el-button style="margin-top: 12px;" v-show="active > 1 && active < 3" @click="before">上一步</el-button>
      <el-button style="margin-top: 12px;" v-show="active < 2" type="primary" @click="next">下一步</el-button>
      <el-button style="margin-top: 12px;" v-show="active === 2" type="primary" @click="submitForm">提交</el-button>
      <el-button style="margin-top: 12px;" v-show="active === 3" @click="editReport">修改报备信息</el-button>
      <el-button style="margin-top: 12px;" v-show="active === 3" type="primary" @click="showReportList">查看报备记录</el-button>
    </div>
  </div>

  <div v-else-if="showList == true">

      <el-page-header @back="goBack" style="margin: 5px 30px"/>

      <el-table v-loading="tableLoading" :data="reportList" >
        <el-table-column label="序号" align="center"  type="index" width="50" />
        <el-table-column label="报备者" align="center" prop="createBy" />
        <el-table-column label="身体状况" align="center" prop="bodyCondition" :show-overflow-tooltip="true" />
        <el-table-column label="体温" align="center" prop="temperature" :show-overflow-tooltip="true" />
        <el-table-column label="抗原或核酸检测情况是否异常" align="center" prop="testing" :show-overflow-tooltip="true"/>
        <el-table-column label="是否接触新冠阳性患者" align="center" prop="touch" :show-overflow-tooltip="true"/>
        <el-table-column label="报备地址" align="center" prop="location" :show-overflow-tooltip="true"/>
        <el-table-column label="报备时间" align="center" prop="createTime" >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
  </div>

</template>

<script>
import { addReport, listReport, todayReport } from '@/api/healthy/report'
import areaDict from "@/plugins/area"

export default {
  name: "Report",
  data() {
    return {
      // 表格遮罩层
      tableLoading: true,
      // 表单遮罩层
      formLoading: true,
      //引用地区
      areaCity: areaDict,
      //是否显示报备列表信息
      showList: false,
      // 报备表格数据
      reportList: [],
      //激活页
      active: 1,
      //返回码
      code: undefined,
      form: {
        userId: undefined,
        bodyCondition: 0,
        temperature: undefined,
        testing: 0,
        touch: 0,
        location: [],
      },
      rules: {
        bodyCondition: [
          { required: true, message: "身体健康状况不能为空", trigger: "blur" }
        ],
        temperature: [
          { required: true, message: "体温信息不能为空", trigger: "blur" },
          { required: true,  trigger: "blur" }
        ],
        testing: [
          { required: true, message: "健康信息不能为空", trigger: "blur" }
        ],
        touch: [
          { required: true, message: "健康信息不能为空", trigger: "blur" }
        ],
        location: [
          { required: true, message: "报备地址信息不能为空", trigger: "blur" }
        ]
      },
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  created() {
   this.checkTodayReport();
  },

  methods: {
    selectArea () {
      this.$refs.ownArea.dropDownVisible = false
    },

    next() {
      this.$refs.form.validate(valid => {
        if (valid){
          if (this.active < 3){
            this.active++
            if(this.active === 2){
              this.$message.info('请确认填写信息无误');
            }
          }
        }else {
          this.$message.error('请正确输入报备信息！');
          return false
        }
      })
    },

    before(){
      if (this.active > 1){
        this.active--;
      }
    },

    submitForm (){
      this.$refs.form.validate(valid => {
        if (valid){
          if (Array.isArray(this.form.location)){
            this.form.location = this.form.location.join("/")
          }
          addReport(this.form).then(res => {
            this.code = res.code;
            if (res.msg == "SAVE"){
              this.$notify({
                title: '您成为新冠阳性患者',
                message: '请前往 “重症管理”>“重症登记” 完成重症信息登记！',
                type: 'warning',
                duration: 0
              });
              setTimeout(() => {
                this.$notify({
                  title: '消息',
                  message: '您新增了一条感染记录。',
                  type: 'info'
                });
              }, 200);
            }
            this.checkTodayReport();
          });
        }
      })
    },

    checkTodayReport() {
      this.formLoading = true;
      todayReport().then(res => {
        if(res.data == 0) {
          this.active = 1;
        } else {
          this.code = res.code;
          this.active = 3;
          res.data.location = res.data.location.split("/")
          this.form = res.data;
        }
        this.formLoading = false;
      });

    },

    editReport() {
      this.$confirm('每日只能修改一次报备新信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (null != this.form.updateTime) {
          this.$message({
            type: 'warning',
            message: '今日已修改'
          });
        } else {
          this.active = 1;
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作已取消'
        });
      });
    },

    showReportList() {
      this.showList = true;
      this.getList();
    },

    getList(){
      this.tableLoading = true;
      listReport(this.queryParams).then(response => {
        this.reportList = response.data.records;
        this.reportList.forEach(item => {
          if (item.bodyCondition == 0){
            item.bodyCondition = "正常";
          }
          else if (item.bodyCondition == 1) {
            item.bodyCondition = "发热咳嗽";
          }
          else {
            item.bodyCondition = "其他不正常状况";
          }
          item.testing = item.testing === 0?'否':'是';
          item.touch = item.touch === 0?'否':'是';
        })
        this.total = response.data.total;
        this.tableLoading = false;
      });
    },

    goBack() {
      this.showList = false;
    }

  }

};
</script>

<style lang="scss" scoped>
.group{
  text-align: center;
}
.content{
  margin: 25px auto;
}
.el-form-item {
  margin-bottom: 10px !important;
}
// 级联下拉框单选 文字选中样式
.selectArea {
  .el-radio {
    width: 100%;
    height: 100%;
    z-index: 10;
    position: absolute;
  }
  .is-disabled {
    cursor: not-allowed;
  }
  .el-radio__input {
    visibility: hidden;
  }
}
</style>
