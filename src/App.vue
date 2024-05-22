<template>
  <div>
    <TabView>
    <TabPanel header="Header I">
      <div>
      <div class="row">
        <label>Employee Number</label>
        <InputText type="text" v-model="employeeNo" />
      </div>
      <div class="row">
        <label>Activity sessionCode</label>
        <InputText type="text" v-model="sessionCode" />
      </div>
      <div class="row">
        <label>Activity classCode</label>
        <InputText type="text" v-model="classCode" />
      </div>
    </div>
    <div class="row">
      <label>Check the box if it is India Training</label>
      <Checkbox v-model="isIndia" :binary="true" />
    </div>
    <div class="row">
      <label>Start Date</label>
      <!-- <Calendar id="calendar-12h" v-model="startDate" showTime hourFormat="12" /> -->
      <Calendar id="calendar-24h" v-model="startDate" showTime hourFormat="24" />
    </div>
    <div class="row">
      <label>End Date</label>
      <Calendar id="calendar-24h" v-model="endDate" showTime hourFormat="24" />
    </div>
    <Button @click="exportToExcel">Export to Excel</Button>
    </TabPanel>
    <TabPanel header="Header II">
        <p class="m-0">
          Hello
        </p>
    </TabPanel>
    </TabView>
    <!-- <InputText type="file" @change="handleFileUpload" accept=".xlsx, .xls" /> -->
    
  <!-- Your template code here -->
  </div>
  </template>
   
  <script>

  import ExcelJS from 'exceljs'

  export default {
    data() {
      return {
        headerColumn:[
    "Employee Number",
    "ActivityCode",
    "Class Start Date",
    "Registration Date",
    "Completion Date",
    "First Launch Date",
    "Score",
    "Passed",
    "Cancellation Date",
    "Payment Term",
    "Cost",
    "Currency",
    "Timezone",
    "Status",
    "Notes",
    "Subscription Source Activity Code ",
    "Subscription Source Activity Start Date ",
    "Elapsed Time (in seconds)",
    "Completion Status",
    "Location_Name",
    "Slotstart_Date",
    "Slotend_Date"
],
        employeeNo:'63863',
        startDate: null,
        endDate: null,
        sessionCode:'',
        classCode:'',
        completionStatus:1,
        tmuStatus:4,
        isIndia:false,
        

        // Your reactive data properties here
      };
    },
    watch:{
      startDate(newValue,oldValue){
        console.log("start",newValue)
      }
    },
    methods: {
      async handleFileUpload(event) {       
        const file = event.target.files[0];       
        const workbook = new ExcelJS.Workbook();            
        await workbook.xlsx.load(file);       
        const worksheet = workbook.getWorksheet();       
        console.log('workbook',workbook)       
        const jsonData = [];      
        worksheet.eachRow((row) => {        
        const rowData = [];         
        row.eachCell((cell) => {           
          rowData.push(cell.value);         
        });         
          jsonData.push(rowData);       
        });       
        this.data = jsonData;    
        console.log("data",jsonData) 
      },
      async exportToExcel() {       // Sample data       
        const headerValues = ['Name', 'Age', 'Country'];       
        const rowData = [
        {'Employee Number':this.employeeNo,'ActivityCode':this.sessionCode,'Class Start Date':this.startDate,'Registration Date':this.startDate,'Completion Date':this.endDate,'First Launch Date':'','Score':'','Passed':'','Cancellation Date':'','Payment Term':'','Cost':'','Currency':'','Timezone':this.timeZone,'Status':this.tmuStatus,'Notes':'','Subscription Source Activity Code':this.classCode,'Subscription Source Activity Start Date':'','Elapsed Time (in seconds)':'','Completion Status':this.completionStatus,'Location_Name':'','Slotstart_Date':'','Slotend_Date':''}]
     // Create a new workbook and worksheet      
         const workbook = new ExcelJS.Workbook();       
         const worksheet = workbook.addWorksheet('TMU')       // Add header row       
         worksheet.addRow(this.headerColumn);       // Add data rows     
           rowData.forEach(row => {       
            console.log("row",row)
              worksheet.addRow([row['Employee Number'],row.ActivityCode,row['Class Start Date'],row['Registration Date'],row['Completion Date']],row['First Launch Date'],row.Score,row.Passed,row['Cancellation Date'],row['Payment Term'],row.Cost,row.Currency,row.Timezone,row.Status,row.Notes,row['Subscription Source Activity Code'],row['Subscription Source Activity Start Date'],row['Elapsed Time (in seconds)'],row['Completion Status'],row.Location_Name,row.Slotstart_Date,row.Slotend_Date);     
           });       // Save the workbook to a blob   
                  const blob = await workbook.xlsx.writeBuffer();     
                    // Create a blob URL     
                      const blobUrl = window.URL.createObjectURL(new Blob([blob], { type: 'application/octet-stream' }));       // Create a download link      
                      const downloadLink = document.createElement('a');       
                      downloadLink.href = blobUrl;       
                      downloadLink.setAttribute('download', 'example.xlsx');       // Simulate a click event on the download link     
                      downloadLink.click();       // Clean up by revoking the blob URL       
                      window.URL.revokeObjectURL(blobUrl);
                    }
    },
    computed: {
      timeZone(){
        return this.isIndia ? 'Asia/Calcutta':'America/Mexico City'
      }
    },
    // Other options like 'created', 'mounted', etc. can be defined here
  };
  </script>
  <style>
  label{
    display: inline-block;
    width:150px;
  }
  .row{
    margin:10px 0px;
  }


</style>