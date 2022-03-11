<template>
  <div class="wrapper-header">
    <div class="logo-text">
      <!-- {{ $t('header.__logoName') }} -->
    </div>
    <div class="wrapper-languages">
      <div
        class="language__item"
        @click="() => changeLocale('en')"
        :class="{ 'active-lang': language === 'en' }"
      >
        <div class="language__item-image">
          <img src="@/assets/english_language.svg" />
        </div>
        <div class="language__item-text">En lang</div>
      </div>
      <div
        class="language__item"
        @click="() => changeLocale('uk')"
        :class="{ 'active-lang': language === 'uk' }"
      >
        <div class="language__item-image">
          <img src="@/assets/ukr.svg" />
        </div>
        <div class="language__item-text">Укр мова</div>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@/i18n';

export default {
  data() {
    return {
      language: 'en',
    };
  },
  mounted() {},
  methods: {
    changeLocale(locale) {
      this.language = locale;
      i18n.global.locale = locale;
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 20px;
}
.logo-text {
  color: $textColor;
  font-size: 12px;
}
.wrapper-languages {
  display: flex;
  gap: 15px;
}
.language {
  &__item {
    box-sizing: border-box;
    position: relative;
    font-size: 12px;
    display: flex;
    align-items: center;
    cursor: pointer;
    &-image {
      margin-right: 5px;
      width: 25px;
      img {
        height: 12px;
      }
    }
    &-text {
      color: $clickableColor;
      font-size: 12px;
    }
  }
}
.active-lang {
  padding: 0 5px;
  z-index: 1;
  cursor: default;
  .language__item-text {
    color: $activeColor;
  }
  &::after {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: block;
    content: '';
    background: rgba(255, 255, 255, 0.8);
    border-radius: 5px;
    z-index: -1;
  }
}
</style>
