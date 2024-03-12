<template>
  <router-view />
</template>
<style lang="scss">
html, body, #app{
  margin: 0;
  border: 0;
  padding: 0;
  height: 100%;
}
</style>
<!-- <template>
  <button @click="getJokes">
    获得笑话
  </button>
  <div>
    <img
      :src="captcha"
      alt=""
    >
  </div>
  <div>
    {{ captchaID }}
  </div>
</template>
<script>
import axios from 'axios'
import service from '@/utils/request'
export default {
  data () {
    return {
      jokes: [],
      captcha: '',
      captchaID: ''
    }
  },
  methods: {
    getJokes () {
      service({
        url: '/captcha',
        method: 'get'
      }).then(Response => {
        console.log(Response)
        this.captcha = Response.captchaURL
        this.captchaID = Response.captchaID
      })
    }
  }
}
</script> -->
