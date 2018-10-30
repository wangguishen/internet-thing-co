<template>
	<div class="d-progress-box">
		<div class="g-progress-box" :style="{height: strokeWidth+'px'}">
			<div class="s-progress-box" :style="{width: percentage, backgroundColor: color}">
				<div class="t-progress-text">{{residueDegrees}}</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	data () {
		return {
		}
	},
	props: {
		strokeWidth: { //高度
			type: String
		},
		residueDegree: [String, Number], //剩余次数
		totalDegree: [String, Number], //总次数
		color: { //进度条数背景颜色
			type: String
		},
		degreeUnit: { //单位
			type: String
		}
	},
	mounted () {
	},
	computed: {
		residueDegrees: function () { //剩余次数
			let self = this;
			// if (self.totalDegree == self.residueDegree) {
			// 	return 'Max'
			// } else {
				return self.residueDegree + self.degreeUnit
			// }
		},
    percentage: function () {
    	let self = this;
    	let val = (Math.round((Number(self.residueDegree) / Number(self.totalDegree)) * 10000) / 100).toFixed(2);
    	return val + '%'
    }
  },
	methods: {

	}
}
</script>
<style lang="scss" scoped>
	.d-progress-box{
		display: inline-block;
    vertical-align: middle;
    width: 100%;
	}
	.g-progress-box{
		height: 15px;
    border-radius: 100px;
    background-color: #ebeef5;
    overflow: hidden;
    position: relative;
    vertical-align: middle;
	}
	.s-progress-box{
		position: absolute;
    left: 0;
    top: 0;
    width: 70%;
    height: 100%;
    background-color: #00aaee;
    text-align: right;
    border-radius: 100px;
    line-height: 0.9;
    white-space: nowrap;
	}
	.t-progress-text{
		display: inline-block;
    vertical-align: middle;
    color: #fff;
    font-size: 12px;
    margin: 0 5px;
	}
	.s-progress-box::after{
    display: inline-block;
    content: "";
    height: 100%;
    vertical-align: middle;
	}
</style>