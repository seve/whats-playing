document.querySelector('.tab-container').addEventListener("click", (e) => {
    const activeTab = document.querySelector('.active-tab');
    const elem = e.target;
    const feedContainer = document.querySelector('.feed-container');feedContainer
    if(elem.classList.contains("tab")) {
        e.preventDefault();
        let shiftAmount = 0;

        if(elem.dataset.num == 3) {
            shiftAmount = 33.33;
        } else if (elem.dataset.num == 1) {
            shiftAmount = -33.33;
        }

        activeTab.style.MozTransform= `translateX(${shiftAmount}vw)`;
        activeTab.style.webkitTransform= `translateX(${shiftAmount}vw)`;
        activeTab.style.OTransform= `translateX(${shiftAmount}vw)`;
        activeTab.style.msTransform= `translateX(${shiftAmount}vw)`;
        activeTab.style.transform= `translateX(${shiftAmount}vw)`;

        shiftAmount = shiftAmount / 33.33 * 100;

        feedContainer.style.MozTransform= `translateX(${shiftAmount}vw)`;
        feedContainer.style.webkitTransform= `translateX(${shiftAmount}vw)`;
        feedContainer.style.OTransform= `translateX(${shiftAmount}vw)`;
        feedContainer.style.msTransform= `translateX(${shiftAmount}vw)`;
        feedContainer.style.transform= `translateX(${shiftAmount}vw)`;

        activeTab.dataset.active = elem.dataset.num;

    }
})

document.querySelector('.feed').addEventListener("click", (e) => {
    const elem = e.target;
    if (elem.className.baseVal == "delete-button") {
        e.preventDefault();
        const spotifySongID = elem.parentNode.dataset.spotifySongId;
        const userID = elem.parentNode.dataset.userId;
        axios.delete(`/share`, {
                params: {
                    spotifySongID: spotifySongID,
                    userID: userID
                }

            })
            .then((res) => {
                elem.parentNode.parentNode.parentNode.style.display = 'none';
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
});
