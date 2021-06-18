if (localStorage.getItem("logged_in") == "true") {
  // console.log(localStorage.getItem("token"))
  var reqData = {
    currentPageNumber: 1,
    referralPageCount: 1
  }
  const images = document.querySelector(".edit_proImg");
  function profile_data() {
    showLoader()
    var user_referralId = localStorage.getItem("user_referralId")
    if (localStorage.getItem("token") != undefined) {
      fetch(`${base_url}/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            credentials: 'include'
          }
        }).then((responce) => responce.json())
        .then((result) => {
          
          // console.log("Profile result--", result)
          $('.username').text(result.profile.name)
          $('.user_email').text(result.profile.email)
          $('#ref_code').text(user_referralId)
          $('.user_mobile').text(result.profile.mobile)
          if(result.profile.profilePic!=undefined){
            $('#user_img').attr("src",`${result.profile.profilePic}`)

          }

          localStorage.setItem("coins", result.profile.coins)
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
          credentials: 'include'
        }
      })
      .then(response => response.json())
      .then(result => {
        // console.log('result--', result)
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
            window.location.href = "./login.html"
          })
        }
      }).
    catch((error) => {
      // console.log('error', error)
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
    var new_name = $("#edit_username").val()
    var new_email = $("#edit_email").val()
    var new_mobile = $("#edit_mobile").val()
    var old_password = $("#old_password").val()
    var new_password = $("#new_password").val()
    var conf_password = $("#conf_password").val()
    var profileImg = images.files[0]

    if (new_password != conf_password) {
      swal({
        text: `Password do not Match`,
        type: "error",
        icon: "error"
      })
      
    }
    else{
      showLoader()
      var raw = JSON.stringify({
        "currentPassword": old_password,
        "email": new_email,
        "mobile": new_mobile,
        "name": new_name,
        "newPassword": new_password,
        "profilePic":profileImg
      });
      // console.log('data--', raw)
      var requestOptions = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          credentials: 'include'
        },
        body: raw,
        redirect: 'follow'
      };
  
      fetch(`${base_url}/profile/update`, requestOptions)
        .then(response => response.json())
        .then(result => {
          // console.log(result)
          if (result.status != undefined) {
            swal({
              text: `${result.message}`,
              type: "error",
              icon: "error"
            })
          } else {
            
            swal({
              text: `Profile Updated Login Again`,
              type: "success",
              icon: "success"
            }).then(function () {
               localStorage.clear()
               window.location.href = "./login.html"
            })
          }
        })
        .catch((error) => {
          // console.log('error', error)
          swal({
            text: `${error}`,
            type: "error",
            icon: "error"
          }).then(()=>hideLoader())
        })
    }
    
  }


  function user_transaction() {
    fetch(`${base_url}/profile/transactions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          credentials: 'include'
        }
      }).then((responce) => responce.json())
      .then((result) => {
        // console.log("ongoing result--", result)
        transactions_list(result.transactions)
      })
  }

  function transactions_list(transactions) {
    var html = ""
    const {
      docs,
      totalPages
    } = transactions;
    if (docs.length != 0) {
      html += `<h1 class="text-center mb-5 bahnschrift" >Transactions</h1>
      <div class="w-100 black_bg bordered">
      <div class="row mx-0 py-4 align-items-center">
        <div class="col-9 col-lg-3 text-center order-1">
          <h5 class="mb-0 font-weight-bold">Time</h5>
        </div>
        <div class="col-3 col-lg-3 text-center order-2 order-lg-4">
          <h5 class="mb-0 product_20">Ammount</h5>
        </div>
        
        <div class="col-12 col-lg-3 text-center order-5">
          <h5 class="mb-0 product_20">Transection ID</h5>
        </div>
        <div class="col-12 col-lg-3 text-center order-6">
        <h5 class="mb-0 product_20">Status</h5>
        </div>
      </div>
    </div>`
      docs.forEach(element => {
        html += `
        <div class="w-100 black_bg bordered py-4 px-3">
            <div class="row mx-0 align-items-center">
              <div class="col-lg-3 text-center col-md-3 col-6 mb-lg-0">
                <p class="mb-0">
                  <i class="fa fa-calendar text_red"></i> ${element.createdAt.slice(0,10)}
                  <br class="d-lg-none">
                  <i class="fa fa-clock-o text_red ml-0 ml-lg-2"></i> ${element.createdAt.slice(11,16)}
                </p>
              </div>
              <div class="col-lg-3 col-md-3 col-6 text-center ">
                <p class="mb-0 product_20">${element.orderDetails.amount/100} Coins</p>
              </div>
              <div class="col-6 col-lg-3 text-center col-md-3 ">
                <p class="mb-0">
                    ${element.orderDetails.id}
                </p>
              </div>
              <div class="col-6 col-md-3 col-lg-3 text-center">
                <p class="mb-0 product_20">
                  <i class="fa fa-check-circle text-success"></i>
                  ${element.orderDetails.status}
                </p>
              </div>
            </div>
          </div>`
      });
      user_transactions_getPageButtons(totalPages)
    } else {
      html += `
              <h1 class="text-center mb-5 bahnschrift" >Transactions</h1>
              <div class="w-100 black_bg bordered py-4 px-3 mb-5">
                <h1 class="text-center mt-3 bahnschrift">No Transactions</h1>
              </div>`
    }
    document.getElementById("user_transactions").innerHTML = html
  }


  function transections_page_list() {
    fetch(`${base_url}/profile/transactions?page=${reqData.currentPageNumber}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          credentials: 'include'
        }
      }).then((responce) => responce.json())
      .then((result) => {
        // console.log("completed result--", result)
        transactions_list(result.tournaments)
      })

  }

  function user_transactions_getPageButtons(pageCount) {
    $(".ongoing-page-buttons").empty();

    /* Declaring next and previous page buttons */
    let previous_page_button = `
            <button class='ongoing-previous-page-btn btn btn-sm page_btn mx-1' disabled>  
              <<
            </button>`;
    $(".ongoing-page-buttons").append(previous_page_button);

    let next_page_button = `
            <button class='ongoing-next-page-btn btn btn-sm page_btn mx-1'>  
              >>
            </button>`;

    /* rendering buttons according to page count */
    for (let index = 1; index <= pageCount; index++) {
      let pageNumberButtons = ` 
            <button class="btn btn-sm page_btn mx-1 ongoing-page-button-number">
              ${index}
            </button>`;
      /* Appending buttons to table */
      $(".ongoing-page-buttons").append(pageNumberButtons);
    }
    /* appending next page butoon at the last
     */
    $(".ongoing-page-buttons").append(next_page_button);

    /* Enabling and disabling previous and next page buttons */
    if (reqData.currentPageNumber > 1) {
      $(".ongoing-previous-page-btn").attr("disabled", false);
    }
    if (reqData.currentPageNumber === 1) {
      $(".ongoing-next-page-btn").attr("disabled", false);
    }
    if (reqData.currentPageNumber == pageCount) {
      $(".ongoing-next-page-btn").attr("disabled", true);
    }

    $(".page-button-number").on("click", (e) => {
      $(this).addClass("active");

      let clickedpageButton = e.target.innerText;

      reqData.currentPageNumber = parseInt(clickedpageButton);
      transections_page_list(reqData);
      $(`[value = ${reqData.currentPageNumber}]`).addClass("active");
    });

    $(".ongoing-next-page-btn").on("click", () => {
      if (reqData.currentPageNumber == pageCount - 1) {
        $(".ongoing-next-page-btn").attr("disabled", true);
      }
      reqData.currentPageNumber++;
      transections_page_list(reqData);
    });


    $(".ongoing-previous-page-btn").on("click", () => {
      if (reqData.currentPageNumber == 1) {
        $(".ongoing-previous-page-btn").attr("disabled", true);
      }
      reqData.currentPageNumber++;
      transections_page_list(reqData);;
    });
  }

  profile_data()
  user_transaction()
} else {
  window.location.href = './login.html'
}