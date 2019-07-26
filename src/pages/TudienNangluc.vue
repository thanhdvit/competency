<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        :grid="$q.screen.xs"
        class="my-sticky-header-table"
        title="TỪ ĐIỂN NĂNG LỰC"
        :data="data"
        :columns="columns"
        row-key="ma"
        :filter="filter"
        :rows-per-page-options="[0]"
        :pagination.sync="pagination"
      >
        <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <q-tr slot="body" slot-scope="props" :style="styleRow(props.row)"
          :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <slot :name="col.name" scope="props" :column="col" :row="props.row">

              <span v-if="col.name !== 'cn' && col.name !== 'nl'">{{ col.value }}</span>

              <span v-if="col.name === 'nl'"
                href="#" class="cursor-pointer"
                @click="addCompetency(props.row)">
                {{ col.value }}
              </span>

              <a href="#" v-if="col.name === 'cn' && props.row.cn !== ''"
                class="add-competency"
                @click="addCompetency(props.row)">
                {{ props.row.cn }}
                <i class="fa fa-plus-circle" style="padding-left: 10px"></i>
              </a>

            </slot>
          </q-td>
        </q-tr>

      </q-table>
    </div>
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
    columns.push({
      name: 'cn', label: '', field: 'cn',
    });

    return {
      filter: '',
      localDataSource: [],
      columns,
      data: [],
      pagination: {
        page: 1,
        rowsPerPage: 0,
      },
    };
  },
  created() {
    this.$axios.get(`${this.$webapiPath}/competency/list`)
      .then((response) => {
        let rowIndex = 0;
        response.data.myData.forEach((item) => {
          rowIndex = (item.competencyCode.length === 1) ? 0 : rowIndex + 1;
          this.data.push({
            stt: (rowIndex === 0) ? '' : rowIndex,
            ma: `${item.competencyCode}`,
            nl: `${item.competency}`,
            cn: (item.competencyCode.length === 1) ? 'Thêm mục tiêu' : '',
          });
        });
      })
      .catch((e) => {
        console.log(e);
      });
  },
  methods: {
    styleRow: (row) => {
      const bgColor = (row.ma.length === 1) ? 'background-color: #05f7d3; font-weight: bold' : '';
      return bgColor;
    },
    addCompetency: (row) => {
      console.log(row);
    },
  },
};
</script>

<style>
.add-competency {
  font-style: italic;
  text-decoration: none;
  color: #063d94;
}
</style>
