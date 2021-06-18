function view_blog() {
    const url = window.location.href
    var new_url = new URL(url);
    var blog_id = new_url.searchParams.get("blog")
    
    showLoader()
    
    fetch(`${base_url}/blog/${blog_id}/view`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                credentials: 'include'
            }
        }).then((responce) => responce.json())
        .then((result) => {
            // console.log("blog result--", result)
            document.getElementById("blog_title").innerText = result.blog.heading
            document.getElementById("blog_img").setAttribute("src",`${result.blog.featuredImage}`)
            document.getElementById("delete_btn").setAttribute("onclick",`deleteBlog('${result.blog._id}')`) 
            document.getElementById("edit_btn").setAttribute("href",`editBlog.html?blog=${result.blog._id}`) 
            document.getElementById("blog_subTitle").innerText = result.blog.subHeading
            document.getElementById("blog_content").innerText = result.blog.blogContent
            document.getElementById("blog_author").innerText = result.blog.author.name
            document.getElementById("blog_summary").innerText = result.blog.summary
            document.getElementById("blog_conclusion").innerText = result.blog.conclusion
            document.getElementById("blog_date").innerText = result.blog.createdAt.slice(0,10)
            hideLoader()
        }).catch((err)=>
        console.log("error--",err)
        )
}

view_blog()

function back_page(){
    window.history.back();
}

function deleteBlog(blogId){
    swal({
        title: "Are you sure?",
        text: `Do You want Delete Blog`,
        icon: "warning",
        type: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then((willDelete) => {
        if (willDelete) {
            showLoader()
            fetch(`${base_url}/blog/${blogId}/delete`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        credentials: 'include'
                    }
                }).then((responce) => responce.json())
                .then((result) => {
                    // console.log("deleted result--", result)
                    if (result.status != undefined) {
                        swal({
                            text: `${result.message}`,
                            type: "error",
                            icon: "error"
                        })
                    } else {
                        swal({
                            text: `Blog Deleted Successfully`,
                            type: "success",
                            icon: "success"
                        }).then(() => {
                            window.location.href = "/admin/blog.html"
                        })
                    }
                })
        }

    })
}