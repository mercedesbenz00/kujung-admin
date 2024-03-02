<template>
  <div class="layout fluid va-gutter-5 dashboard">
    <div class="row row-equal">
      <div class="flex xs12">
        <div class="row">
          <div class="flex xs4">
            <va-card class="mb-4">
              <va-card-title> 오늘 방문자(명) </va-card-title>
              <va-card-content>
                <h2 class="va-h2 ma-0" style="color: black">{{ dashboardData.today_visit_count }}</h2>
              </va-card-content>
            </va-card>
          </div>
          <div class="flex xs4">
            <va-card class="mb-4">
              <va-card-title> 오늘 가입자(명) </va-card-title>
              <va-card-content>
                <h2 class="va-h2 ma-0" style="color: black">{{ dashboardData.today_register_count }}</h2>
              </va-card-content>
            </va-card>
          </div>
          <div class="flex xs4">
            <va-card class="mb-4">
              <va-card-title> 현재 접속 회원가입자(명) </va-card-title>
              <va-card-content>
                <h2 class="va-h2 ma-0" style="color: black">{{ dashboardData.current_user_count }}</h2>
              </va-card-content>
            </va-card>
          </div>
        </div>

        <div class="row">
          <div class="flex xs4">
            <va-card class="mb-4">
              <va-card-title> 랜선 집들이 승인 대기 </va-card-title>
              <va-card-content>
                <h2 class="va-h2 ma-0" style="color: black">{{ dashboardData.online_pending_count }}</h2>
              </va-card-content>
            </va-card>
          </div>
          <div class="flex xs4">
            <va-card class="mb-4">
              <va-card-title> 전문가 집들이 승인 대기 </va-card-title>
              <va-card-content>
                <h2 class="va-h2 ma-0" style="color: black">{{ dashboardData.expert_pending_count }}</h2>
              </va-card-content>
            </va-card>
          </div>
          <div class="flex xs4">
            <va-card class="mb-4">
              <va-card-title> 1:1 문의 답변 대기 </va-card-title>
              <va-card-content>
                <h2 class="va-h2 ma-0" style="color: black">{{ dashboardData.answer_pending_count }}</h2>
              </va-card-content>
            </va-card>
          </div>
        </div>

        <div class="row">
          <div class="flex xs4">
            <va-card class="mb-4">
              <va-card-title> 방문자 현황 </va-card-title>
              <va-card-content>
                <Bar
                  v-if="weekVisitChartData !== undefined"
                  :data="weekVisitChartData"
                  :options="weekVisitChartOptions"
                />
              </va-card-content>
            </va-card>
          </div>
          <div class="flex xs8">
            <va-card class="mb-8">
              <va-card-title> 최근 1:1 문의 </va-card-title>
              <va-card-content>
                <table class="va-table va-table--clickable">
                  <thead>
                    <tr>
                      <th>분류</th>
                      <th>제목</th>
                      <th>이름</th>
                      <th>처리상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="ask in dashboardData.question_list" :key="ask.id" @click="onRowClick(ask.id)">
                      <td>{{ ask.question_type_info?.name }}</td>
                      <td>{{ ask.question_title }}</td>
                      <td>{{ ask.requester?.name }}</td>
                      <td>{{ statusValues[ask.status] }}</td>
                    </tr>
                  </tbody>
                </table>
              </va-card-content>
            </va-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
  import { Bar } from 'vue-chartjs'

  import { onMounted } from 'vue'
  import { requestGet } from '../../../util/api'
  import { useRouter } from 'vue-router'
  import Common from '../../../util/common'

  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

  const router = useRouter()

  const statusValues = ['답변대기', '처리완료', '보류']
  const dashboardData = ref({
    today_visit_count: 0,
    today_register_count: 0,
    current_user_count: 0,
    online_pending_count: 0,
    expert_pending_count: 0,
    answer_pending_count: 0,
    week_visit_data: [],
    question_list: [],
  })

  const weekVisitChartData = ref()
  const weekVisitChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  }

  onMounted(async () => {
    try {
      let result = (await requestGet('statistics/dashboard', {})).data
      dashboardData.value = result
      weekVisitChartData.value = {
        labels: Common.getRecent7Days(),
        datasets: [
          {
            label: '주간 방문자수',
            backgroundColor: 'primary',
            data: result.week_visit_data.reverse(),
          },
        ],
      }
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  })

  const onRowClick = (id) => {
    router.push({ name: 'ask-detail', params: { id: id } })
  }
</script>

<style lang="scss">
  .row-equal .flex {
    .va-card {
      height: 100%;
    }
  }

  .dashboard {
    .va-card {
      margin-bottom: 0 !important;

      &__title {
        font-size: 1rem;
        display: flex;
        justify-content: center;
      }

      &__content {
        display: flex;
        justify-content: center;
      }
    }

    .va-table {
      width: 100%;

      th {
        font-size: 1rem;
      }
    }
  }
</style>
