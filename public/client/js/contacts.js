function send_msg(){
    showLoader()
    var contact_name = document.getElementById("contact_name")
    var contact_email = document.getElementById("contact_email")
    var contact_phone = document.getElementById("contact_phone")
    var contact_subject = document.getElementById("contact_subject")
    var contact_message = document.getElementById("contact_message")
    var contact_category = document.getElementById("contact_category")
    
      var raw = JSON.stringify({
        "name": contact_name,
        "email": contact_email,
        "phone": contact_phone,
        "message":contact_message,
        "subject":contact_subject,
        "category":contact_category
      });

      var requestOptions = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: raw,
        redirect: 'follow'
      };

      fetch(`${base_url}/contact`, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result)
          if (result.status != undefined) {
            swal({
              text: `${result.message}`,
              type: "error",
              icon: "error"
            }).then(()=>{
              hideLoader()
            })
          } else {
            swal({
              text: `Message Submitted`,
              type: "success",
              icon: "success"
            }).then(()=>{
              hideLoader()
              window.location.href = "./contact.html"
            })
          }
        })
        .catch(error => {
          console.log('error', error)
          swal({
            text: `${error}`,
            type: "error",
            icon: "error"
          }).then(()=>{
              hideLoader()
            })
        });
  }