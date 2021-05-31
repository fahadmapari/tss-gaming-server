if (localStorage.getItem("logged_in") == "true" && (localStorage.getItem("user_role") == "admin" || localStorage.getItem("user_role") == "sub-admin")) {

  let reqData = {
    ongoing_currentPageNumber: 1
  };

  function ongoing_tournaments() {
    fetch(`${base_url}/tournament/list?status=ongoing`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      }).then((responce) => responce.json())
      .then((result) => {
        console.log("ongoing result--", result)
        ongoing_tournament_list(result.tournaments)
      })
  }

  function ongoing_tournament_list(tournaments) {
    const {
      docs,
      totalPages
    } = tournaments;
    if (docs.length == 0) {
      var html = `<h1 class="text-center mb-4 mt-5 bahnschrift">Ongoing Tournaments</h1>
      <div class="w-100 black_bg bordered mb-5">
      <h1 class="text-center mb-4 mt-5 bahnschrift">No Ongoing Tournaments</h1>
      </div>`
      document.getElementById("user_ongoing_tournament").innerHTML = html
    } else {
      var html = ""
      var html2 = ""
      html += `<h1 class="text-center mb-4 mt-5 bahnschrift">Ongoing Tournaments</h1>`
      docs.forEach((element, count) => {
        html += `<div class="w-100 black_bg bordered mb-5">
        <div class="row mx-0 py-2 py-lg-4 px-lg-4 align-items-center">
          <div class="col-12 col-lg-3 mb-2 mb-lg-0 text-center text-lg-left">
            <h5 class="mb-0 font-weight-bold tournament_name">${element.title}</h5>
          </div>
          <div class="col-12 col-lg-3 mb-2 mb-lg-0 text-center text-lg-left">
            <h5 class="mb-0"><span class="ml-2">${element.tournamentType}</span></h5>
          </div>
          <div class="col-12 col-lg-3 mb-2 mb-lg-0">
            <h5 class="text-center mb-0">Prize <span>${element.prize}</span> Coins</h5>
          </div>
          <div class="col-12 col-lg-3 text-center text-lg-right">
            <button class="btn secondary_btn btn-sm" onclick="onGoing(${count})">View Details </button>
          </div>
          <div class="col-12 col-lg-3 collapse ongoing_${count} mt-2 text-center text-lg-left">
            <p class="mb-0">Room ID : ${element.roomId}</p>
            <p class="mb-0">Room Password : ${element.roomPassword}</p>
          </div>
          <div class="col-12 col-lg-3 collapse ongoing_${count} mt-2 text-center text-lg-left">
            <a href="${element.stream}" class="text-white"><i class="fa fa-youtube-play mr-1 text_red"></i>Streaming Here</a>
          </div>
          <div class="col-12 col-lg-3 collapse ongoing_${count} mt-2 text-center">
          <button class="btn btn-sm mt-2 secondary_btn" data-toggle="modal" data-target="#registeredUsersModal"        onclick="registeredUsers('${element._id}')">View Registered Players</button>
          </div>
          <div class="col-12 col-lg-3 text-center text-lg-right collapse ongoing_${count} mt-2">
            <button class="btn btn-sm primary_btn" data-toggle="modal" data-target="#winnerModal" onclick="get_tournament_winners('${element._id}')">Enter Winners</button>
          </div>
        </div>
      </div>`
      });
      document.getElementById("user_ongoing_tournament").innerHTML = html
      ongoing_turnament_getPageButtons(totalPages)
    }
  }

  function ongoing_turnament_page_list() {
    fetch(`${base_url}/tournament/list?page=${reqData.ongoing_currentPageNumber}&status=ongoing`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      }).then((responce) => responce.json())
      .then((result) => {
        console.log("completed result--", result)
        ongoing_tournament_list(result.tournaments)
      })

  }

  function ongoing_turnament_getPageButtons(pageCount) {
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
      ongoing_turnament_page_list(reqData);
      $(`[value = ${reqData.ongoing_currentPageNumber}]`).addClass("active");
    });

    $(".ongoing-next-page-btn").on("click", () => {
      if (reqData.ongoing_currentPageNumber == pageCount - 1) {
        $(".ongoing-next-page-btn").attr("disabled", true);
      }
      reqData.ongoing_currentPageNumber++;
      ongoing_turnament_page_list(reqData);
    });


    $(".ongoing-previous-page-btn").on("click", () => {
      if (reqData.ongoing_currentPageNumber == 1) {
        $(".ongoing-previous-page-btn").attr("disabled", true);
      }
      reqData.ongoing_currentPageNumber++;
      ongoing_turnament_page_list(reqData);;
    });
  }

  ongoing_tournaments()


  function get_tournament_winners(tournament_id) {
    fetch(`${base_url}/tournament/leaderboard/${tournament_id}/edit`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      })
      .then(response => response.json())
      .then(result => {
        console.log('tournament winner  result--', result)
        // document.getElementById("edit_tournament_id").value = tournament_id
        // document.getElementById("edit_room_id").value = result.tournament.credentials.roomId
        // document.getElementById("edit_room_pass").value = result.tournament.credentials.roomPassword
        // document.getElementById("edit_stream").value = result.tournament.stream
      })
  }
} else {
  window.location.href = "./admin_login.html"
}