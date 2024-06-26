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
    extractDate() {
      // Flexible regex to match dates in the format "Month Day, Year"
      const regex = /(\b\w+\s\d{1,2},\s\d{4}\b)/;
      const match = this.textInput.match(regex);
      if (match && match[1]) {
        this.extractedDate = match[1];
      } else {
        this.extractedDate = 'No date found';
      }
      console.log('date',this.extractedDate)
    },
    async handleFileUpload(event) {
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
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContentItems = await page.getTextContent();
          console.log('text',textContentItems)
          const pageText = textContentItems.items.map(item => item.str).join(' ');
          textContent += `Page ${pageNum}:\n${pageText}\n\n`;
        }
        this.$emit('metaDataFromPdf',metadata.info.CreationDate)
        console.log("meta",metadata)
        this.pdfData = { textContent, metadata };
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    }
  },
  computed:{
    creationDate(timestamp){
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
    }
  }
};
</script>

<style>
pre {
  white-space: pre-wrap; /* Preserve whitespace */
}
</style>
