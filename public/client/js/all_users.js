if (localStorage.getItem("logged_in") == "true" && (localStorage.getItem("user_role") == "admin" || localStorage.getItem("user_role") == "sub-admin")) {
    let reqData = {
        ongoing_currentPageNumber: 1,
        blocked_currentPageNumber: 1
    };

    function all_registered_users() {
        showLoader()
        fetch(`${base_url}/users?role=user`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                }
            }).then((responce) => responce.json())
            .then((result) => {
                console.log("user result--", result)
                users_list(result.users)
            })
        hideLoader()
    }

    function users_list(tournaments) {
        const {
            docs,
            totalPages
        } = tournaments;
        if (docs.length == 0) {
            var html = `<h1 class="text-center mb-4 mt-5 bahnschrift">Users Not Found</h1>`
            document.getElementById("all_user_list").innerHTML = html
        } else {
            var html = ""

            docs.forEach((element, count) => {
                html += `<div class="w-100 black_bg bordered mb-5">
        <div class="row mx-0 py-2 py-lg-4 px-lg-4 align-items-center">
          <div class="col-12 col-lg-4 mb-2 mb-lg-0 text-center text-lg-left">
            <h5 class="mb-0 font-weight-bold tournament_name">${element.name}</h5>
          </div>
          <div class="col-12 col-lg-4 mb-2 mb-lg-0 text-center text-lg-left">
            <h5 class="mb-0">Email : <span class="ml-2">${element.email}</span></h5>
          </div>
          <div class="col-12 col-lg-2 text-center text-lg-right">
            <button class="btn btn-sm primary_btn" onclick="remove_user('${element._id}','${element.name}')"><i class="fa fa-trash mr-2"></i>Block User </button>
          </div>
          <div class="col-12 col-lg-2 text-center text-lg-right">
            <button class="btn secondary_btn btn-sm" onclick="onGoing(${count})">View Details </button>
          </div>
          <div class="col-12 col-lg-4 collapse ongoing_${count} mt-2 text-center text-lg-left">
            <p class="mb-0">Wallet Coins : ${element.coins}</p>
            <h5 class="mb-0">Reffaral Code : <span>${element.referralId}</span></h5>

          </div>
          <div class="col-12 col-lg-4 collapse ongoing_${count} mt-2 text-center text-lg-left">
            <h5 class="mb-0 ">Mobile: <span class="ml-2">${element.mobile}</span></h5>
          </div>
          <div class="col-12 col-lg-4 collapse ongoing_${count} mt-2">
            <p class="mb-0 ml-5">Mobile Verified : ${element.mobileVerified}</p>
            <p class="mb-0 ml-5">Email Verified : ${element.emailVerified}</p>
          </div>
          
        </div>
      </div>`
            });
            document.getElementById("all_user_list").innerHTML = html
            users_getPageButtons(totalPages)
        }
    }

    function users_page_list() {
        showLoader()
        fetch(`${base_url}/users?page=${reqData.ongoing_currentPageNumber}&role=user`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                }
            }).then((responce) => responce.json())
            .then((result) => {
                console.log("user result--", result)
                ongoing_tournament_list(result.users)
                hideLoader()
            })

    }

    function users_getPageButtons(pageCount) {
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
        if (reqData.ongoing_currentPageNumber > 1) {
            $(".ongoing-previous-page-btn").attr("disabled", false);
        }
        if (reqData.ongoing_currentPageNumber === 1) {
            $(".ongoing-next-page-btn").attr("disabled", false);
        }
        if (reqData.ongoing_currentPageNumber == pageCount) {
            $(".ongoing-next-page-btn").attr("disabled", true);
        }

        $(".page-button-number").on("click", (e) => {
            $(this).addClass("active");

            let clickedpageButton = e.target.innerText;

            reqData.ongoing_currentPageNumber = parseInt(clickedpageButton);
            users_page_list(reqData);
            $(`[value = ${reqData.ongoing_currentPageNumber}]`).addClass("active");
        });

        $(".ongoing-next-page-btn").on("click", () => {
            if (reqData.ongoing_currentPageNumber == pageCount - 1) {
                $(".ongoing-next-page-btn").attr("disabled", true);
            }
            reqData.ongoing_currentPageNumber++;
            users_page_list(reqData);
        });


        $(".ongoing-previous-page-btn").on("click", () => {
            if (reqData.ongoing_currentPageNumber == 1) {
                $(".ongoing-previous-page-btn").attr("disabled", true);
            }
            reqData.ongoing_currentPageNumber++;
            users_page_list(reqData);;
        });
    }



    all_registered_users()


    function remove_user(userId, name) {
        swal({
                title: "Are you sure?",
                text: `Do You want to Block User ${name} `,
                icon: "warning",
                type: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    showLoader()
                    fetch(`${base_url}/users/${userId}/block`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer " + localStorage.getItem("token"),
                            }
                        }).then((responce) => responce.json())
                        .then((result) => {
                            console.log("deleted result--", result)
                            if (result.status != undefined) {
                                swal({
                                    text: `${result.message}`,
                                    type: "error",
                                    icon: "error"
                                }).then(() => {
                                    hideLoader()
                                })
                            } else {
                                swal({
                                    text: `User Blocked Successfully`,
                                    type: "success",
                                    icon: "success"
                                }).then(() => {
                                    window.location.href = "./users.html"
                                })
                            }
                        })
                }

            })

    }

    function search_users() {
        showLoader()
        var search_user = document.getElementById("search_user").value
        console.log("search_user--", search_user)
        fetch(`${base_url}/users/search?role=user`, {
                method: "POST",
                body: JSON.stringify({
                    "searchTerm": search_user
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                }
            }).then((responce) => responce.json())
            .then((result) => {
                console.log("search result--", result)
                if (result.status != undefined) {
                    swal({
                        text: `${result.message}`,
                        type: "error",
                        icon: "error"
                    }).then(() => {

                        hideLoader()
                    })
                } else {
                    users_list(result.searchedUsers)
                    hideLoader()
                }
            })

    }

} else {
    window.location.href = "./admin_login.html"
}