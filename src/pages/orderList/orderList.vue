<script setup>
	import { onLoad } from "@dcloudio/uni-app";
	import { computed, ref } from "vue";
	import { useShopStore } from "@/stores";
	import { getOrderListAPI, cancelOrderAPI } from "../../services/order";
	//店铺的仓库信息
	const shopStore = useShopStore();
	//获取第几页
	let pageNum = 1;
	//页面大小
	let pageSize = 5;
	//保存订单列表信息
	let orders = ref();
	//获取订单列表信息
	const getOrders = async () => {
		let res = await getOrderListAPI(pageNum, pageSize);
		// console.log(res.data)
		orders.value = res.data;
		// console.log(orders.value);
	};
	//超时取消订单
	const onTimeup = async (orderId) => {
		let params = {
			id: orderId,
			cancelReason: "超时自动取消",
		};
		await cancelOrderAPI(params);
		getOrders();
	};
	//加载数据已结束标记
	let finish = ref(false);
	//触底加载更多数据
	const addMore = async () => {
		if (pageNum < orders.value.pages) {
			pageNum += 1;
		} else {
			finish.value = true;
			return;
		}
		let res = await getOrderListAPI(pageNum, pageSize);
		orders.value.records.push(...res.data.records);
		// console.log("加载数据");
	};
	onLoad(() => {
		getOrders();
	});
</script>

<template>
	<!-- 注意触底事件必须加在整个大页面标签中,且标签必须是scroll-view类型 -->
	<scroll-view class="page" scroll-y @scrolltolower="addMore">
		<!-- 商品信息 -->
		<scroll-view class="goods">
			<navigator
				v-for="order in orders?.records"
				:key="order.id"
				:url="`/pages/orderDetail/orderDetail?orderId=${order.id}`"
				class="item"
				hover-class="none"
			>
				<!-- 倒计时组件 -->
				<uni-countdown
					v-if="order.status === 1"
					background-color="#e9ccab"
					:second="order.countDown"
					:font-size="13"
					:show-day="false"
					:show-colon="false"
					:showHour="false"
					@timeup="onTimeup(order.id)"
				/>
				<view class="address"
					>{{ order.shopName }}({{ order.shopAddress }})</view
				>
				<text v-if="order.status === 1" class="status">待支付 〉</text>
				<text v-else-if="order.status === 2" class="status">待接单 〉</text>
				<text v-else-if="order.status === 3" class="status">制作中 〉</text>
				<text v-else-if="order.status === 4" class="status">已完成 〉</text>
				<text v-else class="status">已取消 〉</text>
				<view class="date">{{ order.orderTime }}</view>
				<image
					v-for="orderDetail in order.orderDetailList"
					:key="orderDetail.id"
					class="picture"
					:src="orderDetail.image"
				/>
				<image
					v-if="order.detailCount > 3"
					class="picture omit"
					src="../../static/images/omit/omit.png"
					mode="scaleToFill"
				/>
				<text class="number">共{{ order.dishesNumber }}件</text>
				<text class="price">￥{{ order.amount }}</text>
				<button v-if="order.status === 1" class="cancel">取消订单</button>
				<button v-if="order.status === 1" class="goPay">立即支付</button
				><button v-else class="oneMore">
					再来一单
				</button></navigator
			></scroll-view
		>
		<view class="loading-text">
			{{ finish ? "没有更多数据~" : "正在加载..." }}
		</view>
	</scroll-view>
</template>
<style lang="scss" scoped>
	.page {
		height: 100vh;
		background-color: #f4f5f6;
		.loading-text {
			text-align: center;
			font-size: 28rpx;
			color: #666;
			padding: 20rpx 0;
		}

		.goods {
			margin: 20rpx;
			background-color: #fefefe;

			.item {
				padding: 5rpx 0;
				border-top: 10px solid #f4f5f6;
				&:first-child {
					border-top: none;
				}
				.number {
					margin-right: 30rpx;
					color: #d2d2d2;
					font-size: 28rpx;
					float: right;
					margin-top: 33rpx;
				}
				.oneMore{
					margin-left: 525rpx;
					width: 190rpx;
					text-align: center;
					line-height: 65rpx;
					font-size: 28rpx;
					color: #fefe;
					background-color: #0c0c0c
				}
				.goPay {
					margin-top: 40rpx;
					width: 190rpx;
					text-align: center;
					line-height: 65rpx;
					font-size: 26rpx;
					color: #fefefe;
					background-color: #0c0c0c;
				}
				.cancel {
					float: left;
					margin-left: 120px;
					margin-top: 40rpx;
					border: 0.1px solid #c9c8c6;
					width: 190rpx;
					text-align: center;
					line-height: 65rpx;
					font-size: 26rpx;
					color: #0c0c0c;
					background-color: #fefefe;
				}
				.price {
					font-size: 35rpx;
					padding-top: 30rpx;
					margin-right: 20rpx;
					float: right;
				}
				.status {
					margin-right: 10rpx;
					padding-top: 15rpx;
					float: right;
					color: #696969;
					font-size: 30rpx;
				}
				.countDown {
					margin-right: 13rpx;
					margin-left: 390rpx;
					font-size: 30rpx;
					color: #e9ccab;
				}
				.address {
					display: inline;
					color: #161616;
					font-size: 30rpx;
					font-weight: 550;
				}
				.date {
					font-size: 20rpx;
					color: #9b9b9b;
				}

				.omit {
					opacity: 0.2;
				}
				.picture {
					margin-top: 20rpx;
					width: 100rpx;
					height: 100rpx;
					border-radius: 10rpx;
					margin-right: 20rpx;
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
</style>
