if (localStorage.getItem("logged_in") == "true") {
  let reqData = {
    completed_currentPageNumber: 1,
    upcoming_currentPageNumber: 1
  };

  function profile() {
    showLoader()
    var user_name = document.getElementById("user_name")
    var user_email = document.getElementById("user_email")
    var user_wallet_coin = document.getElementById("user_wallet_coin")
    fetch(`${base_url}/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          credentials: 'include'
        }
      }).then((responce) => responce.json())
      .then((result) => {
        // console.log("Profile result--", result)
        user_name.innerText = result.profile.name
        user_email.innerText = result.profile.email
        user_wallet_coin.innerText = result.profile.coins
      })

  }

  profile()

  function upcoming_match() {

    fetch(`${base_url}/profile/tournaments?status=upcoming`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          credentials: 'include'
        }
      }).then((responce) => responce.json())
      .then((result) => {
        // console.log("upcoming--",result)
        if (result.tournaments.docs.length != 0) {
          var html = `<div class="col-12">
            <h4 class="mb-4 bahnschrift black_input">Your Upcoming Match</h4>
          </div>
          <div class="col-5">
            <p class="mb-1 product_20 black_input"><strong>${result.tournaments.docs[0].tournament.title}</strong></p>
            <p class="mb-1 black_input"><i class="fa fa-calendar text_red"></i> ${result.tournaments.docs[0].tournament.date.slice(0,10)} <i class="fa fa-clock-o text_red"></i> ${result.tournaments.docs[0].tournament.date.slice(11,16)}</p>
            <p class="mb-1 black_input">Room ID : <strong>${result.tournaments.docs[0].tournament.roomId}</strong></p>
          </div>
          <div class="col-7">
            <p class="mb-2 black_input"><strong>Tournament Mode : ${result.tournaments.docs[0].tournament.tournamentType}</strong></p>
            <p class="mb-2 black_input"><strong>Tournament Prize : ${result.tournaments.docs[0].tournament.prize}</strong></p>
            <p class="mb-2 black_input">Room Password : <strong>${result.tournaments.docs[0].tournament.roomPassword}</strong></p>
          </div>`
        } else {
          var html = `<div class="col-12">
            <h4 class="mb-4 bahnschrift">No Upcoming Match</h4>
          </div>`
        }
        document.getElementById("user_upcoming_match").innerHTML = html
        // console.log("upcoming result--", result)
      })
  }
  function previous_match() {

    fetch(`${base_url}/profile/tournaments?status=completed`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          credentials: 'include'
        }
      }).then((responce) => responce.json())
      .then((result) => {
        // console.log("upcoming--",result)
        if (result.tournaments.docs.length != 0) {
          var html = `<div class="col-12">
            <h4 class="mb-4 bahnschrift black_input">Your Previous Match</h4>
          </div>
          <div class="col-5">
            <p class="mb-1 product_20 black_input"><strong>${result.tournaments.docs[0].tournament.title}</strong></p>
            <p class="mb-1 black_input"><i class="fa fa-calendar text_red"></i> ${result.tournaments.docs[0].tournament.date.slice(0,10)}</p>
            <p class="mb-1 black_input"><i class="fa fa-clock-o text_red"></i> ${result.tournaments.docs[0].tournament.date.slice(11,16)}</p>
          </div>
          <div class="col-7">
            <p class="mb-2 black_input"><strong>Tournament Mode : ${result.tournaments.docs[0].tournament.tournamentType}</strong></p>
            <p class="mb-2 black_input">Rank : <strong>${result.tournaments.docs[0].position}</strong></p>
            <p class="mb-1 black_input">Prize : <strong>${result.tournaments.docs[0].prize}</strong></p>
          </div>`
        } else {
          var html = `<div class="col-12">
            <h4 class="mb-4 bahnschrift">No Previous Match</h4>
          </div>`
        }
        document.getElementById("user_previous_match").innerHTML = html
        // console.log("upcoming result--", result)
      })
  }

  previous_match()

  function completed_tournaments() {
    fetch(`${base_url}/profile/tournaments?status=completed`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          credentials: 'include'
        }
      }).then((responce) => responce.json())
      .then((result) => {
        // console.log("completed result--", result)
        completed_tournament_list(result.tournaments)
      })
  }

  function completed_tournament_list(tournaments) {
    const {
      docs,
      totalPages
    } = tournaments;
    if (docs.length == 0) {
      var html = `<h1 class="text-center mb-4 mt-5 bahnschrift">My Previous Tournaments</h1>
      <div class="w-100 black_bg bordered mb-5">
      <h1 class="text-center mb-4 mt-5 bahnschrift">No Tournaments Played Before</h1>
      </div>`
      document.getElementById("user_played_tournament").innerHTML = html

    } else {
      var html = ""
      html += `<h1 class="text-center mb-4 mt-5 bahnschrift">My Previous Tournaments</h1>`
      docs.forEach((element, count) => {
        html += `
        <div class="w-100 black_bg bordered mb-5">
        <div class="row mx-0 py-4">
          <div class="col-12 col-lg-3 mb-2 mb-lg-0 text-center">
            <p class="mb-0 font-weight-bold black_input">${element.tournament.title.slice(0,25)}</p>
          </div>
          <div class="col-12 col-lg-3 mb-2 mb-lg-0 text-center">
            <p class="mb-0 black_input"><span class="ml-2">${element.tournament.tournamentType}</span></p>
          </div>
          <div class="col-12 col-lg-3 mb-2 mb-lg-0 text-center">
            <p class="mb-0 black_input">Prize <span>${element.tournament.prize}</span> Coins</p>
          </div>
          <div class="col-12 col-lg-3 text-center">
            <button class="btn secondary_btn btn-md" onclick="played(${count})">View Details</button>
          </div>
          <div class="col-12 col-lg-3 mt-2 collapse played_${count}">
            <p class="mb-1 black_input"><i class="fa fa-calendar text_red mx-1"></i>${element.tournament.date.slice(0,10)}</p>
          </div>
          <div class="col-12 col-lg-3 mt-2 collapse played_${count}">
            <p class="mb-0 black_input"><i class="fa fa-clock-o text_red mx-1"></i> ${element.tournament.date.slice(11,16)}</p>
          </div>
          <div class="col-12 col-lg-3 mt-2 collapse played_${count}">
            <button class="btn btn-md secondary_btn" data-toggle="modal" data-target="#registeredUsersModal" onclick="registeredUsers('${element._id}')">View Registered Players</button>
          </div>
          <div class="col-12 col-lg-3 mt-2 collapse played_${count} text-center">
            <button class="btn btn-md secondary_btn" data-toggle="modal" data-target="#winnersTournamentModal" onclick="View_winners('${element.tournament._id}')">View Winners</button>
          </div>
      </div></div>`
      });
      document.getElementById("user_played_tournament").innerHTML = html
      completed_turnament_getPageButtons(totalPages)
    }
  }

  function completed_turnament_page_list() {
    showLoader()
    fetch(`${base_url}/profile/tournaments?page=${reqData.completed_currentPageNumber}&status=completed`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          credentials: 'include'
        }
      }).then((responce) => responce.json())
      .then((result) => {
        // console.log("completed result--", result)
        completed_tournament_list(result.tournaments)
        hideLoader()
      })

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
      let clickedpageButton = e.target.innerText;
      reqData.completed_currentPageNumber = parseInt(clickedpageButton);
      completed_turnament_page_list(reqData);
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
      reqData.completed_currentPageNumber--;
      completed_turnament_page_list(reqData);;
    });
  }

  function upcoming_tournaments() {
    fetch(`${base_url}/profile/tournaments?status=upcoming`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          credentials: 'include'
        }
      }).then((responce) => responce.json())
      .then((result) => {
        // console.log("upcoming result--", result)
        upcoming_tournament_list(result.tournaments)
      }).then(()=>hideLoader())
      
  }

  function upcoming_tournament_list(tournaments) {
    const {
      docs,
      totalPages
    } = tournaments;
    if (docs.length == 0) {
      var html = `<h1 class="text-center mb-4 mt-5 bahnschrift">Upcoming Tournaments</h1>
      <div class="w-100 black_bg bordered mb-5">
      <h1 class="text-center mb-4 mt-5 bahnschrift">No Upcoming Tournaments</h1>
      </div>`
      document.getElementById("upcoming_tournaments").innerHTML = html
    } else {
      var html = ""
      html += `<h1 class="text-center mb-4 mt-5 bahnschrift">Upcoming Tournaments</h1>`
      docs.forEach((element, count) => {
        html += `<div class="w-100 black_bg bordered mb-5">
                  <div class="row mx-0 py-4">
                  <div class="col-12 col-lg-3 mb-2 mb-lg-0 text-center">
                    <p class="mb-0 font-weight-bold black_input">${element.tournament.title.slice(0,25)}</p>
                  </div>
                  <div class="col-12 col-lg-3 mb-2 mb-lg-0 text-center">
                    <p class="mb-0 black_input"><span class="ml-2">${element.tournament.tournamentType}</span></p>
                  </div>
                  <div class="col-12 col-lg-3 mb-2 mb-lg-0 text-center">
                    <p class="mb-0 black_input">Prize <span>${element.tournament.prize}</span> Coins</p>
                  </div>
                  <div class="col-12 col-lg-3 text-center">
                    <button class="btn secondary_btn btn-md" onclick="upcoming(${count})">View Details</button>
                  </div>
                  <div class="col-12 col-lg-3 text-center mt-2 collapse upcoming_${count}">
                    <p class="mb-2 black_input">Slots Available: ${element.tournament.slotsAvailable} </p>
                  </div>
                  <div class="col-12 col-lg-3 text-center mt-2 collapse upcoming_${count}">
                    <p class="mb-1 black_input"><i class="fa fa-calendar text_red mx-1"></i>${element.tournament.date.slice(0,10)}</p>
                  </div><div class="col-12 col-lg-3 text-center mt-2 collapse upcoming_${count}">
                    <p class="mb-0 black_input"><i class="fa fa-clock-o text_red mx-1"></i> ${element.tournament.date.slice(11,16)}</p>
                  </div>
                  <div class="col-12 col-lg-3 mt-2 collapse upcoming_${count} text-center">
                    <button class="btn btn-md secondary_btn" data-toggle="modal" data-target="#registeredUsersModal" onclick="registeredUsers('${element.tournament._id}')">View Registered Players</button>
                  </div>
                  <div class="col-12 col-lg-6 text-center collapse upcoming_${count}">
                    <p class="mb-2 black_input">Team Name : ${element.teamName} </p>
                  </div>
                  <div class="col-12 col-lg-6 text-center collapse upcoming_${count}">
                    <p class="mb-2 black_input">Team Players : `
                  element.team.forEach(element => {
                    html+= `${element}, `
                  });
                  html+= `</p></div>
                  </div></div>`
       
       
      });
      document.getElementById("upcoming_tournaments").innerHTML = html
      upcoming_turnament_getPageButtons(totalPages)
    }
  }

  function upcoming_turnament_page_list() {
    showLoader()
    fetch(`${base_url}/profile/tournaments?page=${reqData.upcoming_currentPageNumber}&status=upcoming`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          credentials: 'include'
        }
      }).then((responce) => responce.json())
      .then((result) => {
        // console.log("completed result--", result)
        upcoming_tournament_list(result.tournaments)
        hideLoader()
      })

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

      let clickedpageButton = e.target.innerText;

      reqData.upcoming_currentPageNumber = parseInt(clickedpageButton);
      upcoming_turnament_page_list(reqData);
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
      reqData.upcoming_currentPageNumber--;
      upcoming_turnament_page_list(reqData);;
    });
  }
 
  function View_winners(tournamentId){
    fetch(`${base_url}/tournament/leaderboard/${tournamentId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        credentials: 'include'
      }
    })
    .then(response => response.json())
    .then(result => {
      // console.log('winners Result--', result)
      var rank = ""
      var team = ""
      var prize = ""
      var kill = ""
      var streak = ""
      var damage = ""

      if(result.leaderboard.list.length!=0){
        result.leaderboard.list.forEach(element => {
          // console.log('element--',element)
          rank+=`<li>${element.position}</li>`
          team+=`<li>${element.teamName}</li>`
          prize+=`<li>${element.prize}</li>`
          kill+=`<li>${element.kills}</li>`
          streak+=`<li>${element.streak}</li>`
          damage+=`<li>${element.damage}</li>`

        });
        document.getElementById("players_rank").innerHTML = rank
        document.getElementById("winner_team").innerHTML = team
        document.getElementById("winner_team_prize").innerHTML = prize
        document.getElementById("winner_team_kill").innerHTML = kill
        document.getElementById("winner_team_streak").innerHTML = streak
        document.getElementById("winner_team_damage").innerHTML = damage
      }
      else{
        document.getElementById("winner_players").innerHTML = `<div class="col-12">
                                                                  <p class="text-center mb-2 bahnschrift">LeaderBoard Not Available</p>
                                                                </div>`
      }
      document.getElementById("winner_tournament_title").innerText = `${result.leaderboard.tournament.title.slice(0,20)}`
      document.getElementById("winner_tournament_type").innerText = `${result.leaderboard.tournament.tournamentType}`
      document.getElementById("winner_tournament_date").innerHTML = `<i class="fa fa-calendar text_red mx-1"></i>${result.leaderboard.tournament.date.slice(0,10)}`
      document.getElementById("winner_tournament_time").innerHTML = `<i class="fa fa-clock-o text_red mx-1"></i> ${result.leaderboard.tournament.date.slice(11,16)}`

      document.getElementById("winner_img").setAttribute("src",`${result.leaderboard.tournament.thumbnails[0]}`)
      document.getElementById("video_play").setAttribute("onclick",`showVideo('https://www.youtube.com/embed/SuWTfCcCBl0')`)
      hideLoader()

    })
  }

  function registeredUsers(tournament_id) {
    var html = ""
    fetch(`${base_url}/tournament/${tournament_id}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          credentials: 'include'
        }
      })
      .then(response => response.json())
      .then(result => {
        // console.log('result--', result)
        if (result.users.length != 0) {
          result.users.forEach(element => {
            html += `
                  <div class="row mx-0 my-2 px-lg-3 align-items-center" id="tournament_users">
                    <div class="col-4 col-lg-4 px-0">
                      <p class="mb-0 d-inline">${element.player.name}</p>
                    </div>
                    <div class="col-4 col-lg-4 text-right text-lg-center px-0">
                      <p class="mb-0">${element.player.email}</p>
                    </div>
                    <div class="col-4 col-lg-4 text-right">
                      <p class="mb-0">${element.player.referralId}</p>
                    </div>
                  </div>      
            `
          });
          document.getElementById("append_tournament_users").innerHTML = html
        } else {
          html += `<h3 class="my-5 text-center">Users Not Registered</h3>`
          document.getElementById("append_tournament_users").innerHTML = html

        }
      }).
    catch((error) => {
      // console.log('error', error)
      swal({
        text: `${error}`,
        type: "error",
        icon: "error"
      })
    })
  }
  upcoming_match()
  upcoming_tournaments()
  completed_tournaments()
} else {
  window.location.href = "/user/login.html"
}