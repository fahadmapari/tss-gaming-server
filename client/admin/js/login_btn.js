if(localStorage.getItem("logged_in")=="true"){
    var login_btn = document.getElementById("login_btn")
    login_btn.innerText = "Logout"
    login_btn.removeAttribute("href")
    login_btn.setAttribute("id","logout")
}

$("#logout").click(()=>{
    if(localStorage.getItem("user_role")=="admin" || localStorage.getItem("user_role")=="sub-admin"){
        localStorage.clear()
        window.location.href = "/admin/admin_login.html"
    }
    else{
        localStorage.clear()
        window.location.href = "/user/login.html"
    }
})