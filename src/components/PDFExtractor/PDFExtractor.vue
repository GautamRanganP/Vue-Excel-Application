<template>
  <div>
   <InputText type="file" @change="handleFileUpload" accept=".pdf" class="grp-input"/>
    <!-- <input type="file" @change="handleFileUpload" /> -->
    <!-- <div v-if="pdfData.metadata">
      <h2>Metadata</h2>
      <pre>{{ JSON.stringify(pdfData.metadata, null, 2) }}</pre>
    </div> -->
    <!-- <div v-if="pdfData.textContent">
      <h2>Text Content</h2>
      <pre>{{ pdfData.textContent }}</pre>
    </div>
       <textarea v-model="textInput" placeholder="Paste your text here"></textarea>
    <button @click="extractDate">Extract Date</button>
    <div v-if="extractedDate">
      <h2>Extracted Date:</h2>
      <p>{{ extractedDate }}</p>
    </div> -->
  </div>
</template>

<script>
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf';
import 'pdfjs-dist/build/pdf.worker';

export default {
  data() {
    return {
      pdfData: {
        textContent: '',
        metadata: {},
        textInput: '',
        extractedDate: null
      }
    };
  },
  methods: {
    extractDate(dateString) {
      // Flexible regex to match dates in the format "Month Day, Year"
      const regex = /(\b\w+\s\d{1,2},\s\d{4}\b)/;
      const match = dateString.match(regex);
      if (match && match[1]) {
        return match[1];
      } else {
        this.extractedDate = 'No date found';
      }
      console.log('date',this.extractedDate)
    },
    async handleFileUpload(event) {
      this.$emit('formCertificationReset',"")
      const file = event.target.files[0];
      if (file && file.type === 'application/pdf') {
        const fileReader = new FileReader();
        fileReader.onload = async (e) => {
          const typedArray = new Uint8Array(e.target.result);
          await this.loadPDF(typedArray);
        };
        fileReader.readAsArrayBuffer(file);
      } else {
        alert('Please upload a valid PDF file.');
      }
    },
   
    async loadPDF(typedArray) {
      try {
        const loadingTask = pdfjsLib.getDocument(typedArray);
        const pdf = await loadingTask.promise;

        // Extract metadata
        const metadata = await pdf.getMetadata();

        // Extract text content from each page
        let textContent = '';
        let textItems = [];
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          textItems = await page.getTextContent();
          const pageText = textItems.items.map(item => item.str).join(' ');
           console.log('textitems',textItems)
          textContent += `Page ${pageNum}:\n${pageText}\n\n`;
        }
       
        //  this.$emit('metaDataFromPdf',this.extractDate(textItems.items[4].str))
        console.log('text',textContent)
        console.log("meta",metadata)
        this.pdfData = { textContent, metadata };
        const regex1 = /\b([A-Za-z]+ \d{1,2}, \d{4})\b/;
        const regex2 = /\b([A-Za-z]+ \d{1,2},\d{4})\b/;
        const match = textContent.match(regex1);
        const match1 = textContent.match(regex2);
        if(match && match[0]){
          console.log("regex1")
          this.$emit('metaDataFromPdf',match[0])
        }
        else if(match1 && match1[0]){
          console.log("regex2")
          this.$emit('metaDataFromPdf',match1[0])
        }
        // else if(textItems&& textItems.items &&textItems.items.length!==0&& textItems.items[4].str.includes('Microsoft')){
        //   console.log("Azure")
        //  this.$emit('certificationName',textItems.items[4].str)
        //   this.$emit('metaDataFromPdf',textItems.items[19].str)
        // }
        // else if(textItems&& textItems.items &&textItems.items.length!==0&& textItems.items[2].str.includes('AWS')){
        //   this.$emit('certificationName',textItems.items[2].str)
        //   this.$emit('metaDataFromPdf',textItems.items[4].str)
        // }
        else{
          console.log("creationdate",metadata.info.CreationDate)
          // this.$emit('textExtractDate',metadata.info.CreationDate)
         this.$emit('validationError','')
        }
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    }
  },
  computed:{
  }
};
</script>

<style>
pre {
  white-space: pre-wrap; /* Preserve whitespace */
}
</style>
