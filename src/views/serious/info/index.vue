<template>
  <div class="main-class" v-if="showInfo == false">

    <el-steps :active="active" finish-status="success" simple style="margin: 20px">
      <el-step title="填写"></el-step>
      <el-step title="确认"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>

    <div class="content">
      <div v-show="active === 1" style="text-align: center">
        <el-form ref="form" :model="form" :rules="rules" style="display: inline-block">
          <el-form-item label="1. 年龄是否>65：" prop="age">
            <el-radio-group v-model="form.age">
              <el-radio :label=0><span>否</span></el-radio>
              <el-radio :label=1><span>是</span></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="2. 是否完成全程疫苗接种：" prop="vaccines">
            <el-radio-group v-model="form.vaccines">
              <el-radio :label=0><span>否</span></el-radio>
              <el-radio :label=1><span>是</span></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="3. 是否合并较为严重慢性疾病(高血压、糖尿病等)：" prop="withDisease">
            <el-radio-group v-model="form.withDisease">
              <el-radio :label=0><span>否</span></el-radio>
              <el-radio :label=1><span>是</span></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="4. 是否有呼吸频率增快、持续性高热、浑身肌肉疼痛等症状：" prop="discomfort" style="width: 550px">
            <el-radio-group v-model="form.discomfort">
              <el-radio :label=0><span>否</span></el-radio>
              <el-radio :label=1><span>是</span></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>

      <div v-show="active === 2" style="text-align: center">
        <el-form ref="form" :model="form" :rules="rules" style="display: inline-block">
          <el-form-item label="1. 年龄是否>65：" prop="age">
            <el-radio-group v-model="form.age" disabled>
              <el-radio :label=0><span>否</span></el-radio>
              <el-radio :label=1><span>是</span></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="2. 是否完成全程疫苗接种：" prop="vaccines">
            <el-radio-group v-model="form.vaccines" disabled>
              <el-radio :label=0><span>否</span></el-radio>
              <el-radio :label=1><span>是</span></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="3. 是否合并较为严重慢性疾病(高血压、糖尿病等)：" prop="withDisease">
            <el-radio-group v-model="form.withDisease" disabled>
              <el-radio :label=0><span>否</span></el-radio>
              <el-radio :label=1><span>是</span></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="4. 是否有呼吸频率增快、持续性高热、浑身肌肉疼痛等症状：" prop="discomfort" style="width: 550px">
            <el-radio-group v-model="form.discomfort" disabled>
              <el-radio :label=0><span>否</span></el-radio>
              <el-radio :label=1><span>是</span></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>

      <div v-show="active === 3">
        <el-result v-if="code === 200" icon="success" title="重症登记成功" subTitle="请根据提示进行操作">
        </el-result>
        <el-result v-else icon="error" title="登记失败" subTitle="请根据提示进行操作">
        </el-result>
      </div>
    </div>

    <div class="group">
      <el-button style="margin-top: 12px;" v-show="active > 1 && active < 3" @click="before">上一步</el-button>
      <el-button style="margin-top: 12px;" v-show="active < 2" type="primary" @click="next">下一步</el-button>
      <el-button style="margin-top: 12px;" v-show="active === 2" type="primary" @click="submitForm">提交</el-button>
      <el-button style="margin-top: 12px;" type="primary" @click="showSeriousInfo">查看登记记录</el-button>
    </div>
  </div>

  <div v-else-if="showInfo == true">

    <el-page-header @back="goBack" style="margin: 5px 30px"/>

    <el-card class="main-contain" v-if="info !== undefined">
      <el-descriptions title="重症登记信息">
        <el-descriptions-item label="登记人"> {{ info.createBy }} </el-descriptions-item>
        <el-descriptions-item label="登记时间"> {{ parseTime(info.createTime, '{y}-{m}-{d}') }} </el-descriptions-item>
        <el-descriptions-item label="年龄是否>65">
          <my-tag :options="resultIs" :value="info.age"/>
        </el-descriptions-item>
        <el-descriptions-item label="是否完成全程疫苗接种">
          <my-tag :options="resultNot" :value="info.vaccines"/>
        </el-descriptions-item>
        <el-descriptions-item label="是否合并较为严重慢性疾病">
          <my-tag :options="resultIs" :value="info.withDisease"/>
        </el-descriptions-item>
        <el-descriptions-item label="是否有呼吸频率增快、持续性高热、浑身肌肉疼痛等症状">
          <my-tag :options="resultIs" :value="info.discomfort"/>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-empty :image-size="200" v-if="info === undefined"></el-empty>
  </div>

</template>

<script>
import { addSeriousInfo, getSeriousInfo, updateSeriousInfo } from '@/api/serious/info'

export default {
  name: "SeriousInfo",
  data() {
    return {
      // 表格遮罩层
      Loading: true,
      //是否显示报备列表信息
      showInfo: false,
      // 表格数据
      info: undefined,
      //激活页
      active: 1,
      //返回码
      code: undefined,
      form: {
        age: 0,
        vaccines: 1,
        withDisease: 0,
        discomfort: 0,
      },
      rules: {
        age: [
          { required: true, message: "登记信息不能为空", trigger: "blur" }
        ],
        vaccines: [
          { required: true, message: "登记信息不能为空", trigger: "blur" }
        ],
        withDisease: [
          { required: true, message: "登记信息不能为空", trigger: "blur" }
        ],
        discomfort: [
          { required: true, message: "登记信息不能为空", trigger: "blur" }
        ]
      },
      //结果内容(反)
      resultIs:[{
        label: "否",
        value: "0",
        raw: {
          listClass: "success",
          cssClass: ""
        }
      }, {
        label: "是",
        value: "1",
        raw: {
          listClass: "danger",
          cssClass: ""
        }
      }],
      //结果内容
      resultNot:[{
        label: "否",
        value: "0",
        raw: {
          listClass: "danger",
          cssClass: ""
        }
      }, {
        label: "是",
        value: "1",
        raw: {
          listClass: "success",
          cssClass: ""
        }
      }],
    };
  },

  created() {
    this.getInfo();
    setTimeout(() => {
      this.showTips()
    }, 400)
  },

  methods: {

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
          if (this.info === undefined) {
            addSeriousInfo(this.form).then(res => {
              this.code = res.code;
              this.active = 3;
            });
          } else {
            updateSeriousInfo(this.form).then(res => {
              this.code = res.code;
              this.active = 3;
            })
          }
        }
      })
    },

    showSeriousInfo() {
      this.showInfo = true;
      this.getInfo();
    },

    getInfo(){
      this.Loading = true;
      getSeriousInfo().then(response => {
        if (response != null) {
          this.info = response.data;
          this.form = response.data;
        }
        this.Loading = false;
      });
    },

    showTips() {
      if (this.info === undefined) {
        this.$message({
          showClose: true,
          message: '未查询到你的重症登记记录，请如实填写登记',
          type: 'warning',
        });
      } else {
        this.$message({
          showClose: true,
          message: '查询到您的重证登记记录，若有需要请如实修改登记',
          type: 'success',
        });
      }
    },

    goBack() {
      this.showInfo = false;
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
  margin-bottom: 5px !important;
}
.main-contain{
  margin: 20px 30px;
  padding: 10px 20px;
}
</style>
