<script setup>
	import { defineProps, onMounted, ref } from "vue";
	import { useShopStore } from "@/stores";
	//获取父亲页面传递的参数
	const props = defineProps(["shopList", "closeLocation", "getCartList"]);
	//选择店铺
	const choseShop = (shopInfo) => {
		let shopStore = useShopStore();
		shopStore.setInfo(shopInfo);
		props.getCartList();
		props.closeLocation();
		// console.log(shopInfo)
	};
	const currentLocation = ref({ lat: 0, lng: 0 });
	const getCurrentLocation = () => {
		uni.getLocation({
			type: "wgs84",
			success: (res) => {
				currentLocation.value = {
					lat: res.latitude,
					lng: res.longitude,
				};
				console.log(currentLocation.value);
			},
			fail: (err) => {
				console.error("获取位置失败", err);
			},
		});
	};
	const degToRad = (deg) => (deg * Math.PI) / 180;
	const calculateDistance = (shop) => {
		const radLat1 = degToRad(currentLocation.value.lat);
		const radLat2 = degToRad(shop.latitude);
		const deltaLat = radLat1 - radLat2;
		const deltaLng =
			degToRad(currentLocation.value.lng) - degToRad(shop.longitude);
		const a =
			Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
			Math.cos(radLat1) *
				Math.cos(radLat2) *
				Math.sin(deltaLng / 2) *
				Math.sin(deltaLng / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const distanceValue = 6371 * c; // 地球半径（单位：公里）
		return distanceValue.toFixed(2); // 保留两位小数
	};
	//跳转到腾讯详情地图组件
	const goToMap = (shop) => {
		let plugin = requirePlugin("routePlan");
		let key = "INIBZ-FMQEI-JREGG-UYXHR-YKSUQ-IEFUE"; //使用在腾讯位置服务申请的key
		let referer = "cty"; //调用插件的app的名称
		let endPoint = JSON.stringify({
			//终点
			name: shop.name + "-" + shop.address,
			latitude: shop.latitude,
			longitude: shop.longitude,
		});
		uni.navigateTo({
			url:
				"plugin://routePlan/index?key=" +
				key +
				"&referer=" +
				referer +
				"&endPoint=" +
				endPoint +
				"&navigation=1",
		});
	};
	onMounted(() => {
		getCurrentLocation();
	});
</script>

<template>
	<view class="viewport">
		<!-- 地址列表 -->
		<scroll-view class="scroll-view" scroll-y>
			<view class="address">
				<view class="address-list">
					<!-- 收货地址项 -->
					<view
						@click="choseShop(item)"
						class="item"
						v-for="item in shopList"
						:key="item.id"
					>
						<view class="item-content">
							<view class="shop">
								{{ item.name }}
								<text class="contact">{{ item.phone }}</text>
							</view>
							<view class="locate">{{ item.address }}</view>
							<view style="margin-top: 5px"
								><image
									@click="goToMap(item)"
									class="location"
									src="../../static/images/location/location.png"
									mode="scaleToFill"
								/><text class="miles"
									>{{ calculateDistance(item) }}公里</text
								></view
							>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<style lang="scss">
	.miles {
		font-size: 30rpx;
		padding-bottom: 10rpx;
		color: #898989;
	}
	.location {
		width: 40rpx;
		height: 40rpx;
	}
	/* 删除按钮 */
	.delete-button {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 50px;
		height: 100%;
		font-size: 28rpx;
		color: #fff;
		border-radius: 0;
		padding: 0;
		background-color: #cf4444;
	}
	.viewport {
		display: flex;
		flex-direction: column;
		height: 100%;
		border-radius: 0 0 15rpx 15rpx;
		background-color: #f4f4f4;

		.scroll-view {
			padding-top: 20rpx;
		}
	}

	.address {
		padding: 0 20rpx;
		margin: 0 20rpx;
		border-radius: 10rpx;
		background-color: #fff;

		.item-content {
			line-height: 1;
			padding: 40rpx 10rpx 38rpx;
			border-bottom: 1rpx solid #ddd;
			position: relative;

			.edit {
				position: absolute;
				top: 36rpx;
				right: 30rpx;
				padding: 2rpx 0 2rpx 20rpx;
				border-left: 1rpx solid #666;
				font-size: 26rpx;
				color: #666;
				line-height: 1;
			}
		}

		.item:last-child .item-content {
			border: none;
		}

		.shop {
			font-size: 28rpx;
			margin-bottom: 20rpx;
			color: #333;

			.contact {
				color: #666;
			}

			.badge {
				display: inline-block;
				padding: 4rpx 10rpx 2rpx 14rpx;
				margin: 2rpx 0 0 10rpx;
				font-size: 26rpx;
				color: #27ba9b;
				border-radius: 6rpx;
				border: 1rpx solid #27ba9b;
			}
		}

		.locate {
			line-height: 1.6;
			font-size: 26rpx;
			color: #333;
		}
	}

	.blank {
		margin-top: 300rpx;
		text-align: center;
		font-size: 32rpx;
		color: #888;
	}

	.add-btn {
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		margin: 30rpx 20rpx;
		color: #fff;
		border-radius: 80rpx;
		font-size: 30rpx;
		background-color: #27ba9b;
	}
</style>
