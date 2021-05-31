hideLoader()
if (localStorage.getItem("token") != undefined) {
  function plus_coins(deal) {
    var deal_action = "#coins_" + deal;
    var coins = parseInt($(deal_action).val());
    if (isNaN(coins)) {
      coins = 0;
    }
    $(deal_action).val(coins + 1);
  }

  function minus_coins(deal) {
    var deal_action = "#coins_" + deal;
    var coins = parseInt($(deal_action).val());
    if (coins > 2) {
      $(deal_action).val(coins - 1);
    } else {
      $(deal_action).val(1);
    }
  }

  function validateForm(deal) {
    var deal_action = "#coins_" + deal;
    var coins = parseInt($(deal_action).val());
    if (isNaN(coins) || coins < 1) {
      var popup = '#' + deal + 'Popup'
      $(popup).modal();
      $(deal_action).val(1);
      return false;
    }
  }

  function plus_bulk(amt, deal) {
    var deal_action = "#coins_" + deal;
    var coins = parseInt($(deal_action).val());
    coins = coins + amt;
    $(deal_action).val(coins);
  }
  $("#rzp-button1").hide()

  $("#buy_coins").click(() => {
    showLoader()
    var coins = $("#coins_add").val()
    console.log("coins--", coins)
    fetch(`${base_url}/coins/buy`, {
        method: "POST",
        body: JSON.stringify({
          "coins": coins
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      }).then((responce) => responce.json())
      .then((result) => {
        console.log("result--", result)
        // window.location.href = "./dashboard.html"
        if (result.orderResponse.status == "created") {
          localStorage.setItem("order_id", result.orderResponse.id)
          localStorage.setItem("order_amount", result.orderResponse.amount)

          document.getElementById("proceed_to_pay").innerHTML = `
        
              <div class="form-group row">
                <label class="col-3 col-form-label">Order ID</label>
                <div class="col-9 col-lg-9">
                  <input type="text" id="order_id" class="form-control form-control-sm" value="${result.orderResponse.id}" disabled>
                </div>
              </div>
              <div class="form-group row">
                <label class="col-3 col-form-label">RS.</label>
                <div class="col-9 col-lg-9">
                  <input type="number" id="amount" class="form-control form-control-sm" value="${Number(result.orderResponse.amount)/100}" disabled>
                </div>
              </div>
        `
          $("#rzp-button1").show()
          hideLoader()
        }
      })
  })


  $("#withdraw_coins").click(() => {
    showLoader()
    var coins = $("#coins_add").val()
    var upi_id = $("#upi_id").val()
    var data = {
      "withdrawAmount": coins,
      "upiID": upi_id
    }

    fetch(`${base_url}/coins/withdraw/request`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      }).then((responce) => responce.json())
      .then((result) => {
        console.log("result--",result)
        if (result.status != undefined) {
          swal({
            text: `${result.message}`,
            type: "error",
            icon: "error"
          }).then(function(){
            window.location.href = "./dashboard.html"
          })
        } else {
          swal({
            text: `Withdraw Request Sended to admin`,
            type: "success",
            icon: "success"
          }).then(function(){
            window.location.href = "./dashboard.html"
          })
        }
      })
  })



  document.getElementById("rzp-button1").onclick = function (e) {
    var options = {
      "data-key": "rzp_test_hykiQnvdkLhUch",
      "amount": `${localStorage.getItem("order_amount")}`,
      "currency": "INR",
      "name": `${localStorage.getItem("username")}`,
      "description": "Test Transaction",
      "image": "./images/logo tss.png",
      "order_id": `${localStorage.getItem("order_id")}`,
      "handler": function (response) {
        swal({
          text: `${localStorage.getItem("order_amount")/100} Coins Added to your wallet`,
          type: "success",
          icon: "success"
        }).then(function () {
          window.location.href = './dashboard.html'
        })
      },

      "theme": {
        "color": "#c70300"
      }
    };
    var rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();
  }
} else {
  window.location.href = "./login.html"
}