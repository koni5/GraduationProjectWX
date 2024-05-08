<script setup>
	import { ref, defineProps } from "vue";
	import { onShow } from "@dcloudio/uni-app";
	import { getCouponListAPI } from "../../../services/coupon";
	import { useCouponStore } from "@/stores";
	//获取优惠券仓库
	const couponStore = useCouponStore();
	//获取页面传参的参数值
	const props = defineProps(["orderSum"]);
	let couponList = ref([]);
	const getCouponList = async () => {
		let res = await getCouponListAPI();
		couponList.value = res.data;
	};
	//选中优惠券的标识
	let signal = ref(-1);
	//选择优惠券
	const onChange = (index) => {
		signal.value = index;
	};
	//选中优惠券点击确认触发的函数
	const confirm = () => {
		// console.log(couponList.value[signal.value]);
		couponStore.setInfo(couponList.value[signal.value]);
		uni.navigateBack();
	};
	onShow(() => {
		getCouponList();
	});
</script>
<template>
	<div class="page">
		<scroll-view scroll-y>
			<radio-group class="goods">
				<view
					v-for="(item, index) in couponList"
					:key="item.id"
					class="item"
					hover-class="none"
					@click="onChange(index)"
				>
					<radio
						:value="index"
						:disabled="item.minimum > orderSum"
						:checked="signal === index"
					/>
					<text :class="{ disabled: item.minimum > orderSum }">天天神券</text>
					<view class="meta" :class="{ disabled: item.minimum > orderSum }">
						<view class="name ellipsis">￥{{ item.discount }}</view>
						<view class="attrs">满{{ item.minimum }}可用</view>
						<view class="count">x{{ item.count }}</view>
					</view>
				</view>
			</radio-group>
			<!-- 确认使用优惠券 -->
			<view
				class="toolbar"
				:style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }"
			>
				<view class="button" @click="confirm"> 确认 </view>
			</view>
		</scroll-view>
	</div>
</template>
<style lang="scss" scoped>
	.toolbar {
		position: fixed;
		left: 0;
		right: 0;
		bottom: calc(var(--window-bottom));
		z-index: 1;

		background-color: #fff;
		height: 100rpx;
		padding: 0 20rpx;
		border-top: 1rpx solid #eaeaea;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: content-box;

		.total-pay {
			font-size: 40rpx;
			color: #cf4444;

			.decimal {
				font-size: 75%;
			}
		}

		.button {
			margin-left: 500rpx;
			width: 220rpx;
			text-align: center;
			line-height: 72rpx;
			font-size: 26rpx;
			color: #fff;
			border-radius: 72rpx;
			background-color: #ffbc0d;
		}

		.disabled {
			opacity: 0.6;
		}
	}
	.disabled {
		opacity: 0.35;
	}
	.page {
		background-color: #f4f4f4;
		height: 100vh;
	}
	.title {
		font-size: 35rpx;
		font-style: italic;
		margin-top: 50rpx;
		padding-bottom: 10rpx;
		margin-left: 20rpx;
		color: #313234;
	}
	.goods {
		margin: 20rpx;
		padding: 0 20rpx;
		border-radius: 10rpx;
		background-color: #fefefe;

		.item {
			display: flex;
			padding: 20rpx 0;
			border-top: 5rpx solid #eee;

			&:first-child {
				border-top: none;
			}

			.picture {
				width: 170rpx;
				height: 170rpx;
				border-radius: 10rpx;
				margin-right: 20rpx;
			}

			.meta {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				position: relative;
			}

			.name {
				font-size: 50rpx;
				margin-left: 310rpx;
				height: 80rpx;
				color: #ff3c26;
			}

			.attrs {
				margin-left: 295rpx;
				line-height: 1.8;
				padding: 0 15rpx;
				margin-top: 6rpx;
				font-size: 24rpx;
				align-self: flex-start;
				border-radius: 10rpx;
				color: #888;
				background-color: #f7f7f8;
			}

			.prices {
				display: flex;
				align-items: baseline;
				margin-top: 6rpx;
				font-size: 28rpx;

				.pay-price {
					margin-right: 10rpx;
					color: #cf4444;
				}

				.price {
					font-size: 24rpx;
					color: #999;
					text-decoration: line-through;
				}
			}

			.count {
				position: absolute;
				bottom: 0;
				right: 0;
				font-size: 26rpx;
				color: #cf4444;
			}
		}
	}
</style>
