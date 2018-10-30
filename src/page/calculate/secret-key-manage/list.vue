<template>
	<div>
		<div class="g-header">
			<el-row type="flex" class="row-bg" justify="space-between">
			  <el-col :span="8">
			  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
					  <el-breadcrumb-item>密钥管理</el-breadcrumb-item>
					</el-breadcrumb>
			  </el-col>
			  <el-col :span="16">
			  	<div class="grid-content bg-purple g-top-right">
			  		<el-button class="g-top-btn" size="mini" type="info" @click="$router.push('/calculate/index')">返回</el-button>
			  	</div>
			  </el-col>
			</el-row>
			<el-row class="g-tw">
			  <el-col :span="10" class="tl text-ell">
			    <span>公司名称:</span>
			    <span class="g-name" :title="compName">{{compName}}</span>
			  </el-col>
			  <el-col :span="8" class="tl text-ell">
			    <span>验证邮箱:</span>
			    <span class="g-name" :title="email">{{email}}</span>
			  </el-col>
			  <el-col :span="6" class="tr text-ell">
			    <span>联系方式:</span>
			    <span class="g-name" :title="mobile">{{mobile}}</span>
			  </el-col>
			</el-row>
		</div>
		<div class="g-main">
			<el-table
		    :data="tableData"
		    empty-text="暂无数据"
		    class="g-table-all-border"
		    v-loading="loading">
		    <el-table-column
		      align="center"
		      label="AppId"
		      width="120">
		      <template slot-scope="scope">
		      	<span :title="scope.row.appId">{{scope.row.appId || '--'}}</span>
		      </template>
		    </el-table-column>
		    <el-table-column
		      align="center"
		      label="AppKey">
		      <template slot-scope="scope">
	        	<span :title="scope.row.appKey">{{scope.row.appKey || '--'}}</span>
	        </template>
		    </el-table-column>
		    <el-table-column
		      align="center"
		      label="生成时间">
		      <template slot-scope="scope">
	        	<span>{{scope.row.time | formatTime1}}</span>
	        </template>
		    </el-table-column>
		    <el-table-column
		      align="center"
		      label="密钥状态"
		      width="80">
		      <template slot-scope="scope">
		        <span :class="[scope.row.keyState === '0' ? 'font-red' : '']">
		          <template v-if="scope.row.keyState === '0'">
		          	<span>失效</span>
		          </template>
		          <template v-else-if="scope.row.keyState === '1'">
		          	<span>正常</span>
		          </template>
		          <template v-else>
		          	<span>--</span>
		          </template>
		        </span>
      		</template>
		    </el-table-column>
		    <el-table-column
		      align="center"
		      label="审核状态"
		      width="120">
		      <template slot-scope="scope">
		        <template v-if="scope.row.status === '0'">
		          <el-popover trigger="hover" placement="top" class="g-scope-hover">
			          <p>{{refuseReason}}</p>
			          <div slot="reference" class="name-wrapper">
			            <span>拒绝</span>
			          </div>
			        </el-popover>
		        </template>
		        <template v-else>
		        	<span>{{scope.row.status | statusDictionary}}</span>
		        </template>
      		</template>
		    </el-table-column>
		  </el-table>
	    <el-button type="primary" size="mini" class="fl" v-show="againShow"
	      @click="$router.push('/secretKeyManage/apply-info')">重新申请
	    </el-button>
		</div>
	</div>
</template>
<script>
import { getLocalStorage } from '@/util/storageUtil'
import { queryCompKey } from '@/service/iot-frame'
import { formatTime } from '@/util/dateUtil'
export default {
	data () {
		return {
			tableData: [],
			compName: '',
			mobile: '',
			email: '',
			loading: false,
			compCode: '',
			againShow: false,
			refuseReason: ''
		}
	},
	created () {
		let userInfo = getLocalStorage('USER_INFO', 'json')
		this.compName = userInfo.compName || ''
		this.compCode = userInfo.compCode || ''
		this.queryCompKey()
	},
	methods: {
	  async queryCompKey () {
	  	let params = { compCode: this.compCode }
	  	let resData = await queryCompKey(params)
	  	if (resData.status == 200 && resData.data.message === 'success' && resData.data.data !== null) {
	  		this.tableData = new Array(resData.data.data)
	  		this.email = this.tableData[0].email
	  		this.mobile = this.tableData[0].phone
	  		this.refuseReason = this.tableData[0].refuseReason
	  		if (this.tableData[0].status === '0') {
	  			this.againShow = true
	  		}
	  	}
	  }
	},
	filters: {
		statusDictionary: (value) => {  //status字典
			switch (value) {
				case '0':
				  value = '拒绝'
				  break
				case '1':
				  value = '同意'
				  break
				case '2':
				  value = '待审核'
				  break
			}
			return value
		},
		formatTime1: (value) => {  //格式化时间
			if (!value) return '--'
			return formatTime(value, '{y}/{m}/{d} {h}:{i}')
		}
	}
}
</script>
<style lang="scss" scoped>
  .g-main {
  	margin-top: 20px;
  }
  .g-tw {
  	margin-top: 20px;
  	span {
  		font-size: 14px;
  	}
  	.g-name {
  		font-weight: bold;
  	}
  }
	.fl {
		margin-top: 30px;
	}
	.font-red {
  	color: red;
  }
</style>