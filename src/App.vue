<template>
  <div>
  <div style="display:flex;gap:20px;"> 
   <div class="display-data">

    <TabView>
      <TabPanel header="Header I">
        <div>
          <div class="row">
            <label>Employee Number</label>
            <div style="display: flex;flex-direction: column;padding-right: 10px;">
              <label>Attended</label>
              <Textarea v-model="attended" autoResize rows="5" cols="15" />
            </div>
            <div style="display: flex;flex-direction: column;">
              <label>Not Attended</label>
              <Textarea v-model="notAttended" autoResize rows="5" cols="15" />
            </div>
            <!-- <InputText type="text" v-model="employeeNo" /> -->
      </div>
      <div class="row">
        <label>Activity sessionCode</label>
        <InputText type="text" v-model="sessionCode" />
      </div>
      <div class="row">
        <label>Activity classCode</label>
        <InputText type="text" v-model="classCode" />
      </div>
      <div class="row">
        <label>completionStatus</label>
        <InputText type="number" v-model="completionStatus" />
      </div>
    </div>
    <div class="row">
      <label>India Or Americas</label>
      <div style="display: flex;align-items: center;gap: 5px;">
        <RadioButton v-model="region" inputId="ingredient1" name="pizza" value="Cheese" />
        <label for="ingredient1" style="margin-right: 10px;">India</label>
      </div>
      <div style="display: flex;align-items: center;gap: 5px;">
        <RadioButton v-model="region" inputId="ingredient2" name="pizza" value="Mushroom" />
        <label for="ingredient2" class="ml-2">Americas</label>
      </div>
      <!-- <label>Check the box if it is India Training</label>
      <Checkbox v-model="isIndia" :binary="true" /> -->
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
</div>
<div class="display-data">
     <DataTable :value="employeeIdsOfAttended" showGridlines>
    <Column field="number" header="Attended"></Column>
  </DataTable>
</div>
<div class="display-data">
  
     <DataTable :value="employeeIdsOfNotAttended" showGridlines>
      <Column field="number" header="Not Attended"></Column>
     </DataTable>
</div>

    <!-- <InputText type="file" @change="handleFileUpload" accept=".xlsx, .xls" /> -->
    </div>
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
        completionStatus:null,
        tmuStatus:4,
        isIndia:false,
        region:null,
        attended:'',
        notAttended:'',
        employeeIdsOfAttended:[],
        employeeIdsOfNotAttended:[]

        // Your reactive data properties here
      };
    },
    watch:{
      startDate(newValue,oldValue){
        console.log("start",newValue)
      },
      attended(newValue,oldValue){
        this.employeeIdsOfAttended = this.splitEmployeeIds(newValue)
        console.log("attended",this.splitEmployeeIds(newValue))
      },
      notAttended(newValue,oldValue){
        this.employeeIdsOfNotAttended = this.splitEmployeeIds(newValue)
        console.log("notAttended",this.splitEmployeeIds(newValue))
      },
    },
    methods: {
       splitEmployeeIds(employeeids){
       //   return employeeids.match(/.{1,5}/g); 
       let chunks = employeeids.match(/.{1,5}/g);
       return chunks.map((chunk,index)=>({["number"]:chunk}))
      },
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
        {'Employee Number':'','ActivityCode':this.sessionCode,'Class Start Date':this.startDate,'Registration Date':this.startDate,'Completion Date':this.endDate,'First Launch Date':'','Score':'','Passed':'','Cancellation Date':'','Payment Term':'','Cost':'','Currency':'','Timezone':this.timeZone,'Status':this.tmuStatus,'Notes':'','Subscription Source Activity Code':this.classCode,'Subscription Source Activity Start Date':'','Elapsed Time (in seconds)':'','Completion Status':this.completionStatus,'Location_Name':'','Slotstart_Date':'','Slotend_Date':''}]
        const attendedData = []
        if(this.employeeIdsOfAttended && this.employeeIdsOfAttended.length > 0){
          this.employeeIdsOfAttended.forEach((employeeId)=>{
            const clonedEmployeeRowData = JSON.parse(JSON.stringify(rowData[0]))
            clonedEmployeeRowData['Employee Number'] = employeeId.number
            attendedData.push(clonedEmployeeRowData)
          })
        }
        const notAttendedData = []
        if(this.employeeIdsOfNotAttended && this.employeeIdsOfNotAttended.length > 0){
          this.employeeIdsOfNotAttended.forEach((employeeId)=>{
            const clonedEmployeeRowData = JSON.parse(JSON.stringify(rowData[0]))
            clonedEmployeeRowData['Employee Number'] = employeeId.number
            notAttendedData.push(clonedEmployeeRowData)
          })
        }
     
        console.log('entire data',attendedData)
        // Create a new workbook and worksheet      
         const workbook = new ExcelJS.Workbook();       
         const worksheet = workbook.addWorksheet('TMU')       // Add header row       
         worksheet.addRow(this.headerColumn);       // Add data rows    
         const headerRow = worksheet.getRow(1); 
         // Assuming header row is the first row
         // Mapping column headers to their corresponding column indexes
         const headerMap = {};    
          headerRow.eachCell((cell, colNumber) => {         
            headerMap[cell.value] = colNumber;    
        });
        
  
        attendedData.forEach(row => {       
            worksheet.addRow([row['Employee Number'],row.ActivityCode,row['Class Start Date'],row['Registration Date'],row['Completion Date']," "," "," "," "," "," "," ",row.Timezone,row.Status," ",row['Subscription Source Activity Code']," "," ",row['Completion Status']," "," "," "]);     
        });
        notAttendedData.forEach(row => {       
            worksheet.addRow([row['Employee Number'],row.ActivityCode,row['Class Start Date'],row['Registration Date']," "," "," "," "," "," "," "," ",row.Timezone," "," ",row['Subscription Source Activity Code']," "," "," "," "," "," "]);     
        });
                  // Save the workbook to a blob   
                
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
  .row > label{
    display: inline-block;
    width:180px;
  }
  .row{
    margin:10px 0px;
    display: flex;
    align-items: center;
  }
  .display-data{
    width: 50%;
  }


</style>