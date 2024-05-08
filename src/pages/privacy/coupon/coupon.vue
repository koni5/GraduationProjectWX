<script setup>
	import { ref, defineProps } from "vue";
	const props = defineProps(["couponList"]);
</script>
<template>
	<scroll-view scroll-y>
		<view class="title"> 我的神券 </view>
		<view class="goods">
			<view
				v-for="item in couponList"
				:key="item.id"
				class="item"
				hover-class="none"
			>
				<text style="color: #cf4444">天天神券</text>
				<view class="meta">
					<view class="name ellipsis">￥{{ item.discount }}</view>
					<view class="attrs">满{{ item.minimum }}可用</view>
					<view class="count">x{{ item.count }}</view>
				</view>
			</view>
		</view>
	</scroll-view>
</template>
<style lang="scss" scoped>
	.title {
		font-size: 35rpx;
		font-style: italic;
		margin-top: 35rpx;
		padding-bottom: 10rpx;
		margin-left: 20rpx;
		color: #313234;
	}
	.goods {
		margin: 20rpx;
		padding: 0 15rpx;
		border-radius: 10rpx;
		background-color: #fefefe;

		.item {
			display: flex;
			padding: 20rpx 0;
			border-top: 12rpx solid #eee;

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
				margin-left: 320rpx;
				height: 80rpx;
				color: #ff3c26;
			}

			.attrs {
				margin-left: 310rpx;
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
