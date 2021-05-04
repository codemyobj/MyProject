<template>
  <div class="login-container">
    <div class="login-form-wrap">
      <div class="login-head">
        <div class="logo"></div>
      </div>
    </div>
    <!-- 
      配置form表单验证
      1 必须给el-form组件绑定model为表单数据对象
      2 给需要验证的表单项el-form-item绑定prop属性
      注意：porp属性需要指定表单对象中的数据名称
      3 配置rules规则

      手动触发表单验证：
      1 给el-form 设置ref
      2 通过ref或elform组件的 调用组件的validate进行验证
    -->
    <el-form class="login-form" ref="loginRef" :model="user" :rules="formRules">
      <el-form-item prop="mobile">
        <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item prop="agree">
        <el-checkbox v-model="user.agree">我已阅读并同意用户协议和隐私条款</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="login-btn" :loading="loginLoading" @click="onLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from "@/api/user";

export default {
  name: "LoginIndex",
  props: {},
  data() {
    return {
      user: {
        mobile: "13911111111", //手机号
        code: "246810", //验证码
        agree: false, //是否同意协议
      },
      loginLoading: false, //登录loading状态
      //表单验证规则配置
      formRules: {
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            required: true,
            pattern: /^1[3|4|5|6|7|8|9]\d{9}$/,
            message: "输入正确的手机号格式",
            trigger: "blur",
          },
        ],
        code: [
          { required: true, message: "验证码不能为空", trigger: "blur" },
          {
            required: true,
            pattern: /^\d{6}$/,
            message: "输入正确的验证码格式",
            trigger: "blur",
          },
        ],
        agree: [
          {
            //自定义校验规则
            //验证通过： callback()
            //验证失败：callback(new error(错误消息))
            validator: (rule, value, callback) => {
              if (value) {
                callback();
              } else {
                callback(new Error("请勾选同意用户协议"));
              }
            },
            trigger: "change",
          },
        ],
      },
    };
  },
  created() {},
  methods: {
    onLogin() {
      // 获取表单数据(根据服务端接口要求绑定数据)
      //表单验证
      this.$refs.loginRef.validate((valid) => {
        // 如果表单验证失败 停止请求提交
        if (!valid) {
          return;
        }
        // 验证通过请求登录
        this.login();
      });
    },
    login() {
      // 开启登录中 loading..
      this.loginLoading = true;

      // 对应代码中的请求操作
      //1 接口请求可能需要重用
      //2 实际工作中 接口非常容易变动，改起来麻烦
      //建议把所有的请求都封装成函数 然后统一的组织到模块中进行管理
      //这样做的好处就是 管理维护更方便 而且也好复用
      login(this.user)
        // 成功： ‘’‘
        .then((res) => {
          this.$message.success("登录成功！"); //关闭loading
          this.loginLoading = false;

          // 将接口返回的用户数据放到本地存储 方便应用数据共享
          // 本地存储只能存储字符串
          // 如果需要存储对象 数组类型的数据 则把它们转为json格式字符串进行存储
          window.localStorage.setItem("user", JSON.stringify(res.data.data));

          // 跳转到首页
          this.$router.push("/layout");
        })
        .catch((err) => {
          this.$message.error("登陆失败,手机号或验证码错误!");
          this.loginLoading = false;
        });
    },
  },
};
</script>
<style scoped lang='less'>
.login-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url("~@/assets/img/login/login_bg.jpg") no-repeat;
  .login-form-wrap {
    min-width: 400px;
    padding: 20px 0 0;
    background-color: #fff;
    .login-head {
      display: flex;
      justify-content: center;
      .logo {
        width: 200px;
        height: 57px;
        background: url("~@/assets/img/login/logo_index.png") no-repeat;
        background-size: contain;
      }
    }
  }

  .login-form {
    background-color: #fff;
    padding: 10px 50px 1px;
    min-width: 300px;
    .login-btn {
      width: 100%;
    }
  }
}
</style>