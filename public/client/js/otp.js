
    function get_otp() {
        fetch(`${base_url}/auth/otp/mobile`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            })
            .then(response => response.json())
            .then(result => {
                console.log("result otp1--", result)
                window.location.href = "./otp.html"
            })
    }



    function send_otp() {
        var OTP = $("#OTP").val();
        fetch(`${base_url}/auth/otp/mobile`, {
                method: "POST",
                body: JSON.stringify({
                    otp: OTP
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            }).then((response) => response.json())
            .then((result) => {
                console.log('result--', result)

                if (result.status != "approved") {
                    swal({
                        text: `${result.message}`,
                        type: "error",
                        icon: "error"
                    })
                } else {
                    swal({
                        text: `Your Mobile Verified`,
                        type: "success",
                        icon: "success"
                    }).then(function () {
                        window.location.href = "./profile.html"
                    })
                }
            }).catch((error) => console.log("error--", error))
    }

    function get_otp_email() {
        fetch(`${base_url}/auth/otp/email`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            })
            .then(response => response.json())
            .then(result => {
                console.log("result otp1--", result)
                window.location.href = "./otp.html"
            })
    }



    function send_otp_email() {
        var OTP = $("#OTP").val();
        fetch(`${base_url}/auth/otp/email`, {
                method: "POST",
                body: JSON.stringify({
                    otp: OTP
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            }).then((response) => response.json())
            .then((result) => {
                console.log('result--', result)

                if (result.status != "approved") {
                    swal({
                        text: `${result.message}`,
                        type: "error",
                        icon: "error"
                    })
                } else {
                    swal({
                        text: `Your Mobile Verified`,
                        type: "success",
                        icon: "success"
                    }).then(function () {
                        window.location.href = "./profile.html"
                    })
                }
            }).catch((error) => console.log("error--", error))
    }
