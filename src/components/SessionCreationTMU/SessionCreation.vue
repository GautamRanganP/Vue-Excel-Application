<template>
    <div>
      <div style="display:flex;gap:20px;" class="main-container">
        <div class="input-form-data">
              <div>
              
    <div class="row">
        <label>Employee Data</label>
          <!-- <Toast />
          <FileUpload mode="basic" name="demo[]" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" :maxFileSize="1000000" @upload="onUpload" :auto="true" chooseLabel="Browse" />
         -->
<InputText type="file" @change="handleFileUpload" accept=".xlsx, .xls" />
        </div>

                <div class="row">
                  <label>Training name</label>
                  <InputText type="text" v-model="trainingName" />
                </div>
                <div class="row">
                  <label>Class Number</label>
                  <InputText type="number" v-model="classNumber" />
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
              <div class="row">
                <label>Trainer Employee ID</label>
                <AutoComplete v-model="selectedEmpId" optionLabel="name" :suggestions="filteredEmpId" @complete="searchEmployeeId" />

                <!-- <InputText type="text" v-model="trainerEmpId" /> -->
              </div>
              <Button @click="exportToExcel">Session Creation TMU</Button>
        </div>
        <div class="input-preview-data">
          <div class="row">
                  <label>Session Code</label>
                  <InputGroup>
                    <InputGroupAddon>VILT_{{region !== 'Americas'?'CMP':'MX'}}_</InputGroupAddon>
                    <InputText placeholder="Month" v-model="selectedMonth" disabled />
                    <InputText placeholder="Training Name" v-model="trainingName" disabled />
                    <InputGroupAddon>_SN{{ classNumber }}</InputGroupAddon>
                  </InputGroup>
                  <!-- <InputText type="text" v-model="sessionCode" /> -->
                </div>
          <DataTable :value="employeeIdsOfAttended" showGridlines>
            <Column field="number" header="Attended"></Column>
          </DataTable>
          <div class="row">
                  <label>Class Code</label>
                  <InputGroup>
                    <InputGroupAddon >VILT_{{region !== 'Americas'?'CMP':'MX'}}_</InputGroupAddon>
                    <InputText placeholder="Month" v-model="selectedMonth" disabled />
                    <InputText placeholder="Training name" v-model="trainingName" disabled />
                    <InputGroupAddon>_CLS{{ classNumber }}</InputGroupAddon>
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
            "Activity Code",
            "Name",
            "Parent Code",
            "Parent Start Date",
            "Activity Label",
            "Domain Code",
            "Start Date",
            "End Date",
            "Delivery Method",
            "Active Indicator",
            "Open Indicator",
            "Cancel Indicator",
            "Link",
            "Type",
            "Status",
            "Vendor",
            "Default Payment Term",
            "Media Type",
            "Content Type",
        	"Description",
            "Cost",
            "Hours",
            "Credit Hours",
            "Cancel Day",
            "Passing Grade",
            "Instructor Note",
            "Employee Note",
            "URL",
            "Require Approval",
            "Approver",
            "Currency",
            "Instructor",
            "CBT Launch Method",
            "CBT Launch Path",
            "Max. Attempts",
            "Time zone",
            "Location",
            "Min Capacity",
            "Max Capacity",
            "Certification Indicator",
            "Certification DAYS",
            "Activity owner user number",
            "Activity contact user number",
            "Can be subscribed",
            "Can be fulfilled",
            "Hidden from search",
            "No Registration Required",
            "Hidden in Manager mode",
            "Hidden from Transcript",
            "Can Be Copied",
            "Contribute to parent activity",
            "Required to be completed",
            "Cancellation fee",
            "Late Cancellation Fee",
            "No show fee",
            "CertificationExpiration Rule Type",
            "Certification Expiration DAYS Value",
            "Certification Expiration Month Value",
            "UseRecordedSessions",
            "Conference Details",
            "ScoName",
            "VersionNo",
            "PrevionsVersionNo",
            "Issue Date",
            "Effective Date",
            "Update Related Activity",
            "Enroll Completed",
            "Enroll InProgress",
            "ReTraining Required",
            "Consider versional roster",
            "RestrictEnrolltoAssign",
            "EnrollNewUser",
            "CanLearnerSign",
            "CanInstAdminSign",
            "Can Manager Sign",
            "Keywords",
            "CustomRank",
            "Registration Deadline Date",
            "Express Interest Flag",
            "Learning Activity Sequencing Flag",
            "Language",
            "ConsiderCurriculaRoster",
            "RestrictEnrollOnCurriculum",
            "Completed training Required Indicator",
            "Completed training Due Rule",
            "Completed training Due DAYS",
            "Completed training Due Date",
            "Completed training Priority",
            "Completed training Notes",
            "In Progress training Required Indicator",
            "In Progress training Due Rule",
            "In Progress training Due DAYS",
            "In Progress training Due Date",
            "Completed training Priority2",
            "In Progress training Notes",
            "Additional Options training Required Indicator",
            "Additional Options training Due Rule",
            "Additional Options training Due DAYS",
            "Additional Options training Due Date",
            "Additional Options training Priority",
            "Additional Options training Notes",
            "Block Registration",
            "DAYS",
            "BaseMonthRecurrenceUnitType",
            "BaseMonthRecurrenceValue",
            "BaseMonthBeforeUnitType",
            "BaseMonthBeforeValue",
            "BaseMonthAfterUnitType",
            "BaseMonthAfterValue",
            "RetainBaseMonthAftrGracePeriod",
            "RetainBaseMonthBeforeGracePeriod",
            "GradingScale",
            "ObserverAsstOption",
            "ObserverAsstType",
            "ProfScaleName",
            "SelfAssessmentAllowed",
            "BlockRegType",
            "ReportURL",
            "PublishDate",
            "ActivityImageUrl",
            "AllowOneClickReg",
            "MobileEnabled",
            "IsPartOfBundle",
            "AllowCompletionMarkingBy",
            "RequireCompletionRequestComments",
            "AttemptLockBehaviorOnRoster",
            "EnforceActiveVersions",
            "Honor Versional Assignments",
            "Enrollment Option",
            "Due Date Calculation",
            "Due After Assignment Date",
            "Allow Version Direct Assignments",
            "Cancel Version Registrations",
            "Open Content in Tab"
        ],
        selectedEmpId:null,
        trainerEmpId:null,
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        selectedMonth:null,
        employeeNo: '63863',
        trainingName: null,
        trainingMonth:null,
        startDate: null,
        endDate: null,
        sessionCode: '',
        classCode: '',
        classNumber: 1,
        isIndia: false,
        region: 'India',
        attended: '',
        notAttended: '',
        employeeIdsOfAttended: [],
        employeeIdsOfNotAttended: [],
        filteredEmpId:[],
        employessData:[]
        
        // Your reactive data properties here
      };
    },
    watch: {
   
    },
    methods: {
      searchEmployeeId(event) {
            setTimeout(() => {
                if (!event.query.trim().length) {
                    // this.filteredEmpId = [...this.employessData.NEW_EMP_ID];
                } else {
                  let filterResults = []   
                  filterResults = this.employessData.filter((country) => {
                      console.log("search",country.NEW_EMP_ID)
                        return country.NEW_EMP_ID.toString().toLowerCase().startsWith(event.query.toLowerCase());
                    }).slice(0, 10).map((employee)=>{return employee.NEW_EMP_ID});
                    this.filteredEmpId = [...filterResults]
                    // this.filteredEmpId = filterResults.map((results)=> {return results.NEW_EMP_ID});
                    console.log("empid",this.filteredEmpId)
                }
            }, 250);
      },
      onUpload() {
            this.$toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
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
        // Provided Excel-like array
// const excelData = [
//   ["EMPID", "Name"],
//   [1234, "Gautam"],
//   [4343, "Raja"]
// ];

// Extracting headers (first row)
const headers = jsonData[0];

// Extracting data rows (excluding headers)
const dataRows = jsonData.slice(1);

// Convert data to an array of objects
const extractedData = dataRows.map(row => {
  const rowData = {};
  headers.forEach((header, index) => {
    rowData[header] = row[index];
  });
  return rowData;
});
this.employessData = extractedData
console.log("data",extractedData);

        // console.log("data", jsonData)
      },
      async exportToExcel() {    
  
        const rowDataForAttended = [
          { 'Employee Number': '', 'ActivityCode': this.activitySessionCode, 'Class Start Date': this.startDate, 'Registration Date': this.startDate, 'Completion Date': this.endDate, 'First Launch Date': '', 'Score': '', 'Passed': '', 'Cancellation Date': '', 'Payment Term': '', 'Cost': '', 'Currency': '', 'Timezone': this.timeZone, 'Status': 4, 'Notes': '', 'Subscription Source Activity Code': this.activityClassCode, 'Subscription Source Activity Start Date': '', 'Elapsed Time (in seconds)': '', 'Completion Status': 1, 'Location_Name': '', 'Slotstart_Date': '', 'Slotend_Date': '' }]
          const rowDataForNotAttended = [
          { 'Employee Number': '', 'ActivityCode': this.activitySessionCode, 'Class Start Date': this.startDate, 'Registration Date': this.startDate, 'Completion Date': this.endDate, 'First Launch Date': '', 'Score': '', 'Passed': '', 'Cancellation Date': '', 'Payment Term': '', 'Cost': '', 'Currency': '', 'Timezone': this.timeZone, 'Status': null, 'Notes': '', 'Subscription Source Activity Code': this.activityClassCode, 'Subscription Source Activity Start Date': '', 'Elapsed Time (in seconds)': '', 'Completion Status': null, 'Location_Name': '', 'Slotstart_Date': '', 'Slotend_Date': '' }]
        
        //   const attendedData = []
        // if (this.employeeIdsOfAttended && this.employeeIdsOfAttended.length > 0) {
        //   this.employeeIdsOfAttended.forEach((employeeId) => {
        //     const clonedEmployeeRowData = JSON.parse(JSON.stringify(rowDataForAttended[0]))
        //     clonedEmployeeRowData['Employee Number'] = employeeId.number
        //     attendedData.push(clonedEmployeeRowData)
        //   })
        // }
        // const notAttendedData = []
        // if (this.employeeIdsOfNotAttended && this.employeeIdsOfNotAttended.length > 0) {
        //   this.employeeIdsOfNotAttended.forEach((employeeId) => {
        //     const clonedEmployeeRowData = JSON.parse(JSON.stringify(rowDataForNotAttended[0]))
        //     clonedEmployeeRowData['Employee Number'] = employeeId.number
        //     notAttendedData.push(clonedEmployeeRowData)
        //   })
        // }     

        // const headerObjects = headerColumn.map(header => {
        //     return { [header]: '' }; 
        // });
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Session CreationTMU')       // Add header row    
        worksheet.addRow(this.headerColumn);       // Add data rows    
        const headerRow = worksheet.getRow(1);
        worksheet.getColumn(3).numFmt = 'm/d/yyyy h:mm';
        worksheet.getColumn(4).numFmt = 'm/d/yyyy h:mm';
        worksheet.getColumn(5).numFmt = 'm/d/yyyy h:mm';
        worksheet.columns.forEach((column, columnIndex) => {     
        let maxLength = 0;     
        column.eachCell({ includeEmpty: true }, (cell) => {         
          const columnLength = cell.value ? cell.value.toString().length : 20; 
          // Minimum width 10
          if (columnLength > maxLength) {             
            maxLength = columnLength;         
          }     
        });     
        column.width = maxLength < 20 ? 20 : maxLength; 
      });
  
        // attendedData.forEach(row => {
        //   worksheet.addRow([row['Employee Number'], row.ActivityCode,this.formattedStartDate,this.formattedStartDate,this.formattedEndDate, " ", " ", " ", " ", " ", " ", " ", row.Timezone, row.Status, " ", row['Subscription Source Activity Code'], " ", " ", row['Completion Status'], " ", " ", " "]);
        // });
        // notAttendedData.forEach(row => {
        //   worksheet.addRow([row['Employee Number'], row.ActivityCode,this.formattedStartDate,this.formattedStartDate, " ", " ", " ", " ", " ", " ", " ", " ", row.Timezone, " ", " ", row['Subscription Source Activity Code'], " ", " ", " ", " ", " ", " "]);
        // });
  
        // Save the workbook to a blob   
        const blob = await workbook.xlsx.writeBuffer();
        // Create a blob URL     
        const blobUrl = window.URL.createObjectURL(new Blob([blob], { type: 'application/octet-stream' }));       // Create a download link      
        const downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.setAttribute('download', `${this.trainingName ? this.trainingName : 'Session Creation TMU'}.xlsx`);       // Simulate a click event on the download link     
        downloadLink.click();       // Clean up by revoking the blob URL       
        window.URL.revokeObjectURL(blobUrl);
      }
    },
    computed: {
      timeZone() {
        return this.region !== 'Americas' ? 'Asia/Calcutta' : 'America/Mexico City'
      },
      location() {
        return this.region !== 'Americas' ? 'Hexavarsity India' : 'Hexavarsity Americas'
      },
      activityClassCode(){
        return `VILT_${this.region !== 'Americas'?'CMP':'MX'}_${this.selectedMonth}_${this.trainingName}_CLS${this.classNumber}`
      },
      activitySessionCode(){
        return `VILT_${this.region !== 'Americas'?'CMP':'MX'}_${this.selectedMonth}_${this.trainingName}_SN${this.classNumber}`
      },
      formattedStartDate(){
        if(this.startDate !== null){
          const momentDate = moment(this.startDate.toString());
          momentDate.seconds(0);     
          const formattedDate = momentDate.format("M/D/YYYY HH:mm");
          const parsedDate = moment.utc(formattedDate).toDate();
          return parsedDate;
        }
        return null
      },
      formattedEndDate(){
        if(this.endDate !== null){
          const momentDate = moment(this.endDate.toString());
          momentDate.seconds(0);
          const formattedDate = momentDate.format("M/D/YYYY HH:mm");
          const parsedDate = moment.utc(formattedDate).toDate();
          return parsedDate;
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