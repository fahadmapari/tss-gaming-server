if (localStorage.getItem("logged_in") == "true" && (localStorage.getItem("user_role") == "admin" || localStorage.getItem("user_role") == "sub-admin")) {

  let reqData = {
    ongoing_currentPageNumber: 1
  };

  function ongoing_tournaments() {
    fetch(`${base_url}/tournament/list?status=ongoing`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          credentials: 'include'
        }
      }).then((responce) => responce.json())
      .then((result) => {
        // console.log("ongoing result--", result)
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
        <div class="row mx-0 py-4">
          <div class="col-12 col-lg-3 mb-2 mb-lg-0 text-center">
            <h5 class="mb-0 font-weight-bold black_input tournament_name">${element.title.slice(0,20)}..</h5>
          </div>
          <div class="col-12 col-lg-3 mb-2 mb-lg-0 text-center">
            <h5 class="mb-0 black_input"><span class="ml-2">${element.tournamentType}</span></h5>
          </div>
          <div class="col-12 col-lg-3 mb-2 mb-lg-0">
            <h5 class="text-center mb-0 black_input">Prize <span>${element.prize}</span> Coins</h5>
          </div>
          <div class="col-12 col-lg-3 text-center ">
            <button class="btn secondary_btn btn-md " onclick="onGoing(${count})">View Details </button>
          </div>
          <div class="col-12 col-lg-3 collapse ongoing_${count} mt-2 text-center">
          <h5 class="text-center mb-0 black_input">Teams <span>${element.slots-element.slotsAvailable}</span></h5>
          </div>
          <div class="col-12 col-lg-3 collapse ongoing_${count} mt-2 text-center">
            
            <button class="btn btn-md  secondary_btn " data-toggle="modal" data-target="#registeredUsersModal" onclick="registeredUsers('${element._id}')">View Registered Players</button>
          </div>
          <div class="col-12 col-lg-3 collapse ongoing_${count} mt-2 text-center">
          <a href="${element.stream}" class="btn btn-md secondary_btn "><i class="fa fa-youtube-play mr-1 text_red"></i>Watch Stream Here</a>
          </div>
          <div class="col-12 col-lg-3 text-center  collapse ongoing_${count} mt-2">
            <button class="btn btn-md  secondary_btn" data-toggle="modal" data-target="#winnerModal" onclick="get_tournament_winners('${element._id}','${element.prize}')">Enter Winners</button>
          </div>
        </div>
      </div>`
      });
      document.getElementById("user_ongoing_tournament").innerHTML = html
      ongoing_turnament_getPageButtons(totalPages)
    }
  }

  function ongoing_turnament_page_list() {
    showLoader()
    fetch(`${base_url}/tournament/list?page=${reqData.ongoing_currentPageNumber}&status=ongoing`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          credentials: 'include'
        }
      }).then((responce) => responce.json())
      .then((result) => {
        // console.log("completed result--", result)
        ongoing_tournament_list(result.tournaments)
        hideLoader()
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
      reqData.ongoing_currentPageNumber--;
      ongoing_turnament_page_list(reqData);;
    });
  }

  ongoing_tournaments()


  function get_tournament_winners(tournament_id, prize) {
    fetch(`${base_url}/tournament/leaderboard/${tournament_id}/edit`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          credentials: 'include'
        }
      })
      .then(response => response.json())
      .then(result => {
        // console.log('tournament winner  result--', result)
        if (result.data.length != 0) {
          var html = `<option value="" selected disabled>Select Player</option>`
          result.data.forEach(element => {
            html += `<option value=${JSON.stringify(element)}>${element.player.name}</option>`
          });
          document.getElementsByClassName("winner_player")[0].innerHTML = html
          document.getElementsByClassName("winner_player")[1].innerHTML = html
          document.getElementsByClassName("winner_player")[2].innerHTML = html

          var match_obj = document.getElementById("declare_winner_btn")
        } else {
          document.getElementById("winnerModal").innerHTML = "Players Not Registered"
        }

      })
  }

  function declare_winners() {
    showLoader()
    var match1 = document.getElementsByClassName("winner_player")[0].value
    var match2 = document.getElementsByClassName("winner_player")[1].value
    var match3 = document.getElementsByClassName("winner_player")[2].value

    var winner1_kills = document.getElementsByClassName("winner_kills")[0].value
    var winner1_streak = document.getElementsByClassName("winner_streak")[0].value
    var winner1_damage = document.getElementsByClassName("winner_damage")[0].value
    var winner1_prize = document.getElementsByClassName("winner_prize")[0].value
    var winner2_kills = document.getElementsByClassName("winner_kills")[1].value
    var winner2_streak = document.getElementsByClassName("winner_streak")[1].value
    var winner2_damage = document.getElementsByClassName("winner_damage")[1].value
    var winner2_prize = document.getElementsByClassName("winner_prize")[1].value
    var winner3_kills = document.getElementsByClassName("winner_kills")[2].value
    var winner3_streak = document.getElementsByClassName("winner_streak")[2].value
    var winner3_damage = document.getElementsByClassName("winner_damage")[2].value
    var winner3_prize = document.getElementsByClassName("winner_prize")[2].value
    
    // console.log("match--", match1)

    var data = {
      userStats: []
    }

    if (match1 != "") {
      data.userStats[0] = {
        "prizeWon": winner1_prize,
        "kills": winner1_kills,
        "streak": winner1_streak,
        "damage": winner1_damage,
        "match": JSON.parse(match1)
      }

    }
  
  if (match2 != "") {
    data.userStats[1] = {
      "prizeWon": winner2_prize,
      "kills": winner2_kills,
      "streak": winner2_streak,
      "damage": winner2_damage,
      "match": JSON.parse(match2)
    }
  }
  if (match3 != "") {
    data.userStats[1] = {
      "prizeWon": winner3_prize,
      "kills": winner3_kills,
      "streak": winner3_streak,
      "damage": winner3_damage,
      "match": JSON.parse(match3)
    }
  }

  // console.log("winner data--", data)
  fetch(`${base_url}/tournament/leaderboard/declare`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        credentials: 'include'
      }
    })
    .then(response => response.json())
    .then(result => {
      // console.log('tournament winner  result--', result)
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
          text: `Winners Declared  Successfully`,
          type: "success",
          icon: "success"
        }).then(function () {
          window.location.href = "/admin/admin_dashboard.html"
        })
      }
    })
    .catch(error => {
      // console.log('error', error)
      swal({
        text: `${error}`,
        type: "error",
        icon: "error"
      }).then(function () {
        hideLoader()
      })
    });
}
}
 else {
  window.location.href = "/admin/admin_login.html"
}