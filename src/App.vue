<template>
  <div>
    <div style="display:flex;gap:20px;" class="main-container">
      <div class="input-form-data">
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
              </div>
              <div class="row">
                <label>Training name</label>
                <InputText type="text" v-model="trainingName" />
              </div>
              <div class="row">
                <label>Training name</label>
                  <Dropdown v-model="selectedMonth" :options="months" placeholder="Select a Month" class="w-full md:w-14rem" />
              </div>
            </div>
            <div class="row">
              <label>India Or Americas</label>
              <div style="display: flex;align-items: center;gap: 5px;">
                <RadioButton v-model="region" inputId="ingredient1" name="pizza" value="India" />
                <label for="ingredient1" style="margin-right: 10px;">India</label>
              </div>
              <div style="display: flex;align-items: center;gap: 5px;">
                <RadioButton v-model="region" inputId="ingredient2" name="pizza" value="Americas" />
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
      </div>
      <div class="input-preview-data">
        <div class="row">
                <label>Session Code</label>
                <InputGroup>
                  <InputGroupAddon>VILT_CMP_</InputGroupAddon>
                  <InputText placeholder="Month" v-model="selectedMonth" disabled />
                  <InputText placeholder="Training Name" v-model="trainingName" disabled />
                  <InputGroupAddon>_SN1</InputGroupAddon>
                </InputGroup>
                <!-- <InputText type="text" v-model="sessionCode" /> -->
              </div>
        <DataTable :value="employeeIdsOfAttended" showGridlines>
          <Column field="number" header="Attended"></Column>
        </DataTable>
        <div class="row">
                <label>Class Code</label>
                <InputGroup>
                  <InputGroupAddon>VILT_CMP_</InputGroupAddon>
                  <InputText placeholder="Month" v-model="selectedMonth" disabled />
                  <InputText placeholder="Training name" v-model="trainingName" disabled />
                  <InputGroupAddon>_CLS1</InputGroupAddon>
                </InputGroup>
                <!-- <InputText type="text" v-model="classCode" /> -->
              </div>
        <DataTable :value="employeeIdsOfNotAttended" showGridlines>
          <Column field="number" header="Not Attended"></Column>
        </DataTable>
      </div>


      <!-- <div class="display-data">
       
      </div> -->

      <!-- <InputText type="file" @change="handleFileUpload" accept=".xlsx, .xls" /> -->
    </div>
    <!-- Your template code here -->
  </div>
</template>

<script>

import ExcelJS from 'exceljs'
import moment from 'moment';

export default {
  data() {
    return {
      headerColumn: [
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
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      selectedMonth:null,
      employeeNo: '63863',
      trainingName: null,
      trainingMonth:null,
      startDate: null,
      endDate: null,
      sessionCode: '',
      classCode: '',
      isIndia: false,
      region: 'India',
      attended: '',
      notAttended: '',
      employeeIdsOfAttended: [],
      employeeIdsOfNotAttended: []

      // Your reactive data properties here
    };
  },
  watch: {
    startDate(newValue, oldValue) {
      // const momentDate = moment(newValue.toString());
      // momentDate.seconds(0);
      // const formattedDate = momentDate.format("M/D/YYYY hh:mm:ss A");
      // console.log("start", )
    },
    attended(newValue, oldValue) {
      this.employeeIdsOfAttended = this.splitEmployeeIds(newValue)
      console.log("attended", this.splitEmployeeIds(newValue))
    },
    notAttended(newValue, oldValue) {
      this.employeeIdsOfNotAttended = this.splitEmployeeIds(newValue)
      console.log("notAttended", this.splitEmployeeIds(newValue))
    },
    trainingMonth(newValue, oldValue){
      console.log("month", newValue)
    },
    region(newValue, oldValue){
      console.log("region", newValue)
    }
  },
  methods: {
    splitEmployeeIds(employeeids) {
      //   return employeeids.match(/.{1,5}/g); 
      let chunks = employeeids.match(/.{1,5}/g);
      return chunks.map((chunk, index) => ({ ["number"]: chunk }))
    },
    async handleFileUpload(event) {
      const file = event.target.files[0];
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(file);
      const worksheet = workbook.getWorksheet();
      console.log('workbook', workbook)
      const jsonData = [];
      worksheet.eachRow((row) => {
        const rowData = [];
        row.eachCell((cell) => {
          rowData.push(cell.value);
        });
        jsonData.push(rowData);
      });
      this.data = jsonData;
      console.log("data", jsonData)
    },
    async exportToExcel() {    

      const rowDataForAttended = [
        { 'Employee Number': '', 'ActivityCode': this.activitySessionCode, 'Class Start Date': this.startDate, 'Registration Date': this.startDate, 'Completion Date': this.endDate, 'First Launch Date': '', 'Score': '', 'Passed': '', 'Cancellation Date': '', 'Payment Term': '', 'Cost': '', 'Currency': '', 'Timezone': this.timeZone, 'Status': 4, 'Notes': '', 'Subscription Source Activity Code': this.activityClassCode, 'Subscription Source Activity Start Date': '', 'Elapsed Time (in seconds)': '', 'Completion Status': 1, 'Location_Name': '', 'Slotstart_Date': '', 'Slotend_Date': '' }]
        const rowDataForNotAttended = [
        { 'Employee Number': '', 'ActivityCode': this.activitySessionCode, 'Class Start Date': this.startDate, 'Registration Date': this.startDate, 'Completion Date': this.endDate, 'First Launch Date': '', 'Score': '', 'Passed': '', 'Cancellation Date': '', 'Payment Term': '', 'Cost': '', 'Currency': '', 'Timezone': this.timeZone, 'Status': null, 'Notes': '', 'Subscription Source Activity Code': this.activityClassCode, 'Subscription Source Activity Start Date': '', 'Elapsed Time (in seconds)': '', 'Completion Status': null, 'Location_Name': '', 'Slotstart_Date': '', 'Slotend_Date': '' }]
      
        const attendedData = []
      if (this.employeeIdsOfAttended && this.employeeIdsOfAttended.length > 0) {
        this.employeeIdsOfAttended.forEach((employeeId) => {
          const clonedEmployeeRowData = JSON.parse(JSON.stringify(rowDataForAttended[0]))
          clonedEmployeeRowData['Employee Number'] = employeeId.number
          attendedData.push(clonedEmployeeRowData)
        })
      }
      const notAttendedData = []
      if (this.employeeIdsOfNotAttended && this.employeeIdsOfNotAttended.length > 0) {
        this.employeeIdsOfNotAttended.forEach((employeeId) => {
          const clonedEmployeeRowData = JSON.parse(JSON.stringify(rowDataForNotAttended[0]))
          clonedEmployeeRowData['Employee Number'] = employeeId.number
          notAttendedData.push(clonedEmployeeRowData)
        })
      }

      console.log('entire data', attendedData)
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
      // worksheet.getCell('B2').value = { sharedFormula: 'A2', result: 10 };
      // const range = worksheet.getRange(`C2:C${attendedData.length + notAttendedData.length}`); // Adjust the range as needed
      // range.numberFormat = [["hh:mm:ss AM/PM"]];
      // worksheet.getColumn(`Class Start Date`).numFmt = 'm/d/yyyy h:mm'
      // worksheet.getColumn(`Class Start Date`).eachCell((cell,rowNumber)=>{
      //   // if(rowNumber!==1){
      //   //   cell.numFmt ='m/d/yyyy h:mm'
      //   // }
      //   console.log("start",cell)
      // })
      for(let i = 2;i <= attendedData.length + notAttendedData.length;i++){
        worksheet.getCell(`C${i}`).numFmt ='m/d/yyyy h:mm';
      }
      // worksheet.getCell('C2').numberFormat = [["dd/mm/yyyy hh:mm:ss AM/PM"]];
      attendedData.forEach(row => {
        worksheet.addRow([row['Employee Number'], row.ActivityCode,this.formattedStartDate,this.formattedStartDate,this.formattedEndDate, " ", " ", " ", " ", " ", " ", " ", row.Timezone, row.Status, " ", row['Subscription Source Activity Code'], " ", " ", row['Completion Status'], " ", " ", " "]);
      });
      notAttendedData.forEach(row => {
        worksheet.addRow([row['Employee Number'], row.ActivityCode,this.formattedStartDate,this.formattedStartDate, " ", " ", " ", " ", " ", " ", " ", " ", row.Timezone, " ", " ", row['Subscription Source Activity Code'], " ", " ", " ", " ", " ", " "]);
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
    timeZone() {
      return this.region !== 'Americas' ? 'Asia/Calcutta' : 'America/Mexico City'
    },
    activityClassCode(){
      return `VILT_CMP_${this.selectedMonth}_${this.trainingName}_CLS`
    },
    activitySessionCode(){
      return `VILT_CMP_${this.selectedMonth}_${this.trainingName}_SN`
    },
    formattedStartDate(){
      if(this.startDate !== null){
        const momentDate = moment(this.startDate.toString());
        momentDate.seconds(0);
        const formattedDate = momentDate.format("M/D/YYYY hh:mm:ss A");
        return formattedDate;
      }
      return null
    },
    formattedEndDate(){
      if(this.endDate !== null){
        const momentDate = moment(this.endDate.toString());
        momentDate.seconds(0);
        const formattedDate = momentDate.format("M/D/YYYY hh:mm:ss A");
        return formattedDate;
      }
      return null
    }
  },
  // Other options like 'created', 'mounted', etc. can be defined here
};
</script>
<style>
.row>label {
  display: inline-block;
  width: 135px;
}

.row {
  margin: 10px 0px;
  display: flex;
  align-items: center;
}

.input-form-data {
  width: 40%;
}
.input-preview-data{
  width: 60%;
}
@media screen and (max-width: 1024px) {
  /* Your CSS rules for screens up to 1024px wide */
  .main-container{
    flex-wrap:wrap;
    justify-content: center;
  }
  .input-form-data {
  width: 100%;
}
.input-preview-data{
  width: 100%;
}
}

</style>