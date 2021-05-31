if (
  localStorage.getItem("logged_in") == "true" &&
  (localStorage.getItem("user_role") == "admin" ||
    localStorage.getItem("user_role") == "sub-admin")
) {
  let reqData = {
    completed_currentPageNumber: 1,
    ongoing_currentPageNumber: 1,
    upcoming_currentPageNumber: 1,
  };
  showLoader();
  const Form = document.getElementById("create_tournament");

  Form.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log(e);
    showLoader();
    var img1 = document.querySelector('input[type="file"]');
    var title = $("#title").val();
    var description = $("#Description").val();
    var game_date = $("#game_date").val();
    var game = $("#game").val();
    var game_time = $("#game_time").val();
    var game_type = $("#game_type").val();
    var entry_fee = $("#entry_fee").val();
    var total_prize = $("#total_prize").val();
    var room_id = $("#room_id").val();
    var room_password = $("#room_password").val();
    var kill_prize = $("#kill_prize").val();
    var streak_prize = $("#streak_prize").val();
    var stream_link = $("#stream_link").val();
    var damage_prize = $("#damage_prize").val();
    var total_slots = $("#total_slots").val();

    var myHeaders = new Headers();
    myHeaders.append("Authorization", localStorage.getItem("token"));
    myHeaders.append("Content-Type", "multipart/form-data");

    var formdata = new FormData();
    formdata.append("title", title);
    formdata.append("thumbnails", img1.files[0]);
    formdata.append("description", description);
    formdata.append("date", game_date + "," + game_time);
    formdata.append("entryFee", entry_fee);
    formdata.append("tournamentType", game_type);
    formdata.append("kills", kill_prize);
    formdata.append("streak", streak_prize);
    formdata.append("damage", damage_prize);
    formdata.append("prize", total_prize);
    formdata.append("roomId", room_id);
    formdata.append("roomPassword", room_password);
    formdata.append("stream", stream_link);
    formdata.append("slots", total_slots);
    formdata.append("game", game);

    console.log("form data --", formdata);
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(`${base_url}/tournament/create`, requestOptions)
      .then((responce) => responce.json())
      .then((result) => {
        console.log(result);
        if (result.status != undefined) {
          swal({
            text: `${result.message}`,
            type: "error",
            icon: "error",
          }).then(function () {
            hideLoader();
          });
        } else {
          swal({
            text: `Tournament Created Successfully`,
            type: "success",
            icon: "success",
          }).then(function () {
            window.location.href = "./admin_dashboard.html";
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
        swal({
          text: `${error}`,
          type: "error",
          icon: "error",
        }).then(function () {
          hideLoader();
        });
      });
  });

  function completed_tournaments() {
    fetch(`${base_url}/tournament/list?status=completed`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((responce) => responce.json())
      .then((result) => {
        console.log("completed result--", result);
        completed_tournament_list(result.tournaments);
      });
  }

  function completed_tournament_list(tournaments) {
    const { docs, totalPages } = tournaments;
    if (docs.length == 0) {
      var html = `<h1 class="text-center mb-4 mt-5 bahnschrift">Completed Tournaments</h1>
      <div class="w-100 black_bg bordered mb-5">
      <h1 class="text-center mb-4 mt-5 bahnschrift">No Tournaments Schedualed Before</h1>
      </div>`;
      document.getElementById("user_played_tournament").innerHTML = html;
    } else {
      var html = "";
      html += `<h1 class="text-center mb-4 mt-5 bahnschrift">Completed Tournaments</h1>`;
      docs.forEach((element, count) => {
        html += `
        <div class="w-100 black_bg bordered mb-5">
        <div class="row mx-0 py-4">
        <div class="col-12 col-lg-3">
          <div class="row mx-0 align-items-center text-center mb-4 mb-lg-0">
              <div class="col-12">
                <h4 class="mt-3">${element.title}</h4>
              </div>
          </div>
        </div>
        <div class="col-9 col-lg-3 text-lg-center mb-3">
          <h5 class="mb-2 font-weight-bold"><span class="mr-2">COD</span><span class="ml-2">${
            element.tournamentType
          }</span></h5>
          <p class="mb-0">
            <i class="fa fa-calendar text_red"></i> ${element.date.slice(0, 10)}
            <i class="fa fa-clock-o text_red"></i> ${element.date.slice(12, 16)}
          </p>
        </div>
        <div class="col-12 col-lg-3 mb-2">
          <h5 class="text-center text-lg-left">Prize</h5>
          <h5 class="text-center text-lg-left mb-2">${element.prize}</h5>
        </div>
        <div class="col-12 col-lg-3 text-center">
          <button class="btn secondary_btn btn-sm" onclick="played(${count})">View Details <i class="fa fa-chevron-down down_arrow_${count}"></i></button>
        </div>
        <div class="col-12 col-lg-3 collapse played_${count}">
            <p class="mb-1">Room ID : ${element.roomId}</p>
            <p class="mb-0">Room Password : ${element.roomPassword}</p>
          </div>
          <div class="col-12 col-lg-3 collapse played_${count}">
            <p class="mb-1"><i class="fa fa-calendar text_red mx-1"></i>${element.date.slice(
              0,
              10
            )}</p>
            <p class="mb-0"><i class="fa fa-clock-o text_red mx-1"></i> ${element.date.slice(
              11,
              16
            )}</p>
          </div>
          <div class="col-12 col-lg-3  collapse played_${count} mt-2 text-center">
            <button class="btn btn-sm mt-2 secondary_btn" data-toggle="modal" data-target="#registeredUsersModal" onclick="registeredUsers('${
              element._id
            }')">View Registered Players</button>
          </div>
          <div class="col-12 col-lg-3  text-center collapse played_${count} mt-2">
            <button class="btn btn-sm mt-2 primary_btn" data-toggle="modal" data-target="#winnerModal">View Winners</button>
          </div>
      </div>
      </div>`;
      });
      document.getElementById("user_played_tournament").innerHTML = html;
      completed_turnament_getPageButtons(totalPages);
    }
  }

  function completed_turnament_page_list() {
    fetch(
      `${base_url}/tournament/list?page=${reqData.completed_currentPageNumber}&status=completed`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    )
      .then((responce) => responce.json())
      .then((result) => {
        console.log("completed result--", result);
        completed_tournament_list(result.tournaments);
      });
  }

  function completed_turnament_getPageButtons(pageCount) {
    $(".completed-page-buttons").empty();

    /* Declaring next and previous page buttons */
    let previous_page_button = `
            <button class='completed-previous-page-btn btn btn-sm page_btn mx-1' disabled>  
              <<
            </button>`;
    $(".completed-page-buttons").append(previous_page_button);

    let next_page_button = `
            <button class='completed-next-page-btn btn btn-sm page_btn mx-1'>  
              >>
            </button>`;

    /* rendering buttons according to page count */
    for (let index = 1; index <= pageCount; index++) {
      let pageNumberButtons = ` 
            <button class="btn btn-sm page_btn mx-1 completed-page-button-number">
              ${index}
            </button>`;
      /* Appending buttons to table */
      $(".completed-page-buttons").append(pageNumberButtons);
    }
    /* appending next page butoon at the last
     */
    $(".completed-page-buttons").append(next_page_button);

    /* Enabling and disabling previous and next page buttons */
    if (reqData.completed_currentPageNumber > 1) {
      $(".completed-previous-page-btn").attr("disabled", false);
    }
    if (reqData.completed_currentPageNumber === 1) {
      $(".completed-next-page-btn").attr("disabled", false);
    }
    if (reqData.completed_currentPageNumber == pageCount) {
      $(".completed-next-page-btn").attr("disabled", true);
    }

    $(".completed-page-button-number").on("click", (e) => {
      $(this).addClass("active");

      let clickedpageButton = e.target.innerText;

      reqData.completed_currentPageNumber = parseInt(clickedpageButton);
      completed_turnament_page_list(reqData);
      $(`[value = ${reqData.completed_currentPageNumber}]`).addClass("active");
    });

    $(".completed-next-page-btn").on("click", () => {
      if (reqData.completed_currentPageNumber == pageCount - 1) {
        $(".completed-next-page-btn").attr("disabled", true);
      }
      reqData.completed_currentPageNumber++;
      completed_turnament_page_list(reqData);
    });

    $(".completed-previous-page-btn").on("click", () => {
      if (reqData.completed_currentPageNumber == 1) {
        $(".completed-previous-page-btn").attr("disabled", true);
      }
      reqData.completed_currentPageNumber++;
      completed_turnament_page_list(reqData);
    });
  }

  function upcoming_tournaments() {
    fetch(`${base_url}/tournament/list?status=upcoming`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((responce) => responce.json())
      .then((result) => {
        console.log("upcoming result--", result);
        upcoming_tournament_list(result.tournaments);
      });
  }

  function upcoming_tournament_list(tournaments) {
    const { docs, totalPages } = tournaments;
    if (docs.length == 0) {
      var html = `<h1 class="text-center mb-4 mt-5 bahnschrift">Upcoming Tournaments</h1>
      <div class="w-100 black_bg bordered mb-5">
      <h1 class="text-center mb-4 mt-5 bahnschrift">No Upcoming Tournaments</h1>
      </div>`;
      document.getElementById("upcoming_tournaments").innerHTML = html;
    } else {
      var html = "";
      html += `<h1 class="text-center mb-4 mt-5 bahnschrift">Upcoming Tournaments</h1>`;
      docs.forEach((element, count) => {
        html += `<div class="w-100 black_bg bordered mb-5">
        <div class="row mx-0 py-4">
        <div class="col-12 col-lg-3 mb-2 mb-lg-0 text-center text-lg-left">
            <h5 class="mb-0 font-weight-bold tournament_name">${
              element.title
            }</h5>
          </div>
          <div class="col-12 col-lg-3 mb-2 mb-lg-0 text-center text-lg-left">
            <h5 class="mb-0"><span class="ml-2">${
              element.tournamentType
            }</span></h5>
          </div>
          <div class="col-12 col-lg-3 mb-2 mb-lg-0">
            <h5 class="text-center mb-0">Prize <span>${
              element.prize
            }</span> Coins</h5>
          </div>
          <div class="col-12 col-lg-3 text-center">
            <button class="btn secondary_btn btn-sm" onclick="upcoming(${count})">View Details</button>
          </div>
          <div class="col-12 col-lg-3 collapse upcoming_${count}">
            <p class="mb-1">Room ID : ${element.roomId}</p>
            <p class="mb-0">Room Password : ${element.roomPassword}</p>
          </div>
          <div class="col-12 col-lg-3 collapse upcoming_${count}">
            <p class="mb-1"><i class="fa fa-calendar text_red mx-1"></i>${element.date.slice(
              0,
              10
            )}</p>
            <p class="mb-0"><i class="fa fa-clock-o text_red mx-1"></i> ${element.date.slice(
              11,
              16
            )}</p>
          </div>
          <div class="col-12 col-lg-3  collapse upcoming_${count} mt-2 text-center">
            <button class="btn btn-sm mt-2 secondary_btn" data-toggle="modal" data-target="#registeredUsersModal" onclick="registeredUsers('${
              element._id
            }')">View Registered Players</button>
          </div>
          <div class="col-12 col-lg-3  text-center collapse upcoming_${count} mt-2">
            <button class="btn btn-sm mt-2 primary_btn" data-toggle="modal" data-target="#editTournamentModal" onclick="append_tournamentId('${
              element._id
            }')">Edit Details</button>
          </div>
      </div></div>`;
      });
      document.getElementById("upcoming_tournaments").innerHTML = html;
      upcoming_turnament_getPageButtons(totalPages);
    }
  }

  function upcoming_turnament_page_list() {
    fetch(
      `${base_url}/tournament/list?page=${reqData.upcoming_currentPageNumber}&status=upcoming`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    )
      .then((responce) => responce.json())
      .then((result) => {
        console.log("completed result--", result);
        upcoming_tournament_list(result.tournaments);
      });
  }

  function upcoming_turnament_getPageButtons(pageCount) {
    $(".upcoming-page-buttons").empty();

    /* Declaring next and previous page buttons */
    let previous_page_button = `
            <button class='upcoming-previous-page-btn btn btn-sm page_btn mx-1' disabled>  
              <<
            </button>`;
    $(".upcoming-page-buttons").append(previous_page_button);

    let next_page_button = `
            <button class='upcoming-next-page-btn btn btn-sm page_btn mx-1'>  
              >>
            </button>`;

    /* rendering buttons according to page count */
    for (let index = 1; index <= pageCount; index++) {
      let pageNumberButtons = ` 
            <button class="btn btn-sm page_btn mx-1 page-button-number">
              ${index}
            </button>`;
      /* Appending buttons to table */
      $(".upcoming-page-buttons").append(pageNumberButtons);
    }
    /* appending next page butoon at the last
     */
    $(".upcoming-page-buttons").append(next_page_button);

    /* Enabling and disabling previous and next page buttons */
    if (reqData.upcoming_currentPageNumber > 1) {
      $(".upcoming-previous-page-btn").attr("disabled", false);
    }
    if (reqData.upcoming_currentPageNumber === 1) {
      $(".upcoming-next-page-btn").attr("disabled", false);
    }
    if (reqData.upcoming_currentPageNumber == pageCount) {
      $(".upcoming-next-page-btn").attr("disabled", true);
    }

    $(".page-button-number").on("click", (e) => {
      $(this).addClass("active");

      let clickedpageButton = e.target.innerText;

      reqData.upcoming_currentPageNumber = parseInt(clickedpageButton);
      upcoming_turnament_page_list(reqData);
      $(`[value = ${reqData.upcoming_currentPageNumber}]`).addClass("active");
    });

    $(".upcoming-next-page-btn").on("click", () => {
      if (reqData.upcoming_currentPageNumber == pageCount - 1) {
        $(".upcoming-next-page-btn").attr("disabled", true);
      }
      reqData.upcoming_currentPageNumber++;
      upcoming_turnament_page_list(reqData);
    });

    $(".upcoming-previous-page-btn").on("click", () => {
      if (reqData.upcoming_currentPageNumber == 1) {
        $(".upcoming-previous-page-btn").attr("disabled", true);
      }
      reqData.upcoming_currentPageNumber++;
      upcoming_turnament_page_list(reqData);
    });
  }
  upcoming_tournaments();
  completed_tournaments();

  function registeredUsers(tournament_id) {
    var html = "";
    fetch(`${base_url}/tournament/${tournament_id}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("result--", result);
        if (result.users.length != 0) {
          result.users.forEach((element) => {
            html += `
                  <div class="row mx-0 my-2 px-lg-3 align-items-center" id="tournament_users">
                    <div class="col-3 col-lg-3 text-center">
                      <h5 class="mb-0 d-inline">${element.player.name}</h5>
                    </div>
                    <div class="col-3 col-lg-3 text-center px-0">
                      <p class="mb-0">${element.player.email}</p>
                    </div>
                    <div class="col-3 col-xl-3 text-center">
                      <p class="mb-0">${element.player.mobile}</p>
                    </div>
                    <div class="col-3 col-xl-3 text-right">
                      <p class="mb-0">${element.player.referralId}</p>
                    </div>
                  </div>      
            `;
          });
          document.getElementById("append_tournament_users").innerHTML = html;
        } else {
          html += `<h3 class="my-5 text-center">Users Not Registered</h3>`;
          document.getElementById("append_tournament_users").innerHTML = html;
        }
      })
      .catch((error) => {
        console.log("error", error);
        swal({
          text: `${error}`,
          type: "error",
          icon: "error",
        });
      });
  }

  function append_tournamentId(tournament_id) {
    fetch(`${base_url}/tournament/${tournament_id}/edit`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("edit tournament result--", result);
        document.getElementById("edit_tournament_id").value = tournament_id;
        document.getElementById("edit_room_id").value =
          result.tournament.credentials.roomId;
        document.getElementById("edit_room_pass").value =
          result.tournament.credentials.roomPassword;
        document.getElementById("edit_stream").value = result.tournament.stream;
      });
  }

  function edit_tournament() {
    showLoader();
    var tournament_id = document.getElementById("edit_tournament_id").value;
    var room_id = document.getElementById("edit_room_id").value;
    var room_pass = document.getElementById("edit_room_pass").value;
    var stream = document.getElementById("edit_stream").value;
    var data = JSON.stringify({
      roomId: room_id,
      roomPassword: room_pass,
      stream: stream,
    });
    fetch(`${base_url}/tournament/${tournament_id}/edit`, {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("result--", result);
        if (result.status != undefined) {
          swal({
            text: `${result.message}`,
            type: "error",
            icon: "error",
          }).then(function () {
            hideLoader();
          });
        } else {
          swal({
            text: `Tournament Edited Successfully`,
            type: "success",
            icon: "success",
          }).then(function () {
            window.location.href = "./admin_dashboard.html";
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
        swal({
          text: `${error}`,
          type: "error",
          icon: "error",
        }).then(function () {
          hideLoader();
        });
      });
  }

  function send_notification() {
    showLoader();
    var notif_title = document.getElementById("notif_title").value;
    var notif_body = document.getElementById("notif_body").value;

    var data = JSON.stringify({
      title: notif_title,
      body: notif_body,
    });
    fetch(`${base_url}/send-push-notification`, {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("result--", result);
        if (result.status != undefined) {
          swal({
            text: `${result.message}`,
            type: "error",
            icon: "error",
          }).then(function () {
            hideLoader();
          });
        } else {
          swal({
            text: `Notification Sended Successfully`,
            type: "success",
            icon: "success",
          }).then(function () {
            hideLoader();
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
        swal({
          text: `${error}`,
          type: "error",
          icon: "error",
        }).then(function () {
          hideLoader();
        });
      });
  }
  hideLoader();
} else {
  window.location.href = "./admin_login.html";
}
