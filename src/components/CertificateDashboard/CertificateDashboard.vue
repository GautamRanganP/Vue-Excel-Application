<template>
<div style="width:100%; ">
  <div style="background-color:transparent;display:flex;gap:20px;">    
    <Card style="flex:1;">
      <template #title><div class="grp-dashboard-card">Total Certification</div></template>
      <template #content>
          <h3>104</h3>
      </template>
    </Card>
    <Card style="flex:1;">
      <template #title><div class="grp-dashboard-card">Total Employee</div></template>
      <template #content>
         <h3>115</h3>
      </template>
    </Card>
    <Card style="flex:1;">
      <template #title><div class="grp-dashboard-card">Average Certification</div></template>
      <template #content>
          <h3>98%</h3>
      </template>
    </Card>
  </div>

  <div style="margin-top:20px;display:flex;gap:20px;max-height:400px">  
    <Chart type="bar" :data="chartData" :options="chartOptions" style="flex:1;background-color:white;" />
   
   <Card style="flex:1;">
      <template #title><div class="grp-dashboard-card">Total Certification</div></template>
      <template #content>
      <Card style="flex:1;">
        <template #title><p>104</p></template>
      <template #content>
      </template>
      </Card>
      <Card style="flex:1;">
        <template #title><p>104</p></template>
      <template #content>
      </template>
      </Card>
      <Card style="flex:1;width:150px;height:150px">
        <template #title><p>104</p></template>
      <template #content>
      </template>
      </Card>
          
      </template>
    </Card>
  </div>
  <div style="margin-top:20px;display:flex;gap:20px;max-height:400px">  
    <Chart type="bar" :data="chartData" :options="chartOptions" style="flex:1;background-color:white;" />
    <Chart type="line" :data="chartData" :options="chartOptions1" style="flex:1;background-color:white;" />
  </div>


</div>
</template>
  
  
<script>
import Chart from 'primevue/chart';
import moment from 'moment';

export default {
    components: {
    Chart
  },
  data(){
    return{
        chartData: {
      labels: ['Jan','Feb','Mar','Apr','Jun','Jul','Aug'],
      datasets: [
        {
          label: 'Azure Certification',
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          data: [40, 55, 75, 60, 80, 90, 100],
          fill: false
        },
        {
          label: 'AWS Certification',
          backgroundColor: '#FF6384',
          borderColor: '#FF6384',
          data: [30, 45, 65, 50, 70, 85, 95],
          fill: false
        }
      ]
    },
    chartOptions : {
       responsive: true,
  plugins: {
    legend: {
      display: true,  // Set to false to hide the legend
      position: 'top'  // Adjust position as needed (top, bottom, left, right)
    },
    tooltip: {
      callbacks: {
        // Customizing tooltips if needed
      }
    }
  },
  elements: {
    bar: {
      borderWidth: 0,  // Set border width of bars to 0
      borderRadius: 0  // Remove any rounding of bar corners
    }
  },
  layout: {
    padding: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }
  },
  scales: {
    x: {
      grid: {
        display: false  // Hide grid lines on x-axis
      },
      border: {
        display: false  // Hide border on x-axis
      }
    },
    y: {
      grid: {
        display: false  // Hide grid lines on y-axis
      },
      border: {
        display: false  // Hide border on y-axis
      },
        ticks: {
        display: false  // Hide ticks on y-axis
      }

    }
  }
    },
    chartOptions1: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        // x: {
        //   beginAtZero: true
        // },
        // y: {
        //   beginAtZero: true
        // }
      }
    }
    }
  },
  mounted(){
  }
};
</script>
  <style scoped>
  
.grp-dashboard-card{
  font-size:16px;
  font-weight:600;
}
  </style>