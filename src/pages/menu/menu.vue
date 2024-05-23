<script setup>
	import PopMask from "./popMask/popMask.vue";
	import LocationPop from "./popLocation/popLocation.vue";
	import PopCart from "./popCart/popCart.vue";
	import Order from "../order/order.vue";
	import { ref, computed } from "vue";
	import { getCategoryAPI } from "../../services/category";
	import { getDishAPI } from "../../services/dish";
	import { onLoad, onShow } from "@dcloudio/uni-app";
	import { getShopAPI } from "../../services/shop";
	import { getCartListAPI } from "../../services/shopCart";
	import { useShopStore } from "@/stores";
	import { useCouponStore } from "@/stores";
	const { safeAreaInsets } = uni.getSystemInfoSync();
	//优惠券仓库(用仓库的目的是:回到此页面清除优惠券)
	const couponStore = useCouponStore();
	//存放分类
	let categoryList = ref();
	//获取菜品分类列表
	const getCategoryList = async () => {
		let res = await getCategoryAPI();
		categoryList.value = res.data;
		categoryList.value.forEach((val1) => {
			val1.flavors.forEach((val2) => {
				val2.value = val2.value.split(",");
			});
		});
		console.log(categoryList.value);
	};
	//存放菜品
	let dishList = ref();
	//获取菜品列表
	const getDishList = async (val) => {
		let res = await getDishAPI(val);
		dishList.value = res.data;
		console.log(res);
	};
	//定位分类高亮
	let singal = ref(0);
	//高亮定位当前选中的分类
	const onChangeIndex = (val1, val2) => {
		singal.value = val1;
		getDishList(val2);
		// console.log(val1)
	};
	//选择口味规格
	//存放分类中的口味list
	let flavors = ref();
	let dish = ref();
	let normPop = ref();
	const popup = ref(false);
	//菜品规格弹出层处理
	const choseNorm = (param) => {
		console.log(param);
		let category = categoryList.value.find((val) => {
			return val.id === param.categoryId;
		});
		flavors.value = category.flavors;
		dish.value = param;
		// console.log(flavors.value);
		// console.log(dish.value)
		popup.value.open();
		normPop.value = true;
	};
	//选择店铺位置
	let location = ref(false);
	let locationPop = ref();
	const choseLocation = () => {
		locationPop.value.open();
		location.value = true;
	};
	//关闭地址选择弹窗
	const closeLocation = () => {
		locationPop.value.close();
		location.value = false;
	};
	//关闭口味选择弹窗
	const closeNorm = () => {
		popup.value.close();
		normPop.value = false;
	};
	//获取店铺列表信息
	let shopList = ref();
	const getShopList = async () => {
		let res = await getShopAPI();
		// console.log(res)
		shopList.value = res.data;
	};
	//获取store存储的店铺信息
	let shopInfo = computed(() => {
		return useShopStore().info;
	});
	//存放购物车数据的变量
	let cartList = ref([]);
	//获取当前店铺当前用户的购物车列表
	const getCartList = async () => {
		let res = await getCartListAPI(shopInfo.value.id);
		// console.log(res.data)
		cartList.value = res.data;
		// console.log(cartList.value);
	};
	//计算有多少件菜品
	let dishNum = computed(() => {
		return cartList.value.reduce((total, dish) => total + dish.number, 0);
	});
	//计算购物车总金额
	let cartSum = computed(() => {
		return cartList.value
			.reduce((sum, dish) => sum + dish.number * dish.amount, 0)
			.toFixed(2);
	});
	//购物车弹窗
	//弹出层组件实例
	let popCart = ref();
	//控制购物车弹窗是否出现
	let isPopCart = ref(false);
	const onCartList = () => {
		isPopCart.value = true;
		popCart.value.open();
	};
	const closePopCart = () => {
		isPopCart.value = false;
		popCart.value.close();
	};
	//订单确认页面弹窗
	let orderPop = ref();
	const popOrder = () => {
		orderPop.value.open();
	};
	//关闭order弹窗时的操作
	const closeOrder = () => {
		couponStore.clear();
		orderPop.value.close();
	};
	onShow(async () => {
		await getCategoryList();
		getDishList(categoryList.value[0].id);
		getShopList();
		getCartList();
	});
</script>

<template>
	<view :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
		<!-- 店铺基本信息 -->
		<view class="restaurant_info_box">
			<view class="restaurant_info">
				<!-- 上部 -->
				<view class="info_top">
					<view class="info_top_left">
						<image
							class="logo_ruiji"
							src="../../static/images//shop//shop.png"
						></image>
					</view>
					<view class="info_top_right">
						<view class="right_title">
							<text>{{ shopInfo.name }}</text>
						</view>
						<view class="right_details">
							<!-- 中 -->
							<view class="details_flex">
								<image
									class="top_icon"
									src="../../static/images/money/money.png"
								></image>
								<text class="icon_text">配送费2元</text>
							</view>
						</view>
					</view>
				</view>
				<!-- 下部---信息简介 -->
				<view class="info_bottom">
					<view>
						<view class="word" style="font-size: 30rpx"
							>川菜馆为顾客打造专业的大众化美食餐饮</view
						>
						<view class="address">
							<image
								@click="choseLocation"
								class="shopInfo_address"
								src="../../static/images/location/location.png"
								mode="scaleToFill"
							/>
							<text> 地址:{{ shopInfo.address }}</text>
						</view>

						<view class="phone">
							<image
								class="shopInfo_phone"
								src="../../static/images/phone/phone.png"
								mode="scaleToFill"
							/><text>电话:{{ shopInfo.phone }}</text></view
						>
					</view>
				</view>
			</view>
		</view>
		<!-- 店铺内容 -->
		<view class="viewport" style="padding-top: 285rpx">
			<!-- 搜索框 -->
			<view class="search">
				<view class="input">
					<text class="icon-search">尖椒鸡</text>
				</view>
			</view>
			<!-- 分类 -->
			<view class="categories">
				<!-- 左侧：一级分类 -->
				<scroll-view class="primary" scroll-y>
					<view
						v-for="(item, index) in categoryList"
						:key="item.id"
						class="item"
						:class="{ active: singal === index }"
					>
						<text @click="onChangeIndex(index, item.id)" class="name">
							{{ item.name }}
						</text>
					</view>
				</scroll-view>
				<!-- 右侧：二级分类 -->
				<scroll-view class="secondary" scroll-y>
					<!-- 焦点图 -->
					<XtxSwiper class="banner" :list="[]" />
					<!-- 内容区域 -->
					<view class="section">
						<navigator
							v-for="item in dishList"
							:key="item.id"
							class="goods"
							hover-class="none"
							:url="`/pages/goods/goods?id=`"
						>
							<image class="image" :src="item.image"></image>
							<view class="text">
								<view class="name ellipsis">{{ item.name }}</view>
								<view class="description">配料:{{ item.description }}</view>
								<view class="price"> ¥ {{ item.price }}</view>
								<view class="chose" @click="choseNorm(item)">选择规格</view>
							</view>
						</navigator>
					</view>
				</scroll-view>
			</view>
			<!-- 购物车里没有订单的状态 -->
			<view class="footer_order_buttom" v-if="cartList.length === 0">
				<view class="order_number">
					<image
						src="../../static/images/package/package.png"
						class="order_number_icon"
						mode=""
					></image>
				</view>
				<view class="order_price">
					<text class="ico">您还未挑选商品</text>
				</view>
				<view class="order_but">去结算</view>
			</view>
			<!-- 购物车里有订单结算 -->
			<view style="z-index: 100" class="footer_order_buttom order_form" v-else>
				<view class="orderCar">
					<view class="order_number">
						<image
							@click="onCartList"
							src="../../static/images/package/package.png"
							class="order_number_icon"
							mode=""
						></image>
						<view class="order_dish_num">{{ dishNum }}</view>
					</view>
					<view class="order_price">
						<text class="ico">￥</text>
						{{ cartSum }}
					</view>
				</view>
				<view @click="popOrder" class="order_but" style="background: #ffbc0d"
					>去结算</view
				>
			</view>
			<!-- 规格弹出层 -->
			<uni-popup
				ref="popup"
				type="center"
				:mask-click="false"
				background-color="#fff"
				border-radius="20rpx"
			>
				<PopMask
					v-if="normPop"
					:getCartList="getCartList"
					:dish="dish"
					:flavors="flavors"
					:closeNorm="closeNorm"
				></PopMask>
			</uni-popup>
			<!-- 店铺选择弹出层 -->
			<uni-popup ref="locationPop" type="top">
				<LocationPop
					v-if="location"
					:shopList="shopList"
					:closeLocation="closeLocation"
					:getCartList="getCartList"
				></LocationPop>
			</uni-popup>
			<!-- 购物车详情弹出层 -->
			<uni-popup ref="popCart" type="bottom">
				<PopCart
					v-if="isPopCart"
					:cartList="cartList"
					:getCartList="getCartList"
					:closePopCart="closePopCart"
				></PopCart>
			</uni-popup>
			<!-- 订单页确定弹出层 -->
			<uni-popup
				ref="orderPop"
				type="bottom"
				style="z-index: 103"
				:mask-click="false"
			>
				<Order
					:cartList="cartList"
					:orderSum="cartSum"
					:closeOrder="closeOrder"
				></Order>
			</uni-popup>
		</view>
	</view>
</template>

<style lang="scss" scoped>
	.orderCar {
		flex: 1;
		display: flex;
	}
	.order_form {
		.order_but {
			font-family: PingFangSC, PingFangSC-Medium;
			font-weight: 500;
			color: #333333;
			background: #ffc200;
		}
	}
	.footer_order_buttom {
		position: fixed;
		display: flex;
		bottom: 0rpx;
		width: 100%;
		height: 88rpx;
		margin: 0 auto;
		background: #3a3a3a;
		border-radius: 50rpx;
		box-shadow: 0px 6rpx 10rpx 0px rgba(0, 0, 0, 0.25);
		z-index: 99;
		padding: 0rpx 10rpx;
		box-sizing: border-box;
		.order_number {
			position: relative;
			width: 120rpx;
			.order_number_icon {
				position: absolute;
				display: block;
				width: 120rpx;
				height: 118rpx;
				left: 12rpx;
				bottom: 0px;
			}
			.order_dish_num {
				position: absolute;
				display: inline-block;
				z-index: 9;
				// width: 36rpx;
				min-width: 12rpx;
				height: 36rpx;
				line-height: 36rpx;
				padding: 0 12rpx;
				left: 92rpx;
				font-size: 24rpx;
				top: -8rpx;
				// text-align: center;
				border-radius: 20rpx;
				background-color: #e94e3c;
				color: #fff;
				font-weight: 500;
			}
		}
		.order_price {
			flex: 1;
			text-align: left;
			color: #fff;
			line-height: 88rpx;
			padding-left: 34rpx;
			box-sizing: border-box;
			font-size: 36rpx;
			font-family: DIN, DIN-Medium;
			font-weight: 500;
			.ico {
				font-size: 37rpx;
				color: white;
			}
		}
		.order_but {
			background-color: #6a6a6a;
			width: 204rpx;
			height: 72rpx;
			line-height: 72rpx;
			border-radius: 72rpx;
			color: #fff;
			text-align: center;
			margin-top: 8rpx;
		}
	}
	$min-font-color: #20232a;
	$desc-font-color: #818693;
	.restaurant_info_box {
		position: relative;
		color: $min-font-color;
		width: 100%;
		// height: 236rpx;
		// // height: 160rpx;
		background: linear-gradient(
			184deg,
			rgba(0, 0, 0, 0.35) 25%,
			rgba(51, 51, 51, 0) 96%
		);
	}
	.restaurant_info {
		position: absolute;
		z-index: 9;
		top: 10rpx;
		left: 30rpx;
		display: flex;
		flex-direction: column;
		width: calc(100% - 60rpx);
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 4rpx 10rpx 0px rgba(69, 69, 69, 0.1);
		border-radius: 8rpx;
		padding: 14rpx 18rpx 22rpx 16rpx;
		box-sizing: border-box;
		// 上部
		.info_top {
			flex: 1;
			display: flex;
			padding-bottom: 10rpx;
			border-bottom: 1px dashed #ebebeb;
			.info_top_left {
				margin-right: 20rpx;
				padding-top: 10rpx;
				box-sizing: border-box;
				image {
					width: 86rpx;
					height: 86rpx;
					// background: #333333;
					// border-radius: 12rpx;
					// padding: 10rpx;
					// box-sizing: border-box;
				}
			}
			.info_top_right {
				flex: 1;
				.right_title {
					display: flex;
					align-items: center;
					text {
						font-size: 36rpx;
						font-family: PingFangSC, PingFangSC-Medium;
						font-weight: 500;
						text-align: left;
						color: #20232a;
						line-height: 50rpx;
					}
				}
				.right_details {
					width: 100%;
					display: flex;
					.details_flex {
						white-space: nowrap;
						// 图片
						.top_icon {
							width: 28rpx;
							height: 28rpx;
							background-size: contain;
							display: inline-block;
							vertical-align: middle;
							margin-bottom: 4rpx;
							margin-right: 6rpx;
						}
						// 文本
						.icon_text {
							// font-size: 22rpx;
							font-size: 24rpx;
							font-family: PingFangSC, PingFangSC-Regular;
							font-weight: 400;
							text-align: center;
							color: #333333;
							line-height: 36rpx;
							padding-right: 20rpx;
						}
					}
					.test {
						flex: 1;
					}
					.vertical-line {
						display: inline-block;
						width: 1px;
						height: 20rpx;
						line-height: 20rpx;
						margin: 16rpx 10rpx;
						background-color: #ccc;
					}
				}
			}
		}
		// 下部
		.info_bottom {
			margin-top: 16rpx;
			display: flex;
			font-size: 24rpx;
			font-family: PingFangSC, PingFangSC-Regular;
			font-weight: 400;
			text-align: left;
			color: #4a3c3c;
			line-height: 34rpx;
			padding: 0 4rpx;
			& > view {
				&:first-child {
					flex: 1;
				}
			}
			.word {
				display: block;
				padding-bottom: 15rpx;
			}
			.address {
				display: flex;
				align-items: center;
				text-align: center;
				text {
					margin-top: 5px;
				}
			}
			.phone {
				display: flex;
				align-items: center;
				text-align: center;
				text {
					margin-top: 10px;
					margin-left: 1px;
				}
			}
		}
	}
	page {
		height: 100%;
		overflow: hidden;
	}
	.viewport {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.shopInfo_address {
		width: 40rpx;
		height: 40rpx;
	}
	.shopInfo_phone {
		margin-top: 10px;
		width: 40rpx;
		height: 40rpx;
	}
	.search {
		padding: 0 30rpx 20rpx;
		background-color: #fff;
		.input {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 64rpx;
			padding-left: 26rpx;
			color: #8b8b8b;
			font-size: 28rpx;
			border-radius: 32rpx;
			background-color: #f3f4f4;
		}
	}
	.icon-search {
		&::before {
			margin-right: 10rpx;
		}
	}
	/* 分类 */
	.categories {
		flex: 1;
		min-height: 400rpx;
		display: flex;
	}
	/* 一级分类 */
	.primary {
		overflow: hidden;
		width: 200rpx;
		flex: none;
		background-color: #f6f6f6;
		.item {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 96rpx;
			font-size: 26rpx;
			color: #595c63;
			position: relative;
			&::after {
				content: "";
				position: absolute;
				left: 42rpx;
				bottom: 0;
				width: 96rpx;
				border-top: 1rpx solid #e3e4e7;
			}
		}
		.active {
			background-color: white;
			font-size: 32rpx;
			font-weight: bold;
			&::before {
				content: "";
				position: absolute;
				left: 0;
				top: 0;
				width: 8rpx;
				height: 100%;
				background-color: #ffbc0d;
			}
		}
	}
	.primary .item:last-child::after,
	.primary .active::after {
		display: none;
	}
	/* 二级分类 */
	.secondary {
		background-color: #fff;
		.carousel {
			height: 200rpx;
			margin: 0 30rpx 20rpx;
			border-radius: 4rpx;
			overflow: hidden;
		}
		.panel {
			margin: 0 30rpx 0rpx;
		}
		.title {
			height: 60rpx;
			line-height: 60rpx;
			color: #333;
			font-size: 28rpx;
			border-bottom: 1rpx solid #f7f7f8;
			.more {
				float: right;
				padding-left: 20rpx;
				font-size: 24rpx;
				color: #999;
			}
		}
		.more {
			&::after {
				font-family: "erabbit" !important;
				content: "\e6c2";
			}
		}
		.section {
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			padding: 20rpx 0;
			.goods {
				width: 100%;
				margin: 0rpx 30rpx 20rpx 0;
				&:nth-child(3n) {
					margin-right: 0;
				}
				image {
					float: left;
					width: 200rpx;
					height: 185rpx;
					margin-right: 15rpx;
				}
				.text {
					.name {
						margin-bottom: 25rpx;
						padding: 5rpx;
						font-style: italic;
						font-weight: bold;
						font-size: 35rpx;
						color: #333;
					}
					.description {
						margin-bottom: 25rpx;
						font-size: 25rpx;
					}
					.price {
						float: left;
						padding: 5rpx;
						font-size: 38rpx;
						font-weight: bold;
						color: #cf4444;
					}
					.chose {
						position: fixed;
						right: 50rpx;
						display: inline;
						background: #fec860;
						border-radius: 22rpx;
						font-size: 12px;
						font-family: PingFangSC, PingFangSC-Medium;
						font-weight: 400;
						color: #333333;
					}
				}
			}
		}
	}
</style>
