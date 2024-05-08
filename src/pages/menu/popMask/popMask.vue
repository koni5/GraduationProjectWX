<!--选择多规格弹层-->
<template>
	<view class="more_norm_pop">
		<view class="title">{{ dish.name }}</view>
		<scroll-view class="items_cont" scroll-y="true" scroll-top="0rpx">
			<view class="item_row" v-for="(item, index1) in flavors" :key="index1">
				<view class="flavor_name">{{ item.name }}</view>
				<view class="flavor_value">
					<view
						:class="{
							value: true,
							act: flavorArray[index1] === value,
						}"
						v-for="(value, index2) in item.value"
						:key="index2"
						@click="choseNorm(index1, value)"
					>
						{{ value }}
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="but_item">
			<view class="price">
				<text class="ico">￥</text>
				{{ dish.price }}
			</view>
			<view class="active"
				><view @click="addToCart" class="dish_card_add">加入购物车</view></view
			>
		</view>
		<view class="close"
			><image
				@click="closeNorm"
				class="close_img"
				src="../../../static/images/closebtn/closebtn.png"
				mode=""
			></image
		></view>
	</view>
</template>
<script setup>
	import { addToCartAPI } from "../../../services/shopCart";
	import { ref, defineProps } from "vue";
	import { onLoad, onShow } from "@dcloudio/uni-app";
	import { useShopStore } from "@/stores";
	//获取父传子的数据
	const props = defineProps(["dish", "flavors", "closeNorm","getCartList"]);
	//选择口味高亮(前端判断高亮的)
	let flavorArray = ref([]);
	//选择口味数据(传给后端的)
	let flavorData = [];
	const choseNorm = (index, val) => {
		flavorArray.value[index] = val;
		flavorData[index] = props.flavors[index].name + ":" + val;
		console.log(flavorData);
	};
	//关闭选择口味窗口
	const closeNorm = () => {
		flavorArray.value = [];
		flavorData = [];
		props.closeNorm();
	};
	//添加进购物车
	let dishInfo = ref({});
	const addToCart = async() => {
		if (flavorArray.value.length < props.flavors.length) {
			uni.showToast({
				title: "请选择口味",
				icon: "error",
			});
			//直接返回,不执行下面的添加购物车API
			return;
		}
		// console.log(flavorData.join(","));
		let shopStore=useShopStore()
		let shopId=shopStore.info.id
		console.log(shopId)
		dishInfo.value.dishFlavor = flavorData.join(",");
		dishInfo.value.dishId = props.dish.id;
		dishInfo.value.shopId=shopId;
		//添加进购物车,这里必须要await,因为业务逻辑是添加完后才重新刷新购物车,await保证了顺序的同步
		await addToCartAPI(dishInfo.value);
		//刷新购物车
		props.getCartList()
		//关闭口味弹窗
		closeNorm()
	};
</script>
<style lang="scss" scoped>
	.more_norm_pop {
		width: calc(100vw - 160rpx);
		box-sizing: border-box;
		position: relative;
		top: 50%;
		left: 50%;
		padding: 40rpx;
		transform: translateX(-50%) translateY(-50%);
		background: #fff;
		border-radius: 20rpx;
		.div_big_image {
			width: 100%;
			border-radius: 10rpx;
		}
		.title {
			font-size: 40rpx;
			line-height: 80rpx;
			text-align: center;
			font-weight: bold;
		}
		.items_cont {
			display: flex;
			flex-wrap: wrap;
			margin-left: -14rpx;
			max-height: 50vh;
			.item_row {
				.flavor_name {
					height: 40rpx;
					opacity: 1;
					font-size: 28rpx;
					font-family: PingFangSC, PingFangSC-Regular;
					font-weight: 400;
					text-align: left;
					color: #666666;
					line-height: 40rpx;
					padding-left: 10rpx;
					padding-top: 20rpx;
				}
				.flavor_value {
					display: flex;
					flex-wrap: wrap;
					.value {
						border: 1px solid #ffb302;
						border-radius: 12rpx;
						margin: 20rpx 10rpx;
						padding: 0 26rpx;
						height: 60rpx;
						line-height: 60rpx;
						font-family: PingFangSC, PingFangSC-Regular;
						font-weight: 400;
						color: #333333;
					}
					.act {
						// background: linear-gradient(144deg, #ffda05 18%, #ffb302 80%);
						background: #ffc200;
						border: 1px solid #ffc200;
						font-family: PingFangSC, PingFangSC-Medium;
						font-weight: 500;
					}
				}
			}
		}
		.but_item {
			display: flex;
			position: relative;
			flex: 1;
			padding-left: 10rpx;
			margin: 34rpx 0 -20rpx 0;
			.price {
				text-align: left;
				color: #e94e3c;
				line-height: 88rpx;
				box-sizing: border-box;
				font-size: 48rpx;
				font-family: DIN, DIN-Medium;
				font-weight: 500;
				.ico {
					font-size: 28rpx;
				}
			}
			.active {
				position: absolute;
				right: 0rpx;
				bottom: 20rpx;
				display: flex;
				.dish_add,
				.dish_red {
					display: block;
					width: 72rpx;
					height: 72rpx;
				}
				.dish_number {
					padding: 0 10rpx;
					line-height: 72rpx;
					font-size: 30rpx;
					font-family: PingFangSC, PingFangSC-Medium;
					font-weight: 500;
				}
				.dish_card_add {
					width: 200rpx;
					height: 60rpx;
					line-height: 60rpx;
					text-align: center;
					font-weight: 500;
					font-size: 28rpx;
					opacity: 1;
					// background: linear-gradient(144deg, #ffda05 18%, #ffb302 80%);
					background: #ffc200;
					border-radius: 30rpx;
				}
			}
		}
	}
	.close {
		position: absolute;
		bottom: -100rpx;
		left: 50%;
		transform: translateX(-50%);
		.close_img {
			width: 88rpx;
			height: 88rpx;
		}
	}
</style>
