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
          <q-td/>
        </q-tr>

        <!-- BODY -->
        <q-tr slot="body" slot-scope="props" :props="props" class="table-row">
          <q-td class="text-center table-row" width="50">{{ props.row.stt }}</q-td>
          <q-td class="text-center" width="130">{{ props.row.manv }}</q-td>
          <q-td>{{ props.row.fullname }}</q-td>
          <q-td>{{ props.row.cdcv }}</q-td>
          <q-td>{{ props.row.phongban }}</q-td>
          <q-td width="175">
            <q-item clickable flat tag="a" class="col-link"
              :to="`/estimate/${props.row.id}/CURRENT`">
              <q-item-section>
                <q-item-label>
                  <span v-if="props.row.danhgia === 'HD'">
                    Hội đồng đánh giá
                  </span>
                  <span v-if="props.row.danhgia === 'QL'">
                    Quản lý đánh giá
                  </span>
                  <span v-if="props.row.danhgia === ''">
                    Đánh giá
                  </span>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-td>
          <q-td width="50">
            <a href="#" v-if="props.row.danhgia === 'QL'"
              @click="deleteEstimation(props.row.id, props.row.fullname)">
              <i class="fas fa-trash fa-2x"></i>
            </a>
          </q-td>
        </q-tr>
      </q-table>
    </div>
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="fas fa-trash" color="primary" text-color="white" />
          <span class="q-ml-sm">Bạn muốn xóa kết quả đánh giá của {{ ofName }}?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" @click="confirm = false" />
          <q-btn flat label="OK" color="primary" @click="deleteEstimationOfName" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  name: 'NhanvienCuaQuanly',
  data() {
    return {
      confirm: false,
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
      let url = `${this.$webapiPath}/competency/nhanvien-quanly`;
      url += `?managerID=${this.$store.state.competency.userID}`;
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
    },
    deleteEstimation(employeeID, employeeName) {
      this.confirm = true;
      this.ofID = employeeID;
      this.ofName = employeeName;
    },
    async deleteEstimationOfName() {
      try {
        // Xóa đánh giá
        const url = `${this.$webapiPath}/competency/del/estimation?employeeID=${this.ofID}`;
        this.openModal = true;

        await this.$axios.delete(url);
        this.data.forEach((item) => {
          if (item.id === this.ofID) {
            item.danhgia = '';
          }
        });
        this.openModal = false;
        this.confirm = false;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style>
</style>
