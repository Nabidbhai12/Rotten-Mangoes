const express = require('express')
const DB_movie = require('../../DB_codes/DB_movie')
const DB_review = require('../../DB_codes/DB_review')
const DB_watchlist = require('../../DB_codes/DB_watchlist')
const DB_rating = require('../../DB_codes/DB_rating')
const router = express.Router({ mergeParams: true })

// /anime router
router.get('/:id', async (req, res) => {
    const movie_id = req.params.id;
    const username = req.session.username;

    const movie = await DB_movie.getMoviesById(movie_id);
    const genres = await DB_movie.getGenresById(movie_id);
    const director = await DB_movie.getDirectorByID(movie.directors_ssn);
    const characters = await DB_movie.getActorsById(movie_id);

    const watchlistData = await DB_watchlist.getWatchlistRowOfUserAndMovie(username, movie_id);
    const favlistData=await DB_watchlist.getFavouriteslistOfUser(username,movie_id)
    const usersWatchlisted = await DB_watchlist.getCountWatchlisted(movie_id);
    const usersFavourited = await DB_watchlist.getCountFavourited(movie_id);
    const isAddedToWatchlist = watchlistData ? true : false;
    const isAddedTofav=favlistData?true:false;

    const isAddedToFavouriteList = (isAddedTofav) ? true : false;
    const userRating = await DB_rating.getUsersRatingOfMovie(username, movie_id);
    const userRatedThisMovie = userRating ? true : false;

    const data = {
        pageTitle: 'Shows',
        isAuth: req.session.isAuth,
        username: req.session.userid,

        movie,
        genres,
        director,
        characters,

        watchlistData,
        isAddedToWatchlist,
        isAddedToFavouriteList,
        usersWatchlisted,
        usersFavourited,

        userRating,
        userRatedThisMovie
    }
    //cleanup and stuff
    {
        if (!movie) return res.redirect('/error');
     //   await DB_rating.updateAnimeRating(anime_id);
       // await DB_rating.updateAllAnimeRank();
    }
    res.render('movie', data)
})



router.get('/:id/reviews', async (req, res) => {
    const movie_id = req.params.id;
    const user = req.session.username;

    const reviews = await DB_review.getAllReviewsWithUserVotes(movie_id, user);
    const userReview = await DB_review.getUserReview(user, movie_id);
    const movie_title = (await DB_movie.getMoviesById(movie_id)).title

    let userReviewContent = "";
    if (userReview) userReviewContent = userReview.CONTENT;

    //console.log(reviews)

    const data = {
        pageTitle: 'Reviews',
        isAuth: req.session.isAuth,
        username: req.session.username,

        reviews,
        userReview,
        userReviewContent,
        movie_id,
        movie_title
    }
    res.render('review', data);
})



router.post('/:id/reviews', async (req, res) => {
    const movie_id = req.params.id
    const reviewContent = req.body.Content
    const user = req.body.username

    if (!req.session.isAuth) return res.redirect('/login');

    const userReview = await DB_review.getUserReview(user, movie_id);

    if (!userReview) {
        const inserted_review_id = await DB_review.insertReview(reviewContent); //This line inserts the new review. reID returns the REVIEW_ID of the new row
        //const handle_reviewed = await DB_review.insertIntoReviewRelation(user, anime_id, inserted_review_id)
    } else if (userReview) {
        const review_id = userReview.review_id;
        await DB_review.updateReview(review_id, reviewContent)
    }

    res.redirect('/movie/' + movie_id + '/reviews');
})


router.post('/:movie_id/reviews/delete', async (req, res) => {
    const { username, movie_id } = req.body;

    const remove_review_id = await DB_review.removeReviewFromReviewed(username, movie_id);
    //const remove_review = await DB_review.removeReview(remove_review_id);

    res.redirect('/movie/' + movie_id + '/reviews');
})



router.post('/:movie_id/reviews/:review_id/vote', async (req, res) => {
    const movie_id = req.params.movie_id;
    const {  review_id,username, comments } = req.body;

        //insert vote
        await DB_review.insertVote(username, review_id, comments);
        await DB_review.incrementVoteinReview(review_id);

        //delete vote
  //      await DB_review.deleteVote(username, review_id);
    //    await DB_review.decrementVoteinReview(review_id);

    res.redirect('/movie/' + anime_id + '/reviews');
})


router.post('/:id/rating/post', async (req, res) => {
    const { username,  stars,movie_id } = req.body;

    const userMovieRatingData = await DB_rating.getUsersRatingOfMovie(username, movie_id);

    if (!userAnimeRatingData) {
        await DB_rating.insertRating(username, movie_id, stars);
    } else {
        await DB_rating.updateRating(username, movie_id, stars);
    }
    //await DB_rating.u(movie_id);
    //await DB_rating.updateAllAnimeRank();
    res.redirect('/movie/' + anime_id);
})


/*router.get('/:movie_id/characters/:charactername', async (req, res) => {
    const movie_id = req.params.movie_id;
    const characterFirstname = req.params.charactername.split("_")[0];
    const characterlastname = req.params.charactername.split("_")[1];

    //database query
    const character = await DB_movie.g(anime_id, characterFirstname, characterlastname);
    if (!character) res.redirect('/error')
    const data = {
        pageTitle: 'Character',
        isAuth: req.session.isAuth,
        username: req.session.userid,

        character
    }
    res.render('characterprofile', data)
})*/


router.get('/:id/episodes', async (req, res) => {
    const movie_id = req.params.id;
    //database query
    const numSeasons = await DB_movie.getNumberOfSeasons(movie_id);
    //const episodes = await DB_anime.getEpisodesOfAnime(anime_id);
    //error checking
    const data = {
        pageTitle: 'Episodes',
        isAuth: req.session.isAuth,
        username: req.session.userid,

        //episodes,
        numSeasons
    }
    res.render('episodes', data)
})



module.exports = router