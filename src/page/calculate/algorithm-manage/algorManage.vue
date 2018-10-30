<template>
	<div>
		<div class="g-header">
			<el-row type="flex" class="row-bg" justify="space-between">
			  <el-col :span="8">
			  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
					  <el-breadcrumb-item>算法管理</el-breadcrumb-item>
					</el-breadcrumb>
			  </el-col>
			  <el-col :span="16">
			  	<div class="grid-content bg-purple g-top-right">
			  		<el-button class="g-top-btn" size="mini" type="info" @click="back()">返回</el-button>
			  	</div>
			  </el-col>
			</el-row>
		</div>
		<div class="g-main">
			<el-table
				v-loading="loading"
		    :data="algorithmList"
		    @row-click="jumpDetails"
		    empty-text="暂无数据"
		    class="m-pointer-table g-table-all-border">
		    <el-table-column
		      align="center"
		      label="算法图标"
		      width="130">
		      <template slot-scope="scope">
		      	<template v-if="scope.row.img != ''">
		      		<img class="s-company-bg-img" :src="scope.row.img" alt="" onerror="onerror=null;this.src='static/image/company1.png'">
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
		    <!-- <el-table-column
		      prop="version"
		      align="center"
		      label="当前版本"
		      width="80">
		    </el-table-column>
		    <el-table-column
		      align="center"
		      label="大小"
		      width="80">
		      <template slot-scope="scope">
	        	<span :title="scope.row.size">{{scope.row.size}}</span>
	        </template>
		    </el-table-column> -->
		    <el-table-column
	        label="使用次数"
	        align="center">
	        <template slot-scope="scope">
	        	<my-progress-bar
							strokeWidth="15"
							:residueDegree="scope.row.surplusNum"
							:totalDegree="scope.row.addNum"
							degreeUnit='次'>
						</my-progress-bar>
	        </template>
	      </el-table-column>
	      <el-table-column
	        label="使用天数"
	        align="center">
	        <template slot-scope="scope">
	        	<my-progress-bar
							strokeWidth="15"
							:residueDegree="scope.row.surplusDay"
							:totalDegree="scope.row.totalDay"
							degreeUnit='天'>
						</my-progress-bar>
	        </template>
	      </el-table-column>
	      <!-- <el-table-column
		      align="center"
		      label="大小"
		      width="80">
		      <template slot-scope="scope">
	        	<span :title="scope.row.size">{{scope.row.size}}</span>
	        </template>
		    </el-table-column> -->
		   <!--  <el-table-column
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
	      </el-table-column> -->
	      <el-table-column
	        label="订购时间"
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
		  </el-table>
		</div>
		<my-pagination :paginationObj="paginationObj" v-on:changeCur="changeCur"></my-pagination>
	</div>
</template>
<script>
import {queryCompAlgoList} from '@/service/iot-frame'
import {setToken, removeToken, getLocalStorage} from '@/util/storageUtil'
import MyPagination from '@/components/my-pagination'
import MyProgressBar from '@/components/my-progress-bar'
import {formatTime} from '@/util/dateUtil'
export default {
	components: {
		MyPagination, MyProgressBar
	},
	data () {
		return {
			merData: {},
			searchValue: '',
			algorithmList: [],
			paginationObj: {
				pageSize: 10,
				currentPage: 1,
				totalCount: 0
			},
			loading: true,
			residueDegree: '90',
			totalDegree: '100',
			bgProgressColor: '#00aaee',
			degreeUnit: '次'
		}
	},
	mounted () {
		let self = this;
		self.merData = getLocalStorage('USER_INFO', 'json')
		let url = `?pageSize=${self.paginationObj.pageSize}&currentPage=${self.paginationObj.currentPage}`;
		let data = {compCode: self.merData.compCode, status: '0'}
		self.algorithm(url, data)
	},
	methods: {
		async algorithm (url, data) { //公共请求方法
			let self = this;
			let algorithmData = await queryCompAlgoList(url, data)
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
					self.algorithmList.push(item)
				})
			} else {
				self.$message.error(algorithmData.data.message)
			}
		},
		back () { //返回计算框架模块页面
			let self = this;
			removeToken("ARITHMETIC_OBJECT_ID")
			self.$router.push('/calculate/index')
		},
		jumpDetails (row, event, column) { //跳转详情页面
			let self = this;
			setToken("ARITHMETIC_OBJECT_ID", row.id)
			self.$router.push('/algorManageDetail')
		},
		changeCur (val) { //分页按钮点击事件
			let self = this;
			self.paginationObj.currentPage = val;
			self.loading = true
			self.algorithmList = []
			let data = {compCode: self.merData.compCode, status: '0'}
			let url = `?pageSize=${self.paginationObj.pageSize}&currentPage=${self.paginationObj.currentPage}`;
			self.algorithm(url, data)
		}
	},
	filters: {
		stateDictionary: (value) => { //格式化state字段
		  value = value === '0' ? '正常' : '异常'
		},
		formatPubTime: (value) => { //格式化pubtime
			if (!value) return ''
			return formatTime(value, '{y}/{m}/{d} {h}:{i}')
		}
	}
}
</script>
<style lang="scss" scoped>
	.s-company-bg-img{
		display: block;
		width: 40%;
		border-radius: 3px;
		margin: 0 auto;
		max-height: 40px;
	}
</style>