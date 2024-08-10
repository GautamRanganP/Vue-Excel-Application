<template>

<h1 style="color:white">Employee</h1>
<DataTable :value="employeeData" tableStyle="min-width: 50rem">
    <Column field="employeeID" header="employeeID"></Column>
    <Column field="employeeName" header="employeeName"></Column>
    <Column field="employeeEmail" header="employeeEmail"></Column>
    <Column field="certificationName" header="certificationName"></Column>
    <Column field="completionDate" header="completionDate"></Column>
</DataTable>

</template>
  
  
<script>
import moment from 'moment';
// import employeeData from './data.json'
export default {
  data(){
    return{
        employeeData:null,
    }
  },
  mounted(){
     const response = fetch('http://localhost:3000/getallemployee', 
      {  
        method: 'GET', // or 'PUT'
        headers: {       'Content-Type': 'application/json', // Set the Content-Type to application/json   
                 }, // Convert the data object to a JSON string 
        })  .then(response => {     if (!response.ok) {       // If the response status code is not OK, throw an error
        throw new Error('Network response was not ok ' + response.statusText);     }    return response.json(); // Parse the JSON from the response 
         })  .then(data => { 
          console.log('Success:', data); // Handle the JSON data
        
         
          let transformedData = [];

// Iterate through each employee object
data.forEach(employee => {
  // Iterate through each certification of the employee
  employee.certifications.forEach(certification => {
    const momentDate = moment(certification.completionDate);     
    const formattedDate = momentDate.format("MM/DD/YYYY");
    transformedData.push({
      employeeID: employee.employeeID,
      employeeName: employee.employeeName,
      employeeEmail: employee.employeeEmail,
      certificationName: certification.name,
      completionDate : formattedDate
    });
  });
});
this.employeeData = transformedData
// Output the transformed data
console.log(transformedData);
          }).catch(error => { 
            console.error('Error:', error); // Handle any errors
        });
  }
};
</script>
  <style scoped>
  

  </style>