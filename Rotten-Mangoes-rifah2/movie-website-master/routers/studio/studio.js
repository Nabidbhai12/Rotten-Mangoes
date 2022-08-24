const express = require('express')
const DB_studio = require('../../DB_codes/DB_studio')
const router = express.Router({ mergeParams: true })


// '/studio'
//All done.no error.
router.get('/', async (req, res) => {
    //database query
    const studios = await DB_studio.getAllStudios();
    //error checking
    const data = {
        pageTitle: 'Studios',
        isAuth: req.session.isAuth,
        username: req.session.userid,

        studios
    }
    res.render('studios', data)
})

router.get('/:studio_name', async (req, res) => {
    const studio_name = req.params.studio_name;
    //database query
    const studio = await DB_studio.getStudioByName(studio_name);
    const movies = await DB_studio.getMoviesByStudio(studio_name);
    //error checking
    if (!studio) {
        return res.redirect('/error');
    }
    const data = {
        pageTitle: 'Studio',
        isAuth: req.session.isAuth,
        username: req.session.userid,

        studio,
        movies
    }
    res.render('studio', data);
})

module.exports = router