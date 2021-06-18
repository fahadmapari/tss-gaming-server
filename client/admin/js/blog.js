let reqData = {
    blog_currentPageNumber: 1
};

function all_blogs() {
    showLoader()
    // console.log(`${base_url}/blog`)
    fetch(`${base_url}/blog`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                credentials: 'include'
            }
        }).then((responce) => responce.json())
        .then((result) => {
            // console.log("blog result--", result)
            hideLoader()
            blog_tournament_list(result.blogs)
            hideLoader()
        })
}

function blog_tournament_list(tournaments) {
    const {
        docs,
        totalPages
    } = tournaments;
    if (docs.length == 0) {
        var html = `
        <div class="w-100 black_bg bordered mb-5">
        <h1 class="text-center mb-4 mt-5 bahnschrift">No blog Available</h1>
        </div>`
        document.getElementById("user_blog_tournament").innerHTML = html
    } else {
        var html = ""
        docs.forEach((element, count) => {
            html += ` <div class="row mx-0 bordered black_bg py-4 px-lg-3 mb-4">
                        <div class="col-12 col-lg-6 text-center text-lg-left mb-3 order-1">
                            <h4 class="bahnschrift" style="color: #fa011e;">${element.heading}</h4>
                            <b class="bahnschrift" style="color: #fa011e;">${element.subHeading}</b>

                        </div>
                        <div class="col-12 col-lg-8 order-3">
                            <p>${element.summary}....</p>
                            <b class="bahnschrift" style="color: #fa011e;">Published by ${element.author.name}</b>
                            <p class="bahnschrift" style="color: #fa011e;">Published at ${element.createdAt.slice(0,10)}</p>
                        </div>
                
                        <div class="col-12 col-lg-4 mb-3 order-11 order-lg-5">
                            <img src="${element.featuredImage}" alt="Image not found"
                                class="rounded w-100">
                        </div>
                        <div class="col-12 order-8 mb-2">
                            <a href="./view_blog.html?blog=${element._id}" class="btn btn-sm primary_btn px-4">Read More</a>
                        </div>
                    </div>`
        });
        document.getElementById("blog_list").innerHTML = html
        blog_turnament_getPageButtons(totalPages)
    }
}

function blog_turnament_page_list() {
    fetch(`${base_url}/blogs?page=${reqData.blog_currentPageNumber}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                credentials: 'include'
            }
        }).then((responce) => responce.json())
        .then((result) => {
            // console.log("completed result--", result)
            blog_tournament_list(result.tournaments)
        })

}

function blog_turnament_getPageButtons(pageCount) {
    $(".blog-page-buttons").empty();

    /* Declaring next and previous page buttons */
    let previous_page_button = `
              <button class='blog-previous-page-btn btn btn-sm page_btn mx-1' disabled>  
                <<
              </button>`;
    $(".blog-page-buttons").append(previous_page_button);

    let next_page_button = `
              <button class='blog-next-page-btn btn btn-sm page_btn mx-1'>  
                >>
              </button>`;

    /* rendering buttons according to page count */
    for (let index = 1; index <= pageCount; index++) {
        let pageNumberButtons = ` 
              <button class="btn btn-sm page_btn mx-1 blog-page-button-number">
                ${index}
              </button>`;
        /* Appending buttons to table */
        $(".blog-page-buttons").append(pageNumberButtons);
    }
    /* appending next page butoon at the last
     */
    $(".blog-page-buttons").append(next_page_button);

    /* Enabling and disabling previous and next page buttons */
    if (reqData.blog_currentPageNumber > 1) {
        $(".blog-previous-page-btn").attr("disabled", false);
    }
    if (reqData.blog_currentPageNumber === 1) {
        $(".blog-next-page-btn").attr("disabled", false);
    }
    if (reqData.blog_currentPageNumber == pageCount) {
        $(".blog-next-page-btn").attr("disabled", true);
    }

    $(".blog-page-button-number").on("click", (e) => {
        let clickedpageButton = e.target.innerText;

        reqData.blog_currentPageNumber = parseInt(clickedpageButton);
        blog_turnament_page_list(reqData);
    });

    $(".blog-next-page-btn").on("click", () => {
        if (reqData.blog_currentPageNumber == pageCount - 1) {
            $(".blog-next-page-btn").attr("disabled", true);
        }
        reqData.blog_currentPageNumber++;
        blog_turnament_page_list(reqData);
    });


    $(".blog-previous-page-btn").on("click", () => {
        if (reqData.blog_currentPageNumber == 1) {
            $(".blog-previous-page-btn").attr("disabled", true);
        }
        reqData.blog_currentPageNumber--;
        blog_turnament_page_list(reqData);;
    });
}

all_blogs()

