if (localStorage.getItem("logged_in") == "true" && (localStorage.getItem("user_role") == "admin" || localStorage.getItem("user_role") == "sub-admin")) {

  const images = document.querySelector(".images");
  const Form = document.getElementById('create_blog');

  Form.addEventListener('submit', function (e) {
    e.preventDefault()
    // console.log(e)
    showLoader()
    var blog_sub_title = $("#blog_sub_title").val()

    var blog_title = $("#blog_title").val()
    var blog_tags = Array($("#blog_tags").val())
    var blog_meta = $("#blog_meta").val()
    var blog_contnent = $("#blog_contnent").val()
    var blog_conclusion = $("#blog_conclusion").val()
    var blog_summary = $("#blog_summary").val()
    var blog_category = $("#blog_category").val()



    var myHeaders = new Headers();
    myHeaders.append("credentials",'include');


    var formdata = new FormData();
    formdata.append("heading", blog_title);
    formdata.append("subHeading", blog_sub_title);
    formdata.append("blogContent", blog_contnent);
    formdata.append("keywords", [blog_tags]);
    formdata.append("summary", blog_summary);
    formdata.append("conclusion", blog_conclusion)
    formdata.append("category", blog_category);

    formdata.append("featuredImage", images.files[0]);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch(`${base_url}/blog/create`, requestOptions)
      .then(response => response.text())
      .then(result => {
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
            text: `Blog Posted Successfully`,
            type: "success",
            icon: "success"
          }).then(function () {
            window.location.href = "/admin/blog.html"
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
} else {
  window.location.href = "/admin/admin_login.html"
}
hideLoader()