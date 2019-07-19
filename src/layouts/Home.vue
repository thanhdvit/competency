<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
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
    >
      <q-list>
        <q-item-label header>Menu chức năng</q-item-label>
        <q-item clickable tag="a" href="/#/">
          <q-item-section avatar>
            <q-icon name="fas fa-clipboard-list" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Từ điển năng lực</q-item-label>
            <q-item-label caption>(Ability dictionary)</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" href="/#/framework">
          <q-item-section avatar>
            <q-icon name="fas fa-store-alt" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Xây dựng khung năng lực</q-item-label>
            <q-item-label caption>(Build ability system)</q-item-label>
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
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar';

export default {
  name: 'MyLayout',
  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
    };
  },
  methods: {
    openURL,
  },
};
</script>

<style>
</style>
