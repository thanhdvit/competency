<template>
  <q-page padding>
    <q-btn color="teal"
      label="Import từ điển năng lực Cấp 1"
      @click="importNanglucCap1"></q-btn>
    <q-btn color="teal"
      style="margin-left: 10px"
      label="Import từ điển năng lực Chuyên môn"
      @click="importNanglucChuyenmon"></q-btn>
  </q-page>
</template>

<script>
export default {
  name: 'ImportDanhmucTudienNangluc',
  methods: {
    async importNanglucCap1() {
      try {
        const response = await this.$axios.post(`${this.$webapiPath}/competency/import/cap1`);
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    },
    async importNanglucChuyenmon() {
      try {
        const response = await this.$axios.post(`${this.$webapiPath}/competency/import/chuyenmon`);
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style>
</style>
