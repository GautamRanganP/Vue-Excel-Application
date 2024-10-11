<template>
  <div class="total-points" v-if="totalAwePoints" style="color: white;font-weight: 600;">Total AWE Points : {{ totalAwePoints }}</div>
  <div v-if="dataDifference.length > 0" style="color: white;font-weight: 600;" >Data Difference : {{ this.dataDifference.length }}</div>
  <div class="difference-checker">
    <input type="file" @change="handleFileUpload" accept=".xlsx, .xls" />
    <p v-if="loader">Extracting...</p>
    <p v-if="error" style="color: red;" >Error while Extracting</p>
    <button v-if="dataDifference.length > 0" @click="exportToExcel(JSON.parse(JSON.stringify(duplicateFree.length>0?duplicateFree:dataDifference)))">Export</button>
    <button v-if="((!dataDifference.length > 0 && duplicateFree.length>0)||(dataDifference.length > 0 && !duplicateFree.length>0) )" @click="removeDuplicate(JSON.parse(JSON.stringify(dataDifference)))">Remove Duplicate</button>
    
    <!-- <table v-if="data.length">
      <thead>
        <tr>
          <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in data" :key="rowIndex">
          <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
        </tr>
      </tbody>
    </table> -->
  </div>
</template>

<script>
import ExcelJS from 'exceljs'
import moment from 'moment';
export default {
  data() {
    return {
      totalAwePoints:0,
      headers: [],
      data: [],
      data2: [],
      dataDifference:[],
      loader:false,
      error:false,
      duplicateFree:[],
    }
  },
  methods: {
    async handleFileUpload(event) {
      this.error = false
      this.duplicateFree = []
      this.dataDifference = []
      this.totalAwePoints = 0
      try{
      this.loader = true
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
      let parsedData = JSON.parse(filtered)
      let employeeCertificationDetails = []
      let certificationNameIndex;
      let empIdIndex;
      certificationNameIndex = parsedData[0].findIndex((header)=>{
          return header.includes("Certification Name")
      })
          empIdIndex = parsedData.findIndex((header)=>{
          return header.includes("Emp Id")
          })
        
      parsedData.map((data, index) => {
        if (index !== 0) {
          const employee = { employeeId: data[empIdIndex], certificationName: data[certificationNameIndex] }
          employeeCertificationDetails.push(employee)
        }
      })
      console.log('Bonus Sheet', employeeCertificationDetails)

      // sheet2
      const worksheet2 = workbook.worksheets[1] // Get the first sheet
      worksheet2.getRow(1).values.slice(1) // Get headers
      this.data2 = []
      worksheet2.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        if (rowNumber > 1) {
          // Skip header row
          this.data2.push(row.values.slice(1))
        }
      })
      let filtered2 = JSON.stringify(
        this.data2
          .filter((obj) => {
            return ![null, undefined, ''].includes(obj)
          })
          .filter((el) => {
            return typeof el != 'object' || Object.keys(el).length > 0
          })
      )
      let parsedData2 = JSON.parse(filtered2)
      let employeeCertificationDetails2 = []
      console.log('parsedData',parsedData2[0])
      let tsrUnitIndex;
        let tsrLearningPlanIndex;
        let completionDateIndex;
        let empIdIndex1; 
        let empNameIndex;
        let empOwnUnitIndex;
        let externalCertificationIndex;
        let externalCategoryIndex;
        let externalquadrantIndex;
        tsrUnitIndex = parsedData2[0].findIndex((header)=>{
          return header.includes("TSR UNIT")
      })
          tsrLearningPlanIndex = parsedData2[0].findIndex((header)=>{
            return header.includes("TSR Learning Plan Name")
          })
          completionDateIndex = parsedData2[0].findIndex((header)=>{
            return header.includes("External Certification Completion Date")
          })
          empIdIndex1 = parsedData2[0].findIndex((header)=>{
            return header.includes("Employee ID")
          })
          empNameIndex = parsedData2[0].findIndex((header)=>{
            return header.includes("Employee Name")
          })
          empOwnUnitIndex = parsedData2[0].findIndex((header)=>{
            return header.includes("Employee Owning Unit")
          })
          externalCertificationIndex = parsedData2[0].findIndex((header)=>{
            return header.includes("External Certification Name")
          })
          externalCategoryIndex = parsedData2[0].findIndex((header)=>{
            return header.includes("External Certification Category")
          })
          externalquadrantIndex = parsedData2[0].findIndex((header)=>{
            return header.includes("External Certification Quadrant")
          })
         parsedData2.map((data, index) => {
            if (index !== 0) {
              const employee = { employeeId: data[empIdIndex1],employeeName: data[empNameIndex],employeeOwningUnit:data[empOwnUnitIndex],externalCertificationCategory:data[externalCategoryIndex],tsrLearningPlan:data[tsrLearningPlanIndex],tsrUnit:data[tsrUnitIndex],certificationName: data[externalCertificationIndex] ,completionDate: data[completionDateIndex],Horizon:data[externalquadrantIndex] }
              employeeCertificationDetails2.push(employee)
            }
          })
      console.log('LMS Data', employeeCertificationDetails2)
      console.log(this.findDifferences(employeeCertificationDetails,employeeCertificationDetails2))
     // this.exportToExcel(this.findDifferences(employeeCertificationDetails,employeeCertificationDetails2))
    this.dataDifference =  this.findDifferences(employeeCertificationDetails,employeeCertificationDetails2)
    console.log('difference',JSON.parse(JSON.stringify(this.dataDifference)))
      }
      catch{
        this.error = true;
      }
      finally{
        this.loader = false
      }
    },
    findDifferences(arr1, arr2) {
      const map1 = new Map()
      // Populate map1 with employeeId and certifications
      arr1.forEach((item) => {
        if (!map1.has(item.employeeId)) {
          map1.set(item.employeeId, new Set())
        }
        map1.get(item.employeeId).add(item.certificationName)
      })

      const differences = []

      // Check array2 against map1
      arr2.forEach((item) => {
        if (!map1.has(item.employeeId)) {
          // If employeeId doesn't exist in array1, it's a new entry
          differences.push({ status: 'Added', ...item })
        } else if (!map1.get(item.employeeId).has(item.certificationName)) {
          // If employeeId exists but certification is different
          differences.push({
            status: 'Updated',
            employeeId: item.employeeId,
            employeeName: item.employeeName,
            employeeOwningUnit: item.employeeOwningUnit,
            externalCertificationCategory: item.externalCertificationCategory,
            certificationName: item.certificationName,
            tsrLearningPlan: item.tsrLearningPlan,
            completionDate: item.completionDate,
            tsrUnit:item.tsrUnit,
            Horizon:item.Horizon
          })
        }
      })
      return differences
    },
    async exportToExcel(employeeArr) {    
      // let result = []
      // const header = ['EmployeeID','Employee Name','Employee Owning Unit','External Certification Category','TSR Learning Plan Name','TSR UNIT','External Certification','Completion Date','Horizon','AWE points','Status']
    
      const header = ['EmployeeID','Employee Name','Employee Owning Unit','External Certification Category','TSR Learning Plan Name','TSR UNIT','External Certification','External Certification Completion Date','Horizon','Status']

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Difference')       
      worksheet.addRow(header);   
      worksheet.getRow(1).eachCell((cell)=>{
        cell.fill = {
              type: 'pattern',
              pattern:'solid',
              fgColor: { argb: 'ADD8E6' } 
            }
      })
      // worksheet.getColumn(1).eachCell((cell)=>{
      //   cell.alignment = { horizontal: 'left', vertical: 'middle' };
      // })
    //  worksheet.getRow(1).fill = 'blue'
      worksheet.getColumn(1).width = 15
      worksheet.getColumn(2).width = 15
      worksheet.getColumn(8).width = 20
      worksheet.getColumn(8).numFmt = 'dd-mmm-yyyy';
      worksheet.getColumn(3).width = 20
      worksheet.getColumn(4).width = 25
      worksheet.getColumn(5).width = 25
      worksheet.getColumn(6).width = 15
      worksheet.getColumn(7).width = 30
      // worksheet.getColumn(3).eachCell((cell,rowNumber)=>{
      //   console.log(row)
      //   if(rowNumber !== 1){
      //     cell.alignment = alignment = { horizontal: 'center', vertical: 'middle' }
      //   }
      // })  
      worksheet.getColumn(1).alignment = { horizontal: 'left', vertical: 'middle' }
      employeeArr.forEach(employee => {
        const momentDate = moment(employee.completionDate.toString());
        momentDate.seconds(0);     
        const formattedDate = momentDate.format("DD-MMM-YYYY");
        let points = 0; 
        if(employee.Horizon === 'H1')
          points = 3000
        else if(employee.Horizon === 'H2')
          points = 8000
        else if(employee.Horizon === 'H3')
          points = 10000
        else
          points = 12000

        this.totalAwePoints += points   
        worksheet.addRow([employee.employeeId,employee.employeeName,employee.employeeOwningUnit,employee.externalCertificationCategory,employee.tsrLearningPlan,employee.tsrUnit,employee.certificationName,formattedDate,employee.Horizon,employee.status])
        // worksheet.addRow([employee.employeeId,employee.certificationName,employee.status])
      })

      const blob = await workbook.xlsx.writeBuffer();
        // Create a blob URL     
        const blobUrl = window.URL.createObjectURL(new Blob([blob], { type: 'application/octet-stream' }));       // Create a download link      
        const downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.setAttribute('download', 'difference.xlsx');       // Simulate a click event on the download link     
        downloadLink.click();       // Clean up by revoking the blob URL       
        window.URL.revokeObjectURL(blobUrl);
      
    },
    removeDuplicate(data){
      const uniqueCertifications = data.reduce((acc, entry) => {
    const key = `${entry.employeeId}-${entry.certificationName}`; // Unique key for combination of employeeId and certificationName
    if (!acc.some(e => e.key === key)) {
        acc.push({ ...entry, key }); // Add unique entry with a key to avoid duplicates
    }
    return acc;
}, []).map(({ key, ...rest }) => rest); // Remove the key before returning the result
 this.duplicateFree = uniqueCertifications
console.log(uniqueCertifications);
    }
  }
}
</script>

<style scoped>
.difference-checker{
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: white;
}
.difference-checker input[type="file"] {
    background-color: black;
    padding: 15px;
    border-radius: 5px;
}
.difference-checker p{
  text-align: center;
}
.difference-checker button{
  padding: 6px;
  border: none;
  color: black;
  background-color: white(154, 118, 238);
}
  
/* Add your styles here */
</style>
