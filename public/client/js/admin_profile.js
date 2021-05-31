if (localStorage.getItem("logged_in") == "true" && (localStorage.getItem("user_role") == "admin" || localStorage.getItem("user_role") == "sub-admin")) {
  function profile_data() {
    showLoader()
    var user_referralId = localStorage.getItem("user_referralId")
    if (localStorage.getItem("token") != undefined) {
      fetch(`${base_url}/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          }
        }).then((responce) => responce.json())
        .then((result) => {
          console.log("Profile result--", result)
          $('.username').text(result.profile.name)
          $('.user_email').text(result.profile.email)
          $('.ref_code').text(user_referralId)
          $('.user_mobile').text(result.profile.mobile)
          localStorage.setItem("username", result.profile.name)
          localStorage.setItem("user_email", result.profile.email)
          localStorage.setItem("user_mobile", result.profile.mobile)
        })
    } else {
      window.location.href = "./login.html"
    }
    hideLoader()
  }



  $("#logout_user").click(() => {
    showLoader()
    fetch(`${base_url}/auth/logout`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      })
      .then(response => response.json())
      .then(result => {
        console.log('result--', result)
        if (result.status != "log out") {
          swal({
            text: `${result.message}`,
            type: "error",
            icon: "error"
          }).then(function () {
            hideLoader()
          })
        } else {
          swal({
            text: `Logged Out`,
            type: "success",
            icon: "success"
          }).then(function () {
            localStorage.clear()
            window.location.href = "./admin_login.html"
          })
        }
      }).
    catch((error) => {
      console.log('error', error)
      swal({
        text: `${error}`,
        type: "error",
        icon: "error"
      }).then(function () {
        hideLoader()
      })
    })
  })


  function edit_profile() {
    document.getElementById("edit_username").value = localStorage.getItem("username")
    document.getElementById("edit_email").value = localStorage.getItem("user_email")
    document.getElementById("edit_mobile").value = localStorage.getItem("user_mobile")
  }

  function update_profile() {
    showLoader()
    var new_name = $("#edit_username").val()
    var new_email = $("#edit_email").val()
    var new_mobile = $("#edit_mobile").val()
    var old_password = $("#old_password").val()
    var new_password = $("#new_password").val()
    var conf_password = $("#conf_password").val()
    if (new_password != conf_password) {
      console.log("password do not matched")
      swal({
        text: `password do not matched`,
        type: "error",
        icon: "error"
      }).then(function () {
        hideLoader()
      })
      return
    }
    var raw = JSON.stringify({
      "currentPassword": old_password,
      "email": new_email,
      "mobile": new_mobile,
      "name": new_name,
      "newPassword": new_password
    });
    console.log('data--', raw)
    var requestOptions = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: raw,
      redirect: 'follow'
    };

    fetch("https://tss-gaming.herokuapp.com/api/profile/update", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        if (result.status != undefined) {
          swal({
            text: `${result.message}`,
            type: "error",
            icon: "error"
          }).then(function () {
            hideLoader()
          })
        } else {
          swal({
            text: `OTP Sended to new Mobile Number`,
            type: "success",
            icon: "success"
          }).then(function () {
            get_otp()
          })
        }
      })
      .catch((error) => {
        console.log('error', error)
        swal({
          text: `${error}`,
          type: "error",
          icon: "error"
        }).then(function () {
          hideLoader()
        })
      })
  }
  profile_data()
} else {
  window.location.href = "./admin_login.html"
}