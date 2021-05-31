let reqData = {
  currentPageNumber: 1,
};

function turnament_list() {
  showLoader()
  fetch(`${base_url}/tournament/list?status=upcoming`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then((responce) => responce.json())
    .then((result) => {
      console.log("result--", result)
      buildTournaments(result.tournaments)
      hideLoader()
    })
}

function buildTournaments(tournaments) {
  var user_coins = localStorage.getItem("coins")

  const {
    docs,
    totalDocs,
    totalPages
  } = tournaments;
  if (totalDocs == 0) {
    var html = `<h1 class="text-center mb-4 mt-5 bahnschrift">No Upcoming Tournaments</h1>`
    document.querySelector("#all_tournaments_list").insertAdjacentHTML('afterbegin', html)
  } else {
    var html = ""
    var html2 = ""
    html += `<h1 class="text-center mb-4 mt-5 bahnschrift">Upcoming Tournaments</h1>`

    docs.forEach((element, count) => {
      if (element.status == "upcoming") {
        html += `<div class="row mx-0 bordered black_bg py-4 px-lg-3 mb-4">
          <div class="col-12 col-lg-6 text-center text-lg-left mb-3 order-1">
            <h4 class="bahnschrift">${element.title}</h4>
          </div>
          <div class="col-12 col-lg-6  text-lg-right mb-3 order-2">
            <span class="d-inline mx-3"><i class="fa fa-calendar mx-2 text_red"></i>${element.date.slice(0,10)}</span>
            <br class="d-lg-none">
            <span class="d-inline mx-3"><i class="fa fa-clock-o mx-2 text_red"></i>${element.date.slice(11,16)}</span>
            <br class="d-lg-none">
            <span class="d-inline mx-3"><i class="fa fa-rupee mx-2 text_red"></i>${element.entryFee}</span>
          </div>
          <div class="col-12 col-lg-4 order-3">
            <p>${element.description}</p>
          </div>
          <div class="col-12 col-lg-3 offset-lg-1 mb-2 order-4">
            <p class="mb-0 product_20 font-weight-bold">Price : ${element.prize} Coins</p>
          </div>
          <div class="col-12 col-lg-4 mb-3 order-11 order-lg-5">
            <img src="${element.thumbnails[0]}" alt="" style="height:12rem;width:20rem;">
          </div>
          
          <div class="col-12 col-lg-4 offset-lg-4 text-center collapse collapse_1 mb-2 order-10 order-lg-7">
            <h5>
              <span class="badge badge-secondary px-3 mx-2">${element.tournamentType}</span>
              <span class="badge badge-secondary px-3 mx-2">10 Teams</span>
              <span class="badge badge-secondary px-3 mx-2">${element.tournamentType}</span>
            </h5>
          </div>
          <div class="col-12 order-8 mb-2">`
          if(localStorage.getItem("token")!=undefined){
            html+=`<button class="btn btn-sm primary_btn px-4" data-toggle="modal" data-target="#registerModal${count}" >Register</button></div>
            </div>`
          }
          else{
            html+=`<a href="./login.html" class="btn btn-sm primary_btn px-4">Login to register</a></div>
            </div>`
          }
          
        html2 += `<div class="modal fade" id="registerModal${count}" tabindex="-1" role="dialog" data-backdrop="static" aria-labelledby="registerModalTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
            <div class="modal-content bordered text-white black_bg product">
              <div class="container-fluid">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true" class="text-white">&times;</span>
                </button>
                <form action="">
                  <div class="row mx-0 my-4">`
        if (element.tournamentType.toLowerCase() != "solo") {
          html2 += `<div class="col-12 col-lg-5 order-1">
                      <h5>${element.title}</h5>
                      <div class="form-row">
                        <div class="col-12 col-lg-10">
                          <label for="" class="form-label">Team Name</label>
                          <input type="text" id="team_name${count}" class="form-control form-control-sm w-100 mb-3" required>
                        </div>
                      </div>`
          if (element.tournamentType.toLowerCase() == "squad") {
            html2 += `<h5>Player Name</h5>
                      <div class="form-group row">
                        <label class="col-1 col-form-label">1.</label>
                        <div class="col-9">
                          <input type="text" id="${count}team_member1" class="form-control form-control-sm" required>
                        </div>
                      </div>
                      <div class="form-group row">
                        <label class="col-1 col-form-label">2.</label>
                        <div class="col-9">
                          <input type="text" id="${count}team_member2" class="form-control form-control-sm" required>
                        </div>
                      </div>
                      <div class="form-group row">
                        <label class="col-1 col-form-label">3.</label>
                        <div class="col-9">
                          <input type="text" id="${count}team_member3" class="form-control form-control-sm" required>
                        </div>
                      </div>
                    </div>`
          } else {
            html2 += `<h5>Player Name</h5>
                        <div class="form-group row">
                          <label class="col-1 col-form-label">1.</label>
                          <div class="col-9">
                            <input type="text" id="${count}team_member1" class="form-control form-control-sm" required>
                          </div>
                        </div>
                        <div class="form-group row">
                          <label class="col-1 col-form-label">2.</label>
                          <div class="col-9">
                            <input type="text" id="${count}team_member2" class="form-control form-control-sm" disabled>
                          </div>
                        </div>
                        <div class="form-group row">
                          <label class="col-1 col-form-label">3.</label>
                          <div class="col-9">
                            <input type="text" id="${count}team_member3" class="form-control form-control-sm" disabled>
                          </div>
                        </div>
                      </div>`
          }

        }
        else{
          html2 += `  <div class="col-12 col-lg-5 order-1">
                        <h5>${element.title}</h5>
                        <div class="form-row">
                          <div class="col-12 col-lg-10">
                            <label for="" class="form-label">Team Name</label>
                            <input type="text" id="team_name${count}" class="form-control form-control-sm w-100 mb-3" disabled>
                          </div>
                        </div>
                        <h5>Player Name</h5>
                        <div class="form-group row">
                          <label class="col-1 col-form-label">1.</label>
                          <div class="col-9">
                            <input type="text" id="${count}team_member1" class="form-control form-control-sm" disabled>
                          </div>
                        </div>
                        <div class="form-group row">
                          <label class="col-1 col-form-label">2.</label>
                          <div class="col-9">
                            <input type="text" id="${count}team_member2" class="form-control form-control-sm" disabled>
                          </div>
                        </div>
                        <div class="form-group row">
                          <label class="col-1 col-form-label">3.</label>
                          <div class="col-9">
                            <input type="text" id="${count}team_member3" class="form-control form-control-sm" disabled>
                          </div>
                        </div>
                      </div>`
        }
        html2 += `<div class="col-12 col-lg-7 text-center order-2 mb-3">
                      <p>
                        <span class="d-inline mx-2"><i class="fa fa-calendar text_red"></i> : ${element.date.slice(0,10)}</span>
                        <span class="d-inline mx-2"><i class="fa fa-clock-o text_red"></i> : ${element.date.slice(11,16)}</span>
                        <span class="d-inline mx-2"><i class="fa fa-rupee text_red"></i> : ${element.entryFee}</span></p>
                      <br>
                      <img src="https://images.indianexpress.com/2020/09/PUBG-mobile-1.jpg" alt="" class="img-rounded w-100 mb-3">
                      
                      <h5>
                        Team Mode : 
                        <span class="">${element.tournamentType}</span>
                      </h5>
                      <h5 class="text-success slots">
                        Slots Free : 
                        <span class=""><span id="slot_value${count}">${element.slotsAvailable}</span><span class="ml-2 d-none hurry">Hurry Up!</span></span>
                      </h5>
                      <script>
                        $(document).ready(function(){
                          var slot_free = parseInt($("#slot_value${count}").text(), 10);
                          if (slot_free < 6) {
                            $('.hurry').addClass('d-inline');
                            if (slot_free < 3)
                              $('.slots').addClass('text-danger font-weight-bold');
                            else
                              $('.slots').addClass('text-warning font-weight-bold');
                          }
                        });
                      </script>
                    </div>
                    <div class="col-12 col-lg-5 order-5 order-lg-3 text-center">
                      <button type="button" class="btn btn-sm primary_btn px-5" onclick="join_tournament('${element.tournamentType}','${element._id}','${count}')">
                        Pay 
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 17.934 17.934" class="mx-1">
                          <path id="Icon_awesome-coins" data-name="Icon awesome-coins" d="M0,14.2v1.5c0,1.236,3.012,2.242,6.725,2.242s6.725-1.005,6.725-2.242V14.2c-1.447,1.019-4.091,1.5-6.725,1.5S1.447,15.216,0,14.2ZM11.208,4.483c3.713,0,6.725-1.005,6.725-2.242S14.921,0,11.208,0,4.483,1.005,4.483,2.242,7.5,4.483,11.208,4.483ZM0,10.522v1.807c0,1.236,3.012,2.242,6.725,2.242s6.725-1.005,6.725-2.242V10.522C12,11.713,9.356,12.329,6.725,12.329S1.447,11.713,0,10.522Zm14.571.385c2.007-.389,3.363-1.11,3.363-1.94v-1.5A8.6,8.6,0,0,1,14.571,8.68ZM6.725,5.6C3.012,5.6,0,6.858,0,8.406s3.012,2.8,6.725,2.8,6.725-1.254,6.725-2.8S10.438,5.6,6.725,5.6Zm7.681,1.972c2.1-.378,3.527-1.121,3.527-1.972v-1.5A11.4,11.4,0,0,1,12.3,5.573,3.922,3.922,0,0,1,14.406,7.576Z" fill="#ffffff"/>
                        </svg>
                        ${element.entryFee}
                      </button>
                    </div>
                    <div class="col-12 col-lg-7 order-4 text-center mb-2">
                      <span class="d-inline mr-3">Available Balance : 
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 17.934 17.934" class="mx-1">
                          <path id="Icon_awesome-coins" data-name="Icon awesome-coins" d="M0,14.2v1.5c0,1.236,3.012,2.242,6.725,2.242s6.725-1.005,6.725-2.242V14.2c-1.447,1.019-4.091,1.5-6.725,1.5S1.447,15.216,0,14.2ZM11.208,4.483c3.713,0,6.725-1.005,6.725-2.242S14.921,0,11.208,0,4.483,1.005,4.483,2.242,7.5,4.483,11.208,4.483ZM0,10.522v1.807c0,1.236,3.012,2.242,6.725,2.242s6.725-1.005,6.725-2.242V10.522C12,11.713,9.356,12.329,6.725,12.329S1.447,11.713,0,10.522Zm14.571.385c2.007-.389,3.363-1.11,3.363-1.94v-1.5A8.6,8.6,0,0,1,14.571,8.68ZM6.725,5.6C3.012,5.6,0,6.858,0,8.406s3.012,2.8,6.725,2.8,6.725-1.254,6.725-2.8S10.438,5.6,6.725,5.6Zm7.681,1.972c2.1-.378,3.527-1.121,3.527-1.972v-1.5A11.4,11.4,0,0,1,12.3,5.573,3.922,3.922,0,0,1,14.406,7.576Z" fill="#ffffff"/>
                        </svg>
                        ${user_coins}
                      </span>
                      <a href="./add_coins.html" type="button" class="btn btn-sm secondary_btn">Add Coins</a>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>`
      }
    });
    document.getElementById("all_tournaments_list").innerHTML = html
    document.getElementById("random").innerHTML = html2

    getPageButtons(totalPages);
  }
}

function turnament_page_list() {
  console.log(`${base_url}/tournament/list?page=${reqData.currentPageNumber}`)
  showLoader()
  fetch(`${base_url}/tournament/list?page=${reqData.currentPageNumber}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then((responce) => responce.json())
    .then((result) => {
      console.log("result--", result)
      buildTournaments(result.tournaments)
      hideLoader()
    })
}

function getPageButtons(pageCount) {
  $(".page-buttons").empty();

  /* Declaring next and previous page buttons */
  let previous_page_button = `
          <button class='previous-page-btn btn btn-sm page_btn mx-1' disabled>  
            <<
          </button>`;
  $(".page-buttons").append(previous_page_button);

  let next_page_button = `
          <button class='next-page-btn btn btn-sm page_btn mx-1' disabled>  
            >>
          </button>`;

  /* rendering buttons according to page count */
  for (let index = 1; index <= pageCount; index++) {
    let pageNumberButtons = ` 
          <button class="btn btn-sm page_btn mx-1 page-button-number">
            ${index}
          </button>`;
    /* Appending buttons to table */
    $(".page-buttons").append(pageNumberButtons);
  }
  /* appending next page butoon at the last
   */
  $(".page-buttons").append(next_page_button);

  /* Enabling and disabling previous and next page buttons */
  if (reqData.currentPageNumber > 1) {
    $(".previous-page-btn").attr("disabled", false);
  }
  if (reqData.currentPageNumber === 1) {
    $(".next-page-btn").attr("disabled", false);
  }
  if (reqData.currentPageNumber == pageCount) {
    $(".next-page-btn").attr("disabled", true);
  }

  $(".page-button-number").on("click", (e) => {
    $(this).addClass("active");

    let clickedpageButton = e.target.innerText;
    // console.log('clickedpageButton--', clickedpageButton)
    reqData.currentPageNumber = parseInt(clickedpageButton);
    turnament_page_list(reqData);
    $(`[value = ${reqData.currentPageNumber}]`).addClass("active");
  });



  $(".next-page-btn").on("click", () => {
    if (reqData.currentPageNumber == pageCount - 1) {
      $(".next-page-btn").attr("disabled", true);
    }
    reqData.currentPageNumber++;
    turnament_page_list(reqData);
  });


  $(".previous-page-btn").on("click", () => {
    if (reqData.currentPageNumber == 0) {
      $(".previous-page-btn").attr("disabled", true);
    }
    reqData.currentPageNumber--;
    turnament_page_list(reqData);
  });
}


turnament_list()

function join_tournament(team_type, id, count) {
  console.log("tournamentId--",id)
  if (team_type.toLowerCase() != "solo") {
    if (team_type.toLowerCase() == "squad") {
      var team_name = document.getElementById(`team_name${count}`).value
      var team_member1 = document.getElementById(`${count}team_member1`).value
      var team_member2 = document.getElementById(`${count}team_member2`).value
      var team_member3 = document.getElementById(`${count}team_member3`).value
      var team_members = [team_member1, team_member2, team_member3]
      if (team_name.trim() == "" || team_member1.trim() == "" || team_member2.trim() == "" || team_member3.trim() == "") {
        swal({
          text: `Team Name and all member username required`,
          type: "warning",
          icon: "warning"
        }).then(function () {
          return
        })
      } else {
        var raw = JSON.stringify({
          "tournamentId": id,
          "teamMembers": team_members,
          "teamName": team_name
        });

        var requestOptions = {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: raw,
          redirect: 'follow'
        };

        fetch(`${base_url}/tournament/join`, requestOptions)
          .then(response => response.json())
          .then(result => {
            console.log(result)
            if (result.status != undefined) {
              swal({
                text: `${result.message}`,
                type: "error",
                icon: "error"
              })
            } else {
              swal({
                text: `Successfully Joined Tournament`,
                type: "success",
                icon: "success"
              })
            }

          })
          .catch(error => {
            console.log('error', error)
            swal({
              text: `${error}`,
              type: "error",
              icon: "error"
            })
          });
      }
    } else {
      if (team_type.toLowerCase() == "duo") {
        var team_name = document.getElementById(`team_name${count}`).value
        var team_member1 = document.getElementById(`${count}team_member1`).value
        var team_members = [team_member1]
        if (team_name.trim() == "" || team_member1.trim() == "") {
          swal({
            text: `Team Name and all member username required`,
            type: "warning",
            icon: "warning"
          }).then(function () {
            return
          })
        } else {
          var raw = JSON.stringify({
            "tournamentId": id,
            "teamMembers": team_members,
            "teamName": team_name
          });

          var requestOptions = {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
            body: raw,
            redirect: 'follow'
          };

          fetch(`${base_url}/tournament/join`, requestOptions)
            .then(response => response.json())
            .then(result => {
              console.log(result)
              if (result.status != undefined) {
                swal({
                  text: `${result.message}`,
                  type: "error",
                  icon: "error"
                })
              } else {
                swal({
                  text: `Successfully Joined Tournament`,
                  type: "success",
                  icon: "success"
                })
              }

            })
            .catch(error => {
              console.log('error', error)
              swal({
                text: `${error}`,
                type: "error",
                icon: "error"
              })
            });
        }
      }
    }
  } else {
    var team_members = []
    var team_name = ""
    var raw = JSON.stringify({
      "tournamentId": id,
      "teamMembers": team_members,
      "teamName": team_name
    });

    var requestOptions = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: raw,
      redirect: 'follow'
    };

    fetch(`${base_url}/tournament/join`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        if (result.status != undefined) {
          swal({
            text: `${result.message}`,
            type: "error",
            icon: "error"
          })
        } else {
          swal({
            text: `Successfully Joined Tournament`,
            type: "success",
            icon: "success"
          })
        }

      })
      .catch(error => {
        console.log('error', error)
        swal({
          text: `${error}`,
          type: "error",
          icon: "error"
        })
      });
  }
}