if (localStorage.getItem("logged_in") == "true" && (localStorage.getItem("user_role") == "admin" || localStorage.getItem("user_role") == "sub-admin")) {
    let reqData = {
        users_currentPageNumber: 1,
    };

    function all_registered_users() {
        showLoader()
        fetch(`${base_url}/users?role=user`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    credentials: 'include'
                }
            }).then((responce) => responce.json())
            .then((result) => {
                // console.log("user result--", result)
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
                <div class="row mx-0 py-2 py-lg-4 px-lg-4">
                  <div class="col-12 col-lg-2 mb-2 text-center">
                    <p class="mb-0 black_input font-weight-bold tournament_name">${element.name}</p>
                  </div>
                  <div class="col-12 col-lg-4 mb-2 text-center">
                    <p class="black_input mb-0"><span class="ml-2">${element.email}</span></p>
                  </div>
                  <div class="col-12 col-lg-2 mb-2 text-center">
                    <p class="mb-0 black_input"><span class="ml-2">${element.mobile}</span></p>
                  </div>
                  <div class="col-12 col-lg-2 text-center">
                    <button class="btn btn-md primary_btn" onclick="remove_user('${element._id}','${element.name}')"><i class="fa fa-trash mr-2"></i>Block User</button>
                  </div>
                  <div class="col-12 col-lg-2 text-center">
                    <button class="btn secondary_btn btn-md" onclick="onGoing(${count})">View Details </button>
                  </div>
                  <div class="col-12 col-lg-2 collapse ongoing_${count} mt-2 text-center">
                    <p class="mb-0 black_input">Coins : ${element.coins}</p>
                  </div>
                  <div class="col-12 col-lg-4 collapse ongoing_${count} mt-2 text-center">
                    <p class="mb-0 black_input">Reffaral Code : <span>${element.referralId}</span></p>
                  </div>
                  
                  <div class="col-12 col-lg-2 collapse ongoing_${count} mt-2">
                    <p class="mb-0 black_input" ><span style="font-size:.85rem;">Mobile Verified : ${element.mobileVerified}</span></p>
                  </div>
                  <div class="col-12 col-lg-2 collapse ongoing_${count} mt-2">
                    <p class="mb-0 black_input" ><span style="font-size:.85rem;">Email Verified : ${element.emailVerified}</span></p>
                  </div>
                  <div class="col-12 col-lg-2 collapse ongoing_${count} mt-2 text-center">
                    <button class="btn secondary_btn btn-md" onclick="edit_user('${element.name}','${element.email}',${element.mobile},'${element._id}')"><i class="fa fa-pencil-square-o"></i> Edit User</button>
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
        fetch(`${base_url}/users?page=${reqData.users_currentPageNumber}&role=user`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    credentials: 'include'
                }
            }).then((responce) => responce.json())
            .then((result) => {
                // console.log("user result--", result)
                users_list(result.users)
                hideLoader()
            })

    }

    function users_getPageButtons(pageCount) {
        $(".users-page-buttons").empty();

        /* Declaring next and previous page buttons */
        let previous_page_button = `
            <button class='users-previous-page-btn btn btn-sm page_btn mx-1' disabled>  
              <<
            </button>`;
        $(".users-page-buttons").append(previous_page_button);

        let next_page_button = `
            <button class='users-next-page-btn btn btn-sm page_btn mx-1'>  
              >>
            </button>`;

        /* rendering buttons according to page count */
        for (let index = 1; index <= pageCount; index++) {
            let pageNumberButtons = ` 
            <button class="btn btn-sm page_btn mx-1 users-page-button-number">
              ${index}
            </button>`;
            /* Appending buttons to table */
            $(".users-page-buttons").append(pageNumberButtons);
        }
        /* appending next page butoon at the last
         */
        $(".users-page-buttons").append(next_page_button);

        /* Enabling and disabling previous and next page buttons */
        if (reqData.users_currentPageNumber > 1) {
            $(".users-previous-page-btn").attr("disabled", false);
        }
        if (reqData.users_currentPageNumber === 1) {
            $(".users-next-page-btn").attr("disabled", false);
        }
        if (reqData.users_currentPageNumber == pageCount) {
            $(".users-next-page-btn").attr("disabled", true);
        }

        $(".users-page-button-number").on("click", (e) => {

            let clickedpageButton = e.target.innerText;
            reqData.users_currentPageNumber = parseInt(clickedpageButton);
            users_page_list(reqData);
        });

        $(".users-next-page-btn").on("click", () => {
            if (reqData.users_currentPageNumber == pageCount - 1) {
                $(".users-next-page-btn").attr("disabled", true);
            }
            reqData.users_currentPageNumber++;
            users_page_list(reqData);
        });


        $(".users-previous-page-btn").on("click", () => {
            if (reqData.users_currentPageNumber == 1) {
                $(".users-previous-page-btn").attr("disabled", true);
            }
            reqData.users_currentPageNumber--;
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
                                credentials: 'include'
                            }
                        }).then((responce) => responce.json())
                        .then((result) => {
                            // console.log("deleted result--", result)
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
                                    window.location.href = "/admin/users.html"
                                })
                            }
                        })
                }

            })

    }

    function search_users() {
        showLoader()
        var search_user = document.getElementById("search_user").value
        // console.log("search_user--", search_user)
        fetch(`${base_url}/users/search?role=user`, {
                method: "POST",
                body: JSON.stringify({
                    "searchTerm": search_user
                }),
                headers: {
                    "Content-Type": "application/json",
                    credentials: 'include'
                }
            }).then((responce) => responce.json())
            .then((result) => {
                // console.log("search result--", result)
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

    function edit_user(username, email, mobile, userId) {
        document.getElementById("edit_username").value = username
        document.getElementById("edit_email").value = email
        document.getElementById("edit_mobile").value = mobile
        document.getElementById("user_id").value = userId

        $('#editProfileModal').modal();
    }


    function update_profile() {
        var user_name = $("#edit_username").val()
        var user_email = $("#edit_email").val()
        var user_mobile = $("#edit_mobile").val()
        var user_id = $("#user_id").val()
        var user_role = $("#user_role").val()

        if (user_name.trim() == "" || user_email.trim() == "" || user_mobile.trim() == "") {
            swal({
                text: `All Fields Required`,
                type: "error",
                icon: "error"
            })
        } else {
            showLoader()
            var raw = JSON.stringify({
                "email": user_email,
                "mobile": user_mobile,
                "name": user_name,
                "role": user_role
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

            fetch(`https://tss-gaming.herokuapp.com/api/user/${user_id}/edit`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    // console.log(result)
                    if (result.status != undefined) {
                        swal({
                            text: `${result.message}`,
                            type: "error",
                            icon: "error"
                        }).then(() => hideLoader())
                    } else {
                        swal({
                            text: `User Profile Updated`,
                            type: "success",
                            icon: "success"
                        }).then(function () {
                            window.location.href = "/admin/users.html"
                        })
                    }
                })
                .catch((error) => {
                    // console.log('error', error)
                    swal({
                        text: `${error}`,
                        type: "error",
                        icon: "error"
                    }).then(() => hideLoader())
                })
        }
    }

} else {
    window.location.href = "/admin/admin_login.html"
}