if (localStorage.getItem("logged_in") == "true" && (localStorage.getItem("user_role") == "admin" || localStorage.getItem("user_role") == "sub-admin") ){
let reqData = {
  completed_currentPageNumber: 1,
  ongoing_currentPageNumber: 1,
  upcoming_currentPageNumber: 1
};

function user_transaction() {
    showLoader()
    fetch(`${base_url}/coins/withdraw/pending`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          credentials: 'include'
        }
      }).then((responce) => responce.json())
      .then((result) => {
        // console.log("ongoing result--", result)
        transactions_list(result.withdrawals)
        hideLoader()
      })
  }

  function transactions_list(transactions) {
    var html = ""
    const {
      docs,
      totalPages
    } = transactions;
    if (docs.length != 0) {
      html += `<div class="w-100 black_bg bordered">
      <div class="row mx-0 py-4 align-items-center">
        <div class="col-9 col-lg-3 text-center order-1">
          <h5 class="mb-0 font-weight-bold">Username</h5>
        </div>
        <div class="col-3 col-lg-3 text-center order-2 order-lg-4">
          <h5 class="mb-0 product_20">UPI ID</h5>
        </div>
        
        <div class="col-12 col-lg-3 text-center order-5">
          <h5 class="mb-0 product_20">Ammount</h5>
        </div>
        <div class="col-12 col-lg-3 text-center order-6">
          
        </div>
      </div>
    </div>`
      docs.forEach(element => {
        html += `
        <div class="w-100 black_bg bordered ">
          <div class="row mx-0 py-4 align-items-center">
            <div class="col-9 col-lg-3 order-1 text-center">
              <h5 class="mb-0 font-weight-bold">${element.user.name}</h5>
            </div>
            <div class="col-3 col-lg-3 order-2 order-lg-4 text-center">
              <h5 class="mb-0 product_20">${element.upiID}</h5>
            </div>
            
            <div class="col-12 col-lg-3 text-center  order-5">
              <h5 class="mb-0 product_20">${element.amount}</h5>
            </div>
            <div class="col-12 col-lg-3 text-center order-6">
              <button class="btn btn-sm px-4 secondary_btn mx-2" onclick="reject_withdraw_request('${element._id}')">Reject</button>
              <button class="btn btn-sm px-4 primary_btn mx-2" onclick="accept_withdraw_request('${element._id}')">Accept</button>
            </div>
          </div>
        </div>`
      });
      user_transactions_getPageButtons(totalPages)
    } else {
      html += `
              <div class="w-100 black_bg bordered py-4 px-3 mb-5">
                <h1 class="text-center mt-3 bahnschrift">No Withdraw Request</h1>
              </div>`
    }
    document.getElementById("withdraw_request").innerHTML = html
  }

function transections_page_list() {
    fetch(`${base_url}/coins/withdraw/pending?page=${reqData.currentPageNumber}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          credentials: 'include'
        }
      }).then((responce) => responce.json())
      .then((result) => {
        // console.log("completed result--", result)
        transactions_list(result.withdrawals)
      })
  
  }
  
  function user_transactions_getPageButtons(pageCount) {
    $(".withdraw_request-page-buttons").empty();
  
    /* Declaring next and previous page buttons */
    let previous_page_button = `
              <button class='ongoing-previous-page-btn btn btn-sm page_btn mx-1' disabled>  
                <<
              </button>`;
    $(".withdraw_request-page-buttons").append(previous_page_button);
  
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
      $(".withdraw_request-page-buttons").append(pageNumberButtons);
    }
    /* appending next page butoon at the last
     */
    $(".withdraw_request-page-buttons").append(next_page_button);
  
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
  
  user_transaction()

  function reject_withdraw_request(withdraw_id) {
    // console.log("withdraw_id--", withdraw_id)
    showLoader()
    // console.log("withdraw_id--", withdraw_id)
    var raw = JSON.stringify({
      "action": "decline"
    });
    var requestOptions = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        credentials: 'include'
      },
      body: raw,
      redirect: 'follow'
    };

    fetch(`${base_url}/coins/withdraw/respond/${withdraw_id}`, requestOptions)
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
            text: `Accepted withdraw request`,
            type: "success",
            icon: "success"
          })
        }
      })
      .catch(error => {
        // console.log('error', error)
        swal({
          text: `${error}`,
          type: "error",
          icon: "error"
        })
      });
      hideLoader()
  }

  function accept_withdraw_request(withdraw_id) {
    showLoader()
    // console.log("withdraw_id--", withdraw_id)
    var raw = JSON.stringify({
      "action": "accept"
    });
    var requestOptions = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        credentials: 'include'
      },
      body: raw,
      redirect: 'follow'
    };

    fetch(`${base_url}/coins/withdraw/respond/${withdraw_id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        // console.log(result)
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
            text: `Accepted withdraw request`,
            type: "success",
            icon: "success"
          }).then(()=>{
            window.location.href = "/admin/transactions.html"
          })
        }
      })
      .catch(error => {
        // console.log('error', error)
        swal({
          text: `${error}`,
          type: "error",
          icon: "error"
        }).then(()=>{
          hideLoader()
        })
      });
      
  }
}
else{
  window.location.href = "/admin/admin_login.html"
}