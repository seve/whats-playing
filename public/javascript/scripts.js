/* global axios:true */
const feedContainer = document.querySelector('.feed-container') || document.querySelector('.feed');
const tabContainer = document.querySelector('.tab-container');
const followButton = document.querySelector('.follow-button');
const dim = document.querySelector('.dim');

if (tabContainer) {
  tabContainer.addEventListener('click', (e) => {
    const activeTab = document.querySelector('.active-tab');
    const elem = e.target;
    if (elem.classList.contains('tab')) {
      e.preventDefault();
      let shiftAmount = 0;

      if (elem.dataset.num === '3') {
        shiftAmount = 33.33;
      } else if (elem.dataset.num === '1') {
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
  feedContainer.addEventListener('click', (e) => {
    let elem = e.target;
    if (elem.className === 'delete-button') {
      console.log('Trying to delete');
      e.preventDefault();
      const spotifySongID = elem.dataset.spotifySongId;
      const userID = elem.dataset.userId;
      axios.delete('/share', {
        params: {
          spotifySongID,
          userID,
        },

      })
        .then((res) => {
          elem.parentNode.parentNode.style.display = 'none';
        })
        .catch((err) => {
          console.error(err);
        });
    }
    if (elem.nodeName === 'IMG' || elem.classList.contains('song-name') || elem.classList.contains('artist') || elem.classList.contains('share')) {
      while (!elem.classList.contains('share')) {
        elem = elem.parentNode;
      }
      if (elem.classList.contains('active')) {
        elem.classList.remove('active');
        elem.classList.remove('detailed-view')
      } else {
        elem.classList.add('detailed-view');
        elem.classList.add('active');
      }
    }
  });
}

if (dim) {
  dim.addEventListener('click', (e) => {
    dim.classList.remove('active');
    document.querySelector('.detailed-view').classList.remove('detailed-view');
  });
}

if (followButton) {
  console.log(followButton.dataset.following);
  if (followButton.dataset.following !== true) {
    followButton.innerText = 'Follow';
    followButton.classList.remove('unfollow-button');
    followButton.classList.add('follow-button');
  } else {
    followButton.innerText = 'Unfollow';
    followButton.classList.remove('follow-button');
    followButton.classList.add('unfollow-button');
  }
  followButton.addEventListener('click', (e) => {
    const user = followButton.dataset.userId;

    if (followButton.innerText === 'Follow') {
      axios.post('/follow', {
        user,
      })
        .then((res) => {
          followButton.innerText = 'Unfollow';
          followButton.classList.remove('follow-button');
          followButton.classList.add('unfollow-button');
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      axios.post('/unfollow', {
        user,
      })
        .then((res) => {
          followButton.innerText = 'Follow';
          followButton.classList.add('follow-button');
          followButton.classList.remove('unfollow-button');
        })
        .catch((err) => {
          console.error(err);
        });
    }
  });
}
