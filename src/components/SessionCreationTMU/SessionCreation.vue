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
                <label>Description</label>
                <div style="display: flex;align-items: center;gap: 5px;">
                  <RadioButton v-model="trainingDescrition" inputId="description1" name="description" value="Technical" />
                  <label for="description1" style="margin-right: 10px;">Technical</label>
                </div>
                <div style="display: flex;align-items: center;gap: 5px;">
                  <RadioButton v-model="trainingDescrition" inputId="description2" name="description" value="Language" />
                  <label for="description2" style="margin-right: 10px;" class="ml-2">Language</label>
                </div>
                <div style="display: flex;align-items: center;gap: 5px;">
                  <RadioButton v-model="trainingDescrition" inputId="description3" name="description" value="Behavioral" />
                  <label for="description3" style="margin-right: 10px;" class="ml-2">Behavioral</label>
                </div>
                <div style="display: flex;align-items: center;gap: 5px;">
                  <RadioButton v-model="trainingDescrition" inputId="description4" name="description" value="Process" />
                  <label for="description4" class="ml-2">Process</label>
                </div>
              </div>
                <div class="row">
                  <label>Training Month</label>
                  <Dropdown v-model="selectedMonth" :options="months" placeholder="Select a Month" class="w-full md:w-14rem" />
                </div>
                <div class="row" v-if="this.region === 'India'">
                  <label>Competency Dev</label>
                  <Dropdown v-model="selectedCompetency" :options="competencyDev" placeholder="Select a Competency" class="w-full md:w-14rem" />
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
                  <label>Hours</label>
                  <InputText type="number" v-model="trainingDuration" />
                </div>

                <div class="row">
                <label>Training Type</label>
                <div style="display: flex;align-items: center;gap: 5px;">
                  <RadioButton v-model="trainerType" inputId="ingredient1" name="pizza" value="Internal" />
                  <label for="ingredient1" style="margin-right: 10px;">Internal</label>
                </div>
                <div style="display: flex;align-items: center;gap: 5px;">
                  <RadioButton v-model="trainerType" inputId="ingredient2" name="pizza" value="External" />
                  <label for="ingredient2" class="ml-2">External</label>
                </div>
              </div>
              <!-- <div class="row">
                <label>Trainer ID</label>
                <AutoComplete v-model="selectedEmpId" multiple optionLabel="NEW_EMP_ID" :suggestions="filteredEmpId" @complete="searchEmployeeId" />

                 <InputText type="text" v-model="trainerEmpId" />
              </div> -->
              <div class="row" v-if='trainerType === "Internal"'>
                <label>Trainer Name</label>
                <AutoComplete v-model="selectedEmpName" multiple optionLabel="NAME" :suggestions="filteredName" @complete="searchEmployeeName" />
                <!-- <InputText type="text" v-model="trainerEmpId" /> -->
              </div>
              <!-- <div class="row">
                <label>Trainer Name</label>
                <InputText type="text" v-model="trainerName" disabled />
              </div> -->
              <Button @click="exportToExcel">Session Creation TMU</Button>
        </div>
        <div class="input-preview-data">
          <div class="row">
                  <label>Session Code</label>
                  <!-- <p>VILT_{{region !== 'Americas'?'CMP':'MX'}}_{{selectedMonth}}_{{Training Name}}_SN{{ classNumber }}</p>
        -->
                  <InputGroup>
                    <InputGroupAddon>VILT_{{region !== 'Americas'?'CMP':'MX'}}_</InputGroupAddon>
                    <InputText placeholder="Month" v-model="selectedMonth" disabled />
                    <InputText placeholder="Training Name" v-model="trainingName" disabled />
                    <InputGroupAddon>_SN{{ classNumber }}</InputGroupAddon>
                  </InputGroup>
                  <!-- <InputText type="text" v-model="sessionCode" /> -->
                </div>
          
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
                <!-- <DataTable :value="selectedEmpId">
                  <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header"></Column>
                </DataTable> -->
                 <!-- <Textarea v-model="trainingImportData" autoResize rows="5" cols="15" />
         -->
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
        trainingImportData:null,
        trainerType:"Internal",
        selectedEmpName:null,
        filteredName:null,
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
            "Link Type",
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
            "Block Registration DAYS",
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
        trainingDuration:1,
        selectedCompetency:null,
        selectedEmpId:null,
        trainerEmpId:null,
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        competencyDev: ["BIBA","IMS","ATM","DA"],
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
        trainingDescrition: 'Technical',
        filteredEmpId:[],
        employessData:[]
      };
    },
    watch: {
  
    },
    created(){
      this.columns = [
            { field: 'EMP ID', header: 'EMP ID' },
            { field: 'NAME', header: 'NAME' },
            // { field: 'category', header: 'Category' },
            // { field: 'quantity', header: 'Quantity' }
        ];
    },
    methods: {
      searchEmployeeId(event) {
            setTimeout(() => {
                if (!event.query.trim().length) {
                    // this.filteredEmpId = [...this.employessData.NEW_EMP_ID];
                } else {
                  const nonReactiveData = Object.assign([], this.employessData); // Create a non-reactive copy of the data
                  const filterResults = nonReactiveData.filter((country) => {
                  return country.NEW_EMP_ID.toString().toLowerCase().startsWith(event.query.toLowerCase());
                  }).slice(0, 10)
                  this.filteredEmpId= filterResults;
                  console.log("empid",JSON.parse(JSON.stringify(this.filteredEmpId)))
                }
            }, 250);
      },
      searchEmployeeName(event) {
            setTimeout(() => {
                if (!event.query.trim().length) {
                    // this.filteredEmpId = [...this.employessData.NEW_EMP_ID];
                } else {
                  const nonReactiveData = Object.assign([], this.employessData); // Create a non-reactive copy of the data
                  const filterResults = nonReactiveData.filter((country) => {
                  return country.NAME.toString().toLowerCase().startsWith(event.query.toLowerCase());
                  }).slice(0, 10)
                  this.filteredName= filterResults;
                  console.log("empid",JSON.parse(JSON.stringify(this.filteredName)))
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
      const headers = jsonData[0];
const dataRows = jsonData.slice(1);

const extractedData = dataRows.map(row => {
  const rowData = {};
  headers.forEach((header, index) => {
    rowData[header] = row[index];
  });
  return rowData;
});
this.employessData = extractedData
// const jsonString = JSON.stringify(extractedData); // Create a Blob from the JSON string
// const blob = new Blob([jsonString], { type: "application/json" }); // Create a URL for the Blob
// const url = URL.createObjectURL(blob); // Create an anchor element and set the download attribute
// const a = document.createElement('a'); 
// a.href = url; 
// a.download = 'data.json'; // Append the anchor element to the document body and simulate a click
// document.body.appendChild(a); 
// a.click(); // Clean up by removing the anchor element and revoking the Blob URL
// document.body.removeChild(a);
// URL.revokeObjectURL(url);
      console.log("data",extractedData);
      },
      async exportToExcel() {    
        const rowOne = this.headerColumn.map(header => {
          switch (header) {        
            case "Activity Code":     
              return { [header]: this.activityCourseCode };        
            case "Name":    
              return { [header]: `${this.trainingName}` };        
            case "Activity Label":             
              return { [header]: 'ILT Course' };
            case "Domain Code":
              return { [header]: 'Global' };
              case "Description": 
              return { [header]: this.formattedTrainingDescription };  
              case "Active Indicator": 
              return { [header]: 1 };  
              case "Open Indicator": 
              return { [header]: 1 };  
            case "Cancel Indicator": 
              return { [header]: 0 };
              case "Time zone": 
              return { [header]: this.timeZone };
              case "Hidden from search": 
              return { [header]: 1 }
              case "Can Be Copied": 
              return { [header]: 1 }
              case "Contribute to parent activity": 
              return { [header]: 1 }
            default:
              return { [header]: '' };
          }
        });
        const rowTwo = this.headerColumn.map(header => {
          switch (header) {        
            case "Activity Code":     
              return { [header]: this.activityClassCode };        
            case "Name":    
              return { [header]: `${this.trainingName}_${this.getStartDayAndMonth} - ${this.getEndDayAndMonth}` };        
            case "Parent Code":             
              return { [header]: this.activityCourseCode };    
            case "Activity Label":             // Action for Activity Label
              return { [header]: 'ILT Class' };
            case "Domain Code": 
              return { [header]: 'Global' };  
            case "Start Date": 
              return { [header]: this.formattedStartDate };  
            case "End Date": 
              return { [header]: this.formattedEndDate };  
              case "Delivery Method": 
              return { [header]: "Virtual" };  
            case "Active Indicator": 
              return { [header]: 1 };  
              case "Open Indicator": 
              return { [header]: 1 };  
            case "Cancel Indicator": 
              return { [header]: 0 };  
              case "Link Type": 
              return { [header]: 1 };  
              case "Status": 
              return { [header]: 1 }; 
              case "Media Type": 
              return { [header]: this.region === "India" ? this.selectedCompetency : 'Common' }; 
              case "Description": 
              return { [header]: this.formattedTrainingDescription }; 
              case "Hours": 
              return { [header]: this.trainingDuration };  
              case "Instructor Note": 
              return { [header]: this.hexavarsityLocation }; 
              case "Time zone": 
              return { [header]: this.timeZone };
              case "Location": 
              return { [header]: this.location };
              case "Hidden from search": 
              return { [header]: 1 }
              case "Can Be Copied": 
              return { [header]: 1 }
              case "Contribute to parent activity": 
              return { [header]: 1 }
              case "Keywords": 
              return { [header]: 'NA' }
              case "Instructor": 
              return { [header]: this.selectedEmpName && this.selectedEmpName.length > 0 ? this.selectedEmpName[0]['EMP ID'] : ''}; 
            default:
              return { [header]: '' };
          }
        });
        const rowThree = this.headerColumn.map(header => {
          switch (header) {        
            case "Activity Code":     
              return { [header]: this.activitySessionCode };          
            case "Name":    
              return { [header]: `${this.trainingName} 2025 ${this.selectedMonth} Class ${this.classNumber}` };        
            case "Parent Code":            
              return { [header]: this.activityClassCode };
            case "Parent Start Date":             
              return { [header]:  this.formattedStartDate };   
            case "Activity Label":             
              return { [header]: 'Session' };     
            case "Domain Code": 
              return { [header]: 'Global' };  
              case "Start Date": 
              return { [header]: this.formattedStartDate };  
            case "End Date": 
              return { [header]: this.formattedEndDate };    
            case "Active Indicator": 
              return { [header]: 1 };  
              case "Open Indicator": 
              return { [header]: 1 };  
            case "Cancel Indicator": 
              return { [header]: 0 };  
              case "Link Type": 
              return { [header]: 2 }; 
              case "Description": 
              return { [header]: this.formattedTrainingDescription };  
              case "Instructor Note": 
              return { [header]: this.hexavarsityLocation }; 
              case "Time zone": 
              return { [header]: this.timeZone };
              case "Location": 
              return { [header]: this.location };
              case "Hidden from search": 
              return { [header]: 1 }
              case "Can Be Copied": 
              return { [header]: 1 }
              case "Contribute to parent activity": 
              return { [header]: 1 } 
              case "Instructor": 
              return { [header]: this.selectedEmpName && this.selectedEmpName.length > 0 ? this.selectedEmpName[0]['EMP ID'] : '' }; 
              default: 
              return { [header]: '' };
          } 
        });
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Session CreationTMU')     
        worksheet.addRow(this.headerColumn);        
        worksheet.getColumn(4).numFmt = 'm/d/yyyy h:mm';
        worksheet.getColumn(7).numFmt = 'm/d/yyyy h:mm';
        worksheet.getColumn(8).numFmt = 'm/d/yyyy h:mm';
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
      worksheet.addRow(rowOne.flatMap((row)=>Object.values(row)))
      worksheet.addRow(rowTwo.flatMap((row)=>Object.values(row)))
      worksheet.addRow(rowThree.flatMap((row)=>Object.values(row)))
        const blob = await workbook.xlsx.writeBuffer();
        const blobUrl = window.URL.createObjectURL(new Blob([blob], { type: 'application/octet-stream' }));       // Create a download link      
        const downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.setAttribute('download', `${this.trainingName ? this.trainingName : 'Session Creation TMU'}.xlsx`);       // Simulate a click event on the download link     
        downloadLink.click();       // Clean up by revoking the blob URL       
        window.URL.revokeObjectURL(blobUrl);
      }
    },
    computed: {
      formattedTrainingDescription(){
        if(this.region === 'India'){
          return `${this.trainingDescrition};Competency Dev;Unit Specific;${this.selectedCompetency}`
        }
        else{
          if(this.trainingDescrition === 'Process'){
            return `${this.trainingDescrition};${this.trainingDescrition};Generic;Hexavarsity Americas`
          }
          return `${this.trainingDescrition};Demand Based;Generic;Hexavarsity Americas`
        }
      },
      timeZone() {
        return this.region !== 'Americas' ? 'Asia/Calcutta' : 'America/Mexico City'
      },
      location() {
        return this.region !== 'Americas' ? 'India' : 'Americas'
      },
      hexavarsityLocation() {
        return this.region !== 'Americas' ? 'Hexavarsity India' : 'Hexavarsity Americas'
      },
      activityCourseCode(){
        return `VILT_${this.region !== 'Americas'?'CMP':'MX'}_${this.trainingName} 2025`
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
      },
      getStartDayAndMonth(){
        if(this.startDate !== null){
          const formattedDate = moment(this.startDate).format("D MMM");
          return formattedDate
        }
        return null
      },
      getEndDayAndMonth(){
        if(this.endDate !== null){
          const formattedDate = moment(this.endDate).format("D MMM");
          return formattedDate
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
  label{
    color:black;
  }
  .row {
    margin: 15px 0px;
    display: flex;
    align-items: center;
  }
  
  .input-form-data {
    background-color: white;
    width: 60%;
    padding: 20px;
  }
  .input-preview-data{
    width: 40%;
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