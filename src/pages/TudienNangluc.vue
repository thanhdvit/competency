<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        :grid="$q.screen.xs"
        title="TỪ ĐIỂN NĂNG LỰC"
        :data="data"
        :columns="columns"
        row-key="ma"
        :filter="filter"
        :pagination.sync="pagination"
        separator="cell"
      >
        <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <!-- HEADER -->
        <q-tr slot="header" class="table-header">
          <q-td v-for="col in columns" :key="col.name">
            {{ col.label }}
          </q-td>
        </q-tr>

        <q-tr slot="body" slot-scope="props" :style="styleRow(props.row)" :props="props">
          <q-td width="45">
            {{ props.row.stt}}
          </q-td>
          <q-td width="90">
            {{ props.row.ma}}
          </q-td>
          <!-- NĂNG LỰC CẤP 1 -->
          <q-td v-if="props.row.ma.length === 1" class="cursor-pointer">
            {{ props.row.nl}} <span v-if="props.row.ma === 'D'">{{ phongChuyenmon }}</span>
            <q-popup-edit v-model="props.row.nl" buttons
              label-set="OK"
              @save="onUpdateNanglucC1(props.row)">
              <span>
                {{ `Năng lực: &#60;${props.row.nl}>` }}
              </span>
              <q-input rounded outlined v-model="props.row.nl" style="margin-top: 10px"></q-input>
            </q-popup-edit>
          </q-td>
          <!-- NĂNG LỰC CẤP 2 -->
          <q-td v-if="props.row.ma.length > 1">
            <span class="cursor-pointer"
              @click="onShowUpdateNangluc(props.row)">
              {{props.row.nl}}
            </span>
          </q-td>
        </q-tr>
      </q-table>
      <div class="row">
        <div class="col">
          <q-select
            filled
            label="Công ty"
            v-model="selectedLegal"
            use-input
            input-debounce="0"
            :options="dmCongty"
            @input="onSelectedLegal"
          >
          </q-select>
        </div>
        <div class="col" style="margin-left: 5px;">
          <q-select
            filled
            label="Bộ phận công tác"
            v-model="selectedDepartment"
            use-input
            input-debounce="0"
            :options="optPhongban"
            @filter="filterPhongban"
          >
          </q-select>
        </div>
        <div class="col">
          <q-btn color="secondary" glossy icon="search"
            style="margin-left: 5px; height: 54px" @click="viewNanglucChuyenmon" />
        </div>
      </div>
    </div>
    <q-dialog v-model="beginModify">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="text-weight-bold" style="font-size: 20px"
          v-if="dataRow.ma">
          {{ dmNanglucCap1[dataRow.ma[0]] }}
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-2">Mã</div>
            <div class="col-10 text-weight-bold">
              <span class="text-weight-bold">
                {{ dataRow.ma }}
              </span>
            </div>
          </div>
          <div class="row">
            <div class="col-2 text-weight-bold">Năng lực</div>
            <div class="col-10">
              <q-input rounded outlined v-model="dataRow.nl" style="margin-top: 10px"/>
            </div>
          </div>
          <div class="row">
            <div class="col-2 text-weight-bold">Định nghĩa</div>
            <div class="col-10">
              <q-input type="textarea" style="height: 70px;"
                v-model="dataRow.attr.DN" @keyup.enter.stop/>
            </div>
          </div>
          <div class="row">
            <div class="col-2 text-weight-bold">Tối thiểu</div>
            <div class="col-10">
              <q-input rounded outlined v-model="dataRow.attr.L1" style="margin-top: 10px"/>
            </div>
          </div>
          <div class="row">
            <div class="col-2 text-weight-bold">Cơ bản</div>
            <div class="col-10">
              <q-input rounded outlined v-model="dataRow.attr.L2" style="margin-top: 10px"/>
            </div>
          </div>
          <div class="row">
            <div class="col-2 text-weight-bold">Đạt yêu cầu</div>
            <div class="col-10">
              <q-input rounded outlined v-model="dataRow.attr.L3" style="margin-top: 10px"/>
            </div>
          </div>
          <div class="row">
            <div class="col-2 text-weight-bold">Thành thạo</div>
            <div class="col-10">
              <q-input rounded outlined v-model="dataRow.attr.L4" style="margin-top: 10px"/>
            </div>
          </div>
          <div class="row">
            <div class="col-2 text-weight-bold">Xuất sắc</div>
            <div class="col-10">
              <q-input rounded outlined v-model="dataRow.attr.L5" style="margin-top: 10px"/>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="around">
          <q-btn flat class="bg-red" @click="onCencelUpdateNanglucC2()">Cancel</q-btn>
          <q-btn flat class="bg-positive" @click="onUpdateNanglucC2()">Ok</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  name: 'TudienNangluc',
  data() {
    const columns = [];
    columns.push({
      name: 'stt', align: 'center', label: 'STT', field: 'stt', style: 'width: 50px',
    });
    columns.push({
      name: 'ma', label: 'MÃ', field: 'ma', align: 'left', style: 'width: 100px',
    });
    columns.push({
      name: 'nl', label: 'NĂNG LỰC', field: 'nl', align: 'left',
    });

    return {
      beginModify: false,
      selectedDepartment: null,
      selectedLegal: null,
      dmCongty: [],
      optPhongban: [],
      dmPhongban: [],
      dmNanglucCap1: {},
      phongChuyenmon: '',
      filter: '',
      columns,
      data: [],
      currentDataRow: {},
      dataRow: {
        attr: {},
      },
      pagination: {
        rowsPerPage: 7,
      },
    };
  },
  async created() {
    try {
      // Danh sách công ty
      const response = await this.$axios.get(`${this.$webapiPath}/hr/legals`);
      response.data.myData.forEach((item) => {
        this.dmCongty.push({ label: item.legalName, value: item.legalID });
      });
    } catch (err) {
      console.log(err);
    }

    this.$axios.get(`${this.$webapiPath}/competency/list?attribute=yes`)
      .then((response) => {
        let rowIndex = 0;
        response.data.myData.forEach((item) => {
          rowIndex = (item.competencyCode.length === 1) ? 0 : rowIndex + 1;
          this.data.push({
            stt: (rowIndex === 0) ? '' : rowIndex,
            id: `${item.competencyID}`,
            ma: `${item.competencyCode}`,
            nl: `${item.competency}`,
            attr: JSON.parse(item.attribute),
          });
          if (item.competencyCode.length === 1) {
            this.dmNanglucCap1[item.competencyCode] = item.competency;
          }
        });
      })
      .catch((e) => {
        console.log(e);
      });
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
    styleRow: (row) => {
      const bgColor = (row.ma.length === 1) ? 'background-color: #05f7d3; font-weight: bold' : '';
      return bgColor;
    },
    onShowUpdateNangluc(row) {
      this.beginModify = true;
      this.dataRow = row;
      this.currentDataRow = JSON.stringify(row);
    },
    onCencelUpdateNanglucC2() {
      const row = JSON.parse(this.currentDataRow);
      console.log(row);
      console.log(this.dataRow);
      this.dataRow.nl = row.nl;
      this.dataRow.attr = row.attr;
      this.beginModify = false;
    },
    async onUpdateNanglucC1(row) {
      const bodyFormData = new FormData();
      bodyFormData.set('competencyID', row.id);
      bodyFormData.set('competency', row.nl);

      await this.$axios.put(`${this.$webapiPath}/competency/update/cap1`, bodyFormData)
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
      this.beginModify = false;
    },
    async onUpdateNanglucC2() {
      const bodyFormData = new FormData();
      bodyFormData.set('competencyID', this.dataRow.id);
      bodyFormData.set('competency', this.dataRow.nl);
      bodyFormData.set('attribute', JSON.stringify(this.dataRow.attr));

      await this.$axios.put(`${this.$webapiPath}/competency/update/cap2`, bodyFormData)
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
      this.beginModify = false;
    },
    async onSelectedLegal() {
      try {
        const legalCode = this.selectedLegal.label.substring(0, 3);

        // Danh sách phòng ban, chi nhánh, phân xưởng, ...
        const response = await this.$axios.get(`${this.$webapiPath}/hr/departments?legalCode=${legalCode}`);
        this.dmPhongban = [];
        response.data.myData.forEach((item) => {
          this.dmPhongban.push({ label: item.orgName, value: item.orgID });
        });
      } catch (err) {
        console.log(err);
      }
    },
    async viewNanglucChuyenmon() {
      const orgID = this.selectedDepartment.value;
      const orgName = this.selectedDepartment.label;

      this.phongChuyenmon = `(${orgName})`;

      // Xóa doanh mục chuyên môn trước đó
      let beginPosition;
      let deleteItemCount = 0;
      this.data.forEach((item, idx) => {
        if (item.ma === 'D') {
          beginPosition = idx;
        }
        if (item.ma.length > 1 && item.ma[0] === 'D') {
          deleteItemCount += 1;
        }
      });
      if (deleteItemCount > 0) {
        this.data.splice(beginPosition + 1, deleteItemCount);
      }

      try {
        // Từ điển năng lực - chuyên môn
        const response = await this.$axios.get(`${this.$webapiPath}/competency/list/chuyenmon?orgID=${orgID}&attribute=yes`);
        let rowIndex = 1;
        if (response.data.myData) {
          response.data.myData.forEach((item) => {
            this.data.push({
              stt: rowIndex,
              id: `${item.competencyID}`,
              ma: `${item.competencyCode}`,
              nl: `${item.competency}`,
              attr: JSON.parse(item.attribute),
            });
            rowIndex += 1;
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style scoped>
</style>
