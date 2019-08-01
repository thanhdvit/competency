<template>
  <q-page padding>
    <q-dialog v-model="openModal" persistent position="top">
    </q-dialog>

    <q-table
        :grid="$q.screen.xs"
        class="my-sticky-header-table"
        :data="data"
        :columns="columns"
        row-key="key"
        :filter="filter"
        :rows-per-page-options="[0]"
        :pagination.sync="pagination"
        separator="cell"
        hide-bottom
      >

      <template v-slot:top-left>
        <span class="table-top-left">Tiêu chuẩn năng lực</span>
        <div class="job-title">{{ estimateName }} - {{ estimateJobTitle }}</div>
      </template>

       <!-- HEADER -->
      <q-tr slot="header" style="display: contents">
        <q-tr border="1" class="table-header">
          <q-th width="50">STT</q-th>
          <q-th width="80">MÃ</q-th>
          <q-th >NĂNG LỰC</q-th>
          <q-th width="45">TRỌNG<br/>SỐ</q-th>
          <q-th width="45">MỨC ĐỘ</q-th>
          <q-th width="45">TIÊU CHUẨN</q-th>
          <q-th width="45">ĐIỂM CHUẨN</q-th>
          <q-th width="100">QUẢN LÝ ĐÁNH GIÁ</q-th>
          <q-th width="100">HỘI ĐỒNG ĐÁNH GIÁ</q-th>
          <q-th width="45">ĐIỂM ĐẠT</q-th>
          <q-th width="45">KẾT QUẢ</q-th>
        </q-tr>
      </q-tr>

      <!-- BODY -->
      <q-tr slot="body" slot-scope="props" :props="props"
        :class="(props.row.key.length === 1) ? 'row-lv1' : ''">

        <q-td class="text-center text-weight-bold">
          {{ props.row.data.stt }}
        </q-td>
        <q-td>{{ props.row.key }}</q-td>
        <q-td>{{ props.row.data.nangluc }}</q-td>
        <q-td class="text-center">
          <span v-if="props.row.key.length === 1">
            {{ props.row.data.trongso }}%
          </span>
        </q-td>
        <q-td class="text-center">
          <span v-if="props.row.key.length > 1">
            {{ props.row.data.md }}
          </span>
        </q-td>
        <q-td class="text-center">
          <span v-if="props.row.key.length > 1">
            {{ props.row.data.tc }}
          </span>
        </q-td>
        <q-td class="text-center">
          <span v-if="props.row.key.length === 1">
            {{ sumDiemchuan[props.row.key] }}
          </span>
          <span v-if="props.row.key.length > 1">
            {{ props.row.data.md * props.row.data.tc }}
          </span>
        </q-td>

        <!-- Quản lý đánh giá -->
        <q-td class="text-center">
          <span v-if="props.row.key.length === 1">
            {{ diemQuanly[props.row.key] }}
          </span>
          <span v-if="props.row.key.length > 1"
            :class="(capDanhgia === 'QL' && isQuanly === true && estimatePeriod === 'CURRENT')
            ? 'cursor-pointer'
            : ''"
            style="color: blue">
            {{ props.row.data.qldg }}
            <q-popup-edit v-model="props.row.data.qldg" buttons
              v-if="capDanhgia === 'QL' && isQuanly === true && estimatePeriod === 'CURRENT'"
              label-set="OK"
              @save="updateDiemQuanly">
              <div class="text-weight-bold">
                {{ props.row.data.nangluc }}
              </div>
              <q-radio :val="1" :label="`1) ${props.row.data.question.L1}`"
                v-model="props.row.data.qldg" /><br/>
              <q-radio :val="2" :label="`2) ${props.row.data.question.L2}`"
                v-model="props.row.data.qldg" /><br/>
              <q-radio :val="3" :label="`3) ${props.row.data.question.L3}`"
                v-model="props.row.data.qldg" /><br/>
              <q-radio :val="4" :label="`4) ${props.row.data.question.L4}`"
                v-model="props.row.data.qldg" /><br/>
              <q-radio :val="5" :label="`5) ${props.row.data.question.L5}`"
                v-model="props.row.data.qldg" /><br/>
            </q-popup-edit>
          </span>
        </q-td>

        <!-- Hội đồng đánh giá -->
        <q-td class="text-center">
          <span v-if="props.row.key.length === 1">
            {{ diemHoidong[props.row.key] }}
          </span>
          <span v-if="props.row.key.length > 1"
            :class="(capDanhgia === 'HD' && isHoidong === true && estimatePeriod === 'CURRENT')
              ? 'cursor-pointer'
              : ''"
            style="color: orange">
            {{ props.row.data.hddg }}
            <q-popup-edit v-model="props.row.data.hddg" buttons
              v-if="capDanhgia === 'HD' && isHoidong === true && estimatePeriod === 'CURRENT'"
              label-set="OK"
              @save="updateDiemHoidong">
              <div class="text-weight-bold">
                {{ props.row.data.nangluc }}
              </div>
              <q-radio :val="1" :label="`1) ${props.row.data.question.L1}`"
                v-model="props.row.data.hddg" /><br/>
              <q-radio :val="2" :label="`2) ${props.row.data.question.L2}`"
                v-model="props.row.data.hddg" /><br/>
              <q-radio :val="3" :label="`3) ${props.row.data.question.L3}`"
                v-model="props.row.data.hddg" /><br/>
              <q-radio :val="4" :label="`4) ${props.row.data.question.L4}`"
                v-model="props.row.data.hddg" /><br/>
              <q-radio :val="5" :label="`5) ${props.row.data.question.L5}`"
                v-model="props.row.data.hddg" /><br/>
            </q-popup-edit>
          </span>
        </q-td>
        <q-td class="text-center">
          <span v-if="props.row.key.length === 1 && diemdat[props.row.key] !== 0">
            {{ diemdat[props.row.key] }}
          </span>
          <span v-if="props.row.key.length > 1 && props.row.data.diemdat > 0">
            {{ props.row.data.diemdat }}
          </span>
        </q-td>
        <q-td class="text-center">
          <span v-if="props.row.key.length === 1 && ketqua[props.row.key] !== 0">
            {{ ketqua[props.row.key] }}%
          </span>
          <span v-if="props.row.key.length > 1 && props.row.data.ketqua > 0">
            {{ props.row.data.ketqua }}%
          </span>
        </q-td>
      </q-tr>

      <!-- FOOTER -->
      <template v-slot:bottom-row>
        <q-tr class="bg-grey-4">
          <q-td colspan="3" style="font-size: 16px">
            Tổng cộng
          </q-td>
          <q-td class="text-weight-bold">
            {{ sumTrongso.A + sumTrongso.B + sumTrongso.C + sumTrongso.D }}%
          </q-td>
          <q-td colspan="3"></q-td>
          <q-td class="text-center">
            <span v-if="ketquaDanhgiaQL !== 0">
              {{ ketquaDanhgiaQL }} %
            </span>
          </q-td>
          <q-td></q-td>
          <q-td></q-td>
          <q-td class="text-center text-weight-bold">
            <span v-if="ketquaCuoicung !== 0">
              {{ ketquaCuoicung }} %
            </span>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <!-- LƯU DỮ LIỆU -->
    <div class="text-right" style="margin-top: 5px"
      v-if="isSaveAllowed">
      <q-btn color="teal" icon="memory" label="Lưu tạm"
        @click="luutam" />
      <q-btn color="indigo" icon="save" label="Hoàn tất" style="margin-left: 20px"
        @click="hoantat" />
    </div>

    <div id="chart" style="margin-top: 10px">
      <apexchart type=radar :options="chartOptions" :series="series"
        v-show="ketquaCuoicung > 0" />
    </div>
  </q-page>
</template>

<script>
import Vue from 'vue';
import VueApexCharts from 'vue-apexcharts';

Vue.use(VueApexCharts);

Vue.component('apexchart', VueApexCharts);

export default {
  name: 'DanhgiaNangluc',
  data() {
    return {
      openModal: false,
      series: [],
      chartOptions: {},
      data: [],
      filter: '',
      columns: [],
      serverData: {},
      sumTrongso: {
        A: 0, B: 0, C: 0, D: 0,
      },
      sumDiemchuan: {
        A: 0, B: 0, C: 0, D: 0,
      },
      diemQuanly: {
        A: 0, B: 0, C: 0, D: 0,
      },
      diemHoidong: {
        A: 0, B: 0, C: 0, D: 0,
      },
      diemdat: {
        A: 0, B: 0, C: 0, D: 0,
      },
      ketqua: {
        A: 0, B: 0, C: 0, D: 0,
      },
      ketquaDanhgiaQL: 0,
      ketquaDanhgiaHD: 0,
      ketquaCuoicung: 0,
      capDanhgia: '',
      isHoidong: false,
      isQuanly: false,
      orgID: -1,
      jobID: -1,
      estimatePeriod: 'CURRENT',
      estimateName: '',
      estimateJobTitle: '',
      pagination: {
        page: 1,
        rowsPerPage: 0,
      },
    };
  },
  async created() {
    this.openModal = true;
    this.estimateID = this.$route.params.estimate_id;
    this.estimatePeriod = this.$route.params.estimate_period;

    try {
      // Get thông tin nhân viên và dữ liệu đã đánh giá nếu có
      const url = `${this.$webapiPath}/competency/estimate/get?userID=${this.estimateID}&period=${this.estimatePeriod}`;
      const estimateResponse = await this.$axios.get(url);
      if (Object.keys(estimateResponse.data.myData).length === 0) {
        this.openModal = false;
        this.estimatePeriod = 'ERROR';
        this.notify('Không tìm thấy nhân viên', 'red', 'infor', 'white');
        return;
      }
      // Kiểm tra xem người đánh giá có phải là quản lý
      this.isQuanly = (estimateResponse.data.myData.managerID === this.$store.getters['competency/userID']);

      this.orgID = estimateResponse.data.myData.orgID;
      this.jobID = estimateResponse.data.myData.jobID;
      this.estimateName = estimateResponse.data.myData.fullname;
      this.estimateJobTitle = estimateResponse.data.myData.jobTitle;
      if (estimateResponse.data.myData.who) {
        this.capDanhgia = estimateResponse.data.myData.who; // [QL, HD]
      } else {
        this.capDanhgia = 'QL';
      }

      // Từ điển năng lực
      let response = await this.$axios.get(`${this.$webapiPath}/competency/list?attribute=yes`);
      const tudienNangluc = {};
      response.data.myData.forEach((item) => {
        tudienNangluc[`${item.competencyCode}`] = `${item.competency}`;
        tudienNangluc[`${item.competencyCode}_attribute`] = JSON.parse(`${item.attribute}`);
      });

      // Từ điển năng lực - chuyên môn
      response = await this.$axios.get(`${this.$webapiPath}/competency/list/chuyenmon?orgID=${this.orgID}&attribute=yes`);
      const tudienNanglucChuyenmon = [];
      if (response.data.myData) {
        response.data.myData.forEach((item) => {
          tudienNanglucChuyenmon[`${item.competencyCode}`] = `${item.competency}`;
          tudienNanglucChuyenmon[`${item.competencyCode}_attribute`] = JSON.parse(`${item.attribute}`);
        });
      }

      // Kiểm tra xem người đánh giá có phải là hội đồng
      response = await this.$axios.get(`${this.$webapiPath}/competency/role/hoidong/get?userID=${this.$store.getters['competency/userID']}`);
      if (response.data.myData) {
        response.data.myData.forEach((item) => {
          this.isHoidong = item.dsNhanvien1.includes(`,${this.estimateID},`);
        });
      }

      // Nếu không phải là quản lý và cũng không phải hội đồng
      if (this.isQuanly === false && this.isHoidong === false) {
        return;
      }

      await this.newDanhgia(tudienNangluc, tudienNanglucChuyenmon);
      if (estimateResponse.data.myData.data !== '{}') {
        this.loadDanhgia(JSON.parse(estimateResponse.data.myData.data),
          tudienNangluc, tudienNanglucChuyenmon);
      }

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
  computed: {
    isSaveAllowed() {
      if (this.capDanhgia === 'QL' && this.isQuanly === true && this.estimatePeriod === 'CURRENT') {
        return true;
      }

      if (this.capDanhgia === 'HD' && this.isHoidong === true && this.estimatePeriod === 'CURRENT') {
        return true;
      }

      return false;
    },
  },
  methods: {
    async newDanhgia(tudienNangluc, tudienNanglucChuyenmon) {
      let url = `${this.$webapiPath}`;
      url += `/competency/framework/tieuchuan-nangluc?orgID=${this.orgID}&jobID=${this.jobID}`;

      // Lấy dữ liệu tiêu chuẩn năng lực
      const response = await this.$axios.get(url);

      const tieuchuanNangluc = JSON.parse(response.data.tieuchuanNangluc);
      const jsonData = {};
      Object.keys(tieuchuanNangluc).forEach((key) => {
        const item = {};

        if (key.length === 1) {
          item.nangluc = tudienNangluc[key];
          item.trongso = tieuchuanNangluc[key];
          jsonData[key] = item;
          this.sumTrongso[key] += item.trongso;
        } else {
          const maMdTc = key.split('-');
          const [code, mucdoTieuchuan] = maMdTc;
          if (!jsonData[code]) {
            jsonData[code] = {};
          }

          if (mucdoTieuchuan === 'md') {
            jsonData[code].md = tieuchuanNangluc[key];
          } else if (mucdoTieuchuan === 'tc') {
            jsonData[code].tc = tieuchuanNangluc[key];
          }

          // quản lý đánh giá
          jsonData[code].qldg = 0;
          // hội đồng đánh giá
          jsonData[code].hddg = 0;

          if (key[0] === 'D') {
            jsonData[code].nangluc = tudienNanglucChuyenmon[code];
            jsonData[code].question = tudienNanglucChuyenmon[`${code}_attribute`];
          } else {
            jsonData[code].nangluc = tudienNangluc[code];
            jsonData[code].question = tudienNangluc[`${code}_attribute`];
          }
        }
      });

      Object.keys(jsonData).forEach((key) => {
        this.data.push({ key, data: jsonData[key] });
      });
      this.sortData();
    },
    loadDanhgia(serverData, tudienNangluc, tudienNanglucChuyenmon) {
      this.data.forEach((item) => {
        if (item.key.length > 1) {
          item.data.qldg = serverData[item.key].qldg;
          item.data.hddg = serverData[item.key].hddg;
        }
      });

      this.estimateJobTitle = serverData.jobTitle;
      this.updateDiemQuanly();
      this.updateDiemHoidong();

      this.drawChart(serverData, tudienNangluc, tudienNanglucChuyenmon);
    },
    sortData() {
      // Sắp xếp theo key
      this.data.sort((a, b) => {
        if (a.key === b.key) {
          return 0;
        }
        return (a.key > b.key) ? 1 : -1;
      });
      // Đánh só thứ tự
      let rowIndex = 0;
      this.data.forEach((item) => {
        rowIndex = (item.key.length === 1) ? 0 : rowIndex + 1;
        item.data.stt = (rowIndex === 0) ? '' : rowIndex;
        if (item.key.length > 1) {
          this.sumDiemchuan[`${item.key[0]}`] += item.data.md * item.data.tc;
        }
      });
    },
    updateDiemQuanly() {
      this.data.forEach((item) => {
        if (item.key.length === 1) {
          this.diemQuanly[item.key] = 0;
        } else if (item.key.length > 1) {
          this.diemQuanly[`${item.key[0]}`] += item.data.md * item.data.qldg;
        }
      });

      this.ketquaDanhgiaQL = 0;
      this.ketquaDanhgiaQL = (+this.diemQuanly.A * +this.sumTrongso.A) / +this.sumDiemchuan.A;
      // nếu không có năng lực B (năng lực quản lý)
      if (this.sumDiemchuan.B > 0) {
        this.ketquaDanhgiaQL += (+this.diemQuanly.B * +this.sumTrongso.B) / +this.sumDiemchuan.B;
      }
      this.ketquaDanhgiaQL += (+this.diemQuanly.C * +this.sumTrongso.C) / +this.sumDiemchuan.C;
      this.ketquaDanhgiaQL += (+this.diemQuanly.D * +this.sumTrongso.D) / +this.sumDiemchuan.D;
      this.ketquaDanhgiaQL = Math.round(this.ketquaDanhgiaQL, 2);
    },
    updateDiemHoidong() {
      this.data.forEach((item) => {
        if (item.key.length === 1) {
          this.diemHoidong[item.key] = 0;
          this.diemdat[item.key] = 0;
          this.ketqua[item.key] = 0;
        } else if (item.key.length > 1) {
          item.data.diemdat = item.data.md * item.data.hddg;
          item.data.ketqua = (item.data.diemdat * 100) / (item.data.md * item.data.tc);
          item.data.ketqua = Math.round(item.data.ketqua, 2);
          this.diemHoidong[`${item.key[0]}`] += item.data.md * item.data.hddg;
          this.diemdat[`${item.key[0]}`] += item.data.md * item.data.hddg;
          this.ketqua[`${item.key[0]}`] = this.diemdat[`${item.key[0]}`]
            * this.sumTrongso[`${item.key[0]}`] / this.sumDiemchuan[`${item.key[0]}`];
          this.ketqua[`${item.key[0]}`] = Math.round(this.ketqua[`${item.key[0]}`]);
        }
      });

      this.ketquaDanhgiaHD = 0;
      this.ketquaDanhgiaHD = (+this.diemHoidong.A * +this.sumTrongso.A) / +this.sumDiemchuan.A;
      this.ketquaDanhgiaHD += (+this.diemHoidong.B * +this.sumTrongso.B) / +this.sumDiemchuan.B;
      this.ketquaDanhgiaHD += (+this.diemHoidong.C * +this.sumTrongso.C) / +this.sumDiemchuan.C;
      this.ketquaDanhgiaHD += (+this.diemHoidong.D * +this.sumTrongso.D) / +this.sumDiemchuan.D;
      this.ketquaDanhgiaHD = Math.round(this.ketquaDanhgiaHD, 2);

      this.ketquaCuoicung = this.ketqua.A + this.ketqua.B + this.ketqua.C + this.ketqua.D;
    },
    luutam() {
      const bodyFormData = new FormData();

      this.openModal = true;

      this.serverData = {};
      if (!this.serverData.jobTitle) {
        this.serverData.jobTitle = this.estimateJobTitle;
      }
      this.data.forEach((obj) => {
        const item = {};
        if (obj.key.length > 1) {
          item.qldg = obj.data.qldg;
          item.hddg = obj.data.hddg;
          this.serverData[obj.key] = item;
        }
      });

      bodyFormData.set('userID', this.estimateID);
      bodyFormData.set('who', this.capDanhgia);
      bodyFormData.set('status', 'T');
      bodyFormData.set('data', JSON.stringify(this.serverData));

      this.$axios.put(`${this.$webapiPath}/competency/estimate`, bodyFormData)
        .then((response) => {
          if (response.data.status === 200) {
            this.$router.go();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    hoantat() {
      const bodyFormData = new FormData();

      this.openModal = true;

      this.serverData = {};
      this.serverData.ketquaCuoicung = this.ketquaCuoicung;
      if (!this.serverData.jobTitle) {
        this.serverData.jobTitle = this.estimateJobTitle;
      }

      let fError = false;
      this.data.forEach((obj) => {
        const item = {};
        if (obj.key.length > 1) {
          item.qldg = obj.data.qldg;

          // Nếu quản lý đánh giá xong thì copy kết quả đánh giá qua làm
          // dữ liệu mặt định cho hội đồng
          if (this.capDanhgia === 'QL') {
            item.hddg = obj.data.qldg;
            if (obj.data.qldg === 0) {
              fError = obj.data.nangluc;
              return;
            }
          } else {
            item.hddg = obj.data.hddg;
          }

          this.serverData[obj.key] = item;
        }
      });

      // Nếu có câu hỏi chưa đánh thì không được hoàn thành
      if (fError !== false) {
        this.notify(`${fError} chưa đánh`, 'red', 'error', 'white');
        this.openModal = false;
        return;
      }

      bodyFormData.set('userID', this.estimateID);
      bodyFormData.set('who', this.capDanhgia);
      bodyFormData.set('status', 'H');
      bodyFormData.set('data', JSON.stringify(this.serverData));

      this.$axios.put(`${this.$webapiPath}/competency/estimate`, bodyFormData)
        .then((response) => {
          if (response.data.status === 200) {
            this.$router.go();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    drawChart(serverData, tudienNangluc, tudienNanglucChuyenmon) {
      this.series = [];
      this.chartOptions = {};
      this.chartOptions.labels = [];

      this.chartOptions.chart = {
        height: 1100,
        toolbar: {
          show: false,
        },
      };
      this.chartOptions.plotOptions = {
        radar: {
          polygons: {
            strokeColor: '#e8e8e8',
            fill: {
              colors: ['#f8f8f8', '#fff'],
            },
          },
        },
      };
      this.chartOptions.title = {
        align: 'center',
        text: 'Kết Quả Bài Đánh Giá Năng Lực',
        offsetY: 20,
        style: {
          fontSize: '2em',
          fontFamily: 'Cambria',
          color: '#000000',
        },
      };
      this.chartOptions.subtitle = {
        align: 'center',
        text: this.estimateName,
        offsetY: 50,
        style: {
          fontSize: '1.5em',
          color: '#9699a2',
        },
      };
      this.chartOptions.legend = {
        fontFamily: 'Cambria',
        fontSize: '16px',
        markers: {
          width: 40,
          height: 20,
          radius: 2,
        },
      };

      let nanglucName;

      const diemchuan = {};
      diemchuan.name = 'Điểm chuẩn';
      diemchuan.data = [];

      const dgQuanly = {};
      dgQuanly.name = 'Quản lý đánh giá';
      dgQuanly.data = [];

      const dgHoidong = {};
      dgHoidong.name = 'Hội đồng đánh giá';
      dgHoidong.data = [];

      this.data.forEach((item) => {
        if (item.key.length > 1) {
          diemchuan.data.push(item.data.md * item.data.tc);
          dgQuanly.data.push(item.data.qldg);
          dgHoidong.data.push(item.data.hddg);
          nanglucName = (tudienNangluc[item.key])
            ? tudienNangluc[item.key]
            : tudienNanglucChuyenmon[item.key];
          this.chartOptions.labels.push(nanglucName);
        }
      });

      this.series.push(diemchuan);
      this.series.push(dgQuanly);
      this.series.push(dgHoidong);
    },
    notify(message, color, icon, textColor) {
      this.$q.notify({
        message,
        color,
        icon,
        textColor,
        position: 'top-right',
        timeout: 1000,
      });
    },
  },
};
</script>

<style scoped>
.q-table td, .q-table th {
  white-space: normal !important;
}

.job-title {
  color: black;
  font-size: 1.3em;
}

.row-lv1 {
  font-weight: bold;
  background-color: #bce4e6;
}
</style>
