<template>
<div>
<div style="display:flex;flex-direction: column;align-items: center;gap:10px">
  <h1 style="color:white">Employee Certification Completion Details</h1>
  <Button style="margin-bottom:10px" v-if="employeeData && employeeData.length > 0" @click="exportToExcel(employeeData)">Export Report</Button>
</div>
<DataTable :value="employeeData" tableStyle="min-width: 50rem">
    <Column field="employeeID" header="employeeID"></Column>
    <Column field="employeeName" header="employeeName"></Column>
    <Column field="employeeEmail" header="employeeEmail"></Column>
    <Column field="certificationName" header="certificationName"></Column>
    <Column field="completionDate" header="completionDate"></Column>
</DataTable>
</div>
</template>
  
  
<script>
import Chart from 'primevue/chart';
import moment from 'moment';
  
  import ExcelJS from 'exceljs'
// import employeeData from './data.json'
export default {
    components: {
    Chart
  },
  data(){
    return{
        employeeData:[],
        chartData: {
      labels: ['Azure Certification', 'AWS Certification', 'Other Certification'],
      datasets: [
        {
          label: 'Monthly Completion',
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          data: [40, 55, 75, 60, 80, 90, 100],
          fill: false
        },
        {
          label: 'Monthly Expenses',
          backgroundColor: '#FF6384',
          borderColor: '#FF6384',
          data: [30, 45, 65, 50, 70, 85, 95],
          fill: false
        }
      ]
    },
    chartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          beginAtZero: true
        },
        y: {
          beginAtZero: true
        }
      }
    }
    }
  },
  methods:{
    async exportToExcel(data){
      console.log("working")
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Employees');

    // Define the columns
    worksheet.columns = [
        { header: 'Employee ID', key: 'employeeID', width: 15 },
        { header: 'Employee Name', key: 'employeeName', width: 30 },
        { header: 'Employee Email', key: 'employeeEmail', width: 30 },
        { header: 'Certification Name', key: 'certificationName', width: 25 },
        { header: 'Completion Date', key: 'completionDate', width: 15 }
    ];

    // Add rows to the worksheet
    worksheet.addRows(data);

    // Write the workbook to a file
    const buffer = await workbook.xlsx.writeBuffer();
    
    // Create a Blob object from the buffer
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Create a link element to trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'employee_data.xlsx';
    link.click();
}
  },
  mounted(){
     const response = fetch('https://e-commere-back-end.vercel.app/getallemployee', 
      {  
        method: 'GET', // or 'PUT'
        headers: {       
          'Content-Type': 'application/json', // Set the Content-Type to application/json   
          }, // Convert the data object to a JSON string 
        }).then(response => {     
          if (!response.ok) {       // If the response status code is not OK, throw an error
            throw new Error('Network response was not ok ' + response.statusText);     
          }    
          return response.json(); // Parse the JSON from the response 
         }).then(data => { 
          console.log('Success:', data); // Handle the JSON data
          let transformedData = [];

        // Iterate through each employee object
        data.forEach(employee => {
        // Iterate through each certification of the employee
  employee.certifications.forEach(certification => {
    const momentDate = moment(certification.completionDate);     
    const formattedDate = momentDate.format("MM/DD/YYYY");
    transformedData.push({
      employeeID: employee.employeeID,
      employeeName: employee.employeeName,
      employeeEmail: employee.employeeEmail,
      certificationName: certification.name,
      completionDate : formattedDate
    });
  });
});
this.employeeData = transformedData
// Output the transformed data
console.log(transformedData);
          }).catch(error => { 
            console.error('Error:', error); // Handle any errors
        });
  }
};
</script>
  <style scoped>
  

  </style>