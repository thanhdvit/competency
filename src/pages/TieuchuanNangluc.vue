<template>
  <q-page padding>
    <q-dialog v-model="openModal" persistent position="top">
    </q-dialog>
    <q-table
        :grid="$q.screen.xs"
        class="my-sticky-header-table"
        :data="data"
        :columns="columns"
        row-key="ma"
        :filter="filter"
        :rows-per-page-options="[0]"
        :pagination.sync="pagination"
        separator="cell"
      >

      <template v-slot:top-left>
        <span class="table-top-left">Tiêu chuẩn năng lực</span>
        <div class="job-title">{{ jobName }} - {{ orgName }}</div>
      </template>

      <!-- Header -->
      <q-tr slot="header" style="display: contents">
        <q-tr border="1" class="bg-grey-7 text-white text-center">
          <q-th colspan="1" rowspan="2" width="50">STT</q-th>
          <q-th colspan="1" rowspan="2" width="80">MÃ</q-th>
          <q-th colspan="1" rowspan="2">NĂNG LỰC</q-th>
          <q-th colspan="1" rowspan="2" width="80">TRỌNG SỐ</q-th>
          <q-th colspan="3">MỨC ĐỘ QUAN TRỌNG</q-th>
          <q-th colspan="5">TIÊU CHUẨN</q-th>
          <q-th colspan="1" rowspan="2" width="45">ĐIỂM<br />CHUẨN</q-th>
        </q-tr>
        <q-tr class="bg-grey-7 text-white text-center text-weight-bold">
          <q-th width="50">1</q-th>
          <q-th width="50">2</q-th>
          <q-th width="50">3</q-th>
          <q-th width="50">1</q-th>
          <q-th width="50">2</q-th>
          <q-th width="50">3</q-th>
          <q-th width="50">4</q-th>
          <q-th width="50">5</q-th>
        </q-tr>
      </q-tr>

      <q-tr slot="body" slot-scope="props" :props="props"
        :class="(props.row.ma.length === 1) ? 'row-lv1' : ''">

        <q-td class="text-center text-weight-bold" width="50">{{ props.row.stt }}</q-td>
        <q-td width="80">{{ props.row.ma }}</q-td>
        <q-td>{{ props.row.nangluc }}</q-td>
        <q-td :colspan="(props.row.ma.length === 1) ? 9 : 1" class="text-left" width="80">
          <span v-if="props.row.ma.length === 1">{{ props.row.trongso }}%</span>
        </q-td>

        <!-- MỨC ĐỘ QUAN TRỌNG -->
        <q-td v-if="props.row.ma.length > 1" width="50">
          <q-radio keep-color color="cyan"
            v-model="serverData[`${props.row.ma}-md`]" :val="1"
            @input="save" />
        </q-td>
        <q-td v-if="props.row.ma.length > 1" width="50">
          <q-radio keep-color color="cyan"
            v-model="serverData[`${props.row.ma}-md`]" :val="2"
            @input="save" />
        </q-td>
        <q-td v-if="props.row.ma.length > 1" width="50">
          <q-radio keep-color color="cyan"
            v-model="serverData[`${props.row.ma}-md`]" :val="3"
            @input="save" />
        </q-td>

        <!-- TIÊU CHUẨN -->
        <q-td v-if="props.row.ma.length > 1" width="50">
          <q-radio keep-color color="orange"
            v-model="serverData[`${props.row.ma}-tc`]" :val="1"
            @input="save" />
        </q-td>
        <q-td v-if="props.row.ma.length > 1" width="50">
          <q-radio keep-color color="orange"
            v-model="serverData[`${props.row.ma}-tc`]" :val="2"
            @input="save" />
        </q-td>
        <q-td v-if="props.row.ma.length > 1" width="50">
          <q-radio keep-color color="orange"
            v-model="serverData[`${props.row.ma}-tc`]" :val="3"
            @input="save" />
        </q-td>
        <q-td v-if="props.row.ma.length > 1" width="50">
          <q-radio keep-color color="orange"
            v-model="serverData[`${props.row.ma}-tc`]" :val="4"
            @input="save" />
        </q-td>
        <q-td v-if="props.row.ma.length > 1" width="50">
          <q-radio keep-color color="orange"
            v-model="serverData[`${props.row.ma}-tc`]" :val="5"
            @input="save" />
        </q-td>
        <q-td class="text-center text-weight-bold" width="80">
          <span>
            {{
              (serverData[`${props.row.ma}-md`] * serverData[`${props.row.ma}-tc`] >= 0)
              ? serverData[`${props.row.ma}-md`] * serverData[`${props.row.ma}-tc`]
              : ''
            }}
          </span>
        </q-td>
      </q-tr>

      <!-- FOOTER -->
      <template v-slot:bottom-row>
        <q-tr class="bg-grey-4">
          <q-td colspan="3" style="font-size: 16px">
            Tổng cộng
          </q-td>
          <q-td colspan="10" class="text-weight-bold">
            {{ sumTrongso }}%
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script>
export default {
  name: 'TieuchuanNangluc',
  data() {
    return {
      openModal: false,
      data: [],
      filter: '',
      columns: [],
      orgID: -1,
      orgName: '',
      jobID: -1,
      jobName: '',
      serverData: {},
      sumTrongso: 0,
      pagination: {
        page: 1,
        rowsPerPage: 0,
      },
    };
  },
  async created() {
    this.jobID = this.$route.params.job_id;
    this.orgID = this.$route.params.org_id;

    this.openModal = true;
    this.orgName = this.$route.params.org_name;
    this.jobName = this.$route.params.job_name;

    try {
      // Từ điển năng lực
      let response = await this.$axios.get(`${this.$webapiPath}/competency/list`);
      const tudienNangluc = {};
      response.data.myData.forEach((item) => {
        tudienNangluc[`${item.competencyCode}`] = `${item.competency}`;
      });

      // Từ điển năng lực - chuyên môn
      response = await this.$axios.get(`${this.$webapiPath}/competency/list/chuyenmon?orgID=${this.orgID}`);
      const tudienNanglucChuyenmon = [];
      response.data.myData.forEach((item) => {
        tudienNanglucChuyenmon[`${item.competencyCode}`] = `${item.competency}`;
      });

      // Lấy dữ liệu tiêu chuẩn năng lực
      response = await this.$axios.get(`${this.$webapiPath}/competency/framework/tieuchuan-nangluc?orgID=${this.orgID}&jobID=${this.jobID}`);
      this.serverData = JSON.parse(response.data.tieuchuanNangluc);

      // Dữ liệu khung năng lực của phòng ban
      let trongso;
      response = await this.$axios.get(`${this.$webapiPath}/competency/framework/list?orgID=${this.orgID}&jobID=${this.jobID}`);
      response.data.myData.forEach((item) => {
        Object.keys(item).forEach((key) => {
          const compentencyObj = JSON.parse(item[key]);
          Object.keys(compentencyObj).forEach((key1) => {
            trongso = +compentencyObj[key1];
            if (key1.length === 1 || (key1.length > 1 && compentencyObj[key1] === true)) {
              this.data.push({
                ma: key1,
                nangluc: (tudienNangluc[key1]) ? tudienNangluc[key1] : tudienNanglucChuyenmon[key1],
                trongso,
              });
            }
            if (Number.isInteger(trongso) && key1.length === 1) {
              this.serverData[key1] = trongso;
              this.sumTrongso += trongso;
            }
          });
        });
      });
      // Sắp xếp theo ma
      this.data.sort((a, b) => {
        if (a.ma === b.ma) {
          return 0;
        }
        return (a.ma > b.ma) ? 1 : -1;
      });
      // Đánh só thứ tự
      let rowIndex = 0;
      this.data.forEach((item) => {
        rowIndex = (item.ma.length === 1) ? 0 : rowIndex + 1;
        item.stt = (rowIndex === 0) ? '' : rowIndex;
      });

      this.openModal = false;
    } catch (err) {
      console.log(err);
      this.$q.notify({
        message: 'ERROR',
        position: 'top-right',
        color: 'red',
        textColor: 'black',
        timeout: 1000,
        icon: 'warning',
      });
    }
  },
  methods: {
    save() {
      const bodyFormData = new FormData();

      this.openModal = true;

      bodyFormData.set('jobID', this.jobID);
      bodyFormData.set('orgID', this.orgID);
      bodyFormData.set('tieuchuanNangluc', JSON.stringify(this.serverData));

      this.$axios.post(`${this.$webapiPath}/competency/framework/tieuchuan-nangluc/update`, bodyFormData)
        .then((response) => {
          if (response.data.status === 200) {
            this.openModal = false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scope>
.q-table td, .q-table th {
  white-space: normal !important;
}

.table-header {
  font-size: 1.5em;
  font-weight: bold;
}
.job-title {
  font-size: 1.3em;
}
.row-lv1 {
  font-weight: bold;
  background-color: #bce4e6;
}
</style>

<style lang="stylus">
.my-sticky-header-table
  /* max height is important */
  .q-table__middle
    max-height 800px

  .q-table__body,
  thead tr:nth-child(1) td
    position sticky
    top 0
    opacity 1
    z-index 1
</style>
