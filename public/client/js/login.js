$("#login-btn").click(() => {
  showLoader()
  let login_email = $("#login_email").val();
  let login_password = $("#login_password").val();
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "email": login_email,
    "password": login_password
  });
  console.log("raw--", raw)
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
      console.log("responce--", result)
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
          text: `Successfully logged in`,
          type: "success",
          icon: "success"
        }).then(function () {
          localStorage.setItem("token", result.token)
          localStorage.setItem("coins", result.userInfo.coins)
          localStorage.setItem("username", result.userInfo.name)
          localStorage.setItem("user_email", result.userInfo.email)
          localStorage.setItem("user_img", result.userInfo.profilePic)
          localStorage.setItem("user_referralId", result.userInfo.referralId)
          localStorage.setItem("user_mobile", result.userInfo.mobile)
          localStorage.setItem("user_role", result.userInfo.role)
          localStorage.setItem("logged_in", "true")

          if (result.userInfo.emailVerified || result.userInfo.mobileVerified) {
            window.location.href = "./profile.html"

          } else {
            get_otp()
          }
        })
      }
    })
    .catch(error => {
      console.log('error', error)
      swal({
        text: `${error}`,
        type: "error",
        icon: "error"
      }).then(function () {
        hideLoader()
      })
    });
})


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
  console.log("raw--", raw)
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("https://tss-gaming.herokuapp.com/api/auth/login", requestOptions)
    .then(response => {
      return response.json()
    })
    .then(result => {
      console.log("responce--", result)

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
          localStorage.setItem("token", result.token)
          localStorage.setItem("username", result.userInfo.name)
          localStorage.setItem("user_email", result.userInfo.email)
          localStorage.setItem("user_img", result.userInfo.profilePic)
          localStorage.setItem("user_referralId", result.userInfo.referralId)
          localStorage.setItem("user_mobile", result.userInfo.mobile)
          localStorage.setItem("user_role", result.userInfo.role)
          localStorage.setItem("logged_in", "true")
          window.location.href = "./profile.html"
        })
      }

    })
    .catch(error => {
      console.log('error', error)
      swal({
        text: `${error}`,
        type: "error",
        icon: "error"
      }).then(function () {
        hideLoader()
      })
    });
})


function facebook_auth() {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  fetch(`${base_url}/auth/facebook/url`, requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log("result--", result)
      document.getElementById("link_fb").setAttribute("href", result.url)
    })
    .catch(error => console.log('error', error));
}

function google_auth() {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  fetch(`${base_url}/auth/google/url`, requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log("result--", result)
      document.getElementById("link_google").setAttribute("href", result.url)
    })
    .catch(error => console.log('error', error));
}

function discord_auth() {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  fetch(`${base_url}/auth/discord/url`, requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log("result--", result)
      document.getElementById("link_discord").setAttribute("href", result.url)
    })
    .catch(error => console.log('error', error));
}

discord_auth()
google_auth()
facebook_auth()