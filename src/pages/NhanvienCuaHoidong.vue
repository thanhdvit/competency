<template>
  <q-page padding>
    <q-dialog v-model="openModal" persistent position="top">
    </q-dialog>
    <div class="q-pa-md">
      <q-table
        :grid="$q.screen.xs"
        class="my-sticky-header-table"
        :data="data"
        :columns="columns"
        row-key="id"
        :filter="filter"
        :rows-per-page-options="[0]"
        :pagination.sync="pagination"
        separator="cell"
        hide-bottom
      >
        <template v-slot:top-left>
          <span class="table-top-left">DANH SÁCH NHÂN VIÊN</span>
        </template>

        <!-- SEARCH -->
        <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <!-- HEADER -->
        <q-tr slot="header" class="table-header">
          <q-td v-for="col in columns" :key="col.name" class="text-center">
            <span>
              {{ col.label }}
            </span>
          </q-td>
        </q-tr>

        <!-- BODY -->
        <q-tr slot="body" slot-scope="props" :props="props">
          <q-td class="text-center" width="50">{{ props.row.stt }}</q-td>
          <q-td class="text-center" width="130">{{ props.row.manv }}</q-td>
          <q-td>{{ props.row.fullname }}</q-td>
          <q-td>{{ props.row.cdcv }}</q-td>
          <q-td>{{ props.row.phongban }}</q-td>
          <q-td class="text-center" width="175">
            <q-item clickable flat tag="a" class="col-link"
              v-if="props.row.danhgia === 'HD'"
              :to="`/estimate/${props.row.id}/CURRENT`">
              <q-item-section>
                <q-item-label>Hội đồng đánh giá</q-item-label>
              </q-item-section>
            </q-item>
          </q-td>
        </q-tr>
      </q-table>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'NhanvienCuaHoidong',
  data() {
    return {
      ofID: undefined, // ID nhân viên cần xóa đánh giá
      ofName: undefined, // Họ tên nhân viên cần xóa đánh giá
      openModal: false,
      columns: [],
      data: [],
      filter: '',
      pagination: {
        page: 1,
        rowsPerPage: 0,
      },
    };
  },
  async created() {
    try {
      // Danh sách nhân viên
      let url = `${this.$webapiPath}/competency/nhanvien-hoidong`;
      url += `?userID=${this.$store.state.competency.userID}`;
      const response = await this.$axios.get(url);
      this.showData(response.data);
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    showData(pData) {
      this.columns = [];
      this.columns.push({ name: 'stt', label: 'STT', field: 'stt' });
      this.columns.push({ name: 'manv', label: 'MÃ NHÂN VIÊN', field: 'manv' });
      this.columns.push({ name: 'fullname', label: 'TÊN', field: 'fullname' });
      this.columns.push({ name: 'cdcv', label: 'VỊ TRÍ CHỨC DANH', field: 'cdcv' });
      this.columns.push({ name: 'phongban', label: 'PHÒNG BAN', field: 'phongban' });
      this.columns.push({ name: 'danhgia', label: 'ĐÁNH GIÁ', field: 'danhgia' });

      if (pData.myData !== null) {
        pData.myData.forEach((item, stt) => {
          this.data.push({
            stt: stt + 1,
            id: `${item.employeeID}`,
            manv: `${item.employeeCode}`,
            fullname: `${item.fullname}`,
            cdcv: `${item.jobTitle}`,
            phongban: `${item.department}`,
            danhgia: `${item.who}`,
          });
        });
      }
    },
  },
};
</script>

<style>
</style>
