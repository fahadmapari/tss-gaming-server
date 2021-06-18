if (localStorage.getItem("logged_in") == "true") {
function user_referrals() {
    fetch(`${base_url}/profile/referrals`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          credentials: 'include'
        }
      }).then((responce) => responce.json())
      .then((result) => {
        // console.log("referrals result--", result)
        referrals_list(result.referrals)
      })
  }

  function referrals_list(referrals) {
    var html = ""
    const {
      docs,
      totalPages
    } = referrals;
    if (docs.length != 0) {
      html += `<h1 class="text-center mb-5 bahnschrift" >referrals</h1>
      <div class="w-100 black_bg bordered">
      <div class="row mx-0 py-4 align-items-center">
        <div class="col-9 col-lg-3 text-center order-1">
          <h5 class="mb-0 font-weight-bold">UserName</h5>
        </div>
        <div class="col-3 col-lg-3 text-center order-2 order-lg-4">
          <h5 class="mb-0 product_20">Email</h5>
        </div>
        
        <div class="col-12 col-lg-3 text-center order-5">
          <h5 class="mb-0 product_20">Mobile</h5>
        </div>
        <div class="col-12 col-lg-3 text-center order-6">
        <h5 class="mb-0 product_20">ReferralID</h5>
        </div>
      </div>
    </div>`
      docs.forEach(element => {
        html += `
        <div class="w-100 black_bg bordered py-4 px-3">
            <div class="row mx-0 align-items-center">
              
              <div class="col-lg-3 col-md-3 col-6 text-center ">
                <p class="mb-0 product_20">${element.referredUser.name}</p>
              </div>
              <div class="col-6 col-lg-3 text-center col-md-3 ">
                <p class="mb-0">
                  ${element.referredUser.email}
                </p>
              </div>
              <div class="col-6 col-lg-3 text-center col-md-3 ">
                <p class="mb-0">
                  ${element.referredUser.mobile}
                </p>
              </div>
              <div class="col-6 col-md-3 col-lg-3 text-center">
                <p class="mb-0 product_20">
                  ${element.referredUser.referralId}
                </p>
              </div>
            </div>
          </div>`
      });
      user_referrals_getPageButtons(totalPages)
    } else {
      html += `
              <h1 class="text-center mb-5 bahnschrift" >My Referrals</h1>
              <div class="w-100 black_bg bordered py-4 px-3 mb-5">
                <h1 class="text-center mt-3 bahnschrift">No Referrals</h1>
              </div>`
    }
    document.getElementById("user_referrals").innerHTML = html
  }


function referrals_page_list() {
  fetch(`${base_url}/profile/referrals?page=${reqData.referralPageCount}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        credentials: 'include'
      }
    }).then((responce) => responce.json())
    .then((result) => {
      // console.log("completed result--", result)
      referrals_list(result.tournaments)
    })

}

function user_referrals_getPageButtons(pageCount) {
  $(".referrals-page-buttons").empty();

  /* Declaring next and previous page buttons */
  let previous_page_button = `
            <button class='referrals-previous-page-btn btn btn-sm page_btn mx-1' disabled>  
              <<
            </button>`;
  $(".referrals-page-buttons").append(previous_page_button);

  let next_page_button = `
            <button class='referrals-next-page-btn btn btn-sm page_btn mx-1'>  
              >>
            </button>`;

  /* rendering buttons according to page count */
  for (let index = 1; index <= pageCount; index++) {
    let pageNumberButtons = ` 
            <button class="btn btn-sm page_btn mx-1 referrals-page-button-number">
              ${index}
            </button>`;
    /* Appending buttons to table */
    $(".referrals-page-buttons").append(pageNumberButtons);
  }
  /* appending next page butoon at the last
   */
  $(".referrals-page-buttons").append(next_page_button);

  /* Enabling and disabling previous and next page buttons */
  if (reqData.referralPageCount > 1) {
    $(".referrals-previous-page-btn").attr("disabled", false);
  }
  if (reqData.referralPageCount === 1) {
    $(".referrals-next-page-btn").attr("disabled", false);
  }
  if (reqData.referralPageCount == pageCount) {
    $(".referrals-next-page-btn").attr("disabled", true);
  }

  $(".page-button-number").on("click", (e) => {
    $(this).addClass("active");

    let clickedpageButton = e.target.innerText;

    reqData.referralPageCount = parseInt(clickedpageButton);
    referrals_page_list(reqData);
    $(`[value = ${reqData.referralPageCount}]`).addClass("active");
  });

  $(".referrals-next-page-btn").on("click", () => {
    if (reqData.referralPageCount == pageCount - 1) {
      $(".referrals-next-page-btn").attr("disabled", true);
    }
    reqData.referralPageCount++;
    referrals_page_list(reqData);
  });


  $(".referrals-previous-page-btn").on("click", () => {
    if (reqData.referralPageCount == 1) {
      $(".referrals-previous-page-btn").attr("disabled", true);
    }
    reqData.referralPageCount++;
    referrals_page_list(reqData);;
  });
}

user_referrals()
}
else{
  window.location.href = "/user/login.html"
}