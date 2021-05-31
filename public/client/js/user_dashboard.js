if (localStorage.getItem("logged_in") == "true") {
  let reqData = {
    completed_currentPageNumber: 1,
    ongoing_currentPageNumber: 1,
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
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      }).then((responce) => responce.json())
      .then((result) => {
        console.log("Profile result--", result)
        user_name.innerText = result.profile.name
        user_email.innerText = result.profile.email
        user_wallet_coin.innerText = result.profile.coins
      })
    hideLoader()

  }

  profile()

  function upcoming_match() {

    fetch(`${base_url}/profile/tournaments?status=upcoming`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      }).then((responce) => responce.json())
      .then((result) => {
        console.log("upcoming--",result)
        if (result.tournaments.docs.length != 0) {
          var html = `<div class="col-12">
            <h4 class="mb-4 bahnschrift">Your Upcoming Match</h4>
          </div>
          <div class="col-5">
            <p class="mb-1 product_20"><strong>${result.tournaments.docs[0].tournament.title}</strong></p>
            <p class="mb-3"><i class="fa fa-calendar text_red"></i> ${result.tournaments.docs[0].tournament.date.slice(0,10)} <i class="fa fa-clock-o text_red"></i> ${result.tournaments.docs[0].tournament.date.slice(11,16)}</p>

          </div>
          <div class="col-7">
            <p class="mb-2"><strong>Tournament Mode->${result.tournaments.docs[0].tournament.tournamentType}</strong></p>
            <p class="mb-2"><strong>Tournament Prize->${result.tournaments.docs[0].tournament.prize}</strong></p>
            <p class="mb-1">Room ID-><strong>${result.tournaments.docs[0].tournament.roomId}</strong></p>
            <p class="mb-3">Room Password-><strong>${result.tournaments.docs[0].tournament.roomPassword}</strong></p>
          </div>`
        } else {
          var html = `<div class="col-12">
            <h4 class="mb-4 bahnschrift">No Upcoming Match</h4>
          </div>`
        }
        document.getElementById("user_upcoming_match").innerHTML = html
        console.log("upcoming result--", result)
      })
  }
  function previous_match() {

    fetch(`${base_url}/profile/tournaments?status=completed`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      }).then((responce) => responce.json())
      .then((result) => {
        console.log("upcoming--",result)
        if (result.tournaments.docs.length != 0) {
          var html = `<div class="col-12">
            <h4 class="mb-4 bahnschrift">Your Previous Match</h4>
          </div>
          <div class="col-5">
            <p class="mb-1 product_20"><strong>${result.tournaments.docs[0].tournament.title}</strong></p>
            <p class="mb-3"><i class="fa fa-calendar text_red"></i> ${result.tournaments.docs[0].tournament.date.slice(0,10)} <i class="fa fa-clock-o text_red"></i> ${result.tournaments.docs[0].tournament.date.slice(11,16)}</p>
          </div>
          <div class="col-7">
            <p class="mb-2"><strong>Tournament Mode->${result.tournaments.docs[0].tournament.tournamentType}</strong></p>
            <p class="mb-1">Rank-><strong>${result.tournaments.docs[0].position}</strong></p>
            <p class="mb-3">Prize-><strong>${result.tournaments.docs[0].prize}</strong></p>
          </div>`
        } else {
          var html = `<div class="col-12">
            <h4 class="mb-4 bahnschrift">No Previous Match</h4>
          </div>`
        }
        document.getElementById("user_previous_match").innerHTML = html
        console.log("upcoming result--", result)
      })
  }

  previous_match()

  function completed_tournaments() {
    fetch(`${base_url}/profile/tournaments?status=completed`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      }).then((responce) => responce.json())
      .then((result) => {
        console.log("completed result--", result)
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
        <div class="col-12 col-lg-3">
          <div class="row mx-0 align-items-center text-center mb-4 mb-lg-0">
              <div class="col-12">
                <h4 class="mt-3">${element.title}</h4>
              </div>
          </div>
        </div>
        <div class="col-9 col-lg-3 text-lg-center mb-3">
          <h5 class="mb-2 font-weight-bold"><span class="mr-2">COD</span><span class="ml-2">${element.tournamentType}</span></h5>
          <p class="mb-0">
            <i class="fa fa-calendar text_red"></i> ${element.date.slice(0,10)}
            <i class="fa fa-clock-o text_red"></i> ${element.date.slice(11,16)}
          </p>
        </div>
        <div class="col-12 col-lg-3 mb-2">
          <h5 class="text-center text-lg-left">Prize</h5>
          <h5 class="text-center text-lg-left mb-2">${element.prize}</h5>
        </div>
        <div class="col-12 col-lg-3 text-center">
          <button class="btn secondary_btn btn-sm" onclick="played(${count})">View Details</button>
        </div>`
        fetch(`${base_url}/leaderboard/${element.leaderboard}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          }
        }).then((responce) => responce.json())
        .then((result) => {
          console.log("leaderBoard result--", result)
          html+=`<div class="collapse played_${count} row w-100 mx-0" id="played_${count}">
                  <div class="col-12 col-lg-4 order-3 order-lg-1">
                    <div class="bordered w-100" style="padding-top: 60%; position: relative;">
                      <img src="./images/gamer1.jpeg" alt="" class="stream_match">
                      <button class="play_btn text-white" onclick="showVideo('https://www.youtube.com/embed/HXn2_xiKyyM')"><i class="fa fa-play"></i></button>
                      <p class="badge mb-0 stream_type px-4">Highlights</p>
                    </div>
                  </div>
                  <div class="col-12 col-lg-8 order-2 mb-3 mb-lg-0">
                    <div class="row mx-0 bordered p-3">
                      <div class="col-12">
                        <h5 class="text-center mb-4 bahnschrift">LeaderBoard</h5>
                      </div>
                      <div class="col-6 col-lg-5 pl-0">
                        <h6>Players</h6>
                        <ul class="list-unstyled text-secondary">
                          <li>Lorem ipsum dolor sit</li>
                          <li class="text-white">Lorem ipsum dolor sit</li>
                          <li>Lorem ipsum dolor sit</li>
                          <li>Lorem ipsum dolor sit</li>
                        </ul>
                      </div>
                      <div class="col-2 col-lg-1 pl-0 text-center">
                        <h6>Kills</h6>
                        <ul class="list-unstyled text-secondary">
                          <li>22</li>
                          <li class="text-white">22</li>
                          <li>22</li>
                          <li>22</li>
                        </ul>
                      </div>
                      <div class="col-2 pl-0 text-center">
                        <h6>Damage</h6>
                        <ul class="list-unstyled text-secondary">
                          <li>555</li>
                          <li class="text-white">555</li>
                          <li>555</li>
                          <li>555</li>
                        </ul>
                      </div>
                      <div class="col-12 col-lg-3 d-none d-lg-inline pl-0 text-center">
                        <h6>Health Restored</h6>
                        <ul class="list-unstyled text-secondary">
                          <li>555</li>
                          <li class="text-white">555</li>
                          <li>555</li>
                          <li>555</li>
                        </ul>
                      </div>
                      <div class="col-2 col-lg-1 px-0 text-center">
                        <h6>K/D</h6>
                        <ul class="list-unstyled text-secondary">
                          <li>11</li>
                          <li class="text-white">11</li>
                          <li>11</li>
                          <li>11</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>`
        })
      html+=`
      </div>
      </div>`
      });
      document.getElementById("user_played_tournament").innerHTML = html
      completed_turnament_getPageButtons(totalPages)
    }
  }

  function completed_turnament_page_list() {
    fetch(`${base_url}/profile/tournaments?page=${reqData.completed_currentPageNumber}&status=completed`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      }).then((responce) => responce.json())
      .then((result) => {
        console.log("completed result--", result)
        completed_tournament_list(result.tournaments)
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
      completed_turnament_page_list(reqData);;
    });
  }




  


  function upcoming_tournaments() {
    fetch(`${base_url}/profile/tournaments?status=upcoming`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      }).then((responce) => responce.json())
      .then((result) => {
        console.log("upcoming result--", result)
        upcoming_tournament_list(result.tournaments)
      })
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
        <div class="col-12 col-lg-3">
          <div class="row mx-0 align-items-center mb-4 mb-lg-0">
            <div class="col-12">
              <h4>${element.tournament.title}</h4>
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-3 text-center mb-2">
          <h5 class="mb-3 font-weight-bold "><span class="ml-2">${element.tournament.tournamentType}</span></h5>
          <p class="text-center ">
            <i class="fa fa-calendar text_red mx-2"></i>${element.tournament.date.slice(0,10)} 
            <i class="fa fa-clock-o text_red mx-2"></i> ${element.tournament.date.slice(11,16)}
          </p>
        </div>
        <div class="col-12 col-lg-3 mb-2">
          <h5 class="text-center mb-2">Prize ${element.tournament.prize}</h5>
        </div>
        <div class="col-12 col-lg-3 text-center">
          <button class="btn secondary_btn btn-sm" onclick="upcoming(${count})">View Details</button>
        </div>`
        if(element.tournament.tournamentType!="solo"){
          html+= `<div class="col-12 col-lg-3 collapse upcoming_${count}">
                   <b> Team Name->${element.teamName} </b>
                  </div>
                  <div class="col-12 col-lg-6 collapse upcoming_${count}">
                    <b>Team Players->`
                  element.team.forEach(element => {
                    html+= `${element}, `
                  });
                  html+= `</b></div>`
        }
       html+=`<div class="col-12 col-lg-3  collapse upcoming_${count} text-center">
                <button class="btn btn-sm secondary_btn" data-toggle="modal" data-target="#registeredUsersModal" onclick="registeredUsers('${element.tournament._id}')">View Registered Players</button>
              </div>
       </div></div>`
      });
      document.getElementById("upcoming_tournaments").innerHTML = html
      upcoming_turnament_getPageButtons(totalPages)
    }
  }

  function upcoming_turnament_page_list() {
    fetch(`${base_url}/profile/tournaments?page=${reqData.upcoming_currentPageNumber}&status=upcoming`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      }).then((responce) => responce.json())
      .then((result) => {
        console.log("completed result--", result)
        upcoming_tournament_list(result.tournaments)
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
      upcoming_turnament_page_list(reqData);;
    });
  }
  function registeredUsers(tournament_id) {
    var html = ""
    fetch(`${base_url}/tournament/${tournament_id}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      })
      .then(response => response.json())
      .then(result => {
        console.log('result--', result)
        if (result.users.length != 0) {
          result.users.forEach(element => {
            html += `
                  <div class="row mx-0 my-2 px-lg-3 align-items-center" id="tournament_users">
                    <div class="col-4 col-lg-4 px-0">
                      <h5 class="mb-0 d-inline">${element.player.name}</h5>
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
      console.log('error', error)
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
  window.location.href = "./login.html"
}