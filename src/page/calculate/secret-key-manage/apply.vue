<template>	
  <div>
  	<el-row class="g-header">
  	  <el-col :span="12">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item>密钥管理</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="12" class="tr">
  	    <el-button type="info" class="g-top-btn" size="mini" @click="$router.push('/calculate/index')">
  	      返回
  	    </el-button>
		  </el-col>
  	</el-row>
  	<el-row class="g-content g-wrap-mh">
  	  <el-col :span="24">
  	    <h3 class="g-h3">未申请密钥</h3>
  	    <router-link to="/secretKeyManage/apply-info">
  	      <span class="pointe g-span">点击申请密钥</span>
  	    </router-link>
			</el-col>
		</el-row>
  </div>
</template>

<style lang="scss" scoped>
  .g-content {
	  .g-h3 {
	  	margin-top: 29vh;
	  	margin-bottom: 10px;
	  }
  	.g-span {
  		color: #00aaee;
  	}
  }
</style>
