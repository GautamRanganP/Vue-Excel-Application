<template>
<div class="hexa-form" v-if="formSuccess">
  <h3>Form Submitted Successfully</h3>
  <button @click="formSuccess = false" >Back to Form</button>
</div>
    <div class="hexa-form" v-if="!formSuccess">
      <div class="row" style="margin-bottom: 20px;">
          <h2 style="text-align: center;width: 100%">Certification Form</h2>
      </div>
      <div class="row">
          <label>Employee ID</label>
          <!-- <AutoComplete v-model="selectedEmpId" optionLabel="NEW_EMP_ID" :suggestions="filteredEmpId" @complete="searchEmployeeId" />
       -->
       
       <InputText type="text" v-model="empId" class="grp-input" />
      </div>
      <div class="row">
        <label>Name</label>
        <InputText type="text" v-model="empName" class="grp-input" />
      </div>
      <!-- <div class="row">
        <label>Emp ID</label>
        <InputText type="text" v-model="empId" class="grp-input" />
      </div> -->
      <div class="row">
        <label>Email</label>
        <InputText type="text" v-model="empEmail" class="grp-input" />
      </div>
        <div class="row">
       <label>Completion Date</label>
       <div class="column">
          <PDFExtractor @metaDataFromPdf= "handleDate" @textExtractDate = "handleMetaExtractedDate" @certificationName="handleCertificate" @validationError="handleError" @formCertificationReset= "handleReset"/>
       <span class="date-error" style="color:red;font-size:14px" v-if="fileError">
            pls provide valid pdf download
          </span>
            <!-- <InlineMessage severity="error" v-if="fileError">pls provide valid pdf download</InlineMessage>
         -->
        </div>
        </div>
         <div class="row">
          <label>Certification Name</label>
          <div class="column">
          <InputText type="text" v-model="certName" class="grp-input" />
          <!-- <InlineMessage severity="error" v-if="errorMsg">Certification Already exist </InlineMessage>
         -->
          <div class="date-error" style="color:red;font-size:14px" v-if="errorMsg">
            Certification Already exist 
          </div>   
          </div>
        </div>
        <div class="row">
          <label>Issued Date</label>
          <Calendar class="grp-input" v-model="creationDate" disabled/>
        </div>
        <div class="row">
          <label>Completion Date</label>
          <div style="display:flex;flex-direction:column">
          <Calendar v-model="completionDate" class="grp-input"/>
          <span class="date-error" style="color:red;font-size:14px" v-if="warningMsg">
            Completion Date doesn't Match 
          </span>
          </div>
        </div>
        <div class="hexa-button">
        <Button @click="handleSubmit" label='submit'/>
      </div>
    </div>
  </template>
  
  
<script>
import PDFExtractor from '../PDFExtractor/PDFExtractor.vue';
import moment from 'moment';
// import employeeData from './data.json'
export default {
  data(){
    return{
      errorMsg:false,
      formSuccess:false,
      selectedEmpId:null,
      filteredEmpId:[],
      // employessData:employeeData,
      certName:'',
      empName:'',
      empId:'',
      empEmail:'',
      creationDate:null,
      completionDate:null,
      warningMsg:false,
      fileError:false,
    }
  },
  components: {
    PDFExtractor
  },
  watch:{
    selectedEmpId(newValue, oldValue){
      console.log(newValue)
      if(newValue && newValue.NEW_EMP_ID){
        this.empName = newValue.NAME;
        // this.empEmail = newValue
        // console.log("true")
        // const employeeDetail = this.employessData.find((employee)=>employee.id == newValue)
        // console.log('employeeDetails',employeeDetail)
      }
    },
    completionDate(newValue, oldValue){
      if(this.creationDate != null){
        console.log("compare",this.creationDate,newValue,typeof(newValue),typeof(this.creationDate))
        if(this.creationDate && this.creationDate.getTime() === newValue.getTime()){
          console.log('valid');
          this.warningMsg = false;
        }
        else{
           console.log('Invalid');
           this.warningMsg = true;
        }
      }
    },
    creationDate(newValue, oldValue){
      if(this.completionDate != null){
        if(this.creationDate.getTime() === newValue.getTime()){
          console.log('valid');
          this.warningMsg = false;
        }
        else{
          this.warningMsg = true;
           console.log('Invalid');
        }
      }
    }
  },
  methods:{
     handleSubmit(){
      const formData = {
        employeeID : this.empId, 
        employeeName : this.empName, 
        employeeEmail : this.empEmail, 
        certifications : [{
          name : this.certName,
          completionDate : this.completionDate
        }]
      }
      const response = fetch('http://localhost:3000/employee', 
      {  method: 'POST', // or 'PUT'
      headers: 
      {       'Content-Type': 'application/json', // Set the Content-Type to application/json   
       },    body: JSON.stringify(formData), // Convert the data object to a JSON string 
        })  .then(response => {     if (!response.ok) {       // If the response status code is not OK, throw an error
        throw new Error('Network response was not ok ' + response.statusText);     }    return response.json(); // Parse the JSON from the response 
         })  .then(data => { 
          this.formSuccess = true;
          console.log('Success:', data); // Handle the JSON data
          }) .catch(error => { 
            this.errorMsg = true
            console.error('Error:', error); // Handle any errors
           });

     },
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
     
      formattedCreationDate(timestamp){
        const dateStr = timestamp.substring(2, 10);
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        // const formattedDate = `${day}/${month}/${year}`;
        const stringDate = `${month}/${day}/${year}`;   
        console.log("date",stringDate)  
        const formattedDate = moment(stringDate,'MM/DD/YYYY');
        const parsedDate = formattedDate.toDate();
        return parsedDate;
      },
      handleMetaExtractedDate(timestamp){
        this.creationDate = this.handleExtractedDate(timestamp)
      },
      handleDate(timestamp){
        this.fileError =false;
       // this.creationDate = this.formattedCreationDate(timestamp)
        this.creationDate = this.handleEarnedDate(timestamp)
      },
      handleExtractedDate(dateString){
const regex = /D:(\d{4})(\d{2})(\d{2})/;
    const match = dateString.match(regex);

    if (!match) {
        throw new Error('Invalid date format');
    }

    // Extract date components from the matched groups
    const year = match[1];
    const month = match[2];
    const day = match[3];
    // Construct the date string in MM/DD/YYYY format
    const stringDate = `${month}/${day}/${year}`;

    // Parse the stringDate using moment.js
    const formattedDate = moment(stringDate, 'MM/DD/YYYY');
    // Convert moment.js object back to JavaScript Date object
    console.log("formatted",formattedDate)
    const parsedDate = formattedDate.toDate();
      console.log("formatted",parsedDate)
    return parsedDate;
      },
      handleCertificate(name){
        console.log('name',name)
        this.certName = name
      },
      handleError(){
        this.fileError = true;
      },
      handleCreationDate(dateString){},
      handleEarnedDate(dateString) { 
        const date = new Date(dateString); 
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
        const day = date.getDate().toString().padStart(2, '0'); 
        const year = date.getFullYear(); 
        const stringDate = `${month}/${day}/${year}`
        const formattedDate = moment(stringDate,'MM/DD/YYYY');
        const parsedDate = formattedDate.toDate();
        return parsedDate;
      },
      handleReset(){
        this.certName = '';
        this.creationDate = null;
        this.completionDate = null;
      }
      
      },
      // computed:{
      //   empName(){
      //     if(this.filteredEmpId.length === 1){
      //       return this.filteredEmpId.NEW_EMP_ID
      //     }
      //   }
      // }
};
</script>
  <style scoped>
  
  .row {
    margin: 15px 0px !important;

  }
  .hexa-form{
    padding: 20px 40px;
    background-color: white;
    color: black;
  }
  .hexa-button{
    width:100%;
   text-align: right;
  }
  </style>