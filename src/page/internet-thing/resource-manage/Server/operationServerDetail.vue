<template>
	<div class="operation-server-add">
		<el-row class="g-header">
		  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item :to="{path: '/operationServer'}">服务器环境</el-breadcrumb-item>
				  <el-breadcrumb-item>详情</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tr">
  	    <el-button type="info" class="g-top-btn" size="mini" @click="$router.push('/operationServer')">
  	      返回
  	    </el-button>
		  </el-col>
		</el-row>
		<el-row class="g-content g-wrap-mh">
		  <el-col :span="24">
			  <el-form label-width="80px" :model="form" class="g-form-ipt tl">
			    <el-form-item label="目的主机IP:" :label-width="formLabelWidth">
			      <el-input v-model="form.ip" class="g-item-ipt" disabled></el-input>
			    </el-form-item>
			    <el-form-item label="端口:" :label-width="formLabelWidth">
			      <el-input v-model="form.port" class="g-item-ipt" disabled></el-input>
			    </el-form-item>
			    <el-form-item label="上传用户:" :label-width="formLabelWidth">
			      <el-input v-model="form.name" class="g-item-ipt" disabled></el-input>
			    </el-form-item>
			    <el-form-item label="密码/公钥:" :label-width="formLabelWidth">
			      <el-input v-model="form.pubKey" class="g-item-ipt" disabled></el-input>
			    </el-form-item>
			  </el-form>
		  </el-col>
		</el-row>
		<el-dialog class="g-sdk-details-box" width="26%" top="25vh" :visible.sync="dialogDeleteVisible">
			<div slot="title" class="dialog-title">
		  	<span class="s-pass-text">提示</span>
	    </div>
	    <div class="s-pass-container">
	    	您确定要删除此数据吗？
	    </div>
			<div slot="footer" class="dialog-footer">
		    <el-button size="mini" class="s-yes-bg-ga-btn" type="info" @click="deleteCancel()">取 消</el-button>
		    <el-button size="mini" class="s-pass-sure" type="primary" @click="deleteSure()">确 定</el-button>
		  </div>
		</el-dialog>
	</div>
</template>

<script>
import {deleteServerInfo} from '@/service/iot-frame'
import {getToken} from '@/util/storageUtil'
import {recursionDelete} from '@/util/arrayUtil'
import {companyList} from '@/service/list'
	export default {
		data () {
			return {
				form: {
					ip: '',
					port: '',
	        name: '', //名称
	        pubKey: '', //公钥
	        state: '', //状态
	        address: '', //服务器地址
	        owner: '' //所属人
	      },
	      formLabelWidth: '100px',
	      singleRowData: {},
	      dialogDeleteVisible: false, //删除弹框
	      compOptions: [],
	      selectedOptions: [],
	      props: {
	      	label: 'comp_name',
        	value: 'comp_code',
        	children: 'enterprises'
	      }
			}
		},
		mounted () {
			let self = this;
			self.singleRowData = getToken('operaServerSingData', 'json')
			self.form.ip = self.singleRowData.ip;
			self.form.port = self.singleRowData.port;
			self.form.name = self.singleRowData.userName;
			self.form.pubKey = self.singleRowData.password;
			self.form.address = self.singleRowData.catalog;
			self.form.owner = self.singleRowData.owner;
			if (self.singleRowData.compCode) {
				self.selectedOptions = self.singleRowData.compCode.split(',')
			}
			let data = {
				compCode: '',
				type: "0"
			};
			self.companyLists(data, 'a')
		},
		methods: {
			compOptionsChange (val) { //切换企业
				let self = this;
				if (self.selectedOptions.length > 0) {
	        self.compChange(self.selectedOptions[self.selectedOptions.length - 1])
	      }
			},
			compChange (compValue) {
				let self = this;
				let data = {
					compCode: compValue,
					type: "0"
				};
				self.companyLists(data, 'b')
			},
			async companyLists (data, type) {
				let self = this;
				let companyData = await companyList(data)
				if (companyData.status == 200 && companyData.data.success) {
					let list = companyData.data.data;
					if (type == 'a') {
						self.compOptions = recursionDelete(list)
					} else if (type == 'b') {
						self.form.comp_code = self.selectedOptions.join(',')
						self.form.merId = list[0].id;
						self.form.merName = list[0].comp_name;
					}
				} else {
					self.$message({
	          message: companyData.data.msg,
	          type: 'error',
	          duration: 1500,
	          center: true
	        });
				}
			},
			deleteCancel () {
				let self = this;
				self.dialogDeleteVisible = false;
				self.$message.warning('已取消删除')
			},
			async deleteSure () {
				let self = this;
				let deleteData = {
					'id': self.singleRowData.id
				}
				let deleteResData = await deleteServerInfo(deleteData);
        if (deleteResData.status == 200 && deleteResData.data.message == 'success') {
        	self.$message.success({
          	type: 'success',
          	message: '删除成功!'
          });
          self.$router.push('/operationServer')
        } else {
        	self.$message.error(deleteResData.data.message)
        }
			},
			deleteSingleServer () { //删除单条服务器环境
				let self = this;
				self.dialogDeleteVisible = !self.dialogDeleteVisible;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.g-content {
		border: 1px solid #e3e9ec;
		background: #fff;
		padding: 15px;
		.g-item-ipt {
			width: 60%;
		}
		.upload-demo {
			margin-left: 10px;
		}
		.s-sure-btn {
			margin-left: 100px;
		}
	}
	.g-sdk-details-box{
		text-align: left;
		.g-sdk-details-ipt{
			width: 80%;
		}
		.el-dialog{
			.el-dialog__body{
				padding: 25px 15px;
				.s-no-pass-cause{
					padding-left: 20px;
				}
			}
			.dialog-title{
				.s-pass-text{
					margin-left: 20px;
				}
			}
			.s-pass-container{
				text-align: center;
				font-size: 18px;
				padding: 15px 0;
			}
			.dialog-footer{
				margin-bottom: 20px;
				.s-yes-bg-ga-btn{
					margin-right: 20px;
				}
				.s-pass-sure{
					margin-left: 20px;
				}
			}
		}
	}
</style>