<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          v-show="$store.state.competency.isAuthenticated"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          DTG - HỆ THỐNG ĐÁNH GIÁ NĂNG LỰC
        </q-toolbar-title>

        <div>Version v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      content-class="bg-grey-2"
      v-if="$store.getters['competency/isLogined']"
    >
      <q-list>
        <q-item-label header>Menu chức năng</q-item-label>
        <q-item clickable to="/">
          <q-item-section avatar>
            <q-icon name="fas fa-user" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Đánh giá năng lực</q-item-label>
            <q-item-label caption>(Estimate dictionary)</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/ability/dictionary">
          <q-item-section avatar>
            <q-icon name="fas fa-language" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Từ điển năng lực</q-item-label>
            <q-item-label caption>(Ability dictionary)</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/framework">
          <q-item-section avatar>
            <q-icon name="fas fa-store-alt" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Xây dựng khung năng lực</q-item-label>
            <q-item-label caption>(Build ability system)</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/hoidong/role">
          <q-item-section avatar>
            <q-icon name="fab fa-critical-role" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Phân quyền hội đồng</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/hoidong/estimate">
          <q-item-section avatar>
            <q-icon name="fas fa-users" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Hội đồng đánh giá</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://quasar.dev">
          <q-item-section avatar>
            <q-icon name="fas fa-warehouse" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Báo cáo tổng hợp</q-item-label>
            <q-item-label caption>(Ability report)</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/import/tudien-nangluc">
          <q-item-section avatar>
            <q-icon name="fas fa-file-import" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Import danh mục</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" href="#" @click="$store.commit('competency/logout', logout)">
          <q-item-section avatar>
            <q-icon name="fas fa-sign-out-alt" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Đăng xuất</q-item-label>
            <q-item-label caption>(Logout)</q-item-label>
          </q-item-section>
          <q-item-section side>
            <img height="40" width="40"
              :src="`https://dtg.com.vn/apps/upload/images/employee/${$store.state.competency.userCode}.jpg`" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'MyLayout',
  data() {
    return {
      // leftDrawerOpen: this.$q.platform.is.desktop,
      leftDrawerOpen: false,
    };
  },
  created() {
    const token = this.$store.getters['competency/token'];
    this.$axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  },
  methods: {
    logout() {
      this.$router.replace({ path: '/login' });
    },
  },
};
</script>

<style>
</style>
