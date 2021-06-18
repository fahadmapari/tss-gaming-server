function get_otp() {
    fetch(`${base_url}/auth/otp/mobile`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                credentials: 'include'
            },
        })
        .then(response => response.json())
        .then(result => {
            swal({
                text: `OTP Sended to Your Registed Mobile`,
                type: "success",
                icon: "success"
            }).then(() => {
                window.location.href = "/user/otp.html"
            })
        })
}



function send_otp() {
    showLoader()
    var OTP = $("#OTP").val();
    fetch(`${base_url}/auth/otp/mobile`, {
            method: "POST",
            body: JSON.stringify({
                otp: OTP
            }),
            headers: {
                "Content-Type": "application/json",
                credentials: 'include'
            },
        }).then((response) => response.json())
        .then((result) => {
            // console.log('result--', result)

            if (result.status != "approved") {
                swal({
                    text: `${result.message}`,
                    type: "error",
                    icon: "error"
                }).then(()=>hideLoader())
            } else {
                swal({
                    text: `Otp Verified Successfully`,
                    type: "success",
                    icon: "success"
                }).then(function () {
                    window.location.href = "/user/profile.html"
                })
            }
        }).catch((error) => {
            swal({
                text: `${error}`,
                type: "error",
                icon: "error"
            }).then(()=>hideLoader())
        })
}


function get_otp_email() {
    fetch(`${base_url}/auth/otp/email`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                credentials: 'include'
            },
        })
        .then(response => response.json())
        .then(result => {
            // console.log("result otp1--", result)
            swal({
                text: `OTP Sended to Your Registed Email`,
                type: "success",
                icon: "success"
            }).then(() => {
                window.location.href = "/user/email_otp.html"
            })
        })
}



function send_otp_email() {
    showLoader()
    var OTP = $("#OTP").val();
    fetch(`${base_url}/auth/otp/email`, {
            method: "POST",
            body: JSON.stringify({
                otp: OTP
            }),
            headers: {
                "Content-Type": "application/json",
                credentials: 'include'
            },
        }).then((response) => response.json())
        .then((result) => {
            // console.log('result--', result)

            if (result.status != "approved") {
                swal({
                    text: `${result.message}`,
                    type: "error",
                    icon: "error"
                }).then(()=>hideLoader())
            } else {
                swal({
                    text: `Otp Verified Successfully`,
                    type: "success",
                    icon: "success"
                }).then(function () {
                    window.location.href = "/user/profile.html"
                })
            }
        }).catch((error) => {
            // console.log("error--", error)
            swal({
                text: `${error}`,
                type: "error",
                icon: "error"
            }).then(()=>hideLoader())
        })
}