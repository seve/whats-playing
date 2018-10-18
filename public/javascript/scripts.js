document.querySelector('.feed').addEventListener("click", (e) => {
    console.log("click");
    const elem = e.target;
    if (elem.className == "delete-button") {
        e.preventDefault();
        const spotifySongID = elem.dataset.spotifySongId;
        const userID = elem.dataset.userId;
        axios.delete(`/share`, {
                params: {
                    spotifySongID: spotifySongID,
                    userID: userID
                }

            })
            .then((res) => {
                elem.parentNode.style.display = 'none';
            })
            .catch((err) => {
                console.error(err);
            });
    }
});

document.querySelector('.follow-button').addEventListener("click", (e) => {
    const elem = e.target;
    const user = elem.dataset.userId;

    if (elem.innerText == "Follow") {
        axios.post(`/follow`, {
                user: user
            })
            .then((res) => {
                elem.innerText = "Unfollow";
                elem.classList.add("unfollow-button")
            })
            .catch((err) => {
                console.error(err);
            });
    } else {
        axios.post(`/unfollow`, {
                params: {
                    user: user
                }
            })
            .then((res) => {
                elem.innerText = "Follow";
                elem.classList.add("follow-button")
            })
            .catch((err) => {
                console.error(err);
            });
    }
})
