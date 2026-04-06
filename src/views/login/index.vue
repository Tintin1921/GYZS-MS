<template>
  <div id="login-page">
    <div id="particles-js" />
    <div class="login-box">
      <div class="login-header">
        <img src="@/assets/images/logo-white.png" alt="logo" class="logo-img">
        <div class="title">
          <h2 style="color: #00b894;">制丝车间信息化管理平台</h2>
          <p style="color: #fff;">制丝车间信息化小组</p>
        </div>
      </div>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="账号为姓名拼音" prefix-icon="el-icon-user" autocomplete="on" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            show-password
            autocomplete="on"
          />
        </el-form-item>
        <el-form-item prop="captchaCode">
          <el-input
            v-model="loginForm.captchaCode"
            placeholder="验证码"
            prefix-icon="el-icon-warning-outline"
            autocomplete="on"
            style="width: 55%"
          />
          <span @click="handleGenerate()">
            <el-tooltip placement="top" content="点击刷新验证码">
              <el-image v-loading="loadingImg" :src="imageUrl" style="vertical-align: middle;border-radius: 4px;margin-bottom: .3rem;float: right;width: 35%;height: 40px" />
            </el-tooltip>
          </span>
        </el-form-item>
        <div class="actions">
          <el-link :underline="false" class="forgot" @click="forgetPwd">忘记密码？</el-link>
        </div>
        <el-button :loading="loading" type="primary" class="login-btn animated-btn" @click.native.prevent="handleLogin">
          <span v-if="!loading">登录</span>
        </el-button>
        <div class="footer">
          <el-divider />
          <p>版本号：V1.21</p>
          <p>软著登字第13241659号 登记号：2024SR0837786</p>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import 'particles.js'
import { generate } from '@/api/user'

export default {
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('如姓名为"唐曼"则登录账号为"tangman"'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码至少6位'))
      } else {
        callback()
      }
    }
    return {
      imageUrl: null,
      loadingImg: false,
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        captchaCode: [{ required: true, trigger: 'blur', message: '请填写验证码' }]
      },
      loading: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    generate().then(url => {
      this.imageUrl = URL.createObjectURL(url)
    })
  },
  mounted() {
    this.initParticles()
  },
  methods: {
    handleGenerate() {
      this.loadingImg = true
      generate().then(url => {
        this.imageUrl = URL.createObjectURL(url)
        setTimeout(() => {
          this.loadingImg = false
        }, 1000)
      })
    },
    initParticles() {
      particlesJS.load('particles-js', '/gyzs-ms/particles.json', function() {})
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          setTimeout(async() => {
            this.$store.dispatch('user/login', this.loginForm).then(() => {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
              this.$message.success('登录成功')
            }).catch(() => {
              this.$message.error('验证错误')
              this.handleGenerate()
              this.loading = false
            })
          }, 1500)
        } else {
          this.$message.error('输入错误')
          return false
        }
      })
    },
    forgetPwd() {
      alert('请联系管理员')
    }
  }
}
</script>

<style lang="scss" scoped>
@media screen and (max-width: 768px) {
  .login-box {
    width: 90%;
    padding: 2rem 1.5rem;
  }

  .login-header .title h2 {
    font-size: 18px;
  }

  .login-header .title p {
    font-size: 12px;
  }

  .footer p {
    font-size: 10px;
  }
}

#login-page {
  position: relative;
  width: 100%;
  height: 100vh;
  background: #0f2027;
  overflow: hidden;

  #particles-js {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  .login-box {
    position: relative;
    z-index: 2;
    width: 400px;
    margin: auto;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);

    .login-header {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      margin-bottom: 1.5rem;

      .logo-img {
        width: 60px;
        height: 60px;
        margin-bottom: 10px;
      }

      .title {
        text-align: center;

        h2 {
          margin: 0;
          font-size: 20px;
          font-weight: bold;
          color: #333;
        }

        p {
          font-size: 13px;
          color: #888;
        }
      }
    }

    .actions {
      text-align: right;
      margin-top: -1rem;
      .forgot {
        font-size: 13px;
        color: #409EFF;
      }
    }

    .login-btn {
      width: 100%;
      margin-top: 10px;
      background: linear-gradient(135deg, #00b894, #007457);
      border: none;
      color: #fff;
      font-weight: 600;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      border-radius: 6px;

      &:hover {
        background: linear-gradient(135deg, #00cec9, #00b894);
        box-shadow: 0 5px 15px rgba(0, 185, 148, 0.4);
      }

      &:after {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        height: 0;
        width: 0;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 100%;
        transform: translate(-50%, -50%);
        transition: width 0.5s ease, height 0.5s ease;
      }

      &:active:after {
        width: 200px;
        height: 200px;
        transition: 0s;
      }
    }

    .footer {
      text-align: center;
      margin-top: 1rem;
      p {
        margin: .2rem;
        font-size: 12px;
        color: #aaa;
        padding: 3px
      }
    }
  }
}
</style>
