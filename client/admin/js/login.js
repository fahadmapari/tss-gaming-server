$("#admin_login-btn").click(() => {
  showLoader()
  let login_email = $("#login_email").val();
  let login_password = $("#login_password").val();

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "email": login_email,
    "password": login_password
  });
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch(`${base_url}/auth/login`, requestOptions)
    .then(response => {
      return response.json()
    })
    .then(result => {
      // console.log("responce--", result)

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
          text: `Successfully logged In`,
          type: "success",
          icon: "success"
        }).then(function () {
          localStorage.clear()
          localStorage.setItem("username", result.userInfo.name)
          localStorage.setItem("user_email", result.userInfo.email)
          localStorage.setItem("user_img", result.userInfo.profilePic)
          localStorage.setItem("user_referralId", result.userInfo.referralId)
          localStorage.setItem("user_mobile", result.userInfo.mobile)
          localStorage.setItem("user_role", result.userInfo.role)
          localStorage.setItem("logged_in", "true")
          window.location.href = "/admin/profile.html"
        })
      }

    })
    .catch(error => {
      // console.log('error', error)
      swal({
        text: `${error}`,
        type: "error",
        icon: "error"
      }).then(function () {
        hideLoader()
      })
    });
})
