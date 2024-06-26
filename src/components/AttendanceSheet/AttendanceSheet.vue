<template>
  <div
    style="
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
    "
  >
    <div class="row">
      <label>Team Attendance Sheet</label>
      <InputText
        type="file"
        @change="handleFileUpload"
        multiple
        accept=".xlsx, .xls,.csv"
      />
    </div>
    <div class="row">
      <label>Nomination</label>
      <InputText type="file" @change="handleNomination" accept=".xlsx, .xls,.csv" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  watch: {},
  methods: {
    handleFileUpload(event) {
      const files = event.target.files;
      if (files.length === 0) {
        return;
      }
      console.log("file", event.target.files);

      const TrainingDetails = {
        Name: null,
        DateList: [],
        DateCount: event.target.files.length,
      };
      //   if (files && files.length > 0)
      // files.map((file) => {
      for (let i = 0; i < files.length; i++) {
        const originalFileName = files[i].name;
        const pattern = /^(.*) - Attendance report (\d{1,2}-\d{1,2}-\d{2})\.csv$/;
        const match = originalFileName.match(pattern);
        if (match) {
          if (!TrainingDetails.Name) {
            TrainingDetails.Name = match[1];
          }
          const DateAttendanceObject = readExcel(file.buffer);
          const participantAttendedObject = extractFromTeamsAttendance(
            DateAttendanceObject
          );

          const filteredParticipants = participantAttendedObject.filter((participant) => {
            const durationStr = participant["In-Meeting Duration"];
            const components = durationStr.split(" ");
            let hours = 0;
            let minutes = 0;
            let seconds = 0;
            let totalMinutes = 0;
            for (const component of components) {
              if (component.includes("h")) {
                hours = parseInt(component);
              } else if (component.includes("m")) {
                minutes = parseInt(component);
              } else if (component.includes("s")) {
                seconds = parseInt(component);
              }
            }
            totalMinutes = hours * 60 + minutes + seconds / 60;
            return totalMinutes > delay;
          });

          TrainingDetails.DateList.push({ date: match[2], data: filteredParticipants });
        } else {
          console.log("No match found.");
        }
      }
      // });
      TrainingDetails.DateList.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
      });
      const data2 = readExcel(files2[0].buffer);
      const employees = extractDataFromNomination(data2, files1.length);
      TrainingDetails.DateList.forEach((dateEntry) => {
        const currentDate = dateEntry.date;
        const dateData = dateEntry.data;

        employees.forEach((employee) => {
          const employeeData = dateData.find(
            (data) => Number(data["Participant ID (UPN)"]) === employee.NEW_EMP_ID
          );
          if (employeeData && employeeData.Role === "Presenter") {
            if (!employee.Attendance) {
              employee.Attendance = {}; // Initialize attendance object if not already present
            }
            employee.Attendance[currentDate] = "P";
            employee.PRESENTCOUNT++;
          } else {
            if (!employee.Attendance) {
              employee.Attendance = {}; // Initialize attendance object if not already present
            }
            employee.Attendance[currentDate] = "A";
          }
        });
      });

      console.log("Employee", TrainingDetails);
      //   }
      //   catch(){

      //   }
    },
    handleNomination(event) {
      console.log("file", event.target.files[0]);
    },
  },
  computed: {},
  // Other options like 'created', 'mounted', etc. can be defined here
};
</script>
<style></style>
