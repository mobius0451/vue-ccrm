<template>
  <div class="app-container">
    <el-row v-if="enterId !== 0">
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
          <div v-if="form.status == '0'">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
              <el-row>
                <el-col :span="24" v-if="enterId != 0">
                  <el-form-item label="申请编号: " prop="outId">
                    <span>{{ form.enterId }}</span>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="入校类型" prop="enterType">
                    <el-select v-model="form.enterType" placeholder="请选择入校类型">
                      <el-option
                        v-for="type in enterType"
                        :key="type.value"
                        :label="type.label"
                        :value="type.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="启程地" prop="departurePlace">
                    <el-cascader
                      ref="ownArea"
                      @change="selectArea"
                      :props="{value:'label', label: 'label', children: 'children'}"
                      :options="areaCity" v-model="form.departurePlace"
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
                  <el-form-item label="入校原因" prop="enterReason">
                    <el-input
                      type="textarea"
                      :rows="2"
                      placeholder="请输入内容"
                      v-model="form.enterReason">
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

                <el-col :span="7">
                  <el-form-item label="健康码" prop="healthyCode">
                    <el-upload
                      class="pic-uploader"
                      action="#"
                      :show-file-list="false"
                      :on-change="handlePreview1"
                      :before-upload="beforeUpload"
                      :auto-upload="false">
                      <img v-if="imageUrl1" :src="imageUrl1" class="pic" alt="">
                      <i v-else class="el-icon-plus pic-uploader-icon"></i>
                    </el-upload>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item prop="tripCode" label="行程码">
                    <el-upload
                      class="pic-uploader"
                      action="#"
                      :show-file-list="false"
                      :on-change="handlePreview2"
                      :before-upload="beforeUpload"
                      :auto-upload="false">
                      <img v-if="imageUrl2" :src="imageUrl2" class="pic" alt="">
                      <i v-else class="el-icon-plus pic-uploader-icon"></i>
                    </el-upload>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item prop="nucleicAcid" label="核酸证明">
                    <el-upload
                      class="pic-uploader"
                      action="#"
                      :show-file-list="false"
                      :on-change="handlePreview3"
                      :before-upload="beforeUpload"
                      :auto-upload="false">
                      <img v-if="imageUrl3" :src="imageUrl3" class="pic" alt="">
                      <i v-else class="el-icon-plus pic-uploader-icon"></i>
                    </el-upload>
                  </el-form-item>
                </el-col>

                <el-col :span="24" v-if="enterId != 0">
                  <el-form-item label="审批状态: " prop="status">
                    <my-tag :options="statusContent" :value="form.status"/>
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

          <div v-else>
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

                  <el-col :span="8">
                    <el-form-item label="健康码:" prop="healthyCode">
                      <img v-if="imageUrl1" :src="imageUrl1" class="pic" alt="">
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" >
                    <el-form-item prop="healthyCode" label="行程码:">
                      <img v-if="imageUrl2" :src="imageUrl2" class="pic" alt="">
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" >
                    <el-form-item prop="healthyCode" label="核酸证明:">
                      <img v-if="imageUrl3" :src="imageUrl3" class="pic" alt="">
                    </el-form-item>
                  </el-col>

                  <el-col :span="24" v-if="enterId != 0">
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
import {  getEnter,  addEnter, updateEnter } from "@/api/access/enter";
import {  uploads } from "@/api/common";
import { getUser } from '@/api/system/user'
import areaDict from "@/plugins/area"

export default {
  name: 'EditEnter',
  data() {
    return {
      areaCity: areaDict,
      enterId: 0,
      loading: false,
      user: {
        college:{}
      },
      form: {},
      healthyCode: "",
      tripCode: "",
      nucleicAcid: "",
      imageUrl1: "",
      imageUrl2: "",
      imageUrl3: "",
      healthyCodeFd: undefined,
      tripCodeFd: undefined,
      nucleicAcidFd: undefined,
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
      // 表单校验
      rules: {
        enterType: [
          { required: true, message: "入校类型不能为空", trigger: "blur" }
        ],
        enterReason: [
          { required: true, message: "入校原因不能为空", trigger: "blur" }
        ],
        departurePlace: [
          { required: true, message: "启程地不能为空", trigger: "blur" }
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
        tripCode: [
          { required: true, message: "行程码不能为空" , trigger: "change" }
        ],
        nucleicAcid: [
          { required: true, message: "核酸证明不能为空" , trigger: "change" }
        ],
      }
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
          if (response !== null) {
            if (response.data.status === '0') {
              response.data.departurePlace = response.data.departurePlace.split("/")
            }
            if (response.data.healthyCode === null || response.data.healthyCode === '') {
              this.imageUrl1 = "";
            } else {
              this.imageUrl1 = process.env.VUE_APP_BASE_API + response.data.healthyCode;
              this.healthyCode = response.data.healthyCode.split("/")[3];
            }
            if (response.data.tripCode === null || response.data.tripCode === '') {
              this.imageUrl2 = "";
            } else {
              this.imageUrl2 = process.env.VUE_APP_BASE_API + response.data.tripCode;
              this.tripCode = response.data.tripCode.split("/")[3];
            }
            if (response.data.nucleicAcid === null || response.data.nucleicAcid === '') {
              this.imageUrl3 = "";
            } else {
              this.imageUrl3 = process.env.VUE_APP_BASE_API + response.data.nucleicAcid;
              this.nucleicAcid = response.data.nucleicAcid.split("/")[3];
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
          if (Array.isArray(this.form.departurePlace)){
            this.form.departurePlace = this.form.departurePlace.join("/")
          }
          if (this.healthyCodeFd !== undefined && this.tripCodeFd !== undefined && this.nucleicAcidFd !== undefined) {
            let formData = new FormData();
            formData.append("files", this.healthyCodeFd.raw);
            formData.append("files", this.tripCodeFd.raw);
            formData.append("files", this.nucleicAcidFd.raw);
            uploads(formData).then(res => {
              this.healthyCode = res.data[0];
              this.tripCode = res.data[1];
              this.nucleicAcid = res.data[2];
            });
          }
          setTimeout(() => {
            this.form.healthyCode = this.healthyCode;
            this.form.tripCode = this.tripCode;
            this.form.nucleicAcid = this.nucleicAcid;
            if (this.form.enterId != undefined) {
              updateEnter(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.close();
              });
            } else {
              addEnter(this.form).then(response => {
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
    handlePreview1(file) {
      // 存储图片，点击确认按钮时统一上传
      this.imageUrl1 = URL.createObjectURL(file.raw);
      this.form.healthyCode = file.name;
      this.healthyCodeFd = file
    },
    handlePreview2(file) {
      // 存储图片，点击确认按钮时统一上传
      this.imageUrl2 = URL.createObjectURL(file.raw);
      this.form.tripCode = file.name;
      this.tripCodeFd = file
    },
    handlePreview3(file) {
      // 存储图片，点击确认按钮时统一上传
      this.imageUrl3 = URL.createObjectURL(file.raw);
      this.form.nucleicAcid = file.name;
      this.nucleicAcidFd = file
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
