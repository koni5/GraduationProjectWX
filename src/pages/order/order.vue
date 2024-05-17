<script setup>
	import { computed, ref, defineProps } from "vue";
	import { onShow } from "@dcloudio/uni-app";
	import { submitOrderAPI, goPayAPI } from "../../services/order";
	import { useCouponStore } from "@/stores";
	import { useMemberStore } from "@/stores";
	import { useShopStore } from "@/stores";
	import { useOrderListStore } from "@/stores";
	import { getCouponCountAPI } from "../../services/coupon";
	// 获取屏幕边界到安全区域距离
	const { safeAreaInsets } = uni.getSystemInfoSync();
	//订单菜品信息仓库
	let orderList = useOrderListStore();
	//店铺信息仓库
	let shopStore = useShopStore();
	//会员信息仓库
	let memberStore = useMemberStore();
	//优惠券仓库
	let couponStore = useCouponStore();
	const props = defineProps(["cartList", "orderSum", "closeOrder"]);
	// 订单备注
	const buyerMessage = ref("");
	//商品实付(包括会员折扣+优惠券)
	let realPay = computed(() => {
		if (
			memberStore.profile.discount !== null &&
			couponStore.info === undefined
		) {
			return (props.orderSum * memberStore.profile.discount).toFixed(2);
		} else if (
			memberStore.profile.discount === null &&
			couponStore.info !== undefined
		) {
			return props.orderSum - couponStore.info.discount;
		} else if (
			memberStore.profile.discount !== null &&
			couponStore.info !== undefined
		) {
			return (
				props.orderSum * memberStore.profile.discount -
				couponStore.info.discount
			).toFixed(2);
		} else {
			return props.orderSum;
		}
	});
	//关闭订单
	const close = () => {
		props.closeOrder();
	};
	//提交订单
	//保存回返的订单数据
	let orderData = ref();
	const confirm = async () => {
		orderList.setData(props.cartList);
		let orderInfo = {
			shouldPay: props.orderSum,
			amount: realPay.value,
			// 1表示微信支付,2表示现金支付
			payMethod: 1,
			remark: buyerMessage.value,
			couponId: couponStore.info === undefined ? null : couponStore.info.id,
			shopId: shopStore.info.id,
		};
		// console.log(orderInfo)
		let res = await submitOrderAPI(orderInfo);
		orderData.value = res.data;
		console.log(orderData.value);
		uni.showModal({
			title: "微信模拟支付", // 标题
			cancelText: "支付失败", // 取消按钮的文字
			confirmText: "支付成功", // 确认按钮的文字
			success: async (res) => {
				if (res.confirm) {
					console.log("支付成功");
					await goPayAPI(orderData.value.id);
					uni.navigateTo({
						url: `/pages/orderDetail/orderDetail?orderId=${orderData.value.id}`,
					});
				} else if (res.cancel) {
					console.log("支付失败");
					uni.navigateTo({
						url: `/pages/orderDetail/orderDetail?orderId=${orderData.value.id}`,
					});
					props.closeOrder();
				}
			},
		});
	};
	//存储优惠券总数的变量
	let couponCount = ref();
	//获取优惠券总数
	const getCouponCount = async () => {
		let res = await getCouponCountAPI();
		couponCount.value = res.data;
	};
	onShow(() => {
		getCouponCount();
	});
</script>

<template>
	<view class="close" @click="close"
		><image
			@click="closeNorm"
			class="close_img"
			src="../../../static/images/closebtn/closebtn.png"
			mode=""
		></image
	></view>
	<scroll-view scroll-y class="page">
		<scroll-view scroll-y style="z-index: 103">
			<!-- 餐厅信息 -->
			<view class="shop">
				<p class="info">川菜馆餐厅</p>
				<p class="address">渝鲁大道19号店</p>
			</view>

			<!-- 商品信息 -->
			<view class="goods">
				<h2 style="font-weight: bold; padding-bottom: 20rpx">餐品详情</h2>
				<view
					v-for="item in cartList"
					:key="item.id"
					class="item"
					hover-class="none"
				>
					<image class="picture" :src="item.image" />
					<view class="meta">
						<view class="name ellipsis"> {{ item.name }}</view>
						<view class="attrs">{{ item.dishFlavor }}</view>
						<view class="prices">
							<view class="pay-price symbol">{{ item.amount }}</view>
						</view>
						<view class="count">x{{ item.number }}</view>
					</view>
				</view>
			</view>
			<!-- 会员折扣 -->
			<view class="related">
				<view class="item">
					<text style="font-weight: bold; color: #db0107" class="text"
						>会员折扣</text
					>
					<text v-if="memberStore.profile.discount === null">无折扣</text>
					<text else>{{ memberStore.profile.discount * 10 }}折</text>
				</view>
			</view>
			<!-- 优惠券 -->
			<view class="related">
				<navigator
					:url="`/pages/order/chooseCoupon/chooseCoupon?orderSum=${orderSum}`"
				>
					<view class="item">
						<view>
							<text class="text" style="font-weight: bold; color: #db0107"
								>优惠券</text
							>
						</view>
						<text v-if="couponStore.info === undefined"
							>x{{ couponCount }}</text
						>
						<text v-else style="color: #db0107"
							>-{{ couponStore.info.discount }}￥</text
						>
					</view>
				</navigator>
			</view>
			<!-- 备注 -->
			<view class="related">
				<view class="item">
					<text class="text">订单备注</text>
					<input
						class="input"
						:cursor-spacing="30"
						placeholder="建议留言前先与商家沟通确认"
						v-model="buyerMessage"
					/>
				</view>
			</view>
			<!-- 支付金额 -->
			<view class="settlement" style="margin-bottom: 130rpx">
				<view class="item">
					<text class="text">商品应付: </text>
					<text class="number symbol">{{ orderSum }}</text>
					<text class="text" style="font-weight: bold">商品实付:</text>
					<text class="number symbol">{{ realPay }}</text>
				</view>
			</view>
			<!-- 确认支付 -->
			<view
				class="toolbar"
				:style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }"
			>
				<view class="button" @click.stop="confirm"> 确认支付 </view>
			</view>
		</scroll-view>
	</scroll-view>
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
	.close {
		position: relative;
		margin-left: 64%;
		transform: translateX(-50%);
		.close_img {
			width: 65rpx;
			height: 65rpx;
		}
	}
	.page {
		padding-top: 20rpx;
		height: 86vh;
		background-color: #ededed;
		border-radius: 12rpx 12rpx 0 0;
	}

	.symbol::before {
		content: "¥";
		font-size: 80%;
		margin-right: 5rpx;
	}
	.shop {
		margin: 0 0 20rpx 20rpx;
		padding: 0 20rpx;
		border-radius: 10rpx;
		background-color: #fff;
		.info {
			font-weight: bold;
			margin-bottom: 10rpx;
		}
		.address {
			font-size: 27rpx;
			padding-bottom: 10rpx;
			color: #474747;
		}
	}

	.goods {
		margin: 20rpx;
		padding: 0 20rpx;
		border-radius: 10rpx;
		background-color: #fff;

		.item {
			display: flex;
			padding: 30rpx 0;
			border-top: 1rpx solid #eee;

			&:first-child {
				border-top: none;
			}

			.picture {
				width: 130rpx;
				height: 130rpx;
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
				margin-bottom: 10rpx;
				font-size: 26rpx;
				color: #444;
			}

			.attrs {
				line-height: 1;
				padding: 0 15rpx;
				font-size: 24rpx;
				align-self: flex-start;
				border-radius: 4rpx;
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
				color: #444;
			}
		}
	}

	.related {
		margin: 20rpx;
		padding: 0 20rpx;
		border-radius: 20rpx;
		background-color: #fff;

		.item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			min-height: 80rpx;
			font-size: 26rpx;
			color: #333;
		}

		.input {
			flex: 1;
			text-align: right;
			margin: 20rpx 0;
			padding-right: 20rpx;
			font-size: 26rpx;
			color: #999;
		}

		.item .text {
			width: 125rpx;
		}
	}

	/* 结算清单 */
	.settlement {
		margin: 20rpx;
		padding: 0 8rpx;
		border-radius: 10rpx;
		background-color: #fff;

		.item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 80rpx;
			font-size: 26rpx;
			color: #333;
		}

		.danger {
			color: #cf4444;
		}
	}

	.button {
		padding-bottom: 5rpx;
		width: 220rpx;
		text-align: center;
		line-height: 72rpx;
		font-size: 26rpx;
		color: #fff;
		border-radius: 33rpx;
		background-color: #fec860;
	}
</style>
