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
  </div>
</template>

<script>
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.entry';

export default {
  data() {
    return {
      pdfData: {
        textContent: '',
        metadata: {}
      }
    };
  },
  methods: {
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