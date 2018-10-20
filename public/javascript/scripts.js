const feedContainer = document.querySelector('.feed-container') || document.querySelector('.feed');
const tabContainer = document.querySelector('.tab-container');
const followButton = document.querySelector('.follow-button');

if (tabContainer) {
    tabContainer.addEventListener("click", (e) => {
        const activeTab = document.querySelector('.active-tab');
        const elem = e.target;
        const feedContainer = document.querySelector('.feed-container');
        feedContainer
        if (elem.classList.contains("tab")) {
            e.preventDefault();
            let shiftAmount = 0;

            if (elem.dataset.num == 3) {
                shiftAmount = 33.33;
            } else if (elem.dataset.num == 1) {
                shiftAmount = -33.33;
            }

            activeTab.style.MozTransform = `translateX(${shiftAmount}vw)`;
            activeTab.style.webkitTransform = `translateX(${shiftAmount}vw)`;
            activeTab.style.OTransform = `translateX(${shiftAmount}vw)`;
            activeTab.style.msTransform = `translateX(${shiftAmount}vw)`;
            activeTab.style.transform = `translateX(${shiftAmount}vw)`;

            shiftAmount = shiftAmount / 33.33 * 100;

            feedContainer.style.MozTransform = `translateX(${shiftAmount}vw)`;
            feedContainer.style.webkitTransform = `translateX(${shiftAmount}vw)`;
            feedContainer.style.OTransform = `translateX(${shiftAmount}vw)`;
            feedContainer.style.msTransform = `translateX(${shiftAmount}vw)`;
            feedContainer.style.transform = `translateX(${shiftAmount}vw)`;

            activeTab.dataset.active = elem.dataset.num;

        }
    });
}

if (feedContainer) {
    feedContainer.addEventListener("click", (e) => {
        const elem = e.target;
        console.log("click");
        if (elem.className == "delete-button") {
            console.log("Trying to delete");
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
                    elem.parentNode.parentNode.style.display = 'none';
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    });
}

if (followButton) {
    if (followButton.dataset.following) {
        followButton.innerText = "Follow";
        followButton.classList.remove("unfollow-button");
        followButton.classList.add("follow-button");
    } else {
        followButton.innerText = "Unfollow";
        followButton.classList.remove("follow-button");
        followButton.classList.add("unfollow-button");
    }
    followButton.addEventListener("click", (e) => {

        const user = followButton.dataset.userId;

        if (followButton.innerText == "Follow") {
            axios.post(`/follow`, {
                    user: user
                })
                .then((res) => {
                    followButton.innerText = "Unfollow";
                    followButton.classList.remove("follow-button");
                    followButton.classList.add("unfollow-button");
                })
                .catch((err) => {
                    console.error(err);
                });
        } else {
            axios.post(`/unfollow`, {
                    user: user
                })
                .then((res) => {
                    followButton.innerText = "Follow";
                    followButton.classList.add("follow-button");
                    followButton.classList.remove("unfollow-button");
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    });
}
