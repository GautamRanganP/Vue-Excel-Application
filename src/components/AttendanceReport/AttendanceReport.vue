<template>
  <Dialog
    v-model:visible="showDialog"
    modal
    header="Missing Employee ID"
    :style="{ width: '25rem' }"
  >
    <span>Update the information.</span>
    <div class="form-input-grp">
      <label for="employeeId">Employee ID</label>
      <InputText id="employeeId" v-model="userInput" autocomplete="off" />
    </div>
    <div class="form-input-grp">
      <label for="employeeName">Employee Name</label>
      <InputText id="employeeName" v-model="employeeName" autocomplete="off" disabled />
    </div>
    <div class="btn-grp">
      <Button label="Submit" @click="submitDialog" />
      <Button label="Cancel" @click="cancelDialog" />
    </div>
    <div v-if="bestMatch.length > 0" class="grp-data-table">
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
  <Card>
    <template #title>
      <div style="font-weight: 600">Attendance Report Generator</div>
    </template>
    <template #content>
      <form @submit.prevent="handleSubmit1">
        <div class="attendance-report">
          <label for="teamsAttendance">Teams Attendance</label>
          <input
            type="file"
            @change="handleTeamUpload"
            multiple
            accept=".xlsx, .xls, .csv"
            id="teamsAttendance"
          />
          <label for="nomination">Nomination</label>
          <input
            type="file"
            @change="handleNomination"
            accept=".xlsx, .xls, .csv"
            id="nomination"
          />
        </div>
        <!-- <button type="button" @click="exportExcel">Export</button> -->
        <div style="display: flex; justify-content: center">
          <Button style="margin-top: 15px" label="Export" @click="exportExcel" type="button" />
        </div>
      </form>
    </template>
  </Card>
  <Card v-if="finalAttendance.length > 0">
    <template #title>
      <div style="font-weight: 600">Attendance Summary</div>
    </template>
    <template #content>
      <div v-if="csvData.trainingName">Training Name : {{ csvData.trainingName }}</div>
      <div>Nominated : {{ finalAttendance.length }}</div>
      <div v-if="totalAttended">Attended: {{ totalAttended }}</div>
    </template>
  </Card>
</template>

<script>
import ExcelJS from 'exceljs'
import Papa from 'papaparse'
import moment from 'moment'
export default {
  data() {
    return {
      totalAttended:0,
      nominationList: [],
      showDialog: false,
      userInput: '',
      employeeName: '',
      employeeId: null,
      csvData: [],
      finalAttendance: [],
      visible: false
    }
  },
  methods: {
    async extractFromTeamsAttendance(dataArray) {
      const participants = []
      console.log(dataArray)
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
            let condition =
              this.csvData.trainingParticipant.length > 2
                ? item.__parsed_extra[3] === null
                : item['_3'] === null
            if (condition) {
              missingSet = true
              this.employeeName = item['1. Summary']
              await this.openDialog()
                .then((input) => {
                  if (this.csvData.trainingParticipant.length > 2) {
                    participant = {
                      Name: item['1. Summary'],
                      'First Join': item.__parsed_extra[0],
                      'Last Leave': item.__parsed_extra[1],
                      'In-Meeting Duration': item.__parsed_extra[2],
                      Email: item.__parsed_extra[3],
                      'Participant ID (UPN)': item.__parsed_extra[4]
                        ? item.__parsed_extra[4].replace('@hexaware.com', '')
                        : input,
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
                      'Participant ID (UPN)': item['_4']
                        ? item['_4'].replace('@hexaware.com', '')
                        : input,
                      Role: item['_5'],
                      IdNotPresent: item['_4'] ? true : false
                    }
                  }
                  participants.push(participant)
                })
                .catch((error) => {})
              // empId = prompt("Please Check Employee Id in Nomination", item["1. Summary"]);
            }
            if (missingSet) {
              continue
            }

            if (this.csvData.trainingParticipant.length > 2) {
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
    handleTeamUpload(e) {
      var file = e.target.files
      const trainingDetails = {
        trainingName: null,
        trainingParticipant: [],
        dateCount: file.length
      }
      for (let i = 0; i < file.length; i++) {
        if (file[i]) {
          const pattern = /^(.*) - Attendance report (\d{1,2}-\d{1,2}-\d{2})\.csv$/
          const match = file[i].name.match(pattern)
          if (match) {
            if (!trainingDetails.trainingName) trainingDetails.trainingName = match[1]
            console.log('trainingName', trainingDetails.trainingName)
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
      this.csvData = trainingDetails
      console.log("Team attendance Extracted",this.csvData)
    },
    async handleNomination(event) {
      const file = event.target.files[0]
      if (!file) return

      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.load(await file.arrayBuffer())

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
          console.log('transformedTeamsAttendance', dateData)
          employees.forEach((employee) => {
            const employeeData = dateData.find(
              (data) => Number(data['Participant ID (UPN)']) === employee.NEW_EMP_ID
            )
            if (employeeData && employeeData.Role === 'Presenter') {
              if (!employee.Attendance) {
                employee.Attendance = {} // Initialize attendance object if not already present
              }
              employee.Attendance[currentDate] = 'P'
              employee.PRESENTCOUNT++
            } else {
              if (!employee.Attendance) {
                employee.Attendance = {} // Initialize attendance object if not already present
              }
              employee.Attendance[currentDate] = 'A'
            }
          })
          this.finalAttendance = employees
          this.totalAttended = employees.reduce((a,b)=>{
            if((b.PRESENTCOUNT/b.SESSIONCOUNT)*100 >= 50){
              a+=1
            }
            return a
          },0)
          console.log('Final Attendance', this.finalAttendance)
        } catch {

        }
      }
    },
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
    filterParticipants(data) {
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
        return totalMinutes > 20
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
          if (rowNumber !== 1) {
            if (cell.value === 'A') {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF0000' }
              }
            }
            cell.alignment = { horizontal: 'center', vertical: 'middle' }
          }
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
      downloadLink.setAttribute('download', 'Attendance.xlsx') // Simulate a click event on the download link
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
    }
  },
  computed: {
    bestMatch() {
      const matchFound = this.nominationList.filter((employee) =>
        employee.NAME.replaceAll(' ', '')
          .toLowerCase()
          .includes(this.employeeName.replaceAll(' ', '').toLowerCase())
      )
      return matchFound
    },
  }
}
</script>

<style scoped>
.p-error {
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
</style>
