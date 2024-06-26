<template>
  <div class="main-app">
    <div class="main-router-header">
     <router-link to="/sessionCreation">Session Creation</router-link>  
    <router-link to="/">Attendance Upload</router-link>
    <router-link to="/certificationValidator">Certification Validator</router-link>     
    </div>   
    <router-view></router-view>
    <!-- Your template code here -->
  </div>
</template>

<script>


export default {
  data() {
    return {
    
    };
  },
  watch: {
    
  },
  methods: {
   
  },
  computed: {
    
  },
  // Other options like 'created', 'mounted', etc. can be defined here
};
</script>
<style>

</style>