<template>
  <div class="loading-spinner"></div>
  <!-- <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    style="display: block; shape-rendering: auto"
    :width="width"
    :height="height"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
  >
    <circle
      cx="50"
      cy="50"
      fill="none"
      stroke="#f97316"
      stroke-width="10"
      r="35"
      stroke-dasharray="164.93361431346415 56.97787143782138"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        repeatCount="indefinite"
        dur="1s"
        values="0 50 50;360 50 50"
        keyTimes="0;1"
      ></animateTransform>
    </circle>
  </svg> -->
</template>

<!--<script>
export default {
  props: {
    width: {
      type: String,
      default: '30px',
    },
    height: {
      type: String,
      default: '30px',
    },
  },
};
</script>-->

<style lang="scss" scoped>
@keyframes rotate-forever {
  0% {
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

.loading-spinner {
  animation-duration: 0.75s;
  animation-iteration-count: infinite;
  animation-name: rotate-forever;
  animation-timing-function: linear;
  height: 25px;
  width: 25px;
  border: 0.23rem solid #f97316;
  border-right-color: transparent;
  border-radius: 50%;
  display: inline-block;
}
</style>
