<template>
    <form ref="form" @submit.prevent="sendEmail">
      <label>Name</label>
      <input type="text" name="username">
      <label>Email</label>
      <input type="email" name="user_email">
      <label>Message</label>
      <textarea name="message"></textarea>
      <input type="submit" value="Send">
    </form>
  </template>
  
  <script>
  import emailjs from '@emailjs/browser';
  
  export default {
    methods: {
      sendEmail() {
        emailjs
          .sendForm('service_laut1ic', 'template_23q973t', this.$refs.form, {
            publicKey: 'Ly2RnuGbrbP-N6-Be',
          })
          .then(
            () => {
              console.log('SUCCESS!');
            },
            (error) => {
              console.log('FAILED...', error.text);
            },
          );
      },
    },
  };
  </script>