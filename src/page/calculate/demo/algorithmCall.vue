<template>
	<div>
		<el-row class="g-header">
		  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item>算法调用</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tr">
  	    <el-button type="info" class="g-top-btn" size="mini" @click="$router.push('/calculate/index')">
  	      返回
  	    </el-button>
		  </el-col>
		</el-row>
		<div class="g-request-select-box">
			<div class="g-hint-type s-fl-left">POST</div>
			<el-select v-model="urlPath" clearable placeholder="请选择算法请求" class="g-select-post s-fl-left" @change="changeAlgorithm">
		    <el-option
		      v-for="item in algorithmPath"
		      :key="item.value"
		      :value="item">
		      <span>{{ item.label }}</span>
		    </el-option>
		  </el-select>
		  <!-- <el-button class="g-btn-post s-fl-left" type="primary" slot="append" @click="sendRequest">发送请求</el-button> -->
		</div>
		<div class="g-show-box" v-show="keyModuleShow">
			<div class="g-cont-text">算法简介</div>
			<div class="g-show-time">
				<div class="s-show-box">
					<span class="sm-left">申请次数：{{keyModule.addNum}} 次</span>
					<span class="sm-right">剩余次数：{{keyModule.surplusNum}} 次</span>
				</div>
				<div class="s-show-box">
					<span class="sm-left">续约时间：{{keyModule.totalDay}} 天</span>
					<span class="sm-right">剩余时间：{{keyModule.surplusDay}} 天</span>
				</div>
			</div>
		</div>
		<div v-show="status.md5.show">
			<div class="g-cont-text">加密前</div>
			<el-input v-model="status.md5.beforeVal" placeholder="请输入需要加密的值"></el-input>
			<el-button type="primary" class="g-btn-sy" @click="sendRequestMd5()" size="mini">
				<span class="iconfont">&#xe612;</span>
			</el-button>
			<div class="g-cont-text">加密后</div>
			<el-input v-model="status.md5.afterVal" placeholder="展示加密后的值" disabled></el-input>
		</div>
		<div v-show="status.sum.show">
			<div class="g-cont-text">算法求和</div>
			<el-form class="s-num-ipt" :model="status.sum" ref="numberValidateForm">
				<el-form-item
					class="s-num-ipt-A"
			    prop="beforeValA"
			    :rules="[
			      { type: 'number', message: '求和必须为数字值'}
			    ]">
			    <el-input type="beforeValA" clearable v-model.number="status.sum.beforeValA" auto-complete="off" placeholder="请输入数字"></el-input>
			  </el-form-item>
				<el-form-item class="s-num-ipt-B">
			    <span class="iconfont" style="font-size:14px;">&#xe615;</span>
			  </el-form-item>
				<el-form-item
					class="s-num-ipt-A"
			    prop="beforeValB"
			    :rules="[
			      { type: 'number', message: '求和必须为数字值'}
			    ]">
			    <el-input type="beforeValB" clearable v-model.number="status.sum.beforeValB" auto-complete="off" placeholder="请输入数字"></el-input>
			  </el-form-item>
			  <el-button type="primary" class="g-btn-sy" @click="sendRequestNum('numberValidateForm', 'sum')" size="mini">
					<span class="iconfont">&#xe612;</span>
				</el-button>
				<div class="g-cont-text">求和结果</div>
				<el-input type="text" v-model="status.sum.afterVal" placeholder="展示求和后的值" disabled></el-input>
			</el-form>
		</div>
		<div v-show="status.mul.show">
			<div class="g-cont-text">算法求积</div>
			<el-form class="s-num-ipt" :model="status.mul" ref="numberMulValidateForm">
				<el-form-item
					class="s-num-ipt-A"
			    prop="beforeValA"
			    :rules="[
			      { type: 'number', message: '求积必须为数字值'}
			    ]">
			    <el-input type="beforeValA" clearable v-model.number="status.mul.beforeValA" auto-complete="off" placeholder="请输入数字"></el-input>
			  </el-form-item>
				<el-form-item class="s-num-ipt-B">
			    <span class="iconfont" style="font-size:14px;">&#xe69b;</span>
			  </el-form-item>
				<el-form-item
					class="s-num-ipt-A"
			    prop="beforeValB"
			    :rules="[
			      { type: 'number', message: '求积必须为数字值'}
			    ]">
			    <el-input type="beforeValB" clearable v-model.number="status.mul.beforeValB" auto-complete="off" placeholder="请输入数字"></el-input>
			  </el-form-item>
			  <el-button type="primary" class="g-btn-sy" @click="sendRequestNum('numberMulValidateForm', 'mul')" size="mini">
					<span class="iconfont">&#xe612;</span>
				</el-button>
				<div class="g-cont-text">求积结果</div>
				<el-input type="text" v-model="status.mul.afterVal" placeholder="展示求积后的值" disabled></el-input>
			</el-form>
		</div>
	</div>
</template>
<script>
import { queryCompKey, algorithmCall, queryCompAlgoList } from '@/service/iot-frame'
import { getLocalStorage } from '@/util/storageUtil'
import { Loading } from 'element-ui';
export default {
	data () {
		return {
			compName: '',
			compCode: '',
			company: {},
			companyObj: {},
			urlPath: '',
			algorithmPath: [
				{
					label: "医疗影像",
					value: "http://frame-service.sunmath.cn/algorithm/MD5"
				}, {
					label: "车载船载",
					value: "http://frame-service.sunmath.cn/algorithm/sum"
				}, {
					label: "商城分析",
					value: "http://frame-service.sunmath.cn/algorithm/mul"
				}
    	],
    	status: {
				md5: {
					show: false,
					beforeVal: '',
					afterVal: ''
				},
				sum: {
					show: false,
					beforeValA: '',
					beforeValB: '',
					afterVal: ''
				},
				mul: {
					show: false,
					beforeValA: '',
					beforeValB: '',
					afterVal: ''
				}
			},
			loadingInstance: '',
			keyModule: {},
			keyModuleShow: false
		}
	},
	mounted () {
		let userInfo = getLocalStorage('USER_INFO', 'json')
		this.loadingInstance = Loading.service();
		this.compName = userInfo.compName || ''
		this.compCode = userInfo.compCode || ''
		this.queryCompKey()
	},
	methods: {
		async queryCompKey () { //当前秘钥信息
			let self = this;
			let params = { compCode: this.compCode }
	  	let resData = await queryCompKey(params)
	  	if (resData.status !== 200) {
    		self.$message.error("服务器错误")
    		return
    	}
    	self.company = resData
			self.companyObj = resData.data.data
			self.algorithm()
		},
		async algorithm () { //当前企业已订购算法
			let self = this;
			let url = `?pageSize=10000&currentPage=1`;
			let data = {compCode: self.compCode, status: '0'}
			let algorithmData = await queryCompAlgoList(url, data)
			if (algorithmData.status !== 200) {
    		self.$message.error("服务器错误")
    		return
    	}
			if (algorithmData.status === 200 && algorithmData.data.status === "200") {
				let list = algorithmData.data.data;
				let i = 0
				self.algorithmPath = []
				list.forEach((item, index) => {
					let url = ''
					if (item.algorithmPath) {
						url = 'http://frame-service.sunmath.cn' + item.algorithmPath;
					} else {
						url = 'http://frame-service.sunmath.cn/' + i
						i++
					}
					self.$set(item, 'label', item.name)
					self.$set(item, 'value', url)
					self.algorithmPath.push(item)
				})
				self.loadingInstance.close()
			} else {
				self.loadingInstance.close()
				self.$message.error(algorithmData.data.message)
			}
			console.log(self.compCode)
		},
		async algorithmCall (type, url, data) { //算法公共请求
			let self = this;
			self.loadingInstance = Loading.service();
	  	let resData = await algorithmCall(url, data)
	  	if (resData.status !== 200) {
    		self.$message.error("服务器错误")
    		return
    	}
    	if (resData.data.status == 200 && resData.data.data != null) {
				if (type === 'md5') {
					self.$message.success("算法加密成功")
					self.status.md5.afterVal = resData.data.data.value;
				} else if (type === 'sum') {
					self.$message.success("算法求和成功")
					// self.status.sum.afterVal = resData.data.data;
					self.$set(self.status.sum, 'afterVal', resData.data.data)
					console.log(self.status.sum.afterVal)
				} else if (type === 'mul') {
					self.$message.success("算法求积成功")
					self.$set(self.status.mul, 'afterVal', resData.data.data)
				}
				// self.algorithm()
				self.keyModule.surplusNum --;
				self.loadingInstance.close()
    	} else {
				self.$message.error(resData.data.message)
				self.loadingInstance.close()
    	}
    	console.log(resData)
		},
		changeAlgorithm (key) { //选择算法
			let self = this;
			console.log(key)
			self.keyModule = key
			if (key) {
				self.urlPath = key.value
				self.keyModuleShow = true;
				let arrNum = key.value.split('/')
				let num = arrNum[arrNum.length - 1]
				self.status = {
					md5: {
						show: false,
						beforeVal: '',
						afterVal: ''
					},
					sum: {
						show: false
					},
					mul: {
						show: false
					}
				}
				if (num === 'MD5') self.status.md5.show = true
				if (num === 'sum') self.status.sum.show = true
				if (num === 'mul') self.status.mul.show = true
			} else {
				self.keyModuleShow = false
				self.status.md5.show = false
				self.status.sum.show = false
				self.status.mul.show = false
			}
		},
		sendRequestMd5 () { //Md5发送请求
			let self = this;
			if (self.urlPath === '') {
				self.$message.warning('请选择算法请求')
			} else if (self.status.md5.beforeVal === '') {
				self.$message.warning('请输入需要加密的值')
			} else {
				self.companyAlgorithm('md5', self.status.md5)
			}
		},
		sendRequestNum (value, key) { //num发送请求
			let self = this;
			self.$refs[value].validate((valid) => {
        if (valid) {
        	if (key === 'sum') {
          	self.companyAlgorithm(key, self.status.sum)
        	} else if (key === 'mul') {
        		console.log(self.status.mul)
        		self.companyAlgorithm(key, self.status.mul)
        	}
        } else {
          console.log('error submit!!');
          return false;
        }
      });
		},
		companyAlgorithm (type, val) { //验证公司密钥
			let self = this;
			if (self.company.data.data !== null) {
  			if (self.companyObj.appKey === null || self.companyObj.appKey === '') {
  				self.$confirm(`【${self.compName}】密钥暂时未申请成功，请重新申请密钥`, '提示', {
  					showCancelButton: false,
	          confirmButtonText: '前往申请密钥'
	        }).then(() => {
	          self.$router.push('/secretKeyManage/list')
	        })
	  		} else {
	  			let url = self.GetUrlRelativePath(self.urlPath) + `?appid=${self.companyObj.appId}&appkey=${self.companyObj.appKey}&compCode=${self.companyObj.compCode}`
	  			console.log(url)
	  			let data = {}
	  			if (type === 'md5') {
						self.$set(data, 'value', self.status.md5.beforeVal)
						self.algorithmCall(type, url, data)
	  			} else if (type === 'sum' || type === 'mul') {
						self.$set(data, 'a', val.beforeValA)
						self.$set(data, 'b', val.beforeValB)
						console.log(data)
						self.algorithmCall(type, url, data)
	  			}
	  		}
	  	} else {
	  		self.$confirm(`【${self.compName}】还没有密钥，请申请密钥`, '提示', {
					showCancelButton: false,
          confirmButtonText: '前往申请密钥'
        }).then(() => {
          self.$router.push('/secretKeyManage/apply')
        })
			}
		},
		GetUrlRelativePath (url) {
			let arrUrl = ''
			if (url.includes('//')) {
				arrUrl = url.split("//")[1];
			}
			let start = arrUrl === '' ? url.indexOf("/") : arrUrl.indexOf("/");
			let relUrl = arrUrl === '' ? url.substring(start) : arrUrl.substring(start);
			let returnArr = arrUrl === '' ? url.substring(start) : relUrl.split('/');
			let returnUrl = arrUrl === '' ? url.substring(start) : '/' + returnArr[returnArr.length - 1]
			return returnUrl;
		}
	}
}
</script>
<style lang="scss" scoped>
	.g-request-select-box {
		display: flex;
		justify-content: space-around;
		margin-bottom: 20px;
		overflow: hidden;
		.g-hint-type {
			display: inline-block;
			background-color: #f5f7fa;
	    color: #96a8ae;
	    vertical-align: middle;
	    position: relative;
	    border: 1px solid #dcdfe6;
	    border-right: transparent;
	    border-radius: 4px 0 0 4px;
	    padding: 0 20px;
	    height: 40px;
	    line-height: 38px;
	    box-sizing: border-box;
	    font-size: 14px;
	  }
	  .g-select-post{
	  	width: 100%;
	  }
	  .g-btn-post{
	  	border-radius: 0 4px 4px 0;
	  	border-left: transparent;
	  }
	}
	.g-cont-text{
		margin: 20px 5px 10px;
		text-align: left;
	}
	.g-btn-sy{
		margin: 20px 5px 0px;
	}
	.g-show-box{
		.g-show-time{
			background: #FFF;
			padding: 10px 40px;
			border-radius: 4px;
			.s-show-box{
				display: flex;
				align-items: center;
				justify-content: flex-start;
				span{
					width: 50%;
					height: 30px;
					line-height: 30px;
				}
				.sm-left{
					text-align: left;
				}
				.sm-right{
					text-align: right;
				}
			}
		}
	}
</style>