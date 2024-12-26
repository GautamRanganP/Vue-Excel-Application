<template>
  <Dialog
    v-model:visible="summaryModal"
    modal
    header="Attendance Sheet"
  >
     <div class="attendance-preview">
        <DataTable style="max-height: 300px;overflow: auto;" :value="attendedEmployee" showGridlines tableStyle="min-width: 25rem">
          <Column field="NEW_EMP_ID" header="NEW_EMP_ID"></Column>
          <Column field="NAME" header="NAME"></Column>
           <Column
            v-for="(training, index) in csvData.trainingParticipant"
            :key="index"
            :field="`Attendance.${training.date}`"
            :header="`${training.date}`"
          ></Column>
         </DataTable>
         <div class="btn-grp" style="justify-content: center;margin-top: 20px;">
          <Button label="Go Back" @click=" summaryModal = false"/>
        </div>
      </div>
  </Dialog>
  <Dialog
    v-model:visible="showDialog"
    modal
    header="Missing Employee ID"
    :style="{ width: '25rem' }"
  >
    <span>Update the information. {{ missingDate }}</span>
    <div class="form-input-grp">
      <label for="employeeId">Employee ID</label>
      <AutoComplete v-model="userInput" optionLabel="NEW_EMP_ID" :suggestions="employeeSuggestion" @complete="search" />
      <!-- <InputText id="employeeId" v-model="userInput" autocomplete="off" /> -->
    </div>
    <div class="form-input-grp">
      <label for="employeeName">Employee Name</label>
      <InputText id="employeeName" v-model="employeeName" autocomplete="off" disabled />
    </div>
    <div class="btn-grp">
      <Button label="Submit" @click="submitDialog" />
      <Button label="Cancel" @click="cancelDialog" />
    </div>
    <div v-if="bestMatch && bestMatch.length > 0" class="grp-data-table">
      <h4>Best Match</h4>
      <DataTable :value="bestMatch">
        <Column field="NEW_EMP_ID" header="Code"></Column>
        <Column field="NAME" header="Name"></Column>
      </DataTable>
    </div>
    <div class="grp-data-table">
      <h4>Entire Nomination List</h4>
      <DataTable :value="nominationList">
        <Column field="NEW_EMP_ID" header="Code"></Column>
        <Column field="NAME" header="Name"></Column>
      </DataTable>
    </div>
  </Dialog>
  <div class="card-wrap">
  <Card v-show="!finalAttendance.length > 0">
    <template #title>
      <div style="font-weight: 600">Attendance Report Generator</div>
    </template>
    <template #content>
      <form @submit.prevent="handleSubmit" id="attendance-form">
        <div class="attendance-report">
          <label for="teamsAttendance">Teams Attendance</label>
          <input
            type="file"
            ref="teamsAttendanceFile"
            multiple
            accept=".xlsx, .xls, .csv"
            id="teamsAttendance"
          />
          <label for="nomination">Nomination</label>
          <input
            type="file"
            ref = "nominationFile"
            accept=".xlsx, .xls, .csv"
            id="nomination"
          />
          <label>Minimum Duration to stay</label>
          <select v-model="selectedOption">
              <option value = "0" >0 mins</option>
              <option value = "15">15 mins</option>
              <option value = "30">30 mins</option>
              <option value = "30">45 mins</option>
          </select>
        </div>
        <span class="error-input-grp" v-if="error">error while extracting teams attendance</span>
        <span v-if="loader">Extracting...</span>
        <!-- <button type="button" @click="exportExcel">Export</button> -->
        <div style="display: flex; justify-content: center;gap: 15px;">
          <Button v-if="!finalAttendance.length > 0"  style="margin-top: 15px" label="Extract" type="submit" />
          <!-- <Button v-if="finalAttendance.length > 0" style="margin-top: 15px" label="Export" @click="exportExcel" type="button" /> -->
        </div>
      </form>
    </template>
  </Card>
  <Card v-if="finalAttendance.length > 0" class="summary-card-grp">
    <template #title>
      <div style="font-weight: 600">Attendance Summary</div>
    </template>
    <template #content>
      <div v-if="csvData.trainingName"><span>Training Name </span>:<strong> {{ csvData.trainingName }}</strong></div>
      <div><span>Nominated </span>:<strong> {{ finalAttendance.length }}</strong></div>
      <div v-if="attendedEmployee.length > 0"><span>Attended </span>:<strong> {{ attendedEmployee.length }}</strong></div>
      <div v-if="notAttendedEmployee.length > 0"><span>Not Attended </span>:<strong> {{ notAttendedEmployee.length }}</strong></div>
      <div style="display: flex; justify-content: center;gap: 15px;" @click="toggleSummary" class="attendance-summary-button">
        <button>Preview Attendance Sheet</button>
      </div>
      <!-- <div>
        <DataTable :value="attendedEmployee">
          <Column field="NEW_EMP_ID" header="NEW_EMP_ID"></Column>
          <Column field="NAME" header="NAME"></Column>
           <Column
            v-for="(training, index) in csvData.trainingParticipant"
            :key="index"
            :field="`Attendance.${training.date}`"
            :header="`${training.date}`"
          ></Column>
         </DataTable>
      </div> -->
      <div style="display: flex; justify-content: center;gap: 15px;justify-content: flex-end;">
          <Button v-if="finalAttendance.length > 0" style="margin-top: 15px" label="Resubmit" @click="resetForm" type="button" />
          <Button v-if="finalAttendance.length > 0" style="margin-top: 15px" label="Export" @click="exportExcel" type="button" />
        </div>
    </template>
  </Card>
</div>
</template>

<script>
import ExcelJS from 'exceljs'
import Papa from 'papaparse'
import moment from 'moment'
export default {
  data() {
    return {
      csvData: [],
      finalAttendance: [],
      finalAttendanceNotInNomination: [],
      employeeSuggestion:[],
      nominationList: [],
      attendedEmployee:[],
      notAttendedEmployee:[],
      missingDate:'',
      userInput: '',
      employeeName: '',
      employeeId: null,
      selectedOption:0,
      loader:false,
      error:false,
      showDialog: false,
      summaryModal: false,
    }
  },
  methods: {
    search(event) {
      setTimeout(() => {
                if (!event.query.trim().length) {
                    // this.filteredEmpId = [...this.employessData.NEW_EMP_ID];
                } else {
                  const nonReactiveData = Object.assign([], this.nominationList); // Create a non-reactive copy of the data
                  const filterResults = nonReactiveData.filter((country) => {
                  return country.NEW_EMP_ID.toString().toLowerCase().startsWith(event.query.toLowerCase());
                  }).slice(0, 10)
                  this.employeeSuggestion= filterResults;
                  console.log("empid",JSON.parse(JSON.stringify(this.employeeSuggestion)))
                }
            }, 250);
        // this.employeeSuggestion = [...Array(10).keys()].map((item) => event.query + '-' + item);
    },
    toggleSummary(){
      this.summaryModal = !this.summaryModal
    },
    resetForm(){
      this.$refs.teamsAttendanceFile.value = ''
      this.$refs.nominationFile.value = ''
      this.selectedOption = 0
      this.finalAttendance = []
      this.csvData = []
      this.nominationList = []
      this.employeeSuggestion = []
      this.attendedEmployee = []
      this.notAttendedEmployee = []
      this.missingDate = ''
      this.userInput = ''
      this.employeeName = ''
      this.employeeId = null
    },
    async extractFromTeamsAttendance(dataArray) {
      const participants = []
      // const participants = {
      //   nominationParticipants : [],
      //   nonNominationParticipants : []
      // }
      console.log("rawAttendance",dataArray)
      let isParticipantSection = false
      for (const item of dataArray) {
        if (item['1. Summary'] === 'Name') {
          isParticipantSection = true
          continue
        }
        if (isParticipantSection && item['1. Summary'] !== '3. In-Meeting Activities') {
          let participant = {}
          let missingSet = false

          if (item['1. Summary'] !== null) {
            let condition = item.__parsed_extra ? item.__parsed_extra[3] === null || !item.__parsed_extra[3].includes('@hexaware.com') : item['_3'] === null || !item['_3'].includes('@hexaware.com') 
            if (condition) {
              missingSet = true
              this.missingDate = item.__parsed_extra ? item.__parsed_extra[0].split(',')[0] : item[''].split(',')[0]
              this.employeeName = item['1. Summary']
              await this.openDialog()
                .then((input) => {
                    if (item.__parsed_extra) {
                    participant = {
                      Name: item['1. Summary'],
                      'First Join': item.__parsed_extra[0],
                      'Last Leave': item.__parsed_extra[1],
                      'In-Meeting Duration': item.__parsed_extra[2],
                      Email: item.__parsed_extra[3],
                      'Participant ID (UPN)': item.__parsed_extra[4] && item.__parsed_extra[4].includes('@hexaware.com')
                        ? item.__parsed_extra[4].replace('@hexaware.com', '')
                        : typeof input === 'object' ? input.NEW_EMP_ID : input,
                      Role: item.__parsed_extra[5],
                      IdNotPresent: item.__parsed_extra[4] ? true : false
                    }
                  } else {
                    participant = {
                      Name: item['1. Summary'],
                      'First Join': item[''],
                      'Last Leave': item['_1'],
                      'In-Meeting Duration': item['_2'],
                      Email: item['_3'],
                      'Participant ID (UPN)': item['_4'] && item['_4'].includes('@hexaware.com')
                        ? item['_4'].replace('@hexaware.com', '')
                        : typeof input === 'object' ? input.NEW_EMP_ID : input,
                      Role: item['_5'],
                      IdNotPresent: item['_4'] ? true : false
                    }
                  }
                  participants.push(participant)

                })
                .catch((error) => {
                  this.error =true
                })
              // empId = prompt("Please Check Employee Id in Nomination", item["1. Summary"]);
            }
            if (missingSet) {
              continue
            }

            if (item.__parsed_extra) {
            // if (this.csvData.trainingParticipant.length > 1) {
              participant = {
                Name: item['1. Summary'],
                'First Join': item.__parsed_extra[0],
                'Last Leave': item.__parsed_extra[1],
                'In-Meeting Duration': item.__parsed_extra[2],
                Email: item.__parsed_extra[3],
                'Participant ID (UPN)': item.__parsed_extra[4]
                  ? item.__parsed_extra[4].replace('@hexaware.com', '')
                  : '',
                Role: item.__parsed_extra[5],
                IdNotPresent: item.__parsed_extra[4] ? true : false
              }
            } else {
              participant = {
                Name: item['1. Summary'],
                'First Join': item[''],
                'Last Leave': item['_1'],
                'In-Meeting Duration': item['_2'],
                Email: item['_3'],
                'Participant ID (UPN)': item['_4'] ? item['_4'].replace('@hexaware.com', '') : '',
                Role: item['_5'],
                IdNotPresent: item['_4'] ? true : false
              }
            }

            participants.push(participant)
          }
          missingSet = false
        } else if (item['1. Summary'] === '3. In-Meeting Activities') {
          break
        }
      }
      return participants
    },
    // handleTeamUpload(e) {
    //   var file = e.target.files
    //   const trainingDetails = {
    //     trainingName: null,
    //     trainingParticipant: [],
    //     dateCount: file.length
    //   }
    //   for (let i = 0; i < file.length; i++) {
    //     if (file[i]) {
    //       const pattern = /^(.*) - Attendance report (\d{1,2}-\d{1,2}-\d{2})\.csv$/
    //       const match = file[i].name.match(pattern)
    //       if (match) {
    //         if (!trainingDetails.trainingName) trainingDetails.trainingName = match[1]
    //         console.log('trainingName', trainingDetails.trainingName)
    //       }

    //       Papa.parse(file[i], {
    //         header: true, // Treat the first row as headers
    //         dynamicTyping: true, // Automatically converts data types
    //         complete: (results) => {
    //           trainingDetails.trainingParticipant.push({
    //             date: match[2],
    //             participants: results.data
    //           })
    //         }
    //       })
    //     }
    //   }
    //   trainingDetails.trainingParticipant.sort((a, b) => {
    //     const dateA = new Date(a.date)
    //     const dateB = new Date(b.date)
    //     return dateA - dateB
    //   })
    //   this.csvData = trainingDetails
    //   console.log("Team attendance Extracted",this.csvData)
    // },
    // async handleNomination(event) {
    //   const file = event.target.files[0]
    //   if (!file) return

    //   const workbook = new ExcelJS.Workbook()
    //   await workbook.xlsx.load(await file.arrayBuffer())

    //   const worksheet = workbook.worksheets[0] // Get the first sheet
    //   this.headers = worksheet.getRow(1).values.slice(1) // Get headers
    //   this.data = []
    //   worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    //     if (rowNumber > 1) {
    //       // Skip header row
    //       this.data.push(row.values.slice(1))
    //     }
    //   })
    //   let filtered = JSON.stringify(
    //     this.data
    //       .filter((obj) => {
    //         return ![null, undefined, ''].includes(obj)
    //       })
    //       .filter((el) => {
    //         return typeof el != 'object' || Object.keys(el).length > 0
    //       })
    //   )
    //   let nominationData = JSON.parse(filtered)
    //   let employees = this.extractDataFromNomination(
    //     nominationData,
    //     this.csvData.trainingParticipant.length
    //   )
    //   this.nominationList = employees
    //   this.employeeSuggestion = JSON.parse(JSON.stringify(employees))
    //   console.log('Nomination', employees)
    //   console.log('csv', this.csvData.trainingParticipant)
    //   for (const dateEntry of this.csvData.trainingParticipant) {
    //     try {
    //       const currentDate = dateEntry.date
    //       const dateData = await this.extractFromTeamsAttendance(
    //         JSON.parse(JSON.stringify(dateEntry.participants))
    //       )
    //       console.log('transformedTeamsAttendance', dateData)
    //       employees.forEach((employee) => {
    //         const employeeData = dateData.find(
    //           (data) => Number(data['Participant ID (UPN)']) === employee.NEW_EMP_ID
    //         )
    //         if (employeeData && employeeData.Role === 'Presenter') {
    //           if (!employee.Attendance) {
    //             employee.Attendance = {} // Initialize attendance object if not already present
    //           }
    //           employee.Attendance[currentDate] = 'P'
    //           employee.PRESENTCOUNT++
    //         } else {
    //           if (!employee.Attendance) {
    //             employee.Attendance = {} // Initialize attendance object if not already present
    //           }
    //           employee.Attendance[currentDate] = 'A'
    //         }
    //       })
    //       this.finalAttendance = employees
    //       this.totalAttended = employees.reduce((a,b)=>{
    //         if((b.PRESENTCOUNT/b.SESSIONCOUNT)*100 >= 50){
    //           a+=1
    //         }
    //         return a
    //       },0)
    //       console.log('Final Attendance', this.finalAttendance)
    //     } catch {

    //     }
    //   }
    // },
    extractDataFromNomination(dataArray, sessionCount) {
      const participants = []
      for (const item of dataArray) {
        const participant = {
          NEW_EMP_ID: item[0],
          NAME: item[1],
          PRESENTCOUNT: 0,
          SESSIONCOUNT: sessionCount
        }
        participants.push(participant)
      }
      return participants
    },
    async filterParticipants(data,delay) {
      const filteredParticipants = data.filter((participant) => {
        const durationStr = participant['In-Meeting Duration']
        const components = durationStr.split(' ')
        let hours = 0
        let minutes = 0
        let seconds = 0
        let totalMinutes = 0
        for (const component of components) {
          if (component.includes('h')) {
            hours = parseInt(component)
          } else if (component.includes('m')) {
            minutes = parseInt(component)
          } else if (component.includes('s')) {
            seconds = parseInt(component)
          }
        }
        totalMinutes = hours * 60 + minutes + seconds / 60
        return totalMinutes > delay
      })
      return filteredParticipants
    },
    async exportExcel() {
      const workbook = new ExcelJS.Workbook()
      workbook.creator = 'Gautam Rangan P'
      workbook.lastModifiedBy = 'Bot'
      const worksheet = workbook.addWorksheet('Attendance')
      const headers = [
        { header: 'Emp_Id', key: 'emp_id' },
        { header: 'Name', key: 'name' }
      ]
      let data = JSON.parse(JSON.stringify(this.csvData.trainingParticipant))
      let finalAttendance = JSON.parse(JSON.stringify(this.finalAttendance))
      data.forEach((date, index) => {
        const dateString = date.date
        const parsedDate = moment.utc(dateString).startOf('day').toDate()
        headers.push({ header: parsedDate, key: `date${index + 1}` })
        headers.push({ header: "Duration", key: `duration${index + 1}` })
      })
      headers.push(
        { header: 'No_of_Sessions', key: 'session' },
        { header: 'No_of_Days_Present', key: 'days' },
        { header: 'Attendance in %', key: 'attendance' }
      )
      worksheet.columns = headers
      console.log('exportdata', data)
      let excelDateLocate = []

      for (let i = 0; i < data.length; i++) {
        worksheet.getColumn(`date${i + 1}`).numFmt = 'dd-mmm-yy'
        excelDateLocate.push(worksheet.getColumn(`date${i + 1}`).letter)
      }
      finalAttendance.forEach((employee) => {
        const row = [employee.NEW_EMP_ID, employee.NAME]
        data.forEach((date) => {
          row.push(employee.Attendance[date.date])
          row.push(employee.Duration[date.date])
        })
        row.push(
          employee.SESSIONCOUNT,
          employee.PRESENTCOUNT,
          ((employee.PRESENTCOUNT / employee.SESSIONCOUNT) * 100).toFixed(0) + '%'
        )
        worksheet.addRow(row)
      })

      for (let i = 0; i < data.length; i++) {
        worksheet.getColumn(`date${i + 1}`).eachCell((cell, rowNumber) => {
            if (cell.value === 'A') {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF0000' }
              }
            }
            cell.alignment = { horizontal: 'center', vertical: 'middle' }
        })
      }

      worksheet.getColumn('session').eachCell((cell, rowNumber) => {
        if (rowNumber !== 1) {
          cell.alignment = { horizontal: 'center', vertical: 'middle' }
        }
      })

      worksheet.getColumn('days').eachCell((cell, rowNumber) => {
        if (rowNumber !== 1) {
          if (excelDateLocate.length > 1) {
            cell.value = {
              formula: `COUNTIFS(${excelDateLocate[0] + rowNumber}:${excelDateLocate[excelDateLocate.length - 1] + rowNumber},"P")`
            }
          } else {
            cell.value = {
              formula: `COUNTIFS(${excelDateLocate[0] + rowNumber}:${excelDateLocate[0] + rowNumber},"P")`
            }
          }
          cell.alignment = { horizontal: 'center', vertical: 'middle' }
        }
      })

      let excelTotalDays = worksheet.getColumn('session').letter
      let excelDaysPresent = worksheet.getColumn('days').letter
      worksheet.getColumn('attendance').eachCell((cell, rowNumber) => {
        if (rowNumber !== 1) {
          cell.value = {
            formula: `ROUND(${excelDaysPresent + rowNumber}/${excelTotalDays + rowNumber}*100,0)`
          }
        }
      })

      worksheet.columns.forEach((column) => {
        let maxLength = 0
        column.eachCell({ includeEmpty: true }, (cell) => {
          if (cell.value instanceof Date) {
            maxLength = 10
          } else {
            const length = cell.value ? cell.value.toString().length : 15
            if (length > maxLength) {
              maxLength = length
            }
          }
        })
        column.width = maxLength < 15 ? 15 : maxLength
      })

      const headerRow = worksheet.getRow(1)
      headerRow.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } }
        }
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'B7D1F1' }
        }
      })
      const dataRows = worksheet.getRows(2, finalAttendance.length)
      dataRows.forEach((row) => {
        row.eachCell((cell, colNumber) => {
          cell.border = {
            top: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } },
            bottom: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } }
          }
        })
      })
      let excelAttendance = worksheet.getColumn('attendance').letter
      worksheet.addConditionalFormatting({
        ref: `${excelAttendance}2:${excelAttendance + (finalAttendance.length + 1)}`,
        rules: [
          {
            type: 'dataBar',
            minLength: 0,
            maxLength: 100,
            cfvo: [{ type: 'min' }, { type: 'max' }],
            color: { argb: 'FFFF5050' }
          }
        ]
      })

      const blob = await workbook.xlsx.writeBuffer()
      // Create a blob URL
      const blobUrl = window.URL.createObjectURL(
        new Blob([blob], { type: 'application/octet-stream' })
      ) // Create a download link
      const downloadLink = document.createElement('a')
      downloadLink.href = blobUrl
      downloadLink.setAttribute('download', `${this.csvData.trainingName} Attendance Report.xlsx`) // Simulate a click event on the download link
      downloadLink.click() // Clean up by revoking the blob URL
      window.URL.revokeObjectURL(blobUrl)
    },
    getUserInput() {
      return new Promise((resolve, reject) => {
        this.showDialog = true
        this.resolveDialog = resolve
        this.rejectDialog = reject
      })
    },

    // Method to handle the opening of the dialog and waiting for input
    async openDialog() {
      try {
        const input = await this.getUserInput() // Waits for user input
        console.log('User input:', input)
        return input
        // Rest of your code here, which will now run only after the input is obtained
      } catch (error) {
        console.error(error) // Handle cancellation or missing input
      }
    },

    // Submit the dialog, resolve the Promise
    submitDialog() {
      if (this.userInput) {
        this.resolveDialog(this.userInput) // Resolve with the user input
        this.resetDialog()
      } else {
        this.rejectDialog('No input provided') // Reject if input is empty
      }
    },

    // Cancel the dialog, reject the Promise
    cancelDialog() {
      this.rejectDialog('Dialog canceled')
      this.resetDialog()
    },

    // Reset dialog values
    resetDialog() {
      this.showDialog = false
      this.userInput = ''
      this.resolveDialog = null
      this.rejectDialog = null
    },
    async handleSubmit(e){
      this.loader = true
      let delay = e.target[2].value
      const file = e.target[0].files
      const trainingDetails = {
        trainingName: null,
        trainingParticipant: [],
        dateCount: file.length
      }
      for (let i = 0; i < file.length; i++) {
        if (file[i]) {
          let copyFormat = file[i].name.replace(/ \(\d+\)/g, '')
          const pattern = /^(.*) - Attendance report (\d{1,2}-\d{1,2}-\d{2})\.csv$/
          const match = copyFormat.match(pattern)
          if (match) {
            if (!trainingDetails.trainingName) trainingDetails.trainingName = match[1]
          }
          Papa.parse(file[i], {
            header: true, // Treat the first row as headers
            dynamicTyping: true, // Automatically converts data types
            complete: (results) => {
              trainingDetails.trainingParticipant.push({
                date: match[2],
                participants: results.data
              })
            }
          })
        }
      }
      trainingDetails.trainingParticipant.sort((a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return dateA - dateB
      })
      console.log("before sort",trainingDetails)
      this.csvData = trainingDetails
      console.log("Team attendance Extracted",this.csvData)

      const nominationfile = e.target[1].files[0]
      console.log(nominationfile,file)
      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.load(await nominationfile.arrayBuffer())

      const worksheet = workbook.worksheets[0] // Get the first sheet
      this.headers = worksheet.getRow(1).values.slice(1) // Get headers
      this.data = []
      worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        if (rowNumber > 1) {
          // Skip header row
          this.data.push(row.values.slice(1))
        }
      })
      let filtered = JSON.stringify(
        this.data
          .filter((obj) => {
            return ![null, undefined, ''].includes(obj)
          })
          .filter((el) => {
            return typeof el != 'object' || Object.keys(el).length > 0
          })
      )
      let nominationData = JSON.parse(filtered)
      let employees = this.extractDataFromNomination(
        nominationData,
        this.csvData.trainingParticipant.length
      )
      this.nominationList = employees
      console.log('Nomination', employees)
      for (const dateEntry of this.csvData.trainingParticipant) {
        try {
          const currentDate = dateEntry.date
          const dateData = await this.extractFromTeamsAttendance(
            JSON.parse(JSON.stringify(dateEntry.participants))
          )
          let filteredData = await this.filterParticipants(dateData,delay)
          console.log('transformedTeamsAttendance', filteredData)
          let notInNominationArr  = employees.map((employee)=> employee.NEW_EMP_ID) 
          let notInNomination =  filteredData.filter((employee) => 
            notInNominationArr.indexOf(Number(employee['Participant ID (UPN)'])) === -1);
          let transformNomination =  []
          notInNomination.map((employee)=>{
            transformNomination.push({
              'NEW_EMP_ID':Number(employee['Participant ID (UPN)']),
              'NAME': employee.Name
            })
          })

          transformNomination.forEach((employee) => {
            const employeeData = filteredData.find(
              (data) => Number(data['Participant ID (UPN)']) === employee.NEW_EMP_ID
            )
            const employeeData1 = dateData.find(
              (data) => Number(data['Participant ID (UPN)']) === employee.NEW_EMP_ID
            )
            if (employeeData && employeeData.Role === 'Presenter') {
              if (!employee.PRESENTCOUNT) {
                employee.SESSIONCOUNT = this.csvData.trainingParticipant.length
                employee.PRESENTCOUNT = 0
              }
              if (!employee.Attendance) {
                employee.Duration = {}
                employee.Attendance = {} // Initialize attendance object if not already present
              }
              console.log('Attendance current',currentDate)
              employee.Duration[currentDate] = employeeData && employeeData['In-Meeting Duration'] !== undefined ? employeeData['In-Meeting Duration'] : "0s"
              employee.Attendance[currentDate] = 'P'
              employee.PRESENTCOUNT++
            } else {
              if (!employee.Attendance) {
                employee.Attendance = {} // Initialize attendance object if not already present
                employee.Duration = {}
              }
              employee.Duration[currentDate] = employeeData1 && employeeData1['In-Meeting Duration'] !== undefined ? employeeData1['In-Meeting Duration'] : "0s"
              employee.Attendance[currentDate] = 'A'
            }
          })
          console.log('Attendance current',transformNomination)
          employees.forEach((employee) => {
            const employeeData = filteredData.find(
              (data) => Number(data['Participant ID (UPN)']) === employee.NEW_EMP_ID
            )
            const employeeData1 = dateData.find(
              (data) => Number(data['Participant ID (UPN)']) === employee.NEW_EMP_ID
            )

            if (employeeData && employeeData.Role === 'Presenter') {
              if (!employee.Attendance) {
                employee.Duration = {}
                employee.Attendance = {}
              }
              employee.Duration[currentDate] = employeeData && employeeData['In-Meeting Duration'] !== undefined ? employeeData['In-Meeting Duration'] : "0s"
              employee.Attendance[currentDate] = 'P'
              employee.PRESENTCOUNT++
            } else {
              if (!employee.Attendance) {
                employee.Attendance = {}
                employee.Duration = {}
              }

              employee.Duration[currentDate] = employeeData1 && employeeData1['In-Meeting Duration'] !== undefined ? employeeData1['In-Meeting Duration'] : "0s"
              employee.Attendance[currentDate] = 'A'
            }
          })
          console.log('Attendance employee',employees)
          this.finalAttendanceNotInNomination = transformNomination
          this.finalAttendance = employees
          console.log("final",employees)
        } catch(err) {
          console.log(err)
        }
        finally{
          this.loader = false
        }
      }
      this.attendedEmployee = employees.filter((employee)=>((employee.PRESENTCOUNT/employee.SESSIONCOUNT)*100) >= 50)
      this.notAttendedEmployee = employees.filter((employee)=>((employee.PRESENTCOUNT/employee.SESSIONCOUNT)*100) <= 49)  
      console.log("finalAttendance",this.finalAttendance) 
      console.log('final nomination',this.finalAttendanceNotInNomination)
    }
  },
  computed: {
    bestMatch() {
      if(this.employeeName){
        let cleanedEmployeeName = this.employeeName.replaceAll("(Unverified)", "").toLowerCase().trim().split(' ');
        let filteredList = JSON.parse(JSON.stringify(this.nominationList)).filter((employee) => {
          if(typeof employee.NAME === 'object' ){
            let nameParts = employee.NAME.result.toLowerCase().trim().split(' ');
            return cleanedEmployeeName.some(part => nameParts.includes(part));
          }            
          else{
            let nameParts = employee.NAME.toLowerCase().trim().split(' ');
            return cleanedEmployeeName.some(part => nameParts.includes(part));
          }
        });
        return filteredList;
      }      
    },
  }
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1; 
}
::-webkit-scrollbar-thumb {
  background: #888; 
}
::-webkit-scrollbar-thumb:hover {
  background: #555; 
}
:deep(thead.p-datatable-thead){
  white-space: pre !important;
}
:deep(.p-datatable-wrapper){
  overflow: unset !important;
}
:deep(.p-datatable-table){ 
  overflow:auto !important;
}
:deep(thead.p-datatable-thead){ 
  position: sticky;
  top:0px;
}
.attendance-summary-button button{
   background-color: transparent ;
   text-decoration: underline ;
   border: none;
   text-underline-offset:3px;
   cursor: pointer;
   margin: 20px;
   font-size: 16px;
   font-weight: 600;
}
.summary-card-grp span{
  display: inline-block;
  min-width: 120px;
}
.summary-card-grp strong{
  margin-left: 10px;
  font-weight: bold;
}
.error-input-grp{
  color: red;
}
.btn-grp {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
.attendance-report input[type='file'] {
  background-color: black;
  padding: 15px;
  border-radius: 5px;
  color: white;
}
.attendance-report select{
  background-color: black;
  padding: 15px 10px;
  border-radius: 5px;
  color: white;
}
.attendance-report {
  display: flex;
  flex-direction: column;
  gap: 15x;
}
label {
  margin: 5px 0px;
}
.form-input-grp {
  display: flex;
  flex-direction: column;
}
.grp-data-table {
  margin: 10px 0px;
}
.grp-data-table h4 {
  text-align: left;
}
.card-wrap{
  display: flex;
  gap: 20px;
}

</style>
