<template>
  <q-page padding>
    <q-dialog v-model="openModal" persistent position="top">
    </q-dialog>
    <div class="q-pa-md">
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
            style="margin-left: 5px; height: 54px" @click="viewKhungnangLuc" />
        </div>
      </div>

      <q-spinner-hourglass color="deep-purple" size="6em" v-show="loading" />
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
      >
        <template v-slot:top-left>
          <span class="table-header">XÂY DỰNG KHUNG NĂNG LỰC</span>
          <div class="org-name">{{ orgName }}</div>
        </template>

        <!-- Search -->
        <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <!-- Header -->
        <q-tr slot="header" class="bg-grey-7 text-white">
          <q-td v-for="col in columns" :key="col.name">
            <span v-if="col.field !== 'cdcv'">{{ col.label }}</span>
            <a target="_blank"
:href="`/#/standard/${col.jobID}/${orgID}/${encodeURI(col.label)}/${encodeURI(orgName)}`"
              v-if="col.field === 'cdcv'" class="job-title">
              {{ col.label }}
            </a>
          </q-td>
        </q-tr>

        <q-tr slot="body" slot-scope="props" :class="rowClass(props.row)" :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <slot :name="col.name" scope="props" :column="col" :row="props.row">

              <span style="font-size:15px">{{ col.value }}</span>

              <!-- Danh sách cột chức năng công việc thì có checkbox -->
              <span v-if="col.field === 'cdcv'">
                <!-- Năng lực cấp 1 (hổ trợ, chung, ...) -->
                <span v-if="props.row.ma.length === 1" class="weight">
                  {{
                    framework[`${col.jobID}-${orgID}`][`${props.row.ma}`]
                  }} %
                  <q-popup-edit buttons
                    v-model="framework[`${col.jobID}-${orgID}`][props.row.ma]"
                    @save="(val, init) => {
                      on_save_trongso(val, init, framework, col.jobID, props.row.ma)
                    }"
                    @cancel="() => {loading = true; loading = false;}"
                    label-set="Save"
                    label-cancel="Close">
                    <q-input dense autofocus
                      v-model="framework[`${col.jobID}-${orgID}`][props.row.ma]"
                      @input="() => {loading = true; loading = false;}"
                      :hint="col.label" />
                  </q-popup-edit>
                </span>

                <!-- Năng lực con -->
                <q-checkbox
                  :color="framework[`${col.jobID}-${orgID}`][props.row.ma] ? 'red' : 'grey-5'"
                  v-if="props.row.ma.length !== 1"
                  @input="on_save_nangluc(framework, col.jobID, props.row.ma)"
                  v-model="framework[`${col.jobID}-${orgID}`][props.row.ma]" />
                <q-spinner color="blue" size="1em" :thickness="10"
                  v-if="props.row.ma.length !== 1"
                  v-show="refreshCheckboxUI[`${col.jobID}-${props.row.ma}`]"
                />
              </span>

            </slot>
          </q-td>
        </q-tr>

      </q-table>
    </div>
  </q-page>
</template>

<script>
// import Vue from 'vue';
import axios from 'axios';

export default {
  name: 'KhungNangluc',
  data() {
    const columns = [];
    return {
      openModal: false,
      refreshCheckboxUI: {},
      loading: false,
      selectedDepartment: null,
      selectedLegal: null,
      dmCongty: [],
      optPhongban: [],
      dmPhongban: [],
      filter: '',
      columns,
      orgName: '',
      orgID: -1,
      data: [],
      framework: {},
      pagination: {
        page: 1,
        rowsPerPage: 0,
      },
    };
  },
  async created() {
    try {
      // Danh sách công ty
      const response = await axios.get(`${this.$webapiPath}/hr/legals`);
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
    rowClass: (row) => {
      const className = (row.ma.length === 1) ? 'row-lv1' : '';
      return className;
    },
    on_save_nangluc: (framework, jobID, competencyCode) => {
      framework.$this.save(framework, jobID, competencyCode);
    },
    on_save_trongso: (value, initialValue, framework, jobID, competencyCode) => {
      const refressUI = () => {
        framework.$this.openModal = true;
        framework.$this.refreshCheckboxUI[`${jobID}-${competencyCode}`] = true;
        framework.$this.openModal = false;
        framework.$this.refreshCheckboxUI[`${jobID}-${competencyCode}`] = false;
      };

      // Kiểm tra trọng số phải <= 100%
      const trongso = +value;
      if (!Number.isInteger(trongso)) {
        framework[`${jobID}-${framework.$this.orgID}`][competencyCode] = initialValue;
        console.log('Trọng số phải là số.');
        refressUI();
        return;
      }
      if (trongso >= 100) {
        console.log('Trọng số phải nhỏ hơn 100');
        framework[`${jobID}-${framework.$this.orgID}`][competencyCode] = initialValue;
        refressUI();
        return;
      }
      const trongsoA = +framework[`${jobID}-${framework.$this.orgID}`].A;
      const trongsoB = +framework[`${jobID}-${framework.$this.orgID}`].B;
      const trongsoC = +framework[`${jobID}-${framework.$this.orgID}`].C;
      const trongsoD = +framework[`${jobID}-${framework.$this.orgID}`].D;
      if (Number.isInteger(trongsoA) && Number.isInteger(trongsoB)
        && Number.isInteger(trongsoC) && Number.isInteger(trongsoD)) {
        if ((trongsoA + trongsoB + trongsoC + trongsoD) > 100) {
          framework[`${jobID}-${framework.$this.orgID}`][competencyCode] = initialValue;
          console.log('Trọng số đã vượt 100%');
          framework.$this.$q.notify({
            message: 'Trọng số đã vượt 100%',
            position: 'top-right',
            color: 'red',
            textColor: 'black',
            timeout: 1500,
            icon: 'warning',
          });
          refressUI();
          return;
        }
      }

      framework.$this.save(framework, jobID, competencyCode);
    },
    async save(framework, jobID, competencyCode) {
      const bodyFormData = new FormData();

      framework.$this.openModal = true;
      framework.$this.refreshCheckboxUI[`${jobID}-${competencyCode}`] = true;

      bodyFormData.set('jobID', jobID);
      bodyFormData.set('orgID', framework.$this.orgID);
      bodyFormData.set('framework', JSON.stringify(framework[`${jobID}-${framework.$this.orgID}`]));

      await axios.post(`${framework.$this.$webapiPath}/competency/framework/update`, bodyFormData)
        .then((response) => {
          if (response.data.status === 200) {
            framework.$this.refreshCheckboxUI[`${jobID}-${competencyCode}`] = false;
          }
        })
        .catch((error) => {
          console.log(error);
        });

      framework.$this.openModal = false;
    },
    test() {
      // console.log(this.selectedDepartment);
      console.log(this.framework);
    },
    async viewKhungnangLuc() {
      try {
        this.loading = true;
        if (!this.selectedDepartment) {
          return;
        }

        this.orgID = this.selectedDepartment.value;
        this.columns = [];
        this.data = [];
        this.framework = {};
        this.framework.$this = this;

        this.columns.push({
          name: 'stt', align: 'center', label: 'STT', field: 'stt', style: 'width: 50px',
        });
        this.columns.push({
          name: 'ma', label: 'MÃ', field: 'ma', align: 'left', style: 'width: 100px',
        });
        this.columns.push({
          name: 'nl', label: 'NĂNG LỰC', field: 'nl', align: 'left',
        });

        // Danh sách chức danh công việc
        let response = await axios.get(`${this.$webapiPath}/competency/job-title?orgID=${this.orgID}`);
        response.data.myData.forEach((item) => {
          this.columns.push({
            name: `${item.jobID}`,
            align: 'center',
            label: `${item.jobTitle}`,
            field: 'cdcv',
            jobID: `${item.jobID}`,
          });
          this.framework[`${item.jobID}-${this.orgID}`] = {};
        });
        this.orgName = `${response.data.orgName}`;

        // Từ điển năng lực
        response = await axios.get(`${this.$webapiPath}/competency/list`);
        let rowIndex = 0;
        let nangluc;
        response.data.myData.forEach((item) => {
          rowIndex = (item.competencyCode.length === 1) ? 0 : rowIndex + 1;
          nangluc = (item.competencyCode === 'D') ? `${item.competency} (${this.orgName})` : item.competency;
          this.data.push({
            stt: (rowIndex === 0) ? '' : rowIndex,
            id: `${item.competencyID}`,
            ma: `${item.competencyCode}`,
            nl: nangluc,
          });
        });

        // Từ điển năng lực - chuyên môn
        response = await axios.get(`${this.$webapiPath}/competency/list/chuyenmon?orgID=${this.orgID}`);
        rowIndex = 1;
        response.data.myData.forEach((item) => {
          this.data.push({
            stt: rowIndex,
            id: `${item.competencyID}`,
            ma: `${item.competencyCode}`,
            nl: `${item.competency}`,
          });
          rowIndex += 1;
        });

        // Dữ liệu khung năng lực của phòng ban
        response = await axios.get(`${this.$webapiPath}/competency/framework/list?orgID=${this.orgID}`);
        response.data.myData.forEach((item) => {
          Object.keys(item).forEach((key) => {
            const compentencyObj = JSON.parse(item[key]);
            Object.keys(compentencyObj).forEach((key1) => {
              this.framework[key][key1] = compentencyObj[key1];
            });
          });
        });
      } catch (err) {
        this.columns = [];
        this.orgName = this.selectedDepartment.label;
        this.$q.notify({
          message: 'ERROR',
          position: 'top-right',
          color: 'red',
          textColor: 'black',
          timeout: 1000,
          icon: 'warning',
        });
      } finally {
        this.loading = false;
      }
    },
    async onSelectedLegal() {
      try {
        const legalCode = this.selectedLegal.label.substring(0, 3);

        // Danh sách phòng ban, chi nhánh, phân xưởng, ...
        const response = await axios.get(`${this.$webapiPath}/hr/departments?legalCode=${legalCode}`);
        this.dmPhongban = [];
        response.data.myData.forEach((item) => {
          this.dmPhongban.push({ label: item.orgName, value: item.orgID });
        });
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style>
.q-table td, .q-table th {
  white-space: normal !important;
}

.table-header {
  font-weight: bold;
}
.org-name {
  font-size: 1.6em;
  font-weight: bold;
}
.job-title {
  font-size: 1em;
  color: white;
}

.row-lv1 {
  font-weight: bold;
  background-color: #bce4e6;
}

.weight {
  border-bottom: 1px dotted;
  font-style: italic;
  font-weight: bold;
  font-size: 16px;
}

.add-competency {
  font-style: italic;
  text-decoration: none;
  color: #063d94;
}
</style>
