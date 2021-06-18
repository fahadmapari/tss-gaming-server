function signup_user() {
  let signup_email = $("#signup_email").val();
  let signup_gamername = $("#signup_gamername").val();
  let signup_password = $("#signup_password").val();
  let signup_confirm_password = $("#signup_confirm_password").val();
  let signup_mobile = $("#signup_mobile").val();
  let signup_reference = $("#signup_reference").val();

  // console.log("email--", signup_email, "password--", signup_password, "signup_gamername--", signup_gamername, "signup_confirm_password--", signup_confirm_password, "signup_mobile--", signup_mobile, "signup_reference--", signup_reference);
  if (signup_email == "" || signup_gamername == "" || signup_password == "" || signup_mobile == "") {
    $(".signup-error").html("Please Fill All the Fields!").fadeOut(5000);
    if (signup_password != signup_confirm_password) {
      $(".signup-error").html("Password do not match").fadeOut(5000);
    }

  } else {
    showLoader()
    var data = JSON.stringify({
      "name": signup_gamername,
      "email": signup_email,
      "password": signup_password,
      "mobile": signup_mobile,
      "profilepicture": "file",
      "referCode": signup_reference
    });

    var requestOptions = {
      method: 'POST',
      body: data,
      headers: {
        "Content-Type": "application/json"
      }
    };
    fetch(`${base_url}/auth/register`, requestOptions)
      .then(response => response.json())
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
            text: `Account Created Successfully`,
            type: "success",
            icon: "success"
          }).then(function () {
            localStorage.setItem("username", result.userInfo.name)
            localStorage.setItem("user_email", result.userInfo.email)
            localStorage.setItem("user_img", result.userInfo.profilePic)
            localStorage.setItem("user_referralId", result.userInfo.referralId)
            localStorage.setItem("user_mobile", result.userInfo.mobile)
            get_otp()
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
  }
}


function google_auth() {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  fetch(`${base_url}/auth/google/url`, requestOptions)
    .then(response => response.json())
    .then(result => {
      // console.log("result--", result)
      document.getElementById("link_google").setAttribute("href", result.url)
    })
    // .catch(error => console.log('error', error));
}

function facebook_auth() {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  fetch(`${base_url}/auth/facebook/url`, requestOptions)
    .then(response => response.json())
    .then(result => {
      // console.log("result--", result)
      document.getElementById("link_fb").setAttribute("href", result.url)
    })
    // .catch(error => console.log('error', error));
}

function discord_auth() {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  fetch(`${base_url}/auth/discord/url`, requestOptions)
    .then(response => response.json())
    .then(result => {
      // console.log("result--", result)
      document.getElementById("link_discord").setAttribute("href", result.url)
    })
    // .catch(error => console.log('error', error));
}

discord_auth()
facebook_auth()
google_auth()