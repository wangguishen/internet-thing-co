<template>
	<div>
	  <el-row>
	  	<el-col :span="24">
	  	  <h4>算法应用</h4>
	  	</el-col>
	  </el-row>
	  <el-row>
	  	<router-link to="/algorManage">
	  		<el-col :span="8">
		  		<div class="m-wrap u-first">
		  			<img src="static/icon/arithAdmin.png" alt="..">
		  			<a>算法管理</a>
		  		</div>
		  	</el-col>
	  	</router-link>
	  	<router-link to="/algorithmOrder">
	  		<el-col :span="8">
		  		<div class="m-wrap u-second">
		  			<img src="static/icon/arithOrder.png" alt="..">
		  			<a>算法订购</a>
		  		</div>
		  	</el-col>
	  	</router-link>
	  	<router-link to="/auditRecord">
		  	<el-col :span="8">
		  		<div class="m-wrap">
		  			<img src="static/icon/applyRecord.png" alt="..">
		  			<a>申请记录</a>
		  		</div>
		  	</el-col>
	  	</router-link>
	  </el-row>
	  <!-- <el-row>
	    <router-link to="/downRecordList">
	      <el-col :span="8">
	        <div class="m-wrap">
	        	<img src="static/icon/down-record.png" alt="..">
	        	<a>下载记录</a>
	        </div>
	      </el-col>
	    </router-link>
	    <el-col :span="8">
        <div class="m-wrap u-second">
        </div>
      </el-col>
      <el-col :span="8">
        <div class="m-wrap">
        </div>
      </el-col>
	  </el-row> -->
	  <el-row>
	  	<el-col :span="24">
	  	  <h4>算法密钥</h4>
	  	</el-col>
  		<el-col :span="8">
	  		<div class="m-wrap u-first" @click="handClick">
	  			<img src="static/icon/secret-key.png" alt="..">
	  			<a>密钥管理</a>
	  		</div>
	  	</el-col>
  		<el-col :span="8">
			  <div class="m-wrap u-second">
			  </div>
	  	</el-col>
      <el-col :span="8">
        <div class="m-wrap">
        </div>
      </el-col>
	  </el-row>
	  <el-row>
	  	<el-col :span="24">
	  	  <h4>实验室</h4>
	  	</el-col>
	  	<router-link to="/algorithmCall">
	  		<el-col :span="8">
		  		<div class="m-wrap u-first">
		  			<img src="static/icon/algorithm-called.png" alt="..">
		  			<a>算法调用</a>
		  		</div>
	  		</el-col>
	  	</router-link>
	  	<el-col :span="8">
			  <div class="m-wrap u-second">
			  </div>
	  	</el-col>
      <el-col :span="8">
        <div class="m-wrap">
        </div>
      </el-col>
	  </el-row>
	</div>
</template>
<script>
import { removeToken, getLocalStorage } from '@/util/storageUtil'
import { queryCompKey } from '@/service/iot-frame'
export default {
	data () {
		return {
		  hasSecretKey: true,
		  compCode: ''
		}
	},
	created () {
		let userInfo = getLocalStorage('USER_INFO', 'json')
		this.compCode = userInfo.compCode
		removeToken('APPLY_AUDIT_AX')
		removeToken('AUDIT_RECORD_AX')
		this.queryCompKey()
	},
	methods: {
		handClick () {
			if (!this.hasSecretKey) {
				this.$router.push('/secretKeyManage/apply')
			} else {
        this.$router.push('/secretKeyManage/list')
			}
		},
		async queryCompKey () {
			let params = { compCode: this.compCode }
			let resData = await queryCompKey(params)
			if (resData.status === 200 && resData.data.data !== null) {
        this.hasSecretKey = true
			} else {
				this.hasSecretKey = false
			}
		}
	}
}
</script>
<style lang="scss" scoped>
	.m-wrap {
	  height: 155px;
		border: 1px solid #e3e9ec;
		border-radius: 3px;
		position: relative;
		background: #fff;
		cursor: pointer;
		border-bottom: none;
		img {
			display: block;
			position: absolute;
			left: 50%;
			margin-top: 35px;
			transform: translate(-50%);
		}
		a {
		  font-size: 14px;
			line-height: 220px;
		}
	}

	.m-wrap:hover {
	  background: #eee;
	}
	
	h4 {
		text-align: left;
		margin: 10px 0 10px 0;
		color: #2e2e2e;
	}
	.u-second {
		border-left: none;
		border-right: none;
	}
	@media screen and (min-width:1920px) {
	  .m-wrap {
	  	height: 260px;
	  	img {
	  	  margin-top: 85px;
	  	}
	  	a {
	      line-height: 340px;
	  	}
	  }
    }
</style>