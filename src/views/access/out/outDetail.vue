<template>
  <div class="app-container">
    <el-row v-if="outId !== 0">
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
            <span>出校申请信息</span>
          </div>
          <div v-if="form.status == '0'">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
              <el-row>
                <el-col :span="24" v-if="outId != 0">
                  <el-form-item label="申请编号: " prop="outId">
                    <span>{{ form.outId }}</span>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="出校类型" prop="outType">
                    <el-select v-model="form.outType" placeholder="请选择出校类型">
                      <el-option
                        v-for="type in outType"
                        :key="type.value"
                        :label="type.label"
                        :value="type.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="出校去向" prop="outWhere">
                    <el-cascader
                      ref="ownArea"
                      @change="selectArea"
                      :props="{value:'label', label: 'label', children: 'children'}"
                      :options="areaCity" v-model="form.outWhere"
                      props.expandTrigger="hover"
                      clearable placeholder="请选择地区位置">
                    </el-cascader>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="开始时间" prop="beginTime">
                    <el-date-picker
                      v-model="form.beginTime"
                      type="date"
                      placeholder="选择日期时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="结束时间" prop="overTime">
                    <el-date-picker
                      v-model="form.overTime"
                      type="date"
                      placeholder="选择日期时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item label="出校原因" prop="outReason">
                    <el-input
                      type="textarea"
                      :rows="2"
                      placeholder="请输入内容"
                      v-model="form.outReason">
                    </el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="联系电话" prop="contact">
                    <el-input v-model="form.contact" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="紧急联系" prop="emergencyContact">
                    <el-input v-model="form.emergencyContact" />
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item label="健康码" prop="healthyCode">
                    <el-upload
                      class="pic-uploader"
                      action="#"
                      :show-file-list="false"
                      :on-change="handlePreview"
                      :before-upload="beforeUpload"
                      :auto-upload="false">
                      <img v-if="imageUrl" :src="imageUrl" class="pic" alt="">
                      <i v-else class="el-icon-plus pic-uploader-icon"></i>
                    </el-upload>
                  </el-form-item>
                </el-col>

                <el-col :span="24" v-if="outId != 0">
                  <el-form-item label="审批状态: " prop="status">
                    <my-tag :options="statusContent" :value="form.status"/>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item>
                    <el-button type="primary" size="mini" @click="submitForm">保存</el-button>
                    <el-button type="danger" size="mini" @click="close">关闭</el-button>
                  </el-form-item>
              </el-col>

              </el-row>
            </el-form>
          </div>
          <div v-else>
            <el-form ref="form" :model="form" label-width="80px">
              <el-row>
                <el-col :span="24" v-if="outId != 0">
                  <el-form-item label="申请编号: " prop="outId">
                    <span>{{ form.outId }}</span>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="出校类型: " prop="outType">
                    <my-tag :options="outType" :value="form.outType"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="出校去向: " prop="outWhere">
                    <span>{{ form.outWhere }}</span>
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
                  <el-form-item label="出校原因: " prop="outReason">
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

                <el-col :span="24">
                  <el-form-item label="健康码: " prop="healthyCode">
                    <img v-if="imageUrl" :src="imageUrl" class="pic" alt="">
                  </el-form-item>
                </el-col>

                <el-col :span="24" v-if="outId != 0">
                  <el-form-item label="审批状态: " prop="status">
                    <my-tag :options="statusContent" :value="form.status"/>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item>
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
import {  getOut,  addOut, updateOut } from "@/api/access/out";
import {  upload } from "@/api/common";
import { getUser } from '@/api/system/user'
import areaDict from "@/plugins/area"


export default {
  name: 'EditOut',
  data() {
    return {
      areaCity: areaDict,
      outId: 0,
      loading: false,
      user: {
        college:{}
      },
      form: {},
      healthyCode: "",
      imageUrl: "",
      healthyCodeFd: undefined,
      //状态内容
      statusContent:[{
        label: "审核中",
        value: "0",
        raw: {
          listClass: "primary",
          cssClass: ""
        }
      }, {
        label: "审核通过",
        value: "1",
        raw: {
          listClass: "success",
          cssClass: ""
        }
      },{
        label: "拒绝申请",
        value: "2",
        raw: {
          listClass: "danger",
          cssClass: ""
        }
      }],
      //出校类型
      outType:[{
        label: "临时出校",
        value: "0",
        raw: {
          listClass: "warning",
          cssClass: ""
        }
      }, {
        label: "固定出校",
        value: "1",
        raw: {
          listClass: "primary",
          cssClass: ""
        }
      }],
      // 表单校验
      rules: {
        outType: [
          { required: true, message: "出校类型不能为空", trigger: "blur" }
        ],
        outReason: [
          { required: true, message: "出校原因不能为空", trigger: "blur" }
        ],
        outWhere: [
          { required: true, message: "出校去向不能为空", trigger: "blur" }
        ],
        beginTime: [
          { required: true, message: "开始时间不能为空", trigger: "blur" }
        ],
        overTime: [
          { required: true, message: "结束时间不能为空", trigger: "blur" }
        ],
        contact: [
          { required: true, message: "联系方式不能为空", trigger: "blur" }
        ],
        healthyCode: [
          { required: true, message: "健康码不能为空" , trigger: "change" }
        ],
      }
    };
  },
  created() {
    const outId = this.$route.params && this.$route.params.outId;
    this.loadingData(outId);
  },
  methods: {
    //加载数据
    loadingData(outId) {
      if (outId != 0) {
        this.outId = outId
        this.reset();
        this.loading = true;
        getOut(outId).then((response) => {
          if (response !== null) {
            if (response.data.status === '0') {
              response.data.outWhere = response.data.outWhere.split("/")
            }
            if (response.data.healthyCode === null || response.data.healthyCode === '') {
              this.imageUrl = "";
            } else {
              this.imageUrl =  process.env.VUE_APP_BASE_API + response.data.healthyCode;
              this.healthyCode = response.data.healthyCode.split("/")[3];
            }
            this.form = response.data;
            getUser(response.data.userId).then((res) => {
              this.user = res.data;
              if (this.user.sex === '1') {
                this.user.sex = '女';
              } else {
                this.user.sex = '男'
              }
            });
          }
          this.loading = false;
        });
      } else {
        this.reset();
      }
    },

    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (Array.isArray(this.form.outWhere)){
            this.form.outWhere = this.form.outWhere.join("/")
          }
          if (this.healthyCodeFd !== undefined) {
            upload(this.healthyCodeFd).then(res => {
              this.healthyCode = res.msg;
            });
          }
          setTimeout(() => {
            this.form.healthyCode = this.healthyCode;
            if (this.form.outId != undefined) {
              updateOut(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.close();
              });
            } else {
              addOut(this.form).then(response => {
                this.$modal.msgSuccess("申请成功");
                this.close();
              });
            }
          }, 500);
        }
      });
    },
    // 表单重置
    reset() {
      this.form = {
        outId: undefined,
        outType: undefined,
        outReason: undefined,
        outWhere: undefined,
        beginTime: undefined,
        overTime: undefined,
        contact: undefined,
        emergencyContact: undefined,
        healthyCode: undefined,
        status: "0"
      };
      this.resetForm("form");
    },
    /** 关闭按钮 */
    close() {
      const obj = { path: "/access/out" };
      this.$tab.closeOpenPage(obj);
    },
    selectArea () {
      this.$refs.ownArea.dropDownVisible = false
    },
    requestUpload() {},
    // 上传预处理
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    handlePreview(file) {
        let fd = new FormData()
        fd.append('file', file.raw)
        // 存储图片，点击确认按钮时统一上传
        this.imageUrl = URL.createObjectURL(file.raw);
        this.form.healthyCode = file.name;
        this.healthyCodeFd = fd
    },
  },
}
</script>

<style scoped>
.pic-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 250px;
  height: 520px;
  text-align: center;
}
.avatar-uploader :hover {
  border-color: #409EFF;
}
.pic-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 110px;
  height: 110px;
  line-height: 110px;
  text-align: center;
  padding-top: 215px;
}
.pic {
  width: 250px;
  height: 520px;
  display: block;
}
.box-card {
  margin-bottom: 15px;
}
</style>
