<template>
	<div>
		<el-row class="g-header">
		  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item>算法订购</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tr">
		  	<el-select v-model="selectValue" clearable placeholder="请选择订购状态" size="small" @change="selectChange">
			    <el-option
			      v-for="item in selectOptions"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			  </el-select>
		  	<el-button class="g-top-btn s-yes-icon s-five-text-btn" size="mini" type="primary" icon="el-icon-plus" @click="applyOrder()">申请订购</el-button>
  	    <el-button type="info" class="g-top-btn" size="mini" @click="back">返回</el-button>
		  </el-col>
		</el-row>
		<el-row>
		  <el-table
		  	v-loading="loading"
	      :data="tableData"
	      class="g-table-all-border">
	      <el-table-column
		      align="center"
		      label="算法图标">
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
	        align="center">
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
	      <el-table-column
		      align="center"
		      label="订购状态">
		      <template slot-scope="scope">
		      	<template v-if="scope.row.orderStatus == 1">
		      		已订购
		      	</template>
		        <template v-else>
		        	<template v-if="scope.row.orderStatus == 2">
		        		审核中
		        	</template>
		        	<template v-else>
		        		<span style="color:#eb2929;">未订购</span>
		        	</template>
		        </template>
		      </template>
		    </el-table-column>
	    </el-table>
      <my-pagination :paginationObj="paginationObj" v-on:changeCur="changeCur"></my-pagination>
		</el-row>
	</div>
</template>
<script>
import myPagination from '@/components/my-pagination.vue'
import {queryAlgorithmInfoList} from '@/service/iot-frame'
import {formatTime} from '@/util/dateUtil'
import {changePageSize} from '@/util/numberUtil'
import {removeToken, getLocalStorage} from '@/util/storageUtil'

export default {
	components: {
		myPagination
	},
	data () {
		return {
		  options: [],
      value8: '',
      tableData: [],
      merName: '', //设备号
      merId: '', //公司内部编号
      merCode: '',
      merObj: {},
      paginationObj: {
	      pageSize: 10,
	      currentPage: 1,
      	totalCount: 0
      },
      loading: true,
      selectOptions: [{
        value: '0',
        label: '未订购'
      }, {
        value: '1',
        label: '已订购'
      }, {
        value: '2',
        label: '审核中'
      }],
      selectValue: ''
		}
	},
	mounted () {
		let self = this
		self.merCode = getLocalStorage('USER_INFO', 'json').compCode || ''
		let data = {status: '0'}
		let url = `?pageSize=${self.paginationObj.pageSize}&currentPage=${self.paginationObj.currentPage}&compCode=${self.merCode}&orderStatus=${self.selectValue}`;
		self.getAppsReq(url, data)
	},
	methods: {
		applyOrder () {  //跳转 -- 申请订购
			let self = this;
			self.$router.push('/algorithmSetting')
		},
    changeCur (val) {  //分页 -- 查询
    	let self = this
    	let data = {status: '0'}
    	let url = `?pageSize=${self.paginationObj.pageSize}&currentPage=${self.paginationObj.currentPage}&compCode=${self.merCode}&orderStatus=${self.selectValue}`;
    	self.paginationObj.currentPage = val
    	self.loading = true
    	self.tableData = []
    	self.getAppsReq(url, data)
    },
    async getAppsReq (url, data) {  //请求 -- 企业订购算法状态
    	let self = this
    	let algorithmData = await queryAlgorithmInfoList(url, data)
    	self.loading = false
			if (algorithmData.status !== 200) {
    		self.$message.error("服务器错误")
    		return
    	}
			if (algorithmData.status === 200 && algorithmData.data.status === "200") {
				let list = algorithmData.data.data;
				let page = algorithmData.data.page;
				self.paginationObj.totalCount = page.totalRow;
				list.forEach((item, index) => {
					self.tableData.push(item)
				})
			} else {
				self.$message.error(algorithmData.data.message)
			}
    },
    selectChange () {
    	let self = this;
    	self.paginationObj.currentPage = 1;
    	let data = {status: '0'}
			let url = `?pageSize=${self.paginationObj.pageSize}&currentPage=${self.paginationObj.currentPage}&compCode=${self.merCode}&orderStatus=${self.selectValue}`;
			self.loading = true
    	self.tableData = []
			self.getAppsReq(url, data)
    },
    back () {  //返回计算框架模块页面
    	let self = this
    	removeToken('MER_DATA')
    	self.$router.push('/calculate/index')
    }
	},
	filters: {
		stateDictionary: (value) => {  //格式化state字段
			value = value === '0' ? '正常' : '异常'
			return value
		},
		formatPubTime: (value) => {  //格式化pubtime
			if (!value) return ''
			return formatTime(value, '{y}/{m}/{d} {h}:{i}')
		},
		formatPkgSize: (value) => {  //格式化pgkSize
			if (!value) return ''
			return changePageSize(value, 1)
		}
	}
}
</script>
<style lang="scss" scoped>
	.setting {
	  color: #9fa9ba;
	  font-size: 14px;
	}
	.u-set {
		background: #fff;
		text-align: center;
		width: 32px;
		height: 32px;
		border-radius: 3px;
		border: 1px solid #dee8ef;
		margin: 0 15px;
		cursor: not-allowed;
		outline: none;
	}
	.cursor-pointer {
		cursor: pointer
	}
	.cursor-allowed {
		cursor: not-allowed;
	}
	.s-company-bg-img{
		display: block;
		width: 40%;
		border-radius: 3px;
		margin: 0 auto;
		max-height: 40px;
	}
	.s-no-order{
		color: red;
	}
</style>