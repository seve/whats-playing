document.querySelector('.feed').addEventListener("click", (e) => {
    console.log("click");
    const elem = e.target;
    if (elem.className == "delete-button") {
        e.preventDefault();
        const spotifySongID = elem.dataset.spotifySongId;
        axios.delete(`/share/${spotifySongID}`)
            .then((res) => {
                elem.parentNode.style.display = 'none';
            })
            .catch((err) => {
                console.error(err);
            });
    }
});
