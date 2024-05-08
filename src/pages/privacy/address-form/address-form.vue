<script setup>
	import { ref, computed } from "vue";

	// 表单数据
	const form = ref({
		consignee: "", // 收货人
		phone: "", // 电话
		provinceCode: "", // 省份编码(后端参数)
		provinceName: "", //省份名称
		cityCode: "", // 城市编码(后端参数)
		cityName: "", //城市名称
		districtCode: "", // 区/县编码(后端参数)
		districtName: "", //区级名称
		detail: "", // 详细地址
		isDefault: 0, // 默认地址，1为是，0为否
	});
	//省市区全名称拼接
	let fullLocation = computed(() => {
		let provinceName = form.value.provinceName;
		let cityName = form.value.cityName;
		let districtName = form.value.districtName;
		if (provinceName) {
			return provinceName + " " + cityName + " " + districtName;
		} else {
			return "";
		}
	});
	//修改地区时触发
	const onRegionChange = (ev) => {
		console.log(ev);
		[form.value.provinceName, form.value.cityName, form.value.districtName] =
			ev.detail.value;
		const [provinceCode, cityCode, districtCode] = ev.detail.code;
		Object.assign(form.value, { provinceCode, cityCode, districtCode });
	};
	//收集是否设置为默认地址
	const onSwitchChange = (ev) => {
		console.log(ev);
		form.value.isDefault = ev.detail.value ? 1 : 0;
        console.log(form.value)
	};
</script>

<template>
	<view class="content">
		<uni-forms ref="formRef">
			<!-- 表单内容 -->
			<uni-forms-item class="form-item">
				<text class="label">收货人</text>
				<input
					class="input"
					placeholder="请填写收货人姓名"
					v-model="form.consignee"
				/>
			</uni-forms-item>
			<uni-forms-item class="form-item">
				<text class="label">手机号码</text>
				<input
					class="input"
					placeholder="请填写收货人手机号码"
					v-model="form.phone"
				/>
			</uni-forms-item>
			<uni-forms-item class="form-item">
				<text class="label">所在地区</text>
				<picker
					@change="onRegionChange"
					class="picker"
					mode="region"
					:value="fullLocation.split(' ')"
				>
					<view v-if="fullLocation">{{ fullLocation }}</view>
					<view v-else class="placeholder">请选择省/市/区(县)</view>
				</picker>
			</uni-forms-item>
			<uni-forms-item class="form-item">
				<text class="label">详细地址</text>
				<input class="input" placeholder="街道、楼牌号等信息" v-model="form.detail" />
			</uni-forms-item>
			<uni-forms-item class="form-item">
				<label class="label">设为默认地址</label>
				<switch
					@change="onSwitchChange"
					class="switch"
					color="#27ba9b"
					:checked="form.isDefault === 1"
				/>
			</uni-forms-item>
		</uni-forms>
	</view>
	<!-- 提交按钮 -->
	<button class="button">保存并使用</button>
</template>

<style lang="scss">
	page {
		background-color: #f4f4f4;
	}

	.content {
		margin: 20rpx 20rpx 0;
		padding: 0 20rpx;
		border-radius: 10rpx;
		background-color: #fff;

		.form-item,
		.uni-forms-item {
			display: flex;
			align-items: center;
			min-height: 96rpx;
			padding: 25rpx 10rpx 40rpx;
			background-color: #fff;
			font-size: 28rpx;
			border-bottom: 1rpx solid #ddd;
			position: relative;
			margin-bottom: 0;

			// 调整 uni-forms 样式
			.uni-forms-item__content {
				display: flex;
			}

			.uni-forms-item__error {
				margin-left: 200rpx;
			}

			&:last-child {
				border: none;
			}

			.label {
				width: 200rpx;
				color: #333;
			}

			.input {
				flex: 1;
				display: block;
				height: 46rpx;
			}

			.switch {
				position: absolute;
				right: -20rpx;
				transform: scale(0.8);
			}

			.picker {
				flex: 1;
			}

			.placeholder {
				color: #808080;
			}
		}
	}

	.button {
		height: 80rpx;
		margin: 30rpx 20rpx;
		color: #fff;
		border-radius: 80rpx;
		font-size: 30rpx;
		background-color: #27ba9b;
	}
</style>
