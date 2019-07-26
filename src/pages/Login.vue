<template>
  <q-page padding>
    <div class="q-pa-md row items-start q-gutter-md fixed-center">
      <form @submit.prevent="login">
        <q-card class="my-card">
          <img
            src="https://d3ayyz93zozlya.cloudfront.net/uploaded-images/articlemainimage/competency-modeling-and-the-future-of-work-5ad51042a3b8d.jpeg"
            height="250" style="width: 100%">
          <q-card-section v-if="loading">
            <q-spinner color="deep-purple" size="3em" />
          </q-card-section>
          <q-card-section v-if="errorLogin">
            <span style="color: red" class="text-weight-bold">
              {{ errorLogin }}
            </span>
          </q-card-section>
          <q-card-section>
            <q-input ref="username" v-model="username" label="Mã nhân viên" outlined
              :rules="[val => !!val || 'Chưa nhập mã nhân viên']"
              @input="() => errorLogin = undefined">
              <template v-slot:prepend>
                <q-icon name="fas fa-key" />
              </template>
            </q-input>
            <q-input ref="password" type="password" v-model="password" label="Mật khẩu" outlined
              @input="() => errorLogin = undefined">
              <template v-slot:prepend>
                <q-icon name="fas fa-user-lock" />
              </template>
            </q-input>
          </q-card-section>
          <q-card-actions>
            <q-btn class="full-width" color="red-8" icon="fas fa-sign-in-alt"
              type="submit"
              v-show="!loading">
              <span style="margin-left: 10px">
                Đăng nhập
              </span>
            </q-btn>
          </q-card-actions>
        </q-card>
      </form>
     </div>
  </q-page>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      errorLogin: undefined,
      username: undefined,
      password: undefined,
    };
  },
  methods: {
    async login() {
      if (!this.username) {
        this.errorLogin = 'Vui lòng cung cấp mã nhân viên';
        this.$refs.username.focus();
        return;
      }
      if (!this.password) {
        this.errorLogin = 'Vui lòng cung cấp mật khẩu';
        this.$refs.password.focus();
        return;
      }

      this.loading = true;
      const bodyFormData = new FormData();
      bodyFormData.set('username', this.username);
      bodyFormData.set('matkhau', this.password);
      await axios.post(`${this.$webapiPath}/token/get`, bodyFormData)
        .then((response) => {
          this.$axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
          this.$store.commit('competency/authSuccess', {
            token: response.data.token,
            tokenInfo: JSON.parse(atob(response.data.token.split('.')[1])),
          });
          this.$router.replace(this.$route.query.redirect || '/');
        }).catch(() => {
          this.errorLogin = 'Mã nhân viên hoặc mật khẩu không đúng';
          this.loading = false;
        });
    },
  },
};
</script>

<style>
</style>
<style lang="stylus" scoped>
.my-card
  width 100%
  min-width 400px
  max-width 500px
</style>
