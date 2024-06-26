<template>
  <div id="userLayout">
    <div class="login_panel">
      <div class="login_panel_form">
        <div class="login_panel_form_title">
          <img class="login_panel_form_title_logo" src="/logo.svg">
          <div class="login_panel_form_title_p">
            用户登录
          </div>
        </div>
        <el-form ref="loginForm" :rules="rules" :model="formData">
          <el-form-item prop="username">
            <el-input v-model="formData.username" placeholder="请输入用户名">
              <template #suffix>
                <span class="input-icon">
                  <el-icon>
                    <User />
                  </el-icon>
                </span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="formData.password" placeholder="请输入密码" :type="lock === 'lock' ? 'password' : 'text'">
              <template #suffix>
                <a class="input-icon">
                  <el-icon>
                    <component :is="lock" @click="handleChangeLock" />
                  </el-icon>
                </a>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="captcha">
            <div class="vPicBox">
              <el-input v-model="formData.captcha" placeholder="请输入验证码" style="width: 60%" />
              <div class="vPic">
                <img alt="验证码" :src="captcha" @click="handleChangeCaptcha">
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="large" :disabled="formData.captcha != formData.captchaID" style="width: 46%;"
              @click="formSubmit">
              登 录
            </el-button>
            <!-- <el-button
              type="primary"
              size="large"

              style="width: 46%;text-align: right;"
              @click="formSubmit"
            >
              注 册
            </el-button> -->
          </el-form-item>
        </el-form>
      </div>
      <div class="login_panel_right" />
    </div>
  </div>
</template>

<script setup>

import { authStore } from '@/stores'
import { useRouter, useRoute } from 'vue-router'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
// import 接口
import { getCaptcha } from '@/apis/captcha'
import { postLogin } from '@/apis/login'
// 密码展示效果
const lock = ref('lock')
const handleChangeLock = () => {
  lock.value = lock.value === 'lock' ? 'unlock' : 'lock'
}
const formData = reactive({
  captchaID: '',
  username: '',
  password: '',
  captcha: ''
})

// 图片验证码
const captcha = ref('')
const handleChangeCaptcha = () => {
  getCaptcha().then((result) => {
    captcha.value = result.data.captchaURL
    formData.captchaID = result.data.captchaID
    console.log(result)
  })
}
handleChangeCaptcha()

// 用户登录验证相关

const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, message: '用户名最少为5个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 5, message: '密码最少为5个字符', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    {
      type: 'string',
      validator: (rule, value, callback) => {
        return value === formData.captchaID
      },
      message: '验证码不正确'
    }
  ]
})

// 处理用户登录相关逻辑
const loginForm = ref(null)
const permission = authStore()
const router = useRouter()
const route = useRoute()

const userData = reactive({
  username: formData.username,
  password: formData.password
})

const formSubmit = () => {
  loginForm.value.validate((validate) => {
    if (validate) { // 判断表单是否验证通过。
      postLogin(formData).then((result) => {
        console.log(result)
        console.log(formData);
        if (typeof result.data.token === 'undefined') {
          ElMessage.error('登录失败，未获取到token！')
          return
        }
        console.log(document.cookie)
        permission.token = result.data.token
        permission.routes = result.data.routes
        // console.log(route.query.redirect);
        // console.log(result.index);
        router.push('/')
      }).catch(() => {
        handleChangeCaptcha()
      })
    } else {
      ElMessage.error('请输入正确的数据！')
    }
  })
}

</script>

<style lang="scss" scoped>
#userLayout {
  background-image: url("@/assets/login/login_background.jpg");
  background-size: cover;
  width: 100%;
  height: 100%;

  .input-icon {
    padding-right: 6px;
    padding-top: 4px;
  }

  .login_panel {
    width: 156vw;
    height: 100%;
    background-color: rgba(255, 255, 255, .8);
    backdrop-filter: blur(5px);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    .login_panel_right {
      background-image: url("@/assets/logo-with-shadow.png");
      background-size: cover;
      width: 40%;
      height: 60%;
      float: right !important;
    }

    .login_panel_form {
      width: 420px;
      background-color: #fff;
      padding: 40px 40px 40px 40px;
      border-radius: 10px;
      box-shadow: 2px 3px 7px rgba(0, 0, 0, .2);

      .login_panel_form_title {
        display: flex;
        align-items: center;
        margin: 30px 0;

        .login_panel_form_title_logo {
          width: 90px;
          height: 72px;
        }

        .login_panel_form_title_p {
          font-size: 40px;
          padding-left: 15px;
        }
      }

      .vPicBox {
        display: flex;
        justify-content: space-between;
        width: 100%;
      }

      .vPic {
        width: 33%;
        height: 38px;
        background: #ccc;

        img {
          width: 100%;
          height: 100%;
          vertical-align: middle;
        }
      }
    }
  }
}

//小屏幕不显示右侧，将登陆框居中
@media (max-width: 768px) {
  .login_panel_right {
    display: none;
  }

  .login_panel {
    margin-left: 2vw;
  }

  .login_panel_form {
    width: 100%;
  }
}
</style>