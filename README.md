# SECP [template by MediBoss](https://github.com/MediBoss/SECP)

## Table of Contents
  * [App Design](#app-design)
    * [Objective](#objective)
    * [Audience](#audience)
    * [Experience](#experience)
  * [Technical](#technical)
    * [Screens](#Screens)
    * [External services](#external-services)
    * [Views, View Controllers, and other Classes](#Views-View-Controllers-and-other-Classes)
  * [MVP Milestones](#mvp-milestones)
    * [Sprint 1](#Day-1)
    * [Sprint 2](#Day-2)
    * [Sprint 3](#Day-3)
    * [Sprint 4](#Day-4)
    * [Sprint 5](#Day-5)

---

### App Design

#### Objective
Create a platform for music listeners to share music they enjoy with others. Whether that be friends and family or random strangers.

#### Audience
Music listeners who use streaming services(primarily Spotify)

#### Experience
App will open to a default dashboard of the global feed if not logged in. This will show everyone who publicly shows their music shares.  If the user is logged in, it will show the friends feed. There will be a button the quickly add a song to share.

Shared songs will have the ability to listen to a snippet of the song or proceed to the Spotify page for the song.

If the user is clicked on it will bring you to a page showing the user's feed along with a bio and profile picture.  On this screen it will have a button to allow private music shares.




[Back to top ^](#)

---

### Technical


#### Screens
* __What's Playing__
    * The landing page
    * If not logged in, shows a info panel
    * Shows a feed of all friends if signed in, if not shows global feed.
    * *Actions*
        * Login/Sign Up
        * Share new song
        * View own User Profile
        * Switch to friends/global feed


* __Feed__
    * Shows a chronological list of Shared Songs


* __Shared Song__
    * Shows cover art, song name, artist name, username, and optionally a mentioned user
    * *Actions*
        * Preview song
        * View on Spotify
        * View User Profile


* __User Profile__
    * Shows profile information
        * Profile picture
        * Bio
        * Favorite Artists
    * Shows User Feed
    * *Actions*
        * User to User Share
        * Follow
        * Go back to What's Playing


* __Share New Song__
    * *Actions*
        * Search for song
        * Mention a user
        * Choose privacy
            * Global
            * Friends
            * User to User


#### External services
* [Spotify API](https://developer.spotify.com/documentation/web-api/)
    * Strongly relies on Spotify Data
        * Song Details(name, artist)
        * Song Preview
        * Song Search
        * User Authentication/Log in
        * User Info


#### Views, View Controllers, and other Classes
* **Views**
    * playing
    * user
    * login
    * sign-up
    * share
    * _Partials_
        * feed
        * song-details


* **View Controllers**
    * song
    * user
    * feed


* **Other Classes**
  * tbd


#### Data models
* User
    * \_id - ObjectId
    * spotifyUserID - String
    * username - String
    * following - array of ObjectIds


* Song
    * \_id - ObjectId
    * spotifySongID - String
    * userID - ObjectId
    * mentionId - ObjectId
    * privacy - Number - 0: Global, 1: Friends, 2: UsertoUser


----

### MVP Milestones
[The overall milestones of first usable build, core features, and polish are just suggestions, plan to finish earlier if possible. The last 20% of work tends to take about as much time as the first 80% so do not slack off on your milestones!]

#### Sprint 1 (Day 1)

* ~~Defining the MVP:~~
    * ~~Develop this guide~~
    * ~~Doesn't have to completely finished~~
* ~~Setup environment~~
* ~Explore the Spotify API~
* CRUD songs
    * ~Create~
    * ~Read~
    * Destroy


#### Sprint 2 (Day 2)
_finishing a usable build_
* [goals for the day]

#### Sprint 3 (Day 3)
* [goals for the day]

#### Sprint4 (Day 4)
* [goals for the day, should be finishing all core features]

#### Sprint 5 (Day 5)
_starting the polish_
* [goals for the day]
