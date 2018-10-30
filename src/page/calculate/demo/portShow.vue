<template>
	<div>
		<el-row class="g-header">
		  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item>算法调用</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tr">
		  	<el-switch
				  v-model="selectLinkShow"
				  active-text="输入接口"
				  inactive-text="选择接口"
				  @change="switchLink">
				</el-switch>
  	    <el-button class="g-top-btn s-four-text-btn" size="mini" type="primary" @click="companyAlgorithm()">算法密钥</el-button>
  	    <el-button type="info" class="g-top-btn" size="mini" @click="$router.push('/calculate/index')">
  	      返回
  	    </el-button>
		  </el-col>
		</el-row>
		<!-- 请求手动输入模式 -->
		<div class="g-request-box" v-show="selectLinkShow">
		  <el-input placeholder="请输入请求链接" v-model="hickey.url" class="input-with-select">
		  	<template slot="prepend">POST</template>
		    <el-button slot="append" type="primary" @click="sendRequest">发送请求</el-button>
		  </el-input>
		</div>
		<!-- 请求选择模式 -->
		<div class="g-request-select-box" v-show="!selectLinkShow">
			<div class="g-hint-type s-fl-left">POST</div>
			<el-select v-model="urlPath" filterable clearable placeholder="请选择算法请求" class="g-select-post s-fl-left" @change="changeAlgorithm">
		    <el-option
		      v-for="item in algorithmPath"
		      :key="item.value"
		      :value="item.value">
		      <span>{{ item.label }}</span>
		    </el-option>
		  </el-select>
		  <el-button class="g-btn-post s-fl-left" type="primary" slot="append" @click="sendRequest">发送请求</el-button>
		</div>
		<div class="g-request-box">
			<el-table
	      :data="tableData"
	      class="g-table-all-border g-parameter-sty g-search-ipt">
	      <el-table-column
		      align="left"
		      label="key">
		      <template slot-scope="scope">
		      	<el-input v-model="scope.row.key" class="g-item-ipt"></el-input>
		      </template>
		    </el-table-column>
	      <el-table-column
		      align="left"
		      label="value">
		      <template slot-scope="scope">
		      	<el-input v-model="scope.row.value" class="g-item-ipt"></el-input>
	        </template>
		    </el-table-column>
		    <el-table-column
		    	width="100">
		    	<template slot-scope="scope">
		    		<template v-if="scope.$index != (tableData.length - 1)">
		    			<i class="el-icon-close g-hover-icon" @click="removeLine(scope.$index, tableData)"></i>
		    		</template>
		      </template>
		    </el-table-column>
	    </el-table>
	    <div class="g-cont-text">请求参数</div>
	    <el-input
			  type="textarea"
			  :rows="10"
			  placeholder="展示输入参数"
			  v-model="textarea"
			  resize="none"
			  disabled>
			</el-input>
		</div>
		<div class="g-cont-text">算法解析</div>
    <el-input
		  type="textarea"
		  :rows="10"
		  placeholder="展示算法解析"
		  v-model="returnData"
		  disabled>
		</el-input>
		<div class="g-cont-text">算法解析结果</div>
    <el-input
		  type="textarea"
		  :rows="10"
		  placeholder="展示算法解析结果"
		  v-model="returnResult"
		  disabled>
		</el-input>
	</div>
</template>
<script>
import axios from '@/config/api.js'
import { queryCompKey } from '@/service/iot-frame'
import { getLocalStorage } from '@/util/storageUtil'
export default {
	data () {
		return {
			compCode: '',
			compName: '',
			companyObj: {},
			selectLinkShow: true,
			select: '',
			selectType: [],
			hickey: {
    		name: '', //接口名称
    		mode: 'post', //请求方式
    		url: '', //请求链接
    		parameter: {}
    	},
    	textarea: '',
    	tableData: [
				{
					key: '',
					value: ''
				}
    	],
    	returnData: '',
    	returnResult: '',
    	// 算法选择
    	algorithmPath: [
				{
					label: "MD5加密",
					value: "http://frame-service.sunmath.cn/algorithm/MD5"
				}, {
					label: "算法求和",
					value: "http://frame-service.sunmath.cn/algorithm/sum"
				}, {
					label: "算法乘法",
					value: "http://frame-service.sunmath.cn/algorithm/mul"
				}
    	],
    	urlPath: ''
		}
	},
	mounted () {
		let userInfo = getLocalStorage('USER_INFO', 'json')
		console.log(userInfo)
		this.compName = userInfo.compName || ''
		this.compCode = userInfo.compCode || ''
		this.queryCompKey()
	},
	watch: {
		tableData: {
			handler (val, oldVal) {
				let self = this;
				let obj = {
					key: '',
					value: ''
				}
				if (val[val.length - 1].key != '' || val[val.length - 1].value != '') {
					val.push(obj)
				}
				let object = {}
				for (let item of val) {
					if (!(item.key === '' && item.value === '')) {
						object[item.key] = item.value
					}
				}
				self.hickey.parameter = object
				if (Object.keys(object).length !== 0) {
					self.textarea = JSON.stringify(object, null, 2)
				} else {
					self.textarea = ''
				}
			},
			deep: true
		}
	},
	methods: {
		async queryCompKey () {
			let self = this;
	  	let params = { compCode: this.compCode }
	  	let resData = await queryCompKey(params)
	  	if (resData.status !== 200) {
    		self.$message.error("服务器错误")
    		return
    	}
    	self.company = resData
	  	self.companyObj = resData.data.data
	  },
		sendRequest () {
			let self = this;
			// ?appid=100039&appkey=ffbd8cff66939860fa9b100688aaa0c0&compCode=SUNEEE,ZHONGKEHUISHENG
			// hasOwnProperty
			console.log(self.hickey.parameter)
			let url = self.GetUrlRelativePath(self.hickey.url)
			let selectPath = self.GetUrlRelativePath(self.urlPath)
			if (!self.hickey.parameter.hasOwnProperty('appid')) {
				self.$message.warning('appid是必传字段')
			} else if (!self.hickey.parameter.hasOwnProperty('appkey')) {
				self.$message.warning('appkey是必传字段')
			} else {
				if (self.selectLinkShow) {
					if (self.hickey.url === '') {
						self.$message.warning('请输入请求链接')
					} else {
						url += `?appid=${self.hickey.parameter.appid}&appkey=${self.hickey.parameter.appkey}&compCode=${self.companyObj.compCode}`
						axios[self.hickey.mode](url, self.hickey.parameter)
						.then((res) => {
							console.log("成功", res)
							self.returnData = JSON.stringify(res.data, null, 2)
							self.returnResult = JSON.stringify(res.data.data, null, 2)
						})
						.catch((error) => {
							console.log("失败", error)
						})
					}
				} else {
					if (self.urlPath === '') {
						self.$message.warning('请选择算法请求')
					} else {
						selectPath += `?appid=${self.hickey.parameter.appid}&appkey=${self.hickey.parameter.appkey}&compCode=${self.companyObj.compCode}`
						axios.post(selectPath, self.hickey.parameter)
						.then((res) => {
							console.log("成功", res)
							self.returnData = JSON.stringify(res.data, null, 2)
							self.returnResult = JSON.stringify(res.data.data, null, 2)
						})
						.catch((error) => {
							console.log("失败", error)
						})
					}
				}
			}
		},
		removeLine (index, val) {
			val.splice(index, 1)
		},
		GetUrlRelativePath (url) {
			let arrUrl = ''
			if (url.includes('//')) {
				arrUrl = url.split("//")[1];
			}
			let start = arrUrl === '' ? url.indexOf("/") : arrUrl.indexOf("/");
			let relUrl = arrUrl === '' ? url.substring(start) : arrUrl.substring(start);
			// let relUrl = arrUrl === '' ? url : arrUrl
			return relUrl;
		},
		changeAlgorithm () {
			let self = this;
			self.tableData = [
				{
					key: '',
					value: ''
				}
    	]
    	self.returnData = ''
    	self.textarea = ''
		},
		switchLink () {
			let self = this;
			self.hickey = {
				name: '',
    		mode: 'post',
    		url: '',
    		parameter: {}
			};
			self.tableData = [
				{
					key: '',
					value: ''
				}
    	]
    	self.returnData = ''
    	self.urlPath = ''
    	self.select = ''
			self.textarea = '';
    	self.selectType = []
		},
		companyAlgorithm () { //当前公司密钥选择
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
	  			let [appid, appkey] = [{key: "appid", value: self.companyObj.appId}, {key: "appkey", value: self.companyObj.appKey}]
					let [appidShow, appidIndex, appkeyShow, appkeyIndex] = [false, 0, false, 1]
					self.tableData.forEach((item, index) => {
						if (item.key === 'appid') {
							appidShow = true
							appidIndex = index
						} else if (item.key === 'appkey') {
							appkeyShow = true
							appkeyIndex = index
						}
					})
					if (!appidShow && !appkeyShow) {
						self.tableData.unshift(appid, appkey)
					} else if (!appidShow && appkeyShow) {
						self.tableData.splice(appkeyIndex, 0, appid)
					} else if (appidShow && !appkeyShow) {
						self.tableData.splice((appidIndex + 1), 0, appkey)
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
		}
	}
}
</script>
<style lang="scss" scoped>
	.g-request-box {
		margin-bottom: 20px;
	}
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
	  	// background-color: #f5f7fa;
	  	// color:#96a8ae;
	  	// border-color:#dcdfe6;
	  }
	  // .g-btn-post:hover{
	  // 	background-color: #f5f7fa;
	  // 	color:#96a8ae;
	  // 	border-color:#dcdfe6;
	  // }
	}
	.g-cont-text{
		margin: 20px 5px 10px;
		text-align: left;
	}
	.g-top-btn{
		margin-left: 10px;
	}
</style>