<template>
  <q-page padding>
  <q-dialog v-model="openModal" persistent position="top"></q-dialog>
  <div class="q-pa-md">
    <div class="text-center text-weight-bold" style="font-size: 20px; padding-bottom: 20px">
      PHÂN QUYỀN HỘI ĐỒNG ĐÁNH GIÁ
    </div>
    <div class="row">
      <div class="col">
        <!-- Danh mục công ty -->
        <q-select
          outlined
          label="Công ty"
          v-model="selectedLegal"
          use-input
          input-debounce="0"
          :options="dmCongty"
          @input="onSelectedLegal"
        >
        </q-select>
        <!-- Danh mục hòng ban -->
        <q-select
          outlined
          label="Bộ phận công tác"
          v-model="selectedDepartment"
          use-input
          input-debounce="0"
          :options="optPhongban"
          @filter="filterPhongban"
          @input="onSelectedDepartment"
        >
          <q-spinner color="primary" size="3em" v-if="congtyLoading"/>
        </q-select>
        <!-- Danh sách nhân viên trong phòng-->
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label overline class="text-weight-bold">DANH SÁCH NHÂN VIÊN</q-item-label>
            </q-item-section>
            <q-item-section side top>
              <q-item-label caption>
                <q-spinner color="primary" size="3em" v-if="nhanvienLoading"/>
              </q-item-label>
            </q-item-section>
          </q-item>
          <div  style="height:400px" class="list scroll">
            <q-item v-for="emp in employeeInDepartment" :key="emp.employeeID">
              <q-item-section avatar>
                <q-avatar>
                  <img :src="`https://dtg.com.vn/apps/upload/images/employee/${emp.employeeCode}.jpg`">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ emp.employeeCode }} - {{ emp.fullname }}</q-item-label>
                <q-item-label caption>{{ emp.jobTitle }}</q-item-label>
              </q-item-section>
              <q-item-section side v-if="thongtinHoidong.employeeCode">
                <q-btn flat icon-right="fas fa-arrow-right"
                  @click="moveEmployee(`${emp.employeeID}`)"/>
              </q-item-section>
            </q-item>
          </div>
        </q-list>
      </div>

      <!-- PHẦN HỘI ĐỒNG -->
      <div class="col" style="margin-left: 5px;">
        <!-- THÔNG TIN HỘI ĐỒNG -->
        <q-input color="teal" outlined v-model="manvHoidong" label="Mã hội đồng">
          <q-spinner color="primary" size="3em" v-if="hoidongLoading"/>
          <template v-slot:append>
            <q-btn flat round icon="search" @click="onLoadHoidong"></q-btn>
          </template>
        </q-input>

        <q-item v-if="thongtinHoidong.employeeCode">
          <q-item-section>
            <q-item-label>
              <div class="text-weight-bold" style="font-size: 16px">HỘI ĐỒNG</div>
              {{ thongtinHoidong.employeeCode }} - {{ thongtinHoidong.fullname }}
            </q-item-label>
            <q-item-label caption>
              {{ thongtinHoidong.jobTitle }} - {{ thongtinHoidong.phongban }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <!-- DANH SÁCH NHÂN VIÊN -->
        <q-table
          :grid="$q.screen.xs"
          :data="nhanvienOfHoidong"
          :columns="columns"
          row-key="id"
          :filter="filter"
          separator="cell"
          v-if="thongtinHoidong.employeeCode"
        >
          <!-- SEARCH -->
          <template v-slot:top-right>
            <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:top-left>
            <span class="text-weight-bold">
              Danh sách nhân viên hội đồng cần đánh giá
            </span>
          </template>

          <!-- HEADER -->
          <q-tr slot="header" class="table-header">
            <td width="60">MÃ NV</td>
            <td>HỌ TÊN</td>
            <td>VỊ TRÍ CÔNG VIỆC</td>
            <td>PHÒNG BAN</td>
            <td width="30"></td>
          </q-tr>

          <!-- BODY -->
          <q-tr slot="body" slot-scope="props" :props="props">
            <td>{{ props.row.employeeCode }}</td>
            <td>{{ props.row.fullname }}</td>
            <td>{{ props.row.jobTitle }}</td>
            <td>{{ props.row.phongban }}</td>
            <td>
              <q-btn flat round icon="cancel" size="sm" @click="removeEmployee(props.row)" />
            </td>
          </q-tr>
        </q-table>

        <!-- SAVE -->
        <div class="text-right"
          style="margin-top: 5px"
          v-if="thongtinHoidong.employeeCode">
          <q-btn icon="save" color="teal" label="Save" @click="onSaveHoidong"></q-btn>
        </div>
      </div>
    </div>
  </div>
  </q-page>
</template>

<script>
export default {
  name: 'PhanquyenHoidong',
  data() {
    return {
      openModal: false,
      congtyLoading: false,
      nhanvienLoading: false,
      hoidongLoading: false,
      manvHoidong: undefined,
      selectedLegal: null,
      selectedDepartment: null,
      employeeInDepartment: [],
      dmCongty: [],
      optPhongban: [],
      dmPhongban: [],
      nhanvienOfHoidong: [],
      thongtinHoidong: {},
      filter: '',
      columns: [],
    };
  },
  async created() {
    this.columns = [];
    this.columns.push({ name: 'manv', label: 'MÃ NHÂN VIÊN', field: 'employeeCode' });
    this.columns.push({ name: 'fullname', label: 'TÊN', field: 'fullname' });
    this.columns.push({ name: 'cdcv', label: 'VỊ TRÍ CHỨC DANH', field: 'jobTitle' });
    this.columns.push({ name: 'phongban', label: 'PHÒNG BAN', field: 'phongban' });

    try {
      // Danh sách công ty
      const response = await this.$axios.get(`${this.$webapiPath}/hr/legals`);
      response.data.myData.forEach((item) => {
        this.dmCongty.push({ label: item.legalName, value: item.legalID });
      });
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    filterPhongban(val, update) {
      if (val === '') {
        update(() => {
          this.optPhongban = this.dmPhongban;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.optPhongban = this.dmPhongban.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
      });
    },
    async onSelectedLegal() {
      try {
        this.congtyLoading = true;
        const legalCode = this.selectedLegal.label.substring(0, 3);
        this.employeeInDepartment = [];

        // Danh sách phòng ban, chi nhánh, phân xưởng, ...
        const response = await this.$axios.get(`${this.$webapiPath}/hr/departments?legalCode=${legalCode}`);
        this.dmPhongban = [];
        response.data.myData.forEach((item) => {
          this.dmPhongban.push({ label: item.orgName, value: item.orgID });
        });
        this.congtyLoading = false;
      } catch (err) {
        console.log(err);
      }
    },
    async onSelectedDepartment(val) {
      try {
        const orgID = val.value;

        this.nhanvienLoading = true;
        // Danh sách nhân viên trong phòng
        const response = await this.$axios.get(`${this.$webapiPath}/hr/org/employees?orgID=${orgID}`);
        this.employeeInDepartment = [];
        response.data.myData.forEach((item) => {
          this.employeeInDepartment.push(item);
        });
        this.nhanvienLoading = false;
      } catch (err) {
        console.log(err);
      }
    },
    moveEmployee(employeeID) {
      const empOfHoidongCount = this.nhanvienOfHoidong.length;
      for (let pos = 0; pos < empOfHoidongCount; pos += 1) {
        if (+this.nhanvienOfHoidong[pos].employeeID === +employeeID) {
          this.$q.notify({
            message: 'Nhân viên này đã tồn tại',
            position: 'top-right',
            color: 'blue',
            textColor: 'white',
            timeout: 1500,
            icon: 'info',
          });
          return;
        }
      }

      const empCount = this.employeeInDepartment.length;
      for (let pos = 0; pos < empCount; pos += 1) {
        if (+this.employeeInDepartment[pos].employeeID === +employeeID) {
          const newEmployee = this.employeeInDepartment[pos];
          newEmployee.phongban = this.selectedDepartment.label;
          this.nhanvienOfHoidong.push(newEmployee);
          this.employeeInDepartment.splice(pos, 1);
          break;
        }
      }
    },
    removeEmployee(emp) {
      const index = '__index';
      this.nhanvienOfHoidong.splice(emp[index], 1);
    },
    async onLoadHoidong() {
      if (!this.manvHoidong) { return; }

      try {
        this.hoidongLoading = true;
        this.thongtinHoidong = {};
        this.nhanvienOfHoidong = [];

        // Loading hội đồng
        let response = await this.$axios.get(`${this.$webapiPath}/hr/employee?employeeCode=${this.manvHoidong}`);
        if (response.data.myData) {
          response.data.myData.forEach((item) => {
            this.thongtinHoidong = item;
          });
        }

        // Loading danh sách nhân viên hội đồng
        response = await this.$axios.get(`${this.$webapiPath}/competency/role/hoidong/get?userID=${this.thongtinHoidong.employeeID}`);
        if (response.data.myData) {
          response.data.myData.forEach((item) => {
            this.nhanvienOfHoidong = JSON.parse(item.dsNhanvien2);
          });
        }
        this.hoidongLoading = false;
      } catch (err) {
        console.log(err);
      }
    },
    async onSaveHoidong() {
      this.openModal = true;

      let nhanvienCandanhgia = ',';
      this.nhanvienOfHoidong.forEach((item) => {
        nhanvienCandanhgia += `${item.employeeID},`;
      });

      const bodyFormData = new FormData();
      bodyFormData.set('userID', this.thongtinHoidong.employeeID);
      bodyFormData.set('dsNhanvien1', nhanvienCandanhgia);
      bodyFormData.set('dsNhanvien2', JSON.stringify(this.nhanvienOfHoidong));

      await this.$axios.post(`${this.$webapiPath}/competency/role/hoidong`, bodyFormData)
        .then(() => {
          this.openModal = false;
          this.$q.notify({
            message: 'Dữ liệu đã được lưu',
            position: 'top-right',
            color: 'blue',
            textColor: 'white',
            timeout: 1500,
            icon: 'info',
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style>
</style>
