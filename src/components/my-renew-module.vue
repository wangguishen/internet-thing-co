<template>
  <div>
  	<el-dialog
  		class="g-sdk-details-box"
  		width="30%"
  		min-height="30vh"
  		top="25vh"
		  :visible.sync="showes"
		  :before-close="closeDialog">
			<div slot="title" class="dialog-title">
	  		<span class="s-pass-text">{{deploy.name}}</span>
	    </div>
	    <el-form class="g-form-ipt g-unpass-ta">
    		<template v-for="item of data">
	    		<el-form-item :label="item.name+'：'" :label-width="formLabelWidth">
	    			<el-input v-model="item.degree" placeholder="请输入次数" type="number" auto-complete="off" class="g-ipt-number g-item-ipt" clearable></el-input>
					</el-form-item>
    		</template>
	    </el-form>
	    <el-row class="g-fotter-bth">
			  <el-col :span="12">
			  	<el-button type="info" size="mini" @click="closeDialog">
	  	      返回
	  	    </el-button>
			  </el-col>
			  <el-col :span="12">
	  	    <el-button type="primary" size="mini" @click="UpdateDeviceAppsReq">
	  	      确定
	  	    </el-button>
			  </el-col>
			</el-row>
		</el-dialog>
  </div>
</template>

<script>
export default {
	props: {
    showes: Boolean,
    data: Array,
    deploy: Object
  },
	data () {
		return {
			formLabelWidth: '120px',
			visiShow: false
		}
	},
	watch: {
		// showes: {
		// 	handler: function (val, old) {
		// 		let self = this
		// 		if (val) {
		// 			self.visiShow = true
		// 		} else {
		// 			self.visiShow = false
		// 		}
		// 	},
		// 	deep: true
		// }
	},
	mounted () {
	},
	methods: {
		UpdateDeviceAppsReq () {
			let self = this;
			self.$emit('sureClick')
		},
		closeDialog () {
			let self = this;
			// self.visiShow = false
			self.$emit('closeDialog')
		}
	}
}
</script>

<style lang="scss" scoped>
.g-sdk-details-box {
  .el-dialog .el-dialog__body .el-form-item {
    margin-bottom: 10px;
  }	
  .s-pass-text {
  	font-size: 14px;
  	padding: 15px;
  }
  .g-textarea {
  	min-height: 100px;
  }
  .g-form-ipt{
  	width: 80%;
  }
  .g-fotter-bth{
  	padding: 30px 0 20px;
  	text-align: center;
  }
}
</style>