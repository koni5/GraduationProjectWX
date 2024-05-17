<script setup>
	import { ref, defineProps, onMounted, onUnmounted } from "vue";
	import { getOrderDetailAPI } from "../../services/orderDetail";
	import { getDiscountAPI } from "../../services/coupon";
	import { useMemberStore } from "@/stores";
	import { cancelOrderAPI, goPayAPI } from "../../services/order";
	import { onLoad } from "@dcloudio/uni-app";
	//用户信息仓库
	const memberStore = useMemberStore();
	//用户折扣价
	let discount =
		memberStore.profile.discount === ""
			? ""
			: memberStore.profile.discount * 10;
	// 获取屏幕边界到安全区域距离
	const { safeAreaInsets } = uni.getSystemInfoSync();
	// 获取页面参数
	const props = defineProps(["orderId"]);
	// 取消订单原因弹出层组件
	const popup = ref();
	// 取消原因列表
	const reasonList = ref([
		"不想要了",
		"商品信息选错了",
		"忘记添加红包了",
		"其它",
	]);
	// 订单取消原因
	const reason = ref("");
	// 复制内容
	const onCopy = (orderNumber) => {
		// 设置系统剪贴板的内容
		uni.setClipboardData({ data: orderNumber });
	};
	//存放订单及其详情
	let order = ref();
	//获取订单详情信息
	const getOrderDetail = async () => {
		let res = await getOrderDetailAPI(props.orderId);
		// console.log(res.data);
		order.value = res.data;
	};
	//超时取消订单
	const onTimeup = async (orderId) => {
		let params = {
			id: orderId,
			cancelReason: "超时自动取消",
		};
		await cancelOrderAPI(params);
		getOrderDetail();
	};
	//手动取消订单
	const cancelOrder = async () => {
		let params = {
			id: order.value.id,
			cancelReason: reason.value,
		};
		await cancelOrderAPI(params);
		popup.value.close();
		getOrderDetail();
	};
	//存放优惠券折扣值
	let couponDiscount = ref(0);
	//去支付
	const goPay = async () => {
		uni.showModal({
			title: "微信模拟支付",
			cancelText: "支付取消",
			confirmText: "支付成功",
			success: async (res) => {
				if (res.confirm) {
					await goPayAPI(order.value.id);
					getOrderDetail();
					console.log("支付成功");
				} else if (res.cancel) {
					console.log("支付取消");
				}
			},
		});
	};
	//webSocket配置
	const isConnected = ref(false);
	const receivedMessage = ref("");
	let websocket;
	// 创建WebSocket连接
	const connectWebSocket = () => {
		const wsUrl = `ws://localhost:8080/ws/${props.orderId}`; // 这里填写实际的WebSocket URL
		websocket = uni.connectSocket({
			url: wsUrl,
			success: () => {
				console.log("WebSocket连接成功");
			},
			fail: (err) => {
				console.error("WebSocket连接失败", err);
			},
		});

		websocket.onOpen(() => {
			console.log("WebSocket 已打开");
			isConnected.value = true;
		});

		websocket.onMessage((message) => {
			console.log("收到消息：", message.data);
			receivedMessage.value = message.data;
			getOrderDetail();
		});

		websocket.onClose(() => {
			console.log("WebSocket 已关闭");
			isConnected.value = false;
		});

		websocket.onError((err) => {
			console.error("WebSocket 发生错误", err);
		});
	};
	//页面挂载时webSocket进行连接
	onMounted(() => {
		connectWebSocket();
	});
	//页面销毁时关闭连接
	onUnmounted(() => {
		if (websocket && isConnected.value) {
			websocket.close({
				code: 1000,
				reason: "页面关闭",
			});
		}
	});
	onLoad(async () => {
		await getOrderDetail();
		if (order.value.couponId !== null) {
			let res = await getDiscountAPI(order.value.couponId);
			couponDiscount.value = res.data;
		}
	});
</script>

<template>
	<view class="page">
		<scroll-view scroll-y class="viewport">
			<!-- 订单状态 -->
			<view
				class="overview"
				:style="{ paddingTop: safeAreaInsets.top + 20 + 'px' }"
			>
				<view>
					<view v-if="order.status === 1" class="status icon-clock"
						>待付款</view
					>
					<view v-else-if="order.status === 2" class="status icon-clock"
						>待接单...</view
					>
					<view v-else-if="order.status === 3" class="status icon-clock"
						>制作中...</view
					>
					<view v-else-if="order.status === 4" class="status icon-clock"
						>已完成</view
					>
					<view v-else="order.status" class="status icon-clock">已取消</view>
					<view
						v-if="
							order.status !== 1 &&
							order.status !== 2 &&
							order.status !== 5 &&
							order.status !== 6
						"
						>取餐码 {{ order.pickupCode }}</view
					>
				</view>
				<view v-if="order.status === 1" class="tips">
					<text class="money">需付金额: ¥ {{ order.amount }}</text>
					<text class="time">支付剩余</text>
					<!-- 倒计时组件 -->
					<uni-countdown
						:second="order.countDown"
						:font-size="13"
						:show-day="false"
						:show-colon="false"
						:showHour="false"
						@timeup="onTimeup(order.id)"
					/>
				</view>
				<view v-if="order.status === 1" style="display: flex">
					<view class="button" @click="popup.open()">取消</view>
					<view class="button" @click="goPay">去支付</view>
				</view>
				<view v-if="order.status === 4" class="button">再来一单</view>
			</view>
			<!-- 商品信息 -->
			<scroll-view class="goods">
				<view class="item">
					<navigator
						class="navigator"
						v-for="item in order.orderDetailList"
						:key="item.id"
						hover-class="none"
					>
						<image class="cover" :src="item.image"></image>
						<view class="meta">
							<view class="name ellipsis">{{ item.name }}</view>
							<view class="type">{{ item.dishFlavor }}</view>
							<view class="price">
								<view class="actual">
									<text class="symbol">¥</text>
									<text>{{ item.amount }}</text>
								</view>
							</view>
							<view class="quantity">x{{ item.number }}</view>
						</view>
					</navigator>
				</view>
				<!-- 合计 -->
				<view class="total">
					<view class="row">
						<view class="text">应付金额: </view>
						<view class="symbol">￥{{ order.shouldPay }}</view>
					</view>
					<view class="row" v-if="discount">
						<view class="text">会员折扣</view>
						<view class="symbol"
							>{{ discount === "" ? "非会员无折扣" : discount }}折</view
						>
					</view>
					<view class="row" v-if="true">
						<view class="text">优惠券</view>
						<view class="symbol">{{
							couponDiscount === 0 ? "未使用" : "-" + couponDiscount + "￥"
						}}</view>
					</view>
					<view class="row">
						<view class="text">实付金额: </view>
						<view class="symbol primary">￥{{ order.amount }}</view>
					</view>
				</view>
			</scroll-view>
			<!-- 订单信息 -->
			<view class="detail">
				<view class="title">订单信息</view>
				<view class="row">
					<view class="item">下单时间: {{ order.orderTime }}</view>
					<view class="item">
						订单编号:{{ order.number }}
						<text class="copy" @tap="onCopy(order.number)">复制</text>
					</view>
					<view class="item" v-if="order.status === 5"
						>取消原因:{{ order.cancelReason }}</view
					>
					<view class="item">备注信息:{{ order.remark }}</view>
				</view>
			</view>
		</scroll-view>
	</view>
	<!-- 取消订单的原因弹窗 -->
	<uni-popup ref="popup" type="bottom" background-color="#fff">
		<view class="popup-root">
			<view class="title">订单取消</view>
			<view class="description">
				<view class="tips">请选择取消订单的原因：</view>
				<view
					class="cell"
					v-for="item in reasonList"
					:key="item"
					@tap="reason = item"
				>
					<text class="text">{{ item }}</text>
					<radio :checked="item === reason" />
				</view>
			</view>
			<view class="footer">
				<view class="button" @tap="popup?.close?.()">取消</view>
				<view class="button primary" @tap="cancelOrder">确认</view>
			</view>
		</view>
	</uni-popup>
</template>

<style lang="scss" scoped>
	.page {
		display: flex;
		flex-direction: column;
		height: 140vh;
		overflow: hidden;
	}

	.viewport {
		background-color: #f6f6f6;
	}

	.overview {
		margin-left: 20rpx;
		margin-right: 20rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		line-height: 1;
		color: #0c0c0c;
		background-color: white;

		.status {
			margin-bottom: 20rpx;
			margin-top: -70rpx;
			font-size: 55rpx;
			font-weight: bold;
		}

		.status::before {
			margin-right: 6rpx;
			font-weight: 500;
		}

		.tips {
			margin: 30rpx 0;
			display: flex;
			font-size: 14px;
			.time {
				margin-top: 8rpx;
				font-size: 30rpx;
				color: #c2c2c2;
			}
			.money {
				color: #c2c2c2;
				margin-top: 9rpx;
				margin-right: 30rpx;
				font-size: 30rpx;
			}
		}

		.button-group {
			margin-top: 30rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.button {
			width: 260rpx;
			height: 64rpx;
			margin: 10rpx 20rpx;
			text-align: center;
			line-height: 64rpx;
			font-size: 28rpx;
			color: #e7c6a2;
			border: 1px solid #e7c6a2;
			border-radius: 68rpx;
			border-color: #e7c6a2;
			background-color: #fefefe;
		}
	}

	.goods {
		border-radius: 10rpx;
		background-color: #fff;
		.item {
			padding: 20rpx 20rpx;
			border-bottom: 1rpx solid #eee;

			.navigator {
				display: flex;
				margin: 20rpx 0;
			}

			.cover {
				width: 130rpx;
				height: 130rpx;
				border-radius: 10rpx;
				margin-right: 20rpx;
			}

			.meta {
				margin-left: 20rpx;
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				position: relative;
			}

			.name {
				height: 80rpx;
				font-size: 26rpx;
				color: #444;
			}

			.type {
				line-height: 1.8;
				padding: 0 15rpx;
				margin-top: 6rpx;
				font-size: 24rpx;
				align-self: flex-start;
				border-radius: 4rpx;
				color: #888;
				background-color: #f7f7f8;
			}

			.price {
				display: flex;
				margin-top: 6rpx;
				font-size: 24rpx;
			}

			.symbol {
				font-size: 20rpx;
			}

			.original {
				color: #999;
				text-decoration: line-through;
			}

			.actual {
				margin-left: 10rpx;
				color: #444;
			}

			.text {
				font-size: 22rpx;
			}

			.quantity {
				position: absolute;
				bottom: 0;
				right: 0;
				font-size: 24rpx;
				color: #444;
			}

			.action {
				display: flex;
				flex-direction: row-reverse;
				justify-content: flex-start;
				padding: 30rpx 0 0;

				.button {
					width: 200rpx;
					height: 60rpx;
					text-align: center;
					justify-content: center;
					line-height: 60rpx;
					margin-left: 20rpx;
					border-radius: 60rpx;
					border: 1rpx solid #ccc;
					font-size: 26rpx;
					color: #444;
				}

				.primary {
					color: #27ba9b;
					border-color: #27ba9b;
				}
			}
		}

		.total {
			border-radius: 12rpx;
			margin: 0 8rpx;
			line-height: 1;
			font-size: 26rpx;
			padding: 20rpx 0;
			color: #666;

			.row {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 10rpx 0;
			}

			.symbol::before {
				font-size: 80%;
				margin-right: 3rpx;
			}

			.primary {
				color: #cf4444;
				font-size: 36rpx;
			}
		}
	}

	.detail {
		line-height: 1;
		padding: 30rpx 20rpx 0;
		margin: 20rpx 8rpx 0;
		font-size: 26rpx;
		color: #666;
		border-radius: 10rpx;
		background-color: #fff;

		.title {
			font-size: 40rpx;
			font-weight: 600;
			color: #444;
		}

		.row {
			padding: 20rpx 0;

			.item {
				padding: 10rpx 0;
				display: flex;
				align-items: center;
			}
			.copy {
				border-radius: 20rpx;
				font-size: 20rpx;
				border: 1px solid #ccc;
				padding: 5rpx 10rpx;
				margin-left: 10rpx;
			}
		}
	}

	.toolbar-height {
		height: 100rpx;
		box-sizing: content-box;
	}

	.toolbar {
		position: fixed;
		left: 0;
		right: 0;
		bottom: calc(var(--window-bottom));
		z-index: 1;

		height: 100rpx;
		padding: 0 20rpx;
		display: flex;
		align-items: center;
		flex-direction: row-reverse;
		border-top: 1rpx solid #ededed;
		border-bottom: 1rpx solid #ededed;
		background-color: #fff;
		box-sizing: content-box;

		.button {
			display: flex;
			justify-content: center;
			align-items: center;

			width: 200rpx;
			height: 72rpx;
			margin-left: 15rpx;
			font-size: 26rpx;
			border-radius: 72rpx;
			border: 1rpx solid #ccc;
			color: #444;
		}

		.delete {
			order: 4;
		}

		.button {
			order: 3;
		}

		.secondary {
			order: 2;
			color: #27ba9b;
			border-color: #27ba9b;
		}

		.primary {
			order: 1;
			color: #fff;
			background-color: #27ba9b;
		}
	}

	.popup-root {
		padding: 30rpx 30rpx 0;
		border-radius: 10rpx 10rpx 0 0;
		overflow: hidden;

		.title {
			font-size: 30rpx;
			text-align: center;
			margin-bottom: 30rpx;
		}

		.description {
			font-size: 28rpx;
			padding: 0 20rpx;

			.tips {
				color: #444;
				margin-bottom: 12rpx;
			}

			.cell {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 15rpx 0;
				color: #666;
			}

			.icon::before {
				content: "\e6cd";
				font-family: "erabbit" !important;
				font-size: 38rpx;
				color: #999;
			}

			.icon.checked::before {
				content: "\e6cc";
				font-size: 38rpx;
				color: #27ba9b;
			}
		}

		.footer {
			display: flex;
			justify-content: space-between;
			padding: 30rpx 0 40rpx;
			font-size: 28rpx;
			color: #444;

			.button {
				flex: 1;
				height: 72rpx;
				text-align: center;
				line-height: 72rpx;
				margin: 0 20rpx;
				color: #444;
				border-radius: 72rpx;
				border: 1rpx solid #ccc;
			}

			.primary {
				color: #fff;
				background-color: #27ba9b;
				border: none;
			}
		}
	}
</style>
