<template>
	<div>
		<el-row class="g-header">
		  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item :to="{path: '/algorithmOrder'}">算法订购</el-breadcrumb-item>
				  <el-breadcrumb-item>申请订购</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tr">
  	    <el-button type="info" size="mini" @click="$router.push('/algorithmOrder')">
  	      返回
  	    </el-button>
		  </el-col>
		</el-row>
		<el-row>
		  <el-table
		  	v-loading="loading"
	      :data="tableData"
	      ref="multipleTable"
	      class="g-table-all-border"
	      @selection-change="handleSelectionChange">
	      <el-table-column
	        type="selection">
	      </el-table-column>
	      <el-table-column
	        label="算法图标"
	        align="center">
	        <template slot-scope="scope">
		      	<template v-if="scope.row.img != ''">
		      		<img class="s-company-bg-img" :src="scope.row.img" alt="">
		      	</template>
		        <template v-else>
		        	<img class="s-company-bg-img" src="static/image/company1.png" alt="">
		        </template>
		      </template>
	      </el-table-column>
	      <el-table-column
		      align="center"
		      label="算法名称">
		      <template slot-scope="scope">
	        	<span :title="scope.row.name">{{scope.row.name}}</span>
	        </template>
		    </el-table-column>
		    <el-table-column
		      prop="version"
		      align="center"
		      label="当前版本">
		    </el-table-column>
		    <el-table-column
		      align="center"
		      label="状态">
		      <template slot-scope="scope">
		        <span>{{scope.row.status | stateDictionary}}</span>
      		</template>
		    </el-table-column>
		    <el-table-column
		      prop="size"
		      align="center"
		      label="大小">
		    </el-table-column>
		    <el-table-column
	        label="算法类型"
	        align="center">
	        <template slot-scope="scope">
		        <el-popover trigger="hover" placement="top" class="g-scope-hover">
		          <p>{{scope.row.typeName}}</p>
		          <div slot="reference" class="name-wrapper">
		            <span>{{scope.row.typeName}}</span>
		          </div>
		        </el-popover>
      		</template>
	      </el-table-column>
		    <el-table-column
	        label="上传时间"
	        align="center"
	        min-width="120">
	        <template slot-scope="scope">
		        <el-popover trigger="hover" placement="top" class="g-scope-hover">
		          <p>{{scope.row.createTime | formatPubTime}}</p>
		          <div slot="reference" class="name-wrapper">
		            <span>{{scope.row.createTime | formatPubTime}}</span>
		          </div>
		        </el-popover>
      		</template>
	      </el-table-column>
		    <el-table-column
	        label="描述"
	        align="center">
	        <template slot-scope="scope">
		        <el-popover trigger="hover" placement="top" class="g-scope-hover">
		          <p>{{scope.row.descption}}</p>
		          <div slot="reference" class="name-wrapper">
		            <span>{{scope.row.descption}}</span>
		          </div>
		        </el-popover>
      		</template>
	      </el-table-column>
	    </el-table>
      <my-pagination :paginationObj="paginationObj" v-on:changeCur="changeCur" v-on:saveBtnData="saveBtnData"></my-pagination>
		</el-row>
		<!-- <el-dialog class="g-sdk-details-box" width="30%" min-height="30vh" top="25vh" 
		  :visible.sync="dialogVisible">
			<div slot="title" class="dialog-title">
	  		<span class="s-pass-text">申请次数</span>
	    </div>
	    <el-form class="g-form-ipt g-unpass-ta">
    		<template v-for="item of multipleSelection">
	    		<el-form-item :label="item.name+'：'" :label-width="formLabelWidth">
	    			<el-input v-model="item.degree" placeholder="请输入次数" type="number" auto-complete="off" class="g-ipt-number g-item-ipt " clearable></el-input>
					</el-form-item>
    		</template>
	    </el-form>
	    <el-row class="g-fotter-bth">
			  <el-col :span="12">
			  	<el-button type="info" size="mini" @click="dialogVisible = false">
	  	      返回
	  	    </el-button>
			  </el-col>
			  <el-col :span="12">
	  	    <el-button type="primary" size="mini" @click="UpdateDeviceAppsReq">
	  	      确定
	  	    </el-button>
			  </el-col>
			</el-row>
		</el-dialog> -->
		<my-renew-module
			:showes="dialogVisible"
			:data="multipleSelection"
			:deploy="deploy"
			v-on:sureClick="UpdateDeviceAppsReq"
			v-on:closeDialog="closeDialog">
		</my-renew-module>
	</div>
</template>
<script>
// addOrderRecord
import myPagination from '@/components/my-pagination.vue'
import myRenewModule from '@/components/my-renew-module.vue'
import {getLocalStorage} from '@/util/storageUtil'
import {addOrderRecord, queryRemainAlgo, queryLaboratoryList} from '@/service/iot-frame'
import {formatTime} from '@/util/dateUtil'
import {changePageSize} from '@/util/numberUtil'
export default {
	components: {
		myPagination, myRenewModule
	},
	data () {
		return {
      value8: '',
      checked: false,
      allData: [],
      tableData: [],
      compareData: [], //比较后的数组
      merData: {},
      multipleSelection: [],
      appList: [],
      paginationObj: {
	      pageSize: 10,
	      currentPage: 1,
      	totalCount: 10,
      	applyBtn: 'true'
      },
      copyArrList: [],
      loading: true,
      lab: [],
      options: [],
      dialogVisible: false,
      formLabelWidth: '100px',
      deploy: {
      	name: '申请次数'
      }
		}
	},
	mounted () {
		let self = this
		self.merData = getLocalStorage('USER_INFO', 'json')
		self.getCompanyHasalgor()
	},
	methods: {
		async getCompanyHasalgor () { //未订购 -- 算法列表
			let self = this;
			let url = `?pageSize=${self.paginationObj.pageSize}&currentPage=${self.paginationObj.currentPage}&compCode=${self.merData.compCode}`;
    	let data = {
    		compCode: self.merData.compCode,
    		status: '0'
    	}
			let algorithmData = await queryRemainAlgo(url, data)
			if (algorithmData.status !== 200) {
    		self.$message.error("服务器错误")
    		return
    	}
			if (algorithmData.status === 200 && algorithmData.data.status === "200") {
				let list = algorithmData.data.data;
				self.paginationObj.totalCount = algorithmData.data.page.totalRow
				list.forEach((item, index) => {
					self.$set(item, 'type', 0)
					self.$set(item, 'disabled', 'disabled')
					self.tableData.push(item)
				})
				self.loading = false;
				self.getLabList();
			} else {
				self.$message.error(algorithmData.data.message)
			}
		},
		async getLabList () { //未订购 -- 算法列表
			let self = this;
			let data = {}
			let url = `?pageSize=10000&currentPage=1`;
			let algorithmData = await queryLaboratoryList(url, data)
			if (algorithmData.status !== 200) {
    		self.$message.error("服务器错误")
    		return
    	}
			if (algorithmData.status === 200 && algorithmData.data.status === "200") {
				console.log(algorithmData)
				let list = algorithmData.data.data;
				list.forEach((item, index) => {
					self.$set(item, 'value', item.id)
					self.$set(item, 'label', item.labName)
					self.options.push(item)
				})
			} else {
				self.$message.error(algorithmData.data.message)
			}
		},
    changeCur (val) { //分页 -- 查询算法列表
    	let self = this;
    	self.paginationObj.currentPage = val
    	self.loading = true
    	self.tableData = []
    	self.getCompanyHasalgor()
    },
    handleSelectionChange (val) { //勾选 -- 获取当前值
    	let self = this
    	val.forEach((item, index) => {
    		self.$set(item, 'degree', '')
    	})
      self.multipleSelection = val;
    },
    toggleSelection (rows) { //勾选 -- 切换状态
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    saveBtnData () { //申请次数弹出框
			let self = this;
			console.log(self.multipleSelection)
			if (self.multipleSelection.length == 0) {
				self.$message.warning('请选择您需要申请的算法');
			} else {
				self.dialogVisible = !self.dialogVisible
			}
    },
    async UpdateDeviceAppsReq () { //请求 -- 订购算法申请提交
    	let self = this;
    	let ArrayList = []
    	for (let item of self.multipleSelection) {
				if (item.degree == '') {
    			self.$message.warning(`请填写【${item.name}】申请次数`);
    			return false
    		} else {
    			let obj = {
		    		algorithmId: item.id,
		    		compCode: self.merData.compCode,
		    		compName: self.merData.compName,
		    		status: '0',
		    		type: item.type,
		    		addNum: item.degree
	    		}
	    		ArrayList.push(obj)
    		}
    	}
    	console.log(self.multipleSelection)
    	if (ArrayList.length === 0) {
    		self.$message.warning("没有发生改变")
    		return false
    	} else {
    		let resData = await addOrderRecord(ArrayList)
	    	if (resData.status !== 200) {
	    		self.$message.error('服务器错误')
	    		return
	    	}
	    	if (resData.data === 'timeout') {
	    		self.$message.error("用户登录失效，请重新登录")
	    		self.$router.push('/login')
	    	} else {
	    		self.$message.success("申请算法成功")
	    		self.loading = true
		    	self.tableData = []
		  		self.getCompanyHasalgor()
	    	}
	    	self.dialogVisible = false
    	}
    },
    closeDialog () {
    	let self = this;
    	self.dialogVisible = false
    }
	},
	filters: {
		stateDictionary: (value) => { //格式化state字段
			value = value === '0' ? '正常' : '异常'
			return value
		},
    formatPubTime: (value) => { //格式化pubtime
			if (!value) return ''
			return formatTime(value, '{y}/{m}/{d} {h}:{i}')
		},
		formatPkgSize: (value) => { //格式化pgkSize
			if (!value) return ''
			return changePageSize(value, 1)
		}
	}
}
</script>
<style lang="scss" scoped>
  .tl {
  	margin-bottom: 10px;
  	span {
  	  color: #112331;
	  	font-weight: bold;
	  	font-size: 14px;
	  	padding-left: 15px;
  	}
  }
  .g-top-btn {
  	margin-top: 15px;
  }
  .s-company-bg-img{
		display: block;
		width: 40%;
		border-radius: 3px;
		margin: 0 auto;
		max-height: 40px;
	}
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
	  }
  }
</style>