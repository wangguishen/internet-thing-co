<template>	
  <div>
  	<el-row class="g-header">
  	  <el-col :span="2">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item>申请记录</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="10" class="tl">
		    <span class="g-co-name">公司名称: <span :title="coName">{{ coName }}</span></span>
		  </el-col>
		  <el-col :span="12" class="tr">
  	    <el-button type="info" class="g-top-btn" size="mini" @click="$router.push('/calculate/index')">
  	      返回
  	    </el-button>
		  </el-col>
  	</el-row>
  	<el-row class="g-content">
  	  <el-col :span="24">
	  	  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
				  <el-menu-item :index="arrayType[0]">申请订购</el-menu-item>
				  <el-menu-item :index="arrayType[1]">退订</el-menu-item>
				  <el-menu-item :index="arrayType[2]">续签申请</el-menu-item>
				</el-menu>
				<el-table
		      :data="tableData"
		      class="g-table-check-border pointer"
		      align="left"
		      @row-click="jumpDetails"
		      v-loading="loading">
		      <el-table-column
		        label="算法名称">
		        <template slot-scope="scope">
			        <span :title="scope.row.algoName">{{scope.row.algoName}}</span>
	      		</template>
		      </el-table-column>
		      <template v-if="activeIndex == '2'">
		      	<el-table-column
			        label="续签次数/天数">
			        <template slot-scope="scope">
			        	<template v-if="scope.row.addNum != 0">
			        		<span>{{scope.row.addNum}}次</span>
			        	</template>
				        <template v-else>
			        		<span>{{scope.row.addDay}}天</span>
			        	</template>
		      		</template>
			      </el-table-column>
		      </template>
		      <el-table-column
		        label="申请时间">
		        <template slot-scope="scope">
			        <span>{{scope.row.createTime | formatTime1}}</span>
	      		</template>
		      </el-table-column>
		      <el-table-column
		        label="审批时间">
		        <template slot-scope="scope">
		          <template v-if="scope.row.status === status[2]">
			          <span>审核中</span>
		          </template>
		          <template v-else>
		          	<span>{{scope.row.updateTime | formatTime1}}</span>
		          </template>
	      		</template>
		      </el-table-column>
		      <template v-if="applyAuditShow">
			      <el-table-column
			        label="退订原因">
		      		<template slot-scope="scope">
			      		<el-popover trigger="hover" placement="top" class="g-scope-hover">
				          <p>{{ scope.row.unsubscribeReason}}</p>
				          <div slot="reference" class="name-wrapper">
				            <span>{{ scope.row.unsubscribeReason }}</span>
				          </div>
				        </el-popover>
				      </template>
			      </el-table-column>
		      </template>
		      <template v-if="applyOrderShow">
		      	<el-table-column
			        label="申请次数"
			        align="center">
			        <template slot-scope="scope">
				        <span>{{scope.row.addNum}}</span>
		      		</template>
			      </el-table-column>
		      </template>
		      <el-table-column
		        label="描述">
		        <template slot-scope="scope">
			        <el-popover trigger="hover" placement="top" class="g-scope-hover">
			          <p>{{ scope.row.desc}}</p>
			          <div slot="reference" class="name-wrapper">
			            <span>{{ scope.row.desc }}</span>
			          </div>
			        </el-popover>
	      		</template>
		      </el-table-column>
		      <el-table-column
		        label="状态">
						<template slot-scope="scope">
						  <template v-if="scope.row.status === status[0]">
						  	<el-button class="s-no-red-xq-btn" slot="trigger" size="mini" type="primary" @click.stop="loseDilog(scope.row)">
			          失败
			          </el-button>
						  </template>
						  <template v-if="scope.row.status === status[1]">
				        <el-button class="g-top-btn" slot="trigger" size="mini" type="primary" @click.stop="orderStop">
				        	<template v-if="activeIndex == '2'">
				        		已续签
				        	</template>
				        	<template v-else>
				        		<template v-if="activeIndex===arrayType[0]">
					            已订购
					          </template>
					          <template v-else>
					          	已退订
					          </template>
				        	</template>
				        </el-button>
			        </template>
			        <template v-if="scope.row.status === status[2]">
			        	<el-button class="g-top-btn" slot="trigger" size="mini" type="primary" @click.stop="orderStop">
				          审核中
				        </el-button>
			        </template>
	      		</template>
		      </el-table-column>
		    </el-table>

		    <!-- 失败原因 -->
				<el-dialog class="g-sdk-details-box" width="30%" min-height="30vh" top="25vh" 
				  :visible.sync="dialogVisible">
					<div slot="title" class="dialog-title">
					  <template v-if="activeIndex === arrayType[0]">
				  	  <span class="s-pass-text">未订购成功原因</span>
				  	</template>
				  	<template v-else>
				  		<span class="s-pass-text">未退订成功原因</span>
				  	</template>
			    </div>
			    <el-form class="g-form-ipt g-unpass-ta" disabled="disabled">
			    	<el-input type="textarea" v-model="cause"></el-input>
			    </el-form>
				</el-dialog>
			</el-col>
		</el-row>
		<my-pagination :paginationObj="paginationObj" v-on:changeCur="changeCur"></my-pagination>
  </div>
</template>

<script>
	import { formatTime } from '@/util/dateUtil'
  import myPagination from '@/components/my-pagination.vue'
  import { queryCompanyRecord, queryRenewRecord } from '@/service/iot-frame'
  import { setToken, getToken, getLocalStorage } from '@/util/storageUtil'
	export default {
		components: {
		  myPagination
	  },
		data () {
			return {
				activeIndex: '',
				applyAuditShow: false,
				applyOrderShow: false,
				arrayType: ['0', '1', '2'], //0:订购 1:退订 2:续签申请
				status: ['0', '1', '2'], //0:失败 1:已订购 2:审核中
				coName: '',
				compCode: '',
				form: {},
        formLabelWidth: '35%',
        tableData: [],
        value8: '',
        dialogVisible: false,
        cause: '',
	      paginationObj: {
		      pageSize: 10,
		      currentPage: 1,
	      	totalCount: 0
	      },
	      loading: true
			}
		},
		mounted () {
			this.activeIndex = getToken('AUDIT_RECORD_AX') || '0'
			this.applyAuditShow = this.activeIndex === this.arrayType[1];
			this.applyOrderShow = this.activeIndex === this.arrayType[0];
			this.coName = getLocalStorage('USER_INFO', 'json').compName || ''
			this.compCode = getLocalStorage('USER_INFO', 'json').compCode
      this.queryCompanyRecord()
		},
		methods: {
			async queryCompanyRecord () { //订购退订算法纪录查询
				let self = this
				let qParamData = `?pageSize=${self.paginationObj.pageSize}&currentPage=${self.paginationObj.currentPage}`
				let paramData = {
					"compCode": self.compCode,
					"type": Number(self.activeIndex),
					"pageSize": self.paginationObj.pageSize,
					"currentPage": self.paginationObj.currentPage
				}
				let resData;
				if (self.activeIndex == '2') {
					paramData.type = 1
					resData = await queryRenewRecord(qParamData, paramData)
				} else {
					resData = await queryCompanyRecord(qParamData, paramData)
				}
				// let resData = await queryCompanyRecord(qParamData, paramData)
				if (resData.data.status != 200 || resData.data.message !== 'success') {
					self.$message.error(resData.data.message)
					self.loading = false
					return
				}
				self.tableData = resData.data.data
				self.paginationObj.totalCount = resData.data.page.totalRow
				self.loading = false
				console.log(self.tableData)
			},
			handleSelect (key, keyPath) { //切换 -- 表头申请与退订
				let self = this
				self.applyAuditShow = key === self.arrayType[1];
				self.applyOrderShow = key === self.arrayType[0];
				self.activeIndex = key
				self.loading = true
				self.queryCompanyRecord()
			},
			jumpDetails (row, event, column) { //跳转 -- 详情
				let self = this
				setToken('AUDIT_RECORD_DETAIL', row)
				setToken('AUDIT_RECORD_AX', self.activeIndex)
    	  self.$router.push('/auditRecordDetail')
			},
			changeCur (val) { //分页 -- 查询列表
				let self = this
    	  self.paginationObj.currentPage = val
    	  self.loading = true
    	  self.queryCompanyRecord()
			},
			loseDilog (row) { //弹框 -- 失败模态框显示
				let self = this
				self.cause = row.refuseReason
				self.dialogVisible = !self.dialogVisible
			}
		},
		filters: {
			statusDictionary: (value) => { //status字典
				switch (value) {
					case '0':
					  value = '正常'
					  break
					case '1':
					  value = '审批通过'
					  break
					case '2':
					  value = '未审核'
					  break
				}
				return value
			},
			formatTime1: (value) => { //格式化时间
				if (!value) return ''
				return formatTime(value, '{y}/{m}/{d} {h}:{i}')
			}
		}
	}
</script>

<style lang="scss" scoped>
  .g-form-ipt {
  	// margin-top: 15px;
  	min-height: 150px;
    .g-item-ipt {
		  width: 80%;
		  height: 35px;
    }
		.g-top-btn {
			margin-left: 120px;
		}
		.g-mr {
			margin-left: 20px;
		}
  }
  .s-distribute-btn {
  	margin-right: 30px;
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
  .g-mr {
  	margin-right: 10px;
  }
  .tl {
  	line-height: 30px;
  }
  .font-red {
  	color: red;
  }
  .s-no-red-xq-btn {
  	padding: 8px 28px;
  }
  .g-co-name {
		font-size: 14px;
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
  }
</style>
