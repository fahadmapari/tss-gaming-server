if (localStorage.getItem("logged_in") == "true" && (localStorage.getItem("user_role") == "admin" || localStorage.getItem("user_role") == "sub-admin") ) {
  let reqData = {
    completed_currentPageNumber: 1,
    upcoming_currentPageNumber: 1
  };
  showLoader()
  const images = document.querySelector(".images");
  const Form = document.getElementById('create_tournament');

  Form.addEventListener('submit', function (e) {
    e.preventDefault()
    // console.log(e)
    showLoader()
    var title = $("#title").val()
    var description = $("#Description").val()
    var game_date = $("#game_date").val()
    var game = $("#game").val()
    var game_time = $("#game_time").val()
    var game_type = $("#game_type").val()
    var entry_fee = $("#entry_fee").val()
    var total_prize = $("#total_prize").val()
    var room_id = $("#room_id").val()
    var room_password = $("#room_password").val()
    var kill_prize = $("#kill_prize").val()
    var streak_prize = $("#streak_prize").val()
    var stream_link = $("#stream_link").val()
    var damage_prize = $("#damage_prize").val()
    var total_slots = $("#total_slots").val()

    
  
    var formdata = new FormData();
    formdata.append("title", `${title}`);
    Array.from(images.files).forEach((file) => {
      formdata.append("thumbnails", file);
    });
    formdata.append("description", `${description}`);
    formdata.append("date", `${game_date}` + "," + `${game_time}`);
    formdata.append("entryFee", `${entry_fee}`);
    formdata.append("tournamentType", `${game_type}`);
    formdata.append("kills", `${kill_prize}`);
    formdata.append("streak", `${streak_prize}`);
    formdata.append("damage", `${damage_prize}`);
    formdata.append("prize", `${total_prize}`);
    formdata.append("roomId", `${room_id}`);
    formdata.append("roomPassword", `${room_password}`);
    formdata.append("stream", `${stream_link}`);
    formdata.append("slots", `${total_slots}`);
    formdata.append("game", `${game}`);
    

    // console.log("form data --",formdata)
    var requestOptions = {
      method: 'POST',
      headers: {
        credentials: 'include'
      },
      body: formdata,
    };

    fetch(`${base_url}/tournament/create`, requestOptions)
      .then((responce) => responce.json())
      .then((result) => {
        // console.log(result)
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
            text: `Tournament Created Successfully`,
            type: "success",
            icon: "success"
          }).then(function () {

            window.location.href = "/admin/admin_dashboard.html"
          })
        }
      }).catch((error) => {
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


  function completed_tournaments() {
    fetch(`${base_url}/tournament/list?status=completed`, {
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
      var html = `<h1 class="text-center mb-4 mt-5 bahnschrift">Completed Tournaments</h1>
      <div class="w-100 black_bg bordered mb-5">
      <h1 class="text-center mb-4 mt-5 bahnschrift">No Tournaments Schedualed Before</h1>
      </div>`
      document.getElementById("user_played_tournament").innerHTML = html

    } else {
      var html = ""
      html += `<h1 class="text-center mb-4 mt-5 bahnschrift">Completed Tournaments</h1>`
      docs.forEach((element, count) => {
        html += `
        <div class="w-100 black_bg bordered mb-5">
        <div class="row mx-0 py-4">
          <div class="col-12 col-lg-3 mb-2 mb-lg-0 text-center">
            <h5 class="mb-0 font-weight-bold black_input">${element.title.slice(0,20)}</h5>
          </div>
          <div class="col-12 col-lg-3 mb-2 mb-lg-0 text-center">
            <h5 class="mb-0 black_input"><span class="ml-2">${element.tournamentType}</span></h5>
          </div>
          <div class="col-12 col-lg-3 mb-2 mb-lg-0 text-center">
            <h5 class="mb-0 black_input">Prize <span>${element.prize}</span> Coins</h5>
          </div>
          <div class="col-12 col-lg-3 text-center">
            <button class="btn secondary_btn btn-md" onclick="played(${count})">View Details</button>
          </div>
          <div class="col-12 col-lg-3 mt-2 collapse played_${count}">
            <p class="mb-1 black_input"><i class="fa fa-calendar text_red mx-1"></i>${element.date.slice(0,10)}</p>
          </div>
          <div class="col-12 col-lg-3 mt-2 collapse played_${count}">
            <p class="mb-0 black_input"><i class="fa fa-clock-o text_red mx-1"></i> ${element.date.slice(11,16)}</p>
          </div>
          <div class="col-12 col-lg-3 mt-2 collapse played_${count}">
            <button class="btn btn-md secondary_btn" data-toggle="modal" data-target="#registeredUsersModal" onclick="registeredUsers('${element._id}')">View Registered Players</button>
          </div>
          <div class="col-12 col-lg-3 mt-2 collapse played_${count} text-center">
            <button class="btn btn-md secondary_btn" data-toggle="modal" data-target="#winnersTournamentModal" onclick="View_winners('${element._id}')">View Winners</button>
          </div>
      </div></div>`
      });
      document.getElementById("user_played_tournament").innerHTML = html
      completed_turnament_getPageButtons(totalPages)
    }
  }

  function completed_turnament_page_list() {
    showLoader()
    fetch(`${base_url}/tournament/list?page=${reqData.completed_currentPageNumber}&status=completed`, {
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
    fetch(`${base_url}/tournament/list?status=upcoming`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          credentials: 'include'
        }
      }).then((responce) => responce.json())
      .then((result) => {
        // console.log("upcoming result--", result)
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
      var notify_tournament = `<option value="" selected>Select All</option>`
      html += `<h1 class="text-center mb-4 mt-5 bahnschrift">Upcoming Tournaments</h1>`
      docs.forEach((element, count) => {
        notify_tournament += `<option value="${element._id}">${element.title}</option>`
        html += `<div class="w-100 black_bg bordered mb-5">
        <div class="row mx-0 py-4">
          <div class="col-12 col-lg-3 mb-2 mb-lg-0 text-center">
            <h5 class="mb-0 font-weight-bold black_input">${element.title.slice(0,20)}</h5>
          </div>
          <div class="col-12 col-lg-3 mb-2 mb-lg-0 text-center">
            <h5 class="mb-0 black_input"><span class="ml-2">${element.tournamentType}</span></h5>
          </div>
          <div class="col-12 col-lg-3 mb-2 mb-lg-0 text-center">
            <h5 class="mb-0 black_input">Prize <span>${element.prize}</span> Coins</h5>
          </div>
          <div class="col-12 col-lg-3 text-center">
            <button class="btn secondary_btn btn-sm" onclick="upcoming(${count})">View Details</button>
          </div>
          <div class="col-12 col-lg-3 mt-2 collapse upcoming_${count}">
            <p class="mb-1 black_input">Teams : ${element.slots-element.slotsAvailable}</p>
            <p class="mb-0 black_input">Game : ${element.game.title}</p>
          </div>
          <div class="col-12 col-lg-3 mt-2 collapse upcoming_${count}">
            <p class="mb-1 black_input"><i class="fa fa-calendar text_red mx-1"></i>${element.date.slice(0,10)}</p>
            <p class="mb-0 black_input"><i class="fa fa-clock-o text_red mx-1"></i> ${element.date.slice(11,16)}</p>
          </div>
          <div class="col-12 col-lg-3 mt-2 collapse upcoming_${count}">
            <p class="mb-1 black_input">Total Slots ${element.slots}</p>
            <p class="mb-0 black_input">Available Slots ${element.slotsAvailable}</p>
          </div>
          <div class="col-12 col-lg-3 mt-2 collapse upcoming_${count} text-center">
            <button class="btn btn-sm secondary_btn" data-toggle="modal" data-target="#registeredUsersModal" onclick="registeredUsers('${element._id}')">View Registered Players</button>
            <button class="btn btn-sm mt-2 secondary_btn" data-toggle="modal" data-target="#editTournamentModal" onclick="append_tournamentId('${element._id}')">Edit Tournament Details</button>
          </div>
      </div></div>`
      });
      document.getElementById("upcoming_tournaments").innerHTML = html
      document.getElementById("notify_tournament").innerHTML = notify_tournament
      upcoming_turnament_getPageButtons(totalPages)
    }
  }

  function upcoming_turnament_page_list() {
    showLoader()
    fetch(`${base_url}/tournament/list?page=${reqData.upcoming_currentPageNumber}&status=upcoming`, {
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
  upcoming_tournaments()
  completed_tournaments()



  

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

  function append_tournamentId(tournament_id) {
    fetch(`${base_url}/tournament/${tournament_id}/edit`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          credentials: 'include'
        }
      })
      .then(response => response.json())
      .then(result => {
        // console.log('edit tournament result--', result)
        document.getElementById("tournament_id").value = result.tournament._id
        document.getElementById("edit_room_id").value = result.tournament.credentials.roomId
        document.getElementById("edit_room_pass").value = result.tournament.credentials.roomPassword
        document.getElementById("edit_stream_link").value = result.tournament.stream
        document.getElementById("edit_title").value = result.tournament.title
        document.getElementById("edit_Description").value = result.tournament.description
        document.getElementById("edit_game_date").value = result.tournament.date.slice(0,10)
        document.getElementById("edit_game_time").value = result.tournament.date.slice(12,16)
        document.getElementById("edit_entry_fee").value = result.tournament.entryFee
        document.getElementById("edit_total_prize").value = result.tournament.prize
        document.getElementById("edit_total_slots").value = result.tournament.slots

      })

  }

  function edit_tournament() {
    showLoader()
      var tournament_id = document.getElementById("tournament_id").value
      var edit_room_id =  document.getElementById("edit_room_id").value
      var edit_room_pass =  document.getElementById("edit_room_pass").value 
      var edit_stream_link =  document.getElementById("edit_stream_link").value 
      var edit_title =  document.getElementById("edit_title").value 
      var edit_Description =  document.getElementById("edit_Description").value
      var edit_game_date =  document.getElementById("edit_game_date").value 
      var edit_game_time =  document.getElementById("edit_game_time").value 
      var edit_entry_fee =  document.getElementById("edit_entry_fee").value 
      var edit_total_prize =  document.getElementById("edit_total_prize").value 
      var edit_total_slots =  document.getElementById("edit_total_slots").value 
      var edit_game_type =  document.getElementById("edit_game_type").value 
      var game =  document.getElementById("game2").value 

    var data = JSON.stringify({
      title:edit_title,
      description:edit_Description,
      entryFee:edit_entry_fee,
      prize:edit_total_prize,
      date:`${edit_game_date}` + "," + `${edit_game_time}`,
      tournamentType:edit_game_type,
      roomId: edit_room_id,
      roomPassword: edit_room_pass,
      stream: edit_stream_link,
      slots:edit_total_slots,
      game:game,
      status:"upcoming"
    })
    // console.log('edit tournament post data--',data)
    // console.log("edit tournament route--",`${base_url}/tournament/${tournament_id}/edit`)
    fetch(`${base_url}/tournament/${tournament_id}/edit`, {
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
          credentials: 'include'
        }
      })
      .then(response => response.json())
      .then(result => {
        // console.log('result--', result)
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
            text: `Tournament Edited Successfully`,
            type: "success",
            icon: "success"
          }).then(function () {
            window.location.href = "/admin/admin_dashboard.html"
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
  }

  function send_notification() {
    
    var notif_title = document.getElementById("notif_title").value
    var notif_body = document.getElementById("notif_body").value
    var notify_game = document.getElementById("notify_game").value
    var notify_tournament = document.getElementById("notify_tournament").value
    
    if(notif_title.trim()=="" || notif_body.trim()==""){
      swal({
        text: `Notification title and body required`,
        type: "warning",
        icon: "warning"
      })
    }
    else{
      showLoader()
      var data = JSON.stringify({
        title: notif_title,
        body: notif_body,
        id:notify_tournament
      })
      fetch(`${base_url}/send-push-notification`, {
          method: "POST",
          body: data,
          headers: {
            "Content-Type": "application/json",
            credentials: 'include'
          }
        })
        .then(response => response.json())
        .then(result => {
          // console.log('result--', result)
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
              text: `Notification Sent Successfully`,
              type: "success",
              icon: "success"
            }).then(function () {
              hideLoader()
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
    }
    
  }

  function get_games(){
    fetch(`${base_url}/games`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        credentials: 'include'
      }
    })
    .then(response => response.json())
    .then(result => {
      // console.log('Games Result--', result)
      var html = `<option value="" selected>Select All</option>`
      result.games.forEach(element => {
        html += `<option value="${element._id}">${element.title}</option>`
      });
      document.getElementById("game").innerHTML = html
      document.getElementById("game2").innerHTML = html
      
      document.getElementById("notify_game").innerHTML = html
      hideLoader()

    })
  }
  get_games()


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
                                                                  <h5 class="text-center mb-2 bahnschrift">LeaderBoard Not Available</h5>
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

} else {
  window.location.href = "/admin/admin_login.html"
}