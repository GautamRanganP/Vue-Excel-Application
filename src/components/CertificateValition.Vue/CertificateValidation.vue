<template>
    <div>
        <div class="row">
        <!-- <label>Certification</label>
        <InputText type="file" @change="handleFileUpload" accept=".pdf" />
         -->
         <PDFExtractor/>
        </div>
    </div>
  </template>
  
  
<script>
import PDFExtractor from '../PDFExtractor/PDFExtractor.vue';

export default {
  components: {
    PDFExtractor
  }
};
</script>
  <style>
  
  </style>