const  makeComment = async (event) => {
    event.preventDefault();

    switch (event.target.id) {
        case 'new':
            const postData = {
                title: document.getElementById("titleArea").value,
                body: document.getElementById("postArea").value
            }
            const newPost = await fetch('/posts/new', {
                method: 'POST',
                body: JSON.stringify(postData),
                headers: { 'Content-Type': 'application/json' },
                });
            
            if (newPost.ok) {
            // If successful, redirect the browser to the profile page
            document.location.replace('/profile');
            } else {
            alert(newPost.statusText);
            }

            break;
        case "add":
                // Send a POST request to the API endpoint
            const add = await fetch('/posts/comment', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                });
            
            if (add.ok) {
            // If successful, redirect the browser to the profile page
            document.location.replace('/posts/comment');
            } else {
            alert(add.statusText);
            }

            break;
        
        case 'save':
            const commentData = {
                body: document.getElementById("commentArea").value,
                postID: document.getElementById("save").dataset.postId
            }

            const save = await fetch('/posts/comment', {
                method: 'POST',
                body: JSON.stringify(commentData),
                headers: { 'Content-Type': 'application/json' },
                });
            
            if (save.ok) {
                console.log("got here?");
            // If successful, redirect the browser to the profile page
            document.location.replace('/posts/'+ commentData.postID);
            } else {
            alert(save.statusText);
            }
            break;
        default:
            document.location.replace('/');
            break;
    }

}

document.querySelector("button")
.addEventListener("click", makeComment)