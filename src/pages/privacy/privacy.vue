<script setup>
	import { useMemberStore } from "@/stores";
	import { getCouponListAPI } from "../../services/coupon";
	import { ref } from "vue";
	import { onShow } from "@dcloudio/uni-app";
	// 获取屏幕边界到安全区域距离
	const { safeAreaInsets } = uni.getSystemInfoSync();
	import Coupon from "./coupon/coupon.vue";
	//获取用户信息
	const memberStore = useMemberStore();
	//保存优惠券的变量
	let couponList = ref([]);
	//获取用户优惠券
	const getCouponList = async () => {
		let res = await getCouponListAPI();
		// console.log(res.data);
		couponList.value = res.data;
	};
	onShow(() => {
		getCouponList();
	});
</script>

<template>
	<scroll-view class="viewport" scroll-y enable-back-to-top :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
		<!-- 个人资料 -->
		<view class="profile" :style="{ paddingTop: safeAreaInsets.top + 'px' }">
			<!-- 情况1：已登录 -->
			<view class="overview" v-if="memberStore.profile">
				<navigator url="/pagesMember/profile/profile" hover-class="none">
					<image
						class="avatar"
						mode="aspectFill"
						src="../../static/images/profileImg/default.png"
					></image>
				</navigator>
				<view class="meta">
					<view class="nickname"> 微信用户 </view>
					<navigator
						class="extra"
						url="/pagesMember/profile/profile"
						hover-class="none"
					>
						<text class="update">更新头像昵称</text>
					</navigator>
				</view>
			</view>
			<!-- 情况2：未登录 -->
			<view class="overview" v-else>
				<navigator url="/pages/login/login" hover-class="none">
					<image
						class="avatar gray"
						mode="aspectFill"
						src="http://yjy-xiaotuxian-dev.oss-cn-beijing.aliyuncs.com/picture/2021-04-06/db628d42-88a7-46e7-abb8-659448c33081.png"
					></image>
				</navigator>
				<view class="meta">
					<navigator
						url="/pages/login/login"
						hover-class="none"
						class="nickname"
					>
						未登录
					</navigator>
					<view class="extra">
						<text class="tips">点击登录账号</text>
					</view>
				</view>
			</view>
			<navigator
				class="settings"
				url="/pages/privacy/settings/settings"
				hover-class="none"
			>
				设置
			</navigator>
		</view>
		<!-- 我的订单 -->
		<view class="orders">
			<view class="title">
				我的订单
				<navigator
					class="navigator"
					url="/pages/orderList/orderList"
					hover-class="none"
				>
					查看最近订单<text class="icon-right"></text>
				</navigator>
			</view>
		</view>
		<Coupon :couponList="couponList"></Coupon>
	</scroll-view>
</template>

<style lang="scss" scoped>

	.viewport {
		background-color: #eeeeee;
		height: 100vh;
		background-repeat: no-repeat;
		background-image: url(https://sky-cty-itcast.oss-cn-chengdu.aliyuncs.com/privacy-background.jpg);
		background-size: 100% auto;
	}

	/* 用户信息 */
	.profile {
		margin-top: 20rpx;
		position: relative;

		.overview {
			display: flex;
			height: 120rpx;
			padding: 0 36rpx;
			color: #fff;
		}

		.avatar {
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
			background-color: #eee;
		}

		.gray {
			filter: grayscale(100%);
		}

		.meta {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: flex-start;
			line-height: 30rpx;
			padding: 16rpx 0;
			margin-left: 20rpx;
		}

		.nickname {
			max-width: 350rpx;
			margin-bottom: 16rpx;
			font-size: 30rpx;

			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.extra {
			display: flex;
			font-size: 20rpx;
		}

		.tips {
			font-size: 22rpx;
		}

		.update {
			padding: 3rpx 10rpx 1rpx;
			color: rgba(255, 255, 255, 0.8);
			border: 1rpx solid rgba(255, 255, 255, 0.8);
			margin-right: 10rpx;
			border-radius: 30rpx;
		}

		.settings {
			position: absolute;
			bottom: 0;
			right: 40rpx;
			font-size: 30rpx;
			color: #fff;
		}
	}

	/* 我的订单 */
	.orders {
		height: 6vh;
		position: relative;
		z-index: 99;
		padding: 30rpx;
		margin: 40rpx 10rpx 0;
		background-color: #fff;
		border-radius: 10rpx;
		box-shadow: 0 4rpx 6rpx #f6f6f6;

		.title {
			height: 40rpx;
			line-height: 40rpx;
			font-size: 35rpx;
			color: #1e1e1e;

			.navigator {
				font-size: 24rpx;
				color: #939393;
				float: right;
			}
		}

		.section {
			width: 100%;
			display: flex;
			justify-content: space-between;
			padding: 40rpx 20rpx 10rpx;
			.navigator,
			.contact {
				text-align: center;
				font-size: 24rpx;
				color: #333;
				&::before {
					display: block;
					font-size: 60rpx;
					color: #ff9545;
				}
			}
			.contact {
				padding: 0;
				margin: 0;
				border: 0;
				background-color: transparent;
				line-height: inherit;
			}
		}
	}
</style>
