<template>
  
  <form @submit.prevent="handleExcel" id="attendance-form" ref="attendanceForm">
    <h3>Attendance Report Generator</h3>
    <div class="form-control">
      <label for="formAttendance">Teams Attendance</label>
      <input type="file" id="formAttendance" multiple />
    </div>
    <div class="form-control">
      <label for="formAttendance">Minimum Stay</label>
      <select v-model="minDurationStay">
            <option value = "0" >0 mins</option>
            <option value = "15">15 mins</option>
            <option value = "30">30 mins</option>
            <option value = "45">45 mins</option>
            <option value = "60">1 hour</option>
       </select>
    </div>
    <div class="form-button" v-if="!loading"> 
      <button type="submit" v-if="finalAttendance.length === 0">Extract</button>
      <button @click="clearAttendance" v-else>Resubmit</button>
      <button v-if="exportReady" @click="exportExcel">Export</button>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </form>

</template>

<script>
import ExcelJS from 'exceljs'
import Papa from 'papaparse'
import moment from 'moment'
export default {
  data() {
    return {
      exportReady:false,
      loading:false,
      minDurationStay: 0,
      dynamicNomination: [],
      finalAttendance: [],
      trainingInformation: []
    }
  },
  methods: {
    clearAttendance(){
      this.exportReady = false
      this.dynamicNomination = []
      this.finalAttendance = [],
      this.trainingInformation = []
      this.$refs.attendanceForm.reset()
    },
    handleExcel(e) {
      this.loading = true
      const files = e.target[0].files
      const trainingDetails = {
        trainingName: null,
        trainingParticipant: [],
        dateCount: files.length
      }
      for (let file of files) {
        if (file) {
          let copyFormat = file.name.replace(/ \(\d+\)/g, '')
          const pattern = /^(.*) - Attendance report (\d{1,2}-\d{1,2}-\d{2})\.csv$/
          const match = copyFormat.match(pattern)
          if (match) {
            if (!trainingDetails.trainingName) trainingDetails.trainingName = match[1]
          }
          Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            complete: (results) => {
              trainingDetails.trainingParticipant.push({
                date: match[2],
                participants: this.extractFromTeamsAttendance(results.data)
              })

            }
          })
        }
      }
      setTimeout(() => {
        trainingDetails.trainingParticipant.sort((a, b) => {
          const dateA = new Date(a.date)
          const dateB = new Date(b.date)
          return dateA - dateB
        })
        const uniqueArray = this.setNominationSheet(trainingDetails)
        this.finalAttendance = this.prepareFinalAttendance(uniqueArray,trainingDetails)
        this.trainingInformation = trainingDetails
        this.exportReady = true
        this.loading = false
      }, 2000)

      console.log('Training details', trainingDetails)
    },
    extractFromTeamsAttendance(dataArray) {
      let isEnable = false
      let result = []
      for (let teams of dataArray) {
        let participant = {
          EMPID: null,
          NAME: null,
          DURATION: null,
          EMAIL: null,
          DATE: null
        }
        for (let key in teams) {
          if (teams[key] == '2. Participants') {
            isEnable = true
            continue
          }
          if (teams[key] === null) isEnable = false
          if (isEnable) {
            if (
              teams[key] === 'Name' ||
              (teams[key] && teams[key].length > 0 && teams[key][0] === 'First Join')
            )
              continue
            if (typeof teams[key] === 'string' && teams[key] !== 'Name')
              participant.NAME = teams[key]
            if (
              typeof teams[key] !== 'string' &&
              teams[key] &&
              teams[key].length > 0 &&
              teams[key][0] !== 'First Join'
            ) {
              participant.DATE = teams[key][0].split(',')[0]
              participant.DURATION = teams[key][2]
              participant.EMAIL = teams[key][3]
              if(teams[key][4] && teams[key][4].includes('@hexaware'))
                participant.EMPID = teams[key][4].replace(/\D/g, '')
              else  
               participant.EMPID = ''
              
              result.push(participant)
            }
          }
        }
      }
      return result
    },
    setNominationSheet(trainingDetails){
      let nomination = trainingDetails.trainingParticipant.map((data) => data.participants)
        let mergedArray = nomination.flat()
        const uniqueMap = new Map()
        mergedArray.forEach((item) => {
          const key = item.EMPID !== null ? `empid-${item.EMPID}` : `name-${item.NAME}`
          if (!uniqueMap.has(key)) {
            uniqueMap.set(key, item)
          }
        })
        const uniqueArray = Array.from(uniqueMap.values())
        this.dynamicNomination = uniqueArray.map(({EMPID,NAME})=>({EMPID,NAME}))

        return uniqueArray
    },
    prepareFinalAttendance(uniqueArray,trainingDetails){
      let finalAttendanceSheet = JSON.parse(JSON.stringify(uniqueArray))
      let delay = this.minDurationStay
      let totalSession = trainingDetails.trainingParticipant.length
      for(let data of trainingDetails.trainingParticipant){
          let wholeData    = data.participants
          let filteredData = this.filterParticipants(data.participants,delay)
          console.log("filter",filteredData)
          console.log("whole",wholeData)
          let currentDate = data.date
          finalAttendanceSheet.forEach((employee) => {
            const filterEmployee = filteredData.find((data) => data.EMPID === employee.EMPID)
            const employeeData = wholeData.find((data) => data.EMPID === employee.EMPID)
            if (filterEmployee) {
              if (!employee.PRESENTCOUNT) {
                employee.SESSIONCOUNT = totalSession
                employee.PRESENTCOUNT = 0
              }
              if (!employee.Attendance) {
                employee.Duration = {}
                employee.Attendance = {} 
              }
              employee.Duration[currentDate] = filterEmployee && filterEmployee.DURATION !== undefined ? filterEmployee.DURATION : "0s"
              employee.Attendance[currentDate] = 'P'
              employee.PRESENTCOUNT++
            } else {
              if (!employee.SESSIONCOUNT) {
                employee.SESSIONCOUNT = totalSession
              }
              if (!employee.Attendance) {
                employee.Attendance = {} 
                employee.Duration = {}
              }
              employee.Duration[currentDate] = employeeData && employeeData.DURATION !== undefined ? employeeData.DURATION : "0s"
              employee.Attendance[currentDate] = 'A'
            }
          })
        }
          console.log('Attendance employee',finalAttendanceSheet)
          // this.finalAttendance = employees
          return finalAttendanceSheet
    },
    filterParticipants(data,delay = 30) {
      const filteredParticipants = data.filter((participant) => {
        const durationStr = participant.DURATION
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
      let data = JSON.parse(JSON.stringify(this.trainingInformation.trainingParticipant))
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
        const row = [employee.EMPID ? Number(employee.EMPID):'', employee.NAME]
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
      downloadLink.setAttribute('download', `${this.trainingInformation.trainingName} Attendance Report.xlsx`) // Simulate a click event on the download link
      downloadLink.click() // Clean up by revoking the blob URL
      window.URL.revokeObjectURL(blobUrl)
    }
  }

}
</script>

<style>
#attendance-form{
  font-size: 18px;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
}
#attendance-form button{
  padding: 6px 18px;
  background-color: rgb(48, 194, 87);
  border: none;
  color: white;
  font-weight: 600;
  cursor: pointer;
}
#attendance-form .form-button{
  display: flex;
  gap: 10px;
  justify-content: center;
}
#attendance-form input[type='file'],#attendance-form select {
  background-color: black;
  padding: 15px;
  border-radius: 5px;
  color: white;
}
.form-control{
  display: flex;
  flex-direction: column;
  gap: 10px;
}
#attendance-form .form-control label{
  font-weight: bold;
}
</style>
