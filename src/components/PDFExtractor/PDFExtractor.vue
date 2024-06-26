<template>
  <div>
    <h1>PDF Text Extractor</h1>
    <input type="file" @change="handleFileUpload" />
    <div v-if="pdfData.metadata">
      <h2>Metadata</h2>
      <pre>{{ JSON.stringify(pdfData.metadata, null, 2) }}</pre>
    </div>
    <div v-if="pdfData.textContent">
      <h2>Text Content</h2>
      <pre>{{ pdfData.textContent }}</pre>
    </div>
       <textarea v-model="textInput" placeholder="Paste your text here"></textarea>
    <button @click="extractDate">Extract Date</button>
    <div v-if="extractedDate">
      <h2>Extracted Date:</h2>
      <p>{{ extractedDate }}</p>
    </div>
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

        this.pdfData = { textContent, metadata };
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    }
  }
};
</script>

<style>
pre {
  white-space: pre-wrap; /* Preserve whitespace */
}
</style>
