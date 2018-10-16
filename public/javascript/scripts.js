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
