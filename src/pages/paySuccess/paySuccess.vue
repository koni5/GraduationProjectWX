<script setup>
	import { defineProps, ref, onMounted, onUnmounted } from "vue";
	import { useOrderListStore } from "@/stores";
	import { onLoad } from "@dcloudio/uni-app";
	import { getOrderStatusAPI } from "../../services/order";
	// 获取屏幕边界到安全区域距离
	const { safeAreaInsets } = uni.getSystemInfoSync();
	//获取订单菜品列表仓库信息
	let orderList = useOrderListStore();
	//上一个页面传递的订单数据
	const props = defineProps(["orderId", "orderNumber"]);
	//获取订单状态
	let orderStatus = ref();
	const getStatus = async () => {
		let res = await getOrderStatusAPI(props.orderId);
		// console.log(res);
		orderStatus.value = res.data;
	};
	onLoad(() => {
		getStatus();
	});
	// 定时器的引用
	let intervalId = null;
	// 在组件挂载后启动定时器
	onMounted(() => {
		intervalId = setInterval(getStatus, 10000); // 10 秒
	});
	// 在组件卸载后清除定时器
	onUnmounted(() => {
		if (intervalId) {
			clearInterval(intervalId); // 清除定时器
		}
	});
</script>

<template>
	<navigator class="navbar" url="/pages/menu/menu" open-type="switchTab">
		<image
			class="img"
			src="../../static/images/home/home.png"
			mode="scaleToFill"
		/>
	</navigator>
	<view class="overview" :style="{ paddingTop: safeAreaInsets.top + 'px' }">
		<view class="number">订单编号:{{ orderNumber }}</view>
		<view v-if="orderStatus.status === 2">待接单</view>
		<view v-else-if="orderStatus.status === 3">制作中...</view>
		<view v-else="orderStatus.status === 4">已完成</view>
		<view v-if="orderStatus.status > 2"
			>取餐码{{ orderStatus.pickupCode }}</view
		>
	</view>
	<!-- 商品信息 -->
	<view class="goods">
		<navigator
			v-for="item in orderList.data"
			:key="item.id"
			class="item"
			hover-class="none"
		>
			<image class="picture" :src="item.image" />
			<view class="meta">
				<view class="name ellipsis">{{ item.name }} </view>
				<view class="flavor">{{ item.dishFlavor }}</view>
				<view class="prices">
					<view class="pay-price symbol">￥{{ item.amount }}</view>
				</view>
				<view class="count">x{{ item.number }}</view>
			</view>
		</navigator>
	</view>
</template>
<style lang="scss" scoped>
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
				height: 80rpx;
				font-size: 26rpx;
				color: #444;
			}

			.flavor {
				line-height: 1.8;
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
					font-size: 25rpx;
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

	.navbar {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9;
		/* background-color: #f8f8f8; */
		background-color: transparent;
		.img {
			margin-top: 33rpx;
			margin-left: 10rpx;
			width: 60rpx;
			height: 60rpx;
		}
	}

	.overview {
		display: flex;
		flex-direction: column;
		align-items: center;
		line-height: 3;
		padding-bottom: 30rpx;
		color: #fff;
		background-image: url("https://sky-cty-itcast.oss-cn-chengdu.aliyuncs.com/%E6%A9%98%E8%89%B2%E8%83%8C%E6%99%AF%E7%9A%84%E7%BA%B8%E6%9D%AF%E8%9B%8B%E7%B3%95.jpg");
		background-size: cover;
		.number {
			margin-top: 20rpx;
		}
		.status {
			margin-top: 20rpx;
			font-size: 36rpx;
		}

		.status::before {
			margin-right: 6rpx;
			font-weight: 500;
		}

		.tips {
			margin: 30rpx 0;
			display: flex;
			font-size: 14px;
			align-items: center;

			.money {
				margin-right: 30rpx;
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
			margin: 0 10rpx;
			text-align: center;
			line-height: 64rpx;
			font-size: 28rpx;
			color: #db7d01;
			border-radius: 68rpx;
			background-color: #fff;
		}
	}

	.goods {
		margin: 20rpx 20rpx 0;
		padding: 0 20rpx;
		border-radius: 10rpx;
		background-color: #fff;

		.item {
			padding: 30rpx 0;
			border-bottom: 1rpx solid #eee;

			.meta {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				position: relative;
			}

			.name {
				height: 60rpx;
				font-size: 26rpx;
				color: #444;
			}

			.symbol {
				font-size: 20rpx;
			}
		}
	}

	.detail {
		line-height: 1;
		padding: 30rpx 20rpx 0;
		margin: 20rpx 20rpx 0;
		font-size: 26rpx;
		color: #666;
		border-radius: 10rpx;
		background-color: #fff;

		.title {
			font-size: 30rpx;
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
			background-color: #e18400;
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
				background-color: #e18400;
				border: none;
			}
		}
	}
</style>
