<template>
  <Card>
    <template #title>
      <div style="font-weight:600">Attendance Report Generator</div>
    </template>
    <template #content>
      <form @submit.prevent="handleSubmit1">
        <div style="display:flex;flex-direction:column;gap:15px">
          <div>
            <label style="display:block">Team Attendance</label>
            <InputText
              type="file"
              ref="teamAttendanceInput"
              @change="handleFileChange('teamAttendance')"
              accept=".xlsx, .xls"
            />
          </div>
          <div>
            <label style="display:block">Nomination</label>
            <InputText
              type="file"
              ref="nominationInput"
              @change="handleFileChange('nomination')"
              accept=".xlsx, .xls"
            />
          </div>
        </div>
        <div style="display:flex;justify-content:flex-end">
          <Button style="margin-top:15px" label="Generate" type="submit"/>
        </div>
      </form>
    </template>
  </Card>
</template>

<script>
import ExcelJS from 'exceljs';

export default {
  data() {
    return {
      files: {
        teamAttendance: null,
        nomination: null
      },
      errors: {
        teamAttendance: null,
        nomination: null
      },
    };
  },
  methods: {
    handleFileChange(type) {
      const input = this.$refs[`${type}Input`];
      const file = input.files[0];

      if (file && this.validateFile(file)) {
        this.files[type] = file;
        this.errors[type] = null; // Clear any previous errors
      } else {
        this.errors[type] = 'Invalid file type or size';
      }
    },
    validateFile(file) {
      // Example validation: only accept .xlsx files and size <= 5MB
      const allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      return allowedTypes.includes(file.type) && file.size <= maxSize;
    },
    async handleSubmit1() {
      // Check if both files are uploaded
      if (!this.files.teamAttendance) {
        this.errors.teamAttendance = 'Team Attendance file is required.';
      }
      if (!this.files.nomination) {
        this.errors.nomination = 'Nomination file is required.';
      }

      if (this.files.teamAttendance && this.files.nomination) {
        // Reset errors
        this.errors.teamAttendance = null;
        this.errors.nomination = null;

        // Process the files
        try {
          const teamAttendanceData = await this.parseExcel(this.files.teamAttendance);
          const nominationData = await this.parseExcel(this.files.nomination);

          console.log('Team Attendance Data:', teamAttendanceData);
          console.log('Nomination Data:', nominationData);

          // Handle form submission logic here (e.g., send data to an API)
        } catch (error) {
          console.error('Error processing files:', error);
        }
      }
    },
    async parseExcel(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(data);

            if (workbook.worksheets.length === 0) {
              throw new Error('No worksheets found in the file.');
            }

            const worksheet = workbook.worksheets[0]; // Get the first worksheet
            const json = this.sheetToJson(worksheet);
            resolve(json);
          } catch (error) {
            reject(`Error parsing Excel file: ${error.message}`);
          }
        };
        reader.onerror = () => reject('Error reading file');
        reader.readAsArrayBuffer(file);
      });
    },
    sheetToJson(sheet) {
      if (!sheet || !sheet.rowCount) {
        return []; // Return empty array if no sheet or rows
      }

      const rows = [];
      sheet.eachRow({ includeEmpty: true }, (row) => {
        rows.push(row.values);
      });
      return rows;
    }
  }
};
</script>

<style scoped>
.p-error {
  color: red;
}
</style>
