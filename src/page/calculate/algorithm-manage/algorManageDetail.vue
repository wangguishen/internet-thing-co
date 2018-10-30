<template>
	<div class="l-father-div">
		<div class="g-header">
			<el-row type="flex" class="row-bg" justify="space-between">
			  <el-col :span="16">
			  	<div class="s-img-box g-top-left">
			  		<img class="iconImg fl" :src="algorithmObj.img">
			  		<div class="g-overflow-hide">{{algorithmObj.name}}</div>
			  	</div>
			  </el-col>
			  <el-col :span="8">
			  	<div class="grid-content bg-purple g-top-right">
			  		<el-button class="g-top-btn" size="mini" type="info" @click="back()">返回</el-button>
			  	</div>
			  </el-col>
			</el-row>
		</div>
		<div class="g-main">
			<el-form :model="algorithmObj" ref="formAccount" class="g-form-ipt">
				<el-form-item label="算法路径：" :label-width="formLabelWidth">
					<el-input v-model="algorithmObj.path" auto-complete="off" class="ipt_wid g-item-ipt" disabled></el-input>
				</el-form-item>
				<el-form-item label="当前版本：" :label-width="formLabelWidth">
					<el-input v-model="algorithmObj.version" auto-complete="off" class="ipt_wid g-item-ipt" disabled></el-input>
				</el-form-item>
				<el-form-item label="大小：" :label-width="formLabelWidth">
					<el-input v-model="algorithmObj.size" auto-complete="off" class="ipt_wid g-item-ipt" disabled></el-input>
				</el-form-item>
				<el-form-item label="状态：" :label-width="formLabelWidth">
					<el-input v-model="algorithmObj.algStatu" auto-complete="off" class="ipt_wid g-item-ipt" disabled></el-input>
				</el-form-item>
				<el-form-item label="算法类型：" :label-width="formLabelWidth">
					<el-input v-model="algorithmObj.typeName" auto-complete="off" class="ipt_wid g-item-ipt" disabled></el-input>
				</el-form-item>
				<el-form-item label="上传时间：" :label-width="formLabelWidth">
					<el-input v-model="algorithmObj.timeData" auto-complete="off" class="ipt_wid g-item-ipt" disabled></el-input>
				</el-form-item>
				<el-form-item label="剩余次数：" :label-width="formLabelWidth">
					<el-input v-model="algorithmObj.surplusNum" auto-complete="off" class="ipt_wid g-item-ipt" disabled></el-input>
				</el-form-item>
				<el-form-item label="申请次数：" :label-width="formLabelWidth">
					<el-input v-model="algorithmObj.addNum" auto-complete="off" class="ipt_wid g-item-ipt" disabled></el-input>
				</el-form-item>
				<el-form-item label="描述:" :label-width="formLabelWidth">
		      <el-input v-model="algorithmObj.descption" type="textarea" class="ipt_wid g-item-ipt" disabled="disabled"></el-input>
		    </el-form-item>
		    <el-form-item :label-width="formLabelWidth">
		    	<template v-if="algorithmObj.orderStatus == 0">
	      		<el-button class="s-sure-btn g-top-btn" size="mini" type="primary" @click="deleteClick">退订</el-button>
	      		<!-- <template v-if="algorithmObj.path">
	        		<el-button class="s-sure-btn g-top-btn" size="mini" type="primary" @click="uploaddown">下载</el-button>
	      		</template> -->
      			<template v-if="algorithmObj.surplusDay == 0 && algorithmObj.surplusNum != 0">
      				<el-button class="s-sure-btn g-top-btn" size="mini" type="primary" @click="renewClick('xy')">续约</el-button>
      			</template>
      			<template v-else-if="algorithmObj.surplusDay != 0 && algorithmObj.surplusNum == 0">
      				<el-button class="s-sure-btn g-top-btn" size="mini" type="primary" @click="renewClick('xq')">续签</el-button>
      			</template>
      			<template v-else>
    					<el-button class="s-sure-btn g-top-btn" size="mini" type="primary" @click="renewClick('xq')">续签</el-button>
    					<el-button class="s-sure-btn g-top-btn" size="mini" type="primary" @click="renewClick('xy')">续约</el-button>
      			</template>
	      	</template>
		      <template v-else>
		      	<el-button class="s-three-text-btn" size="mini" type="info" disabled>退订中</el-button>
		      </template>
		    </el-form-item>
	  	</el-form>
	  	<canvas ref="canvas" style="height: 0"></canvas>
	  	<el-dialog class="g-sdk-details-box" width="30%" min-height="40vh" top="25vh" :visible.sync="dialogRefuseVisible" @close="closePassVisible" center>
				<div slot="title" class="dialog-title">
			  	<span class="s-refuse-text">退订原因</span>
		    </div>
		    <el-form class="g-form-ipt g-unpass-ta">
		    	<el-input class="s-unpass-ta" maxlength="200" type="textarea" v-model="refuseCause" placeholder="请填写退订原因,200字以内...">
		    	</el-input>
		    </el-form>
		    <div slot="footer" class="dialog-footer">
		    	<el-button type="info" class="g-cancel" size="mini" @click="closePassVisible">
	          取消
	  	    </el-button>
		    	<el-button type="primary" class="g-cancel" size="mini" @click="refuseSure">
	          确定
	  	    </el-button>
	  	  </div>
			</el-dialog>
			<my-renew-module
				:showes="renewShow"
				:data="renewData"
				:deploy="deploy"
				v-on:sureClick="renewAffirm"
				v-on:closeDialog="closeDialog">
			</my-renew-module>
			<el-dialog class="g-sdk-details-box" width="30%" min-height="40vh" top="25vh" :visible.sync="dialogRenewalVisible" @close="closePassVisible" center>
				<div slot="title" class="dialog-title">
			  	<span class="s-refuse-text">申请续约</span>
		    </div>
		    <el-form class="g-form-ipt g-unpass-ta">
		    	<el-form-item label="申请续约时间：" :label-width="formLabelWidth">
						<el-select class="s-form-select" v-model="renewalCause" clearable placeholder="请选择">
					    <el-option
					      v-for="item in options"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
					</el-form-item>
		    </el-form>
	  	  <el-row class="g-fotter-bth">
				  <el-col :span="12">
				  	<el-button type="info" size="mini" @click="closePassVisible">
		  	      返回
		  	    </el-button>
				  </el-col>
				  <el-col :span="12">
		  	    <el-button type="primary" size="mini" @click="renewAffirm">
		  	      确定
		  	    </el-button>
				  </el-col>
				</el-row>
			</el-dialog>
		</div>
	</div>
</template>
<script>
import myRenewModule from '@/components/my-renew-module.vue'
import {getToken, setToken, getLocalStorage} from '@/util/storageUtil'
import {addOrderRecord, queryAlgorithmInfo, queryRenew} from '@/service/iot-frame'
import {formatTime} from '@/util/dateUtil'
export default {
	components: {
		myRenewModule
	},
	data () {
		return {
			merData: {},
			algorithmId: '',
			algorithmObj: {},
			formCompany: {},
			formLabelWidth: '120px',
			dialogRefuseVisible: false, //退订原因
			refuseCause: '',
			pressObj: {},
			renewShow: false,
			renewData: [],
			deploy: {
				name: '申请续签'
			},
			dialogRenewalVisible: false, //续约弹框
			renewalCause: '',
			options: [
				{
          value: '90',
          label: '三个月'
        }, {
          value: '180',
          label: '六个月'
        }, {
          value: '270',
          label: '九个月'
        }, {
          value: '360',
          label: '十二个月'
        }
      ]
		}
	},
	mounted () {
		let self = this;
		self.algorithmId = getToken("ARITHMETIC_OBJECT_ID")
		self.merData = getLocalStorage('USER_INFO', 'json')
		console.log(self.merData)
		// self.algorithmObj.timeData = formatTime(self.algorithmObj.createTime, '{y}/{m}/{d} {h}:{i}')
		// self.algorithmObj.algStatu = self.algorithmObj.status == '0' ? '正常' : '异常'
		let id = `?id=${self.algorithmId}&compCode=${self.merData.compCode}`
		self.algorithm(id)
	},
	methods: {
		back () {  //返回算法管理列表页面
			let self = this;
			self.$router.push('/algorManage')
		},
		async algorithm (url) {  //请求 -- 当前算法详情
			let self = this;
			let algorithmData = await queryAlgorithmInfo(url)
			if (algorithmData.status !== 200) {
    		self.$message.error("服务器错误")
    		return
    	}
			if (algorithmData.status === 200 && algorithmData.data.status === "200") {
				let obj = algorithmData.data.data;
				let statu = '';
				if (obj.status == '0') {
					statu = '正常'
				} else {
					statu = '异常'
				}
				let time = formatTime(obj.createTime, '{y}/{m}/{d} {h}:{i}')
				self.$set(obj, 'timeData', time)
				self.$set(obj, 'algStatu', statu)
 				self.algorithmObj = obj;
			} else {
				self.$message.error(algorithmData.data.message)
			}
		},
		async uploaddown () {  //下载操作 -- 暂时去掉企业下载功能
			let self = this;
			let userName = self.merData.userName || self.merData.account
    	let url = `/iot-frame/algorithm_download?url=${self.algorithmObj.path}&algorithmId=${self.algorithmId}&compCode=${self.merData.compCode}&download=${userName}`
    	window.location = url
		},
		deleteClick (index, tab) { //按钮事件 -- 退订
			let self = this;
			self.dialogRefuseVisible = !self.dialogRefuseVisible
		},
		renewClick (num) { //按钮事件 -- 续签
			let self = this;
			if (num == 'xq') {
				self.renewData = []
				self.renewData.push(self.algorithmObj)
				self.renewShow = true
			} else if (num == 'xy') {
				self.dialogRenewalVisible = true
			}
		},
		async renewAffirm () {
			let self = this;
			let success = `【${self.algorithmObj.name}】已申请续约`
			let data = {
				"addNum": '',
				"addDay": self.renewalCause,
				"compCode": self.merData.compCode,
				"compName": self.merData.compName,
				"sdkNum": self.algorithmObj.id
			}
			if (self.renewData.length != 0) {
				data.addNum = self.renewData[0].degree
				success = `【${self.algorithmObj.name}】已申请续签`
			}
			let resData = await queryRenew(data)
			if (resData.status !== 200) {
    		self.$message.error('服务器错误')
    		return
    	}
    	if (resData.data.message == 'success') {
    		self.$message.success(success)
    	} else {
    		self.$message.warning(resData.data.message)
    	}
			if (self.renewData.length != 0) {
	    	self.renewData[0].degree = ''
	    	self.renewShow = false
	    } else {
				self.renewalCause = ''
	    	self.dialogRenewalVisible = false
	    }
		},
		closeDialog () {
    	let self = this;
    	self.renewData[0].degree = ''
    	self.renewShow = false
    },
		closePassVisible () { //关闭 -- 模态框
			let self = this
			self.refuseCause = ''
			self.renewalCause = ''
			self.dialogRefuseVisible = false
			self.dialogRenewalVisible = false
		},
		async refuseSure () { //请求 -- 退订操作
			let self = this
			let arr = [];
			if (!self.refuseCause) {
				self.$message.warning("请填写退订原因")
    		return
			}
			let obj = {
    		algorithmId: self.algorithmObj.id,
    		compCode: self.merData.compCode,
    		compName: self.merData.compName,
    		unsubscribeReason: self.refuseCause,
    		status: '0',
    		type: '1'
  		}
  		arr.push(obj)
  		console.log('arr', arr)
			let resData = await addOrderRecord(arr)
    	if (resData.status !== 200) {
    		self.$message.error('服务器错误')
    		return
    	}
    	if (resData.data === 'timeout') {
    		self.$message.error("用户登录失效，请重新登录")
    		self.$router.push('/login')
    	} else if (resData.data.data == null) {
    		self.$message.error(resData.data.message)
    	} else {
    		self.$message.success("申请退订成功")
  			self.algorithmObj.orderStatus = '1'
  			self.dialogRefuseVisible = false
  			setToken("ARITHMETIC_OBJECT_ROW", self.algorithmObj)
    	}
		}
	}
}
</script>
<style lang="scss" scoped>
	.g-header{
		margin-bottom: 10px;
		.g-top-left, .g-top-right{
			height:40px;
			line-height: 40px;
		}
	}
	.l-father-div{
		height:100%;
	}
	.g-main{
		text-align: left;
		min-height: 80%;
		background: #fff;
		padding: 15px 0 10px;
		border: 1px solid #e3e9ec;
		border-radius: 3px;
	}
	.ipt_wid{
		width: 50%;
	}
	.s-company-bg-img{
		display: block;
		width: 28%;
		border-radius: 3px;
	}
	.s-img-box{
		text-align: left;
		font-size: 14px;
	}
	.iconImg{
		display: block;
		height:100%;
		margin-right: 15px;
		border-radius: 3px;
	}
	.g-sdk-details-box {
    .el-dialog .el-dialog__body .el-form-item {
      margin-bottom: 10px;
    }	
	  .s-refuse-text {
	  	font-size: 14px;
	  	padding: 15px;
	  }
	  .g-textarea {
	  	min-height: 100px;
	  }
  }
  .g-cancel {
  	margin-top: 10px;
  }
  .g-fotter-bth{
  	padding: 30px 0 20px;
  	text-align: center;
  }
  .s-form-select{
  	width: 80%;
  }
</style>