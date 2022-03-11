<template>
  <div class="popup-container" @click="$emit('close')">
    <div class="popup">
      <span class="text">{{ text }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.popup-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
}
.popup {
  position: absolute;
  width: 250px;
  background: #fff;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
  padding: 5px;
  border-radius: 5px;
}
.text {
  color: #000;
  font-size: 12px;
}
</style>
