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
            document.getElementById("blog_subTitle").innerText = result.blog.subHeading
            document.getElementById("blog_content").innerText = result.blog.blogContent
            document.getElementById("blog_author").innerText = result.blog.author.name
            document.getElementById("blog_summary").innerText = result.blog.summary
            document.getElementById("blog_conclusion").innerText = result.blog.conclusion
            document.getElementById("blog_date").innerText = result.blog.createdAt.slice(0,10)

           
            
            document.querySelector('meta[property="article:title"]').setAttribute("content", result.blog.heading);
            document.querySelector('meta[property="article:image"]').setAttribute("content", result.blog.featuredImage);

            

            hideLoader()
        })
        // .catch((err)=>console.log("error--",err))
}

view_blog()

function back_page(){
    window.history.back();
}