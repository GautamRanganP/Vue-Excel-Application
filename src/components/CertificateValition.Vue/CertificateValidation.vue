<template>
    <div>
      <div class="row">
        <label>Name</label>
        <InputText type="text" v-model="empName" />
      </div>
      <div class="row">
        <label>EMP ID</label>
        <InputText type="text" v-model="empId" />
      </div>
      <div class="row">
        <label>Email</label>
        <InputText type="text" v-model="empEmail" />
      </div>
        <div class="row">
          <label>Upload Attendance</label>
          <PDFExtractor @metaDataFromPdf= "handleDate"/>
        </div>
        <div class="row">
          <label>Completion Date</label>
          <Calendar v-model="creationDate"/>
        </div>
    </div>
  </template>
  
  
<script>
import PDFExtractor from '../PDFExtractor/PDFExtractor.vue';

export default {
  data(){
    return{
      empName:'',
      empId:'',
      empEmail:'',
      creationDate:null,
    }
  },
  components: {
    PDFExtractor
  },
  methods:{
      formattedCreationDate(timestamp){
        const dateStr = timestamp.substring(2, 10);
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        // const formattedDate = `${day}/${month}/${year}`;
        const formattedDate = `${month}/${day}/${year}`;
        return formattedDate
      },
      handleDate(timestamp){
        this.creationDate = this.formattedCreationDate(timestamp)
      },
    }
};
</script>
  <style>
  
  </style>