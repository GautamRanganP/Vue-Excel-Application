<template>
<div style="display: flex;" class="">
  <div style="display: flex;flex-direction: column;align-items: center;flex:1;gap:20px;margin: 20px;">
    <h3 class="" style="font-weight: 600;color: white;white-space: pre;">Bonus Estimator with data difference</h3>
    <div class="total-points" v-if="dataDifference.length > 0" style="color: white;font-weight: 600;">Total Estimated AWE Points : {{ duplicateFree.length > 0 ? calculateAwePoints(duplicateFree):calculateAwePoints(dataDifference) }}</div>
    <div v-if="dataDifference.length > 0" style="color: white;font-weight: 600;" >Data Difference : {{ duplicateFree.length>0?duplicateFree.length:dataDifference.length }}</div>
    <div class="difference-checker">
      <input type="file" @change="handleFileUpload" accept=".xlsx, .xls" />
      <p v-if="loader">Extracting...</p>
      <p v-if="error" style="color: red;" >Error while Extracting</p>
      <button v-if="dataDifference.length > 0" @click="exportToExcel(JSON.parse(JSON.stringify(duplicateFree.length>0?duplicateFree:dataDifference)))">Export</button>
      </div>
  </div>
  <div style="flex: 2;">
    <DataTable v-if="dataDifference.length > 0" :value="resultUniqueCertification(dataDifference).splice(0,9)">
        <Column field="certificationName" header="Certification Name"></Column>
        <Column field="count" header="Certification Count"></Column>
    </DataTable>
  </div>
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
    calculateAwePoints(data){
      if(data.length > 0){
      let totalAwePoints = 0
      data.forEach((employee)=>{
        if(employee.Horizon === 'H1')
          totalAwePoints += 3000
        else if(employee.Horizon === 'H2')
          totalAwePoints += 8000
        else if(employee.Horizon === 'H3')
          totalAwePoints += 10000
        else
          totalAwePoints += 12000
        })
        return totalAwePoints
      }
      return 0
    },
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

      const worksheet = workbook.worksheets[0]
      this.data = []
      worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => this.data.push(row.values.slice(1)))
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
      console.log('Bonus Sheet Header ',parsedData[0])
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
      const worksheet2 = workbook.worksheets[1] 
      this.data2 = []
      worksheet2.eachRow({ includeEmpty: true }, (row, rowNumber) => this.data2.push(row.values.slice(1)))
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
      console.log('LMS Data Header ',parsedData2[0])
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

      console.log("Sort employee id",employeeCertificationDetails2.sort((a, b) => a.employeeId - b.employeeId))
      console.log('LMS Data', employeeCertificationDetails2)
      let lmsDataRemovedDuplicates = this.removeDuplicate(employeeCertificationDetails2.sort((a, b) => {
      if (a.employeeId !== b.employeeId) {
        return a.employeeId - b.employeeId;
      }
      return new Date(a.completionDate) - new Date(b.completionDate);
      }))
        
  
         
      console.log(lmsDataRemovedDuplicates)
      this.dataDifference =  this.findDifferences(employeeCertificationDetails.sort((a, b) => a.employeeId - b.employeeId),lmsDataRemovedDuplicates)
      this.resultUniqueCertification(this.dataDifference)
      console.log('difference',JSON.parse(JSON.stringify(this.dataDifference)))
      }
      catch(error){
        console.log(error)
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
      // console.log("map1",map1.get(1000016988),[...map1.get(1000016988)].length)
      const differences = []

      // Check array2 against map1
      let addedCertificationCount = 1
      let updatedCertificationCount = 1
      let addedEmployee ,updatedEmployee ;
      arr2.forEach((item) => {
        addedEmployee !== item.employeeId ? addedCertificationCount = 1 : addedCertificationCount
        updatedEmployee !== item.employeeId ? updatedCertificationCount = 1 : updatedCertificationCount
        if (!map1.has(item.employeeId)) {
          // If employeeId doesn't exist in array1, it's a new entry
          //  status: 'Added'
          differences.push({
           ...item ,certificationCount : addedCertificationCount })
          addedCertificationCount++
          addedEmployee = item.employeeId
        } else if (!map1.get(item.employeeId).has(item.certificationName)) {
          // If employeeId exists but certification is different
          differences.push({
            // status: 'Updated',
            employeeId: item.employeeId,
            employeeName: item.employeeName,
            employeeOwningUnit: item.employeeOwningUnit,
            externalCertificationCategory: item.externalCertificationCategory,
            certificationName: item.certificationName,
            tsrLearningPlan: item.tsrLearningPlan,
            completionDate: item.completionDate,
            tsrUnit:item.tsrUnit,
            Horizon:item.Horizon,
            certificationCount :[...map1.get(item.employeeId)].length + updatedCertificationCount 
          })
          updatedCertificationCount++
          updatedEmployee = item.employeeId
        }
      
      })
      return differences
    },
    async exportToExcel(employeeArr) {    
      // let result = []
      // const header = ['EmployeeID','Employee Name','Employee Owning Unit','External Certification Category','TSR Learning Plan Name','TSR UNIT','External Certification','Completion Date','Horizon','AWE points','Status']
    
      const headerColumns = [
        { header:"EmployeeID", key:"empId" },
        { header:"Employee Name", key:"empName" },
        { header:"Employee Owning Unit", key:"empOwnUnit" },
        { header:"External Certification Category", key:"externalCertificateCategory" },
        { header:"TSR Learning Plan Name", key:"tsrLearningPlan" },
        { header:"TSR UNIT", key:"tsrUnit"},
        { header:"External Certification", key:"externalCertification"},
        { header:"External Certification Completion Date", key:"externalCertificationCompletionDate"},
        { header:"Horizon", key:"horizon"},
        // { header:"Status", key:"status"},
        { header:"Total Completed certification", key:"certificationCompletedCount"},
        { header:'Learning Bonus eligiblity status', key:"learningBonus"}]

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Difference')       
      worksheet.columns = headerColumns;   

      worksheet.getColumn(1).width = 15
      worksheet.getColumn(2).width = 15
      worksheet.getColumn(8).width = 20
      worksheet.getColumn(8).numFmt = 'dd-mmm-yyyy';
      worksheet.getColumn(3).width = 20
      worksheet.getColumn(4).width = 25
      worksheet.getColumn(5).width = 25
      worksheet.getColumn(6).width = 15
      worksheet.getColumn(7).width = 30
      worksheet.getColumn(12).width = 30
      worksheet.getColumn(1).alignment = { horizontal: 'left', vertical: 'middle' }
      
      employeeArr.forEach(employee => {
        const momentDate = moment(employee.completionDate.toString());
        momentDate.seconds(0);     
        const formattedDate = momentDate.format("DD-MMM-YYYY");
        const parsedDate = moment.utc(formattedDate).toDate();
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
        worksheet.addRow([employee.employeeId,employee.employeeName,employee.employeeOwningUnit,employee.externalCertificationCategory,employee.tsrLearningPlan,employee.tsrUnit,employee.certificationName,parsedDate,employee.Horizon,employee.certificationCount,employee.certificationCount <= 6 ? "less than or equal to 6 certification ":"Exceeds 6 certification"])
      
      
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
      const dataRows = worksheet.getRows(2, employeeArr.length)
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
      worksheet.getColumn('certificationCompletedCount').eachCell((cell, rowNumber) => {
        if (rowNumber !== 1) {
          cell.alignment = { horizontal: 'center', vertical: 'middle' }
        }
      })

      worksheet.getColumn('tsrUnit').eachCell((cell, rowNumber) => {
        if (rowNumber !== 1) {
          cell.alignment = { horizontal: 'center', vertical: 'middle' }
        }
      })
      worksheet.getColumn('externalCertificationCompletionDate').eachCell((cell, rowNumber) => {
        if (rowNumber !== 1) {
          cell.alignment = { horizontal: 'center', vertical: 'middle' }
        }
      })
      worksheet.getColumn('horizon').eachCell((cell, rowNumber) => {
        if (rowNumber !== 1) {
          cell.alignment = { horizontal: 'center', vertical: 'middle' }
        }
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
    resultUniqueCertification(arr){
      const map3 = new Map();
      arr.forEach((item) => {
      if (!map3.has(item.certificationName)) {
        map3.set(item.certificationName, new Set());
        } 
        map3.get(item.certificationName).add(item);
      })
      let resultArr = [] 
      map3.forEach((key, value)=>{
          resultArr.push({certificationName: [...key][0].certificationName,count:[...key].length},)
      })
      return resultArr.sort((a, b) => b.count - a.count);
    },
    removeDuplicate(data){
      const uniqueCertifications = data.reduce((acc, entry) => {
      const key = `${entry.employeeId}-${entry.certificationName}`;
        if (!acc.some(e => e.key === key)) {
          acc.push({ ...entry, key });
        }
        return acc;
      }, []).map(({ key, ...rest }) => rest);
      return uniqueCertifications
    },
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
  background-color: white;
  border-radius: 5px;
  padding: 6px;
  border: none;
  color: black;
  background-color: white(154, 118, 238);
}
  
/* Add your styles here */
</style>
