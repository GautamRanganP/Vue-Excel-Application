<template>
    <div>
      <div class="row">
        <label>Name</label>
        <InputText type="text" v-model="empName" class="grp-input" />
      </div>
      <div class="row">
        <label>Emp ID</label>
        <InputText type="text" v-model="empId" class="grp-input" />
      </div>
      <div class="row">
        <label>Email</label>
        <InputText type="text" v-model="empEmail" class="grp-input" />
      </div>
        <div class="row">
       <label>Completion Date</label>
          <PDFExtractor @metaDataFromPdf= "handleDate" @certificationName="handleCertificate"/>
        </div>
         <div class="row">
          <label>Certification Name</label>
   <InputText type="text" v-model="certName" class="grp-input" />
        </div>
        <div class="row">
          <label>Completion Date</label>
          <Calendar class="grp-input" v-model="creationDate" disabled/>
        </div>
        <div class="row">
          <label>User Completion Date</label>
          <div style="display:flex;flex-direction:column">
          <Calendar v-model="completionDate" class="grp-input"/>
          <span class="date-error" style="color:red;font-size:14px" v-if="warningMsg">
            Certification Completion Date and the Date you have entered doesn't Match 
          </span>
          </div>
        </div>
        <Button label='submit' />
    </div>
  </template>
  
  
<script>
import PDFExtractor from '../PDFExtractor/PDFExtractor.vue';
  import moment from 'moment';
export default {
  data(){
    return{
      certName:'',
      empName:'',
      empId:'',
      empEmail:'',
      creationDate:null,
      completionDate:null,
      warningMsg:false,
    }
  },
  components: {
    PDFExtractor
  },
  watch:{
    completionDate(newValue, oldValue){
      if(this.creationDate != null){
        console.log("compare",this.creationDate,newValue,typeof(newValue),typeof(this.creationDate))
        if(this.creationDate.getTime() === newValue.getTime()){
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
      formattedCreationDate(timestamp){
        const dateStr = timestamp.substring(2, 10);
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        // const formattedDate = `${day}/${month}/${year}`;
        const stringDate = `${month}/${day}/${year}`;     
        const formattedDate = moment(stringDate,'MM/DD/YYYY');
        const parsedDate = formattedDate.toDate();
        return parsedDate;
      },
      handleDate(timestamp){
        this.creationDate = this.formattedCreationDate(timestamp)
      },
      handleCertificate(name){
        this.certName = name
      }
    }
};
</script>
  <style>
  
  </style>