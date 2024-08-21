<template>
    <Card style="width: 25rem; overflow: hidden">
        <template #title> <div class="title-content"><i class="pi pi-check"></i>  Thank you!
      </div></template>
      <!-- <template #title> <div class="title-content"><i class="pi pi-times"></i> Something went wrong on our end !
      </div></template> -->
      <!-- <template #content>
        <p class="m-0" style="text-align: center;">
            Please try submitting the form again.
        </p>
    </template> -->
    <template #content>
        <p class="m-0" style="text-align: center;">
            Your form has been successfully completed and submitted.
        </p>
    </template>
       <template #footer>
            <div class="title-content">
                <Button label="Submit Another Form" severity="secondary" outlined class="w-full" />
                <!-- <Button label="Try Again" severity="secondary" outlined class="w-full" /> -->
            </div>
        </template>
    </Card>
</template>
      
    <script>
    export default {
      data(){
        return{
            employeeData:null,
        }
      },
   
    }
    </script>
      <style scoped>
      .title-content{
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .pi-check{
        margin-right: 10px;
      }
    
      </style>