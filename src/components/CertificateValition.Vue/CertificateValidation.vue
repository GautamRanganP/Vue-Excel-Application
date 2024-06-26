<template>
    <div>
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
      creationDate:null,
    }
  },
  components: {
    PDFExtractor
  },
  methods:{
       formattedCreationDate(timestamp){
// const timestamp = "D:20231113075823+00'00'";

// Extract the date portion from the string
const dateStr = timestamp.substring(2, 10);

// Parse the date string into a Date object
const year = dateStr.substring(0, 4);
const month = dateStr.substring(4, 6);
const day = dateStr.substring(6, 8);

// Format the date in DD/MM/YYYY format
const formattedDate = `${day}/${month}/${year}`;
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