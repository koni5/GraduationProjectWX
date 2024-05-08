<script setup>
// 倒计时结束事件
const onTimeup = () => {
  // 修改订单状态为已取消
  
}
</script>

<template>
  <!-- 待付款状态:展示去支付按钮和倒计时 -->
  <template>
    <view class="status icon-clock">等待付款</view>
    <view class="tips">
      <text class="money">应付金额: ¥ 99.00</text>
      <text class="time">支付剩余</text>
      <!-- 倒计时组件 -->
      <uni-countdown
        :second="10"
        color="#fff"
        splitor-color="#fff"
        :show-day="false"
        :show-colon="false"
        @timeup="onTimeup"
      />
    </view>
    <view class="button">去支付</view>
  </template>
</template>