<template>
  <div>
    <div style="display: flex; gap: 20px" class="main-container">
      <div class="input-form-data">
        <div>
          <div class="row">
            <label>Employee Data</label>
            <InputText type="file" @change="handleEmployeeData" accept=".xlsx, .xls" />
          </div>

          <div class="row">
            <label>Employee Number</label>
            <div style="display: flex; flex-direction: column; padding-right: 10px">
              <label
                >Attended <Badge severity="info">{{ employeeIdsOfAttended.length }}</Badge></label
              >
              <Textarea v-model="attended" autoResize rows="5" cols="15" />
            </div>
            <div style="display: flex; flex-direction: column">
              <label
                >Not Attended
                <Badge severity="info">{{ employeeIdsOfNotAttended.length }}</Badge></label
              >
              <Textarea v-model="notAttended" autoResize rows="5" cols="15" />
            </div>
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
            <Dropdown
              v-model="selectedMonth"
              :options="months"
              placeholder="Select a Month"
              class="w-full md:w-14rem"
            />
          </div>
        </div>
        <div class="row">
          <label>India Or Americas</label>
          <div style="display: flex; align-items: center; gap: 5px">
            <RadioButton v-model="region" inputId="ingredient1" name="pizza" value="India" />
            <label for="ingredient1" style="margin-right: 10px">India</label>
          </div>
          <div style="display: flex; align-items: center; gap: 5px">
            <RadioButton v-model="region" inputId="ingredient2" name="pizza" value="Americas" />
            <label for="ingredient2" class="ml-2">Americas</label>
          </div>
          <!-- <label>Check the box if it is India Training</label>
        <Checkbox v-model="isIndia" :binary="true" /> -->
        </div>


        <div class="row">
                <label>Training Type</label>
                  <div style="display: flex;align-items: center;gap: 5px;">
                    <RadioButton v-model="trainingType" inputId="DemandBased" name="DemandBased" value="DemandBased" />
                    <label for="DemandBased" class="ml-2" style="margin-right: 10px;">Demand Based</label>
                  </div>
                  <div style="display: flex;align-items: center;gap: 5px;">
                    <RadioButton v-model="trainingType" inputId="Competency" name="Competency" value="Competency" />
                    <label for="Competency" >Competency</label>
                  </div>
              </div>
              


              <div class="row">
                <label>Mode</label>
                  <div style="display: flex;align-items: center;gap: 5px;">
                    <RadioButton v-model="modeofTraining" inputId="Virtual" name="Virtual" value="Virtual" />
                    <label for="Virtual" class="ml-2" style="margin-right: 10px;">Virtual</label>
                  </div>
                  <div style="display: flex;align-items: center;gap: 5px;">
                    <RadioButton v-model="modeofTraining" inputId="InPerson" name="InPerson" value="InPerson" />
                    <label for="InPerson">InPerson</label>
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
        <Button @click="exportToExcel">Export TMU</Button>
      </div>
      <div class="input-preview-data">
        <div class="row">
          <label>Session Code</label>
          <InputGroup>
            <InputGroupAddon>{{modeofTraining==="InPerson" ? "ILT" :"VILT"}}_{{region !== 'Americas'? trainingType=== "Competency" ?'CMP': 'AR' :'MX'}}_</InputGroupAddon>
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
            <InputGroupAddon>{{modeofTraining==="InPerson" ? "ILT" :"VILT"}}_{{region !== 'Americas'? trainingType=== "Competency" ?'CMP': 'AR' :'MX'}}_</InputGroupAddon>
            <InputText placeholder="Month" v-model="selectedMonth" disabled />
            <InputText placeholder="Training name" v-model="trainingName" disabled />
            <InputGroupAddon>_CLS{{ classNumber }}</InputGroupAddon>
          </InputGroup>
          <!-- <InputText type="text" v-model="classCode" /> -->
        </div>

<!-- 
        <Card style="width: 30rem; overflow: hidden">
    <template #title>{{trainingName ? trainingName : "Training Name" }}</template>
    <template #subtitle>

      <p class="m-0">
            Class Code : {{modeofTraining==="InPerson" ? "ILT" :"VILT"}}_{{region !== 'Americas'? trainingType=== "Competency" ?'CMP': 'AR' :'MX'}}_{{ selectedMonth ? selectedMonth : "Month" }}_{{ trainingName ? trainingName : "Training Name" }}_CLS{{ classNumber }}
        </p>
         <p class="m-0">
          Session Code : {{modeofTraining==="InPerson" ? "ILT" :"VILT"}}_{{region !== 'Americas'? trainingType=== "Competency" ?'CMP': 'AR' :'MX'}}_{{ selectedMonth ? selectedMonth : "Month" }}_{{ trainingName ? trainingName : "Training Name" }}_SN{{ classNumber }}
          </p>
    </template>
    
    <template #content>
        <p class="m-0">
        Start Date : {{ formattedStartDate ? formattedStartDate : "Start Date" }}
        </p>
         <p class="m-0">

        End Date : {{ formattedEndDate ? formattedEndDate : "End Date"  }}
          </p>
    </template>
</Card> -->


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
import moment from 'moment'

export default {
  data() {
    return {
      modeofTraining:"InPerson",
      trainingType:"DemandBased",
      employessData: null,
      headerColumn: [
        'Employee Number',
        'ActivityCode',
        'Class Start Date',
        'Registration Date',
        'Completion Date',
        'First Launch Date',
        'Score',
        'Passed',
        'Cancellation Date',
        'Payment Term',
        'Cost',
        'Currency',
        'Timezone',
        'Status',
        'Notes',
        'Subscription Source Activity Code ',
        'Subscription Source Activity Start Date ',
        'Elapsed Time (in seconds)',
        'Completion Status',
        'Location_Name',
        'Slotstart_Date',
        'Slotend_Date'
      ],
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      selectedMonth: null,
      employeeNo: '63863',
      sixDigitIds: [],
      sixDigitIdsNotAttended : [],
      trainingName: null,
      trainingMonth: null,
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
      employeeIdsOfNotAttended: []

      // Your reactive data properties here
    }
  },
  watch: {
    attended(newValue, oldValue) {
      if (this.employessData && this.employessData.length > 0) {
        const result = this.splitEmployeeIds(newValue)
          .map(({ number }) => {
            const match = this.employessData.find(
              ({ NEW_EMP_ID }) => NEW_EMP_ID.toString() === number
            )
            return match ? {number:match['EMP ID']} : null // Return EMP ID if match found, otherwise null
          })
          .filter((empId) => empId !== null) // Filter out null values
          this.employeeIdsOfAttended = result
          console.log('attended', this.employeeIdsOfAttended)
      }
      else{
        this.employeeIdsOfAttended = this.splitEmployeeIds(newValue)
        console.log('attended', this.splitEmployeeIds(newValue))
      }
    },
    notAttended(newValue, oldValue) {
      if (this.employessData && this.employessData.length > 0) {
        const result = this.splitEmployeeIds(newValue)
          .map(({ number }) => {
            const match = this.employessData.find(
              ({ NEW_EMP_ID }) => NEW_EMP_ID.toString() === number
            )
            return match ? {number:match['EMP ID']} : null // Return EMP ID if match found, otherwise null
          })
          .filter((empId) => empId !== null) // Filter out null values
          
          this.employeeIdsOfNotAttended = result
      }
      else{
        this.employeeIdsOfNotAttended = this.splitEmployeeIds(newValue)
      console.log('notAttended', this.splitEmployeeIds(newValue))
      
      }
    }
  },
  methods: {
    splitEmployeeIds(employeeids) {
      let chunks = this.employessData && this.employessData.length > 0 ? employeeids.match(/.{1,10}/g) : employeeids.match(/.{1,5}/g)
      return chunks ? chunks.map((chunk, index) => ({ ['number']: chunk })) : []
    },
    async handleFileUpload(event) {
      const file = event.target.files[0]
      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.load(file)
      const worksheet = workbook.getWorksheet()
      console.log('workbook', workbook)
      const jsonData = []
      worksheet.eachRow((row) => {
        const rowData = []
        row.eachCell((cell) => {
          rowData.push(cell.value)
        })
        jsonData.push(rowData)
      })
      this.data = jsonData
      console.log('data', jsonData)
    },
    async exportToExcel() {
      const rowDataForAttended = [
        {
          'Employee Number': '',
          ActivityCode: this.activitySessionCode,
          'Class Start Date': this.startDate,
          'Registration Date': this.startDate,
          'Completion Date': this.endDate,
          'First Launch Date': '',
          Score: '',
          Passed: '',
          'Cancellation Date': '',
          'Payment Term': '',
          Cost: '',
          Currency: '',
          Timezone: this.timeZone,
          Status: 4,
          Notes: '',
          'Subscription Source Activity Code': this.activityClassCode,
          'Subscription Source Activity Start Date': '',
          'Elapsed Time (in seconds)': '',
          'Completion Status': 1,
          Location_Name: '',
          Slotstart_Date: '',
          Slotend_Date: ''
        }
      ]
      const rowDataForNotAttended = [
        {
          'Employee Number': '',
          ActivityCode: this.activitySessionCode,
          'Class Start Date': this.startDate,
          'Registration Date': this.startDate,
          'Completion Date': this.endDate,
          'First Launch Date': '',
          Score: '',
          Passed: '',
          'Cancellation Date': '',
          'Payment Term': '',
          Cost: '',
          Currency: '',
          Timezone: this.timeZone,
          Status: null,
          Notes: '',
          'Subscription Source Activity Code': this.activityClassCode,
          'Subscription Source Activity Start Date': '',
          'Elapsed Time (in seconds)': '',
          'Completion Status': null,
          Location_Name: '',
          Slotstart_Date: '',
          Slotend_Date: ''
        }
      ]

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
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('TMU') // Add header row
      worksheet.addRow(this.headerColumn) // Add data rows
      const headerRow = worksheet.getRow(1)
      worksheet.getColumn(3).numFmt = 'm/d/yyyy h:mm'
      worksheet.getColumn(4).numFmt = 'm/d/yyyy h:mm'
      worksheet.getColumn(5).numFmt = 'm/d/yyyy h:mm'
      worksheet.columns.forEach((column, columnIndex) => {
        let maxLength = 0
        column.eachCell({ includeEmpty: true }, (cell) => {
          const columnLength = cell.value ? cell.value.toString().length : 20
          // Minimum width 10
          if (columnLength > maxLength) {
            maxLength = columnLength
          }
        })
        column.width = maxLength < 20 ? 20 : maxLength
      })

      attendedData.forEach((row) => {
        worksheet.addRow([
          row['Employee Number'],
          row.ActivityCode,
          this.formattedStartDate,
          this.formattedStartDate,
          this.formattedEndDate,
          ' ',
          ' ',
          ' ',
          ' ',
          ' ',
          ' ',
          ' ',
          row.Timezone,
          row.Status,
          ' ',
          row['Subscription Source Activity Code'],
          ' ',
          ' ',
          row['Completion Status'],
          ' ',
          ' ',
          ' '
        ])
      })
      notAttendedData.forEach((row) => {
        worksheet.addRow([
          row['Employee Number'],
          row.ActivityCode,
          this.formattedStartDate,
          this.formattedStartDate,
          ' ',
          ' ',
          ' ',
          ' ',
          ' ',
          ' ',
          ' ',
          ' ',
          row.Timezone,
          ' ',
          ' ',
          row['Subscription Source Activity Code'],
          ' ',
          ' ',
          ' ',
          ' ',
          ' ',
          ' '
        ])
      })

      // Save the workbook to a blob
      const blob = await workbook.xlsx.writeBuffer()
      // Create a blob URL
      const blobUrl = window.URL.createObjectURL(
        new Blob([blob], { type: 'application/octet-stream' })
      ) // Create a download link
      const downloadLink = document.createElement('a')
      downloadLink.href = blobUrl
      downloadLink.setAttribute('download', 'example.xlsx') // Simulate a click event on the download link
      downloadLink.click() // Clean up by revoking the blob URL
      window.URL.revokeObjectURL(blobUrl)
    },
    async handleEmployeeData(event) {
      const file = event.target.files[0]
      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.load(file)
      const worksheet = workbook.getWorksheet()
      console.log('workbook', workbook)
      const jsonData = []
      worksheet.eachRow((row) => {
        const rowData = []
        row.eachCell((cell) => {
          rowData.push(cell.value)
        })
        jsonData.push(rowData)
      })
      this.data = jsonData
      const headers = jsonData[0]
      const dataRows = jsonData.slice(1)

      const extractedData = dataRows.map((row) => {
        const rowData = {}
        headers.forEach((header, index) => {
          rowData[header] = row[index]
        })
        return rowData
      })
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
      console.log('data', extractedData)
    }
  },
  computed: {
    timeZone() {
      return this.region !== 'Americas' ? 'Asia/Calcutta' : 'America/Mexico City'
    },
    activityClassCode() {
        return `${this.modeofTraining==="InPerson" ? "ILT" :"VILT"}_${this.region !== 'Americas'? this.trainingType=== "Competency" ?'CMP': 'AR' :'MX'}_${this.selectedMonth}_${this.trainingName}_CLS${this.classNumber}`
    },
    activitySessionCode() {
         return `${this.modeofTraining==="InPerson" ? "ILT" :"VILT"}_${this.region !== 'Americas'? this.trainingType=== "Competency" ?'CMP': 'AR' :'MX'}_${this.selectedMonth}_${this.trainingName}_SN${this.classNumber}`
   },
    formattedStartDate() {
      if (this.startDate !== null) {
        const momentDate = moment(this.startDate.toString())
        momentDate.seconds(0)
        const formattedDate = momentDate.format('M/D/YYYY HH:mm')
        const parsedDate = moment.utc(formattedDate).toDate()
        return parsedDate
      }
      return null
    },
    formattedEndDate() {
      if (this.endDate !== null) {
        const momentDate = moment(this.endDate.toString())
        momentDate.seconds(0)
        const formattedDate = momentDate.format('M/D/YYYY HH:mm')
        const parsedDate = moment.utc(formattedDate).toDate()
        return parsedDate
      }
      return null
    }
  }
  // Other options like 'created', 'mounted', etc. can be defined here
}
</script>
<style scoped>
label {
  margin-bottom: 5px;
}
</style>
<style>
.row > label {
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
.input-preview-data {
  width: 60%;
}
.p-inputtextarea{
  max-height: 108px;
  overflow: auto;
}
@media screen and (max-width: 1024px) {
  /* Your CSS rules for screens up to 1024px wide */
  .main-container {
    flex-wrap: wrap;
    justify-content: center;
  }
  .input-form-data {
    width: 100%;
  }
  .input-preview-data {
    width: 100%;
  }
}
</style>
