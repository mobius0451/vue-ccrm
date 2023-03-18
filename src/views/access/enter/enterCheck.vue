<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <el-card class="box-card">
          <el-descriptions title="用户信息">
            <el-descriptions-item label="用户名"> {{ user.userName }} </el-descriptions-item>
            <el-descriptions-item label="姓名"> {{ user.nickName }} </el-descriptions-item>
            <el-descriptions-item label="性别"> {{ user.sex }} </el-descriptions-item>
            <el-descriptions-item label="学院班级"> {{ user.college.collegeName }} </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>入校申请信息</span>
          </div>
          <div>
            <el-form ref="form" :model="form" label-width="80px">
              <el-row>
                <el-col :span="24" v-if="enterId != 0">
                  <el-form-item label="申请编号: " prop="enterId">
                    <span>{{ form.enterId }}</span>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="入校类型: " prop="enterType">
                    <my-tag :options="enterType" :value="form.enterType"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="启程地: " prop="departurePlace">
                    <span>{{ form.departurePlace }}</span>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="开始时间: " prop="beginTime">
                    <span>{{ form.beginTime }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="结束时间: " prop="overTime">
                    <span>{{ form.overTime }}</span>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item label="入校原因: " prop="enterReason">
                    <el-input
                      type="textarea"
                      :rows="2"
                      placeholder="请输入内容"
                      readonly
                      v-model="form.outReason">
                    </el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="联系电话: " prop="contact">
                    <span>{{ form.contact }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="紧急联系: " prop="emergencyContact">
                    <span>{{ form.emergencyContact }}</span>
                  </el-form-item>
                </el-col>

                <el-col :span="7">
                  <el-form-item label="健康码:" prop="healthyCode">
                    <img v-if="imageUrl1" :src="imageUrl1" class="pic" alt="">
                  </el-form-item>
                </el-col>
                <el-col :span="7" >
                  <el-form-item prop="healthyCode" label="行程码:">
                    <img v-if="imageUrl2" :src="imageUrl2" class="pic" alt="">
                  </el-form-item>
                </el-col>
                <el-col :span="7" >
                  <el-form-item prop="healthyCode" label="核酸证明:">
                    <img v-if="imageUrl3" :src="imageUrl3" class="pic" alt="">
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item label="审批状态" prop="status">
                    <el-select v-model="form.status">
                      <el-option
                        v-for="type in examine"
                        :key="type.value"
                        :label="type.label"
                        :value="type.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item>
                    <el-button type="primary" size="mini" @click="submitForm" v-hasPermi="['access:enter:edit']">保存</el-button>
                    <el-button type="danger" size="mini" @click="close">关闭</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getUser } from '@/api/system/user'
import { getEnter, updateEnter } from '@/api/access/enter'


export default {
  name: 'ReadEnter',
  data() {
    return {
      enterId: 0,
      loading: false,
      user: {
        college:{}
      },
      form: {},
      imageUrl1: "",
      imageUrl2: "",
      imageUrl3: "",
      //审核内容
      examine:[{
        label: "审核中",
        value: "0",
      },{
        label: "审核通过",
        value: "1",
      },{
        label: "拒绝申请",
        value: "2",
      }],
      //入校类型
      enterType:[{
        label: "临时访校",
        value: "0",
        raw: {
          listClass: "warning",
          cssClass: ""
        }
      }, {
        label: "出校过期",
        value: "1",
        raw: {
          listClass: "primary",
          cssClass: ""
        }
      },{
        label: "假期返校",
        value: "2",
        raw: {
          listClass: "success",
          cssClass: ""
        }
      }],
    };
  },
  created() {
    const enterId = this.$route.params && this.$route.params.enterId;
    this.loadingData(enterId);
  },
  methods: {

    loadingData(enterId) {
      if (enterId != 0) {
        this.enterId = enterId
        this.reset();
        this.loading = true;
        getEnter(enterId).then((response) => {
          this.imageUrl1 =  process.env.VUE_APP_BASE_API + response.data.healthyCode;
          this.imageUrl2 =  process.env.VUE_APP_BASE_API + response.data.tripCode;
          this.imageUrl3 =  process.env.VUE_APP_BASE_API + response.data.nucleicAcid;
          this.form = response.data;
          getUser(response.data.userId).then((res) => {
            this.user = res.data;
            if (this.user.sex === '1') {
              this.user.sex = '女';
            } else {
              this.user.sex = '男'
            }
          });
          this.loading = false;
        });
      } else {
        this.reset();
      }
    },

    /** 提交按钮 */
    submitForm: function() {
      this.form.healthyCode = this.form.healthyCode.split("/")[3]
      this.form.tripCode = this.form.tripCode.split("/")[3]
      this.form.nucleicAcid = this.form.nucleicAcid.split("/")[3]
      updateEnter(this.form).then(response => {
        this.$modal.msgSuccess("审批成功");
        this.close(this.form.healthyCode);
      });
    },
    // 表单重置
    reset() {
      this.form = {
        enterId: undefined,
        enterType: undefined,
        enterReason: undefined,
        departurePlace: undefined,
        beginTime: undefined,
        overTime: undefined,
        contact: undefined,
        emergencyContact: undefined,
        healthyCode: undefined,
        tripCode: undefined,
        nucleicAcid: undefined,
        status: "0"
      };
      this.resetForm("form");
    },
    /** 关闭按钮 */
    close() {
      const obj = { path: "/access/enter" };
      this.$tab.closeOpenPage(obj);
    },
    selectArea () {
      this.$refs.ownArea.dropDownVisible = false
    },
  },
}
</script>

<style scoped>
.pic {
  width: 250px;
  height: 520px;
  display: block;
}
.box-card {
  margin-bottom: 15px;
}
</style>
