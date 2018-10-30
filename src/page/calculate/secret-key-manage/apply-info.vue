<template>	
  <div v-loading="loading">
  	<el-row class="g-header">
  	  <el-col :span="4">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item>申请密钥</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="20">
		    <el-steps :active="activeIndex" simple>
				  <el-step title="填写信息" icon="el-icon-edit"></el-step>
				  <el-step title="邮箱验证" icon="el-icon-message"></el-step>
          <el-step :title="stepText" :icon="stepIcon"></el-step>
				</el-steps>
		  </el-col>
  	</el-row>
  	<el-row class="g-content g-wrap-mh">
  	  <el-col :span="24">
  	    <!-- 填写信息 -->
  	    <el-form label-width="120px" :model="form" class="g-form-ipt tl" :rules="rules" ref="form" v-show="isInfo">
  	      <el-form-item label="公司名称:">
  	        <span>{{form.compName}}</span>
  	      </el-form-item>
  	      <el-form-item label="有效地址:" prop="address">
  	        <el-input v-model="form.address" class="g-item-ipt" :maxlength="NAME_MAX_LENGTH"></el-input>
  	      </el-form-item>
  	      <el-form-item label="营业执照号码:" prop="number">
  	        <el-input v-model="form.number" class="g-item-ipt" :maxlength="NAME_MAX_LENGTH"></el-input>
  	      </el-form-item>
  	      <el-form-item label="公司负责人:" prop="person">
  	        <el-input v-model="form.person" class="g-item-ipt" :maxlength="NAME_MAX_LENGTH"></el-input>
  	      </el-form-item>
  	      <el-form-item label="公司联系电话:" prop="phone">
  	        <el-input v-model="form.phone" class="g-item-ipt" :maxlength="NAME_MAX_LENGTH"></el-input>
  	      </el-form-item>
  	      <el-form-item label="电子邮箱:" prop="email">
  	        <el-input v-model="form.email" class="g-item-ipt" :maxlength="NAME_MAX_LENGTH" @blur="blur"></el-input>
  	      </el-form-item>
  	      <el-form-item label="上传营业执照：" label-width="120px" prop="img">
						<el-upload
						  class="avatar-uploader"
						  :action="uploadImg1"
						  name="imgFile"
						  :show-file-list="false"
						  :on-success="handleAvatarSuccess"
						  list-type="picture"
						  accept=".jpg,.jpeg,.png">
						  <img v-if="form.img" :src="form.img" class="avatar">
  						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
				  </el-form-item>
				  <el-form-item>
			      <el-button type="primary" size="mini" @click="nextStep">下一步</el-button>
				  </el-form-item>
  	    </el-form>

  	    <!-- 身份验证 -->
  	    <el-form label-width="160px" class="g-form-ipt tl" v-show="isApply">
  	      <el-form-item label="电子邮箱:">
  	        <el-input v-model="storageEmail" class="g-item-ipt" disabled="disabled"></el-input>
  	      </el-form-item>
  	      <el-form-item>
  	        <el-button type="primary" size="mini" @click="emailVerification">确定并前往验证</el-button>
  	      </el-form-item>
  	    </el-form>

        <!-- 申请成功 -->
        <div v-show="isSuccess">
          <h3 class="g-h3">恭喜你申请成功</h3>
          <h5 class="g-h5">我们会在七个工作日内完成工作的审核</h5>
          前往[<router-link to="/secretKeyManage/list">
            <span class="pointe g-span">密钥管理</span>
          </router-link>]
        </div>

        <div v-show="isStep4">
          <h3 class="g-h3">申请失败</h3>
          <h5 class="g-h5">邮箱已失效</h5>
          前往[<router-link to="/secretKeyManage/list">
            <span class="pointe g-span">密钥管理</span>
          </router-link>]
        </div>
			</el-col>
		</el-row>
  </div>
</template>

<script>
  import { checkStr } from '@/util/typeUtil'
  import { getLocalStorage, setToken, getToken } from '@/util/storageUtil'
  import { addCompanyInfo, toEmail, isExistEmail } from '@/service/iot-frame'
	export default {
    data () {
			var checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入公司负责人联系电话'))
        }
        setTimeout(() => {
          if (!checkStr(value, 'phone') && !checkStr(value, 'tel')) {
          	return callback(new Error('号码格式不正确'))
          } else {
          	callback()
          }
        }, 1000);
      }
      var checkEmail = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入邮箱'))
        }
        if (!this.emailIsExist) {
          return callback(new Error('邮箱已存在'))
        }
        setTimeout(() => {
          if (!checkStr(value, 'email')) {
          	return callback(new Error('邮箱格式不正确'))
          } else {
          	callback()
          }
        }, 1000);
      }

      var checkimg = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请上传营业执照'))
        } else {
        	callback()
        }
      }
			return {
			  form: {
			  	address: '',
			  	number: '',
			  	person: '',
			  	phone: '',
			  	email: '',
			  	img: '',
			  	compName: '',
			  	compCode: '',
			  	validated: '0',
          redirectUrl: '',  //成功跳转地址
          wrongRedireUrl: ''  //失效跳转地址,
			  },
			  activeIndex: 1,
			  uploadImg1: '/zqi_appstore/admin/uploadImg.do',
        url: '',  //邮箱跳转url
        storageEmail: '',
	      loading: false,
	      isInfo: true,
        isApply: false,
        isSuccess: false,
        isStep4: false,
        stepText: '申请成功',
        stepIcon: 'el-icon-success',
        emailIsExist: true,
	      rules: {
	      	address: [
	      	  { required: true, message: '请填写地址', trigger: 'blur' }
	      	],
	      	number: [
	      	  { required: true, message: '请填写营业执照号码', trigger: 'blur' }
	      	],
	      	person: [
	      	  { required: true, message: '请填写公司负责人', trigger: 'blur' }
	      	],
	      	phone: [
	      	  { validator: checkPhone, trigger: 'blur', required: true }
	      	],
	      	email: [
	      	  { validator: checkEmail, trigger: 'blur', required: true }
	      	],
	      	img: [
	      	  { validator: checkimg, trigger: 'blur', required: true }
	      	]
	      }
			}
		},
		created () {
      this.url = getToken('URL') || ''
      this.storageEmail = getToken('STORAGE_EMAIL') || ''
      this.form.redirectUrl = window.location.href + '?activeIndex=3'
      this.form.wrongRedireUrl = window.location.href + '?activeIndex=4'
      let queryIndex = this.$route.query.activeIndex
      if (queryIndex) {
        if (queryIndex == 2) {
          this.isSuccess = false
          this.isStep4 = false
          this.stepText = '申请成功'
          this.stepIcon = 'el-icon-success'
          this.isInfo = false
          this.isApply = true
        } else if (queryIndex == 4) {
          this.isStep4 = true
          this.isSuccess = false
          this.stepText = '申请失败'
          this.stepIcon = 'el-icon-error'
          this.isInfo = false
          this.isApply = false
        } else {
          this.isSuccess = true
          this.isStep4 = false
          this.stepText = '申请成功'
          this.stepIcon = 'el-icon-success'
          this.isInfo = false
          this.isApply = false
        }
        this.activeIndex = Number(queryIndex)
      }
      let userInfo = getLocalStorage('USER_INFO', 'json')
      this.form.compCode = userInfo.compCode || ''
      this.form.compName = userInfo.compName || ''
		},
		methods: {
		  handleAvatarSuccess (file) {  //上传成功
        this.form.img = file.imgUrl
		  },
		  nextStep () {  //下一步
		  	let self = this
		  	self.$refs.form.validate(async (valid) => {
          if (valid) {
            self.loading = true
          	let resData = await addCompanyInfo(self.form)
            let resData1 = await toEmail(self.form.email)
            this.storageEmail = self.form.email
            setToken('STORAGE_EMAIL', self.form.email)
            if (resData1.status == 200) {
              setToken('URL', resData1.data)
              self.url = resData1.data
            }
          	self.loading = false
          	if (resData.status == 200 && resData.data.message === 'success') {
          	  self.isInfo = false
              self.isApply = true
              self.isSuccess = false
              self.isStep4 = false
              self.stepText = '申请成功'
              this.stepIcon = 'el-icon-success'
          	  self.activeIndex = 2
              self.$router.push('/secretKeyManage/apply-info?activeIndex=2')
          	} else {
          		self.$message.warning(resData.data.message)
          	}
            try {
              self.loading = true
            } finally {
              self.loading = false
            }
          }
        })
		  },
		  async emailVerification () {  //邮箱验证
        window.open(this.url)
		  },
      async blur () {
        let resData = await isExistEmail(`?email=${this.form.email}`)
        if (resData.status == 200) {
          this.emailIsExist = !resData.data
        }
      }
		}
	}
</script>

<style lang="scss" scoped>
  .g-content {
		border: 1px solid #e3e9ec;
		background: #fff;
		padding: 15px;
		.g-item-ipt {
			width: 60%;
		}
    .g-h3 {
      margin-top: 24.5vh;
    }
    .g-h3, .g-h5 {
      margin-bottom: 10px;
    }
    .g-span {
      color: #00aaee;
    }
	}
</style>
