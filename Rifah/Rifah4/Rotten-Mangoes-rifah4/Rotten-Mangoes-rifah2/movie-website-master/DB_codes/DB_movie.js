const database = require('./database')

async function getRandomSeries()
{
    let sql=`
    SELECT *
    FROM "C##MOVIEDATABASE"."Tv_series"
    fetch NEXT 4 ROWS ONLY 
    `
    return (await database.execute(sql,[],database.options)).rows
}
async function getRandomShow()
{
    let sql=`
    SELECT *
    FROM "C##MOVIEDATABASE"."Show"
     
    `
    return (await database.execute(sql,[],database.options)).rows
}
async function getMoviesByID(id) {
    let sql = `
        SELECT 
        *
        FROM "C##MOVIEDATABASE"."Movies" natural join "C##MOVIEDATABASE"."Show" 
        WHERE "Id"=:id 
    `
    return (await database.execute(sql, [id], database.options)).rows[0]
}
async function getShowsByID(id) {
    let sql = `
        SELECT *
        
        FROM "C##MOVIEDATABASE"."Show"
        WHERE "Id"=:id 
    `
    return (await database.execute(sql, [id], database.options)).rows[0]
}


async function getMoviesByREGEX(string) {
    let sql = `
    SELECT    *
    FROM    "C##MOVIEDATABASE"."Movies" 
                WHERE LOWER("Title") LIKE '${string[0]}'`
    for (let i = 1; i < string.length; i++) {
        sql += ` AND LOWER("TITLE") LIKE '${string[i]}'`;
    }
    return (await database.execute(sql, [], database.options)).rows
}


async function getGenresById(id) {
    let sql = `
        SELECT "Gnere" 
        FROM  "C##MOVIEDATABASE"."Show"
              WHERE "Id"=:id
    `
    return (await database.execute(sql, [id], database.options)).rows
}
async function getActorsById(id) {
    let sql = `
        SELECT "Name" FROM  "C##MOVIEDATABASE"."Show" natural join "C##MOVEIDATABASE"."ActedBy" Natural join "C##MOVIEDATABASE"."Actors" 
                    WHERE "Id"=:id
    `
    return (await database.execute(sql, [id], database.options)).rows
}
async function getDirectorByID(PERSONNEL_ID) {
    let sql = `
        SELECT * FROM "C##MOVIEDATABASE"."Directors" WHERE "SSN" = :PERSONNEL_ID
    `
    return (await database.execute(sql, [PERSONNEL_ID], database.options)).rows[0]
}

async function getStudioName(id) {
    let sql = `
        SELECT "Studio_name" FROM  "C##MOVIEDATABASE"."Show" WHERE "Id"=:id
    `
    return (await database.execute(sql, [id], database.options)).rows[0]
}
async function getAllActors()
{
    let sql=`
    SELECT *
    FROM "C##MOVIEDATABASE"."Actor"
    `
    return (await database.execute(sql,[],database.options)).rows
}
async function getAllDirectors()
{
    let sql=`
        SELECT *
        FROM "C##MOVIEDATABASE"."Directors"

    `
    return (await database.execute(sql,[],database.options)).rows
}



async function getAllMoviesTitleAndID() {
    let sql = `
           SELECT *
        FROM "C##MOVIEDATABASE"."Movies"
    `
    return (await database.execute(sql, [], database.options)).rows
}
async function getAllTvSeriesTitleAndID() {
    let sql = `
           SELECT *
           FROM "C##MOVIEDATABASE"."Tv_series" natural join "C##MOVIEDATABASE"."Show"
    `
    return (await database.execute(sql, [], database.options)).rows
}

/*async function getMoviesByGenreAndOrYear(genres, years) {
    let sqlgenre = `
        SELECT TITLE FROM MOVIES WHERE GENRE = '${genres[0]}'`;
    for (let i = 1; i < genres.length; i++) {
        sqlgenre += `
        INTERSECT
        (SELECT TITLE FROM MOVIES WHERE GENRE = '${genres[i]}')`;
    }
    if (years && years.length > 0) {
        sqlgenre += `and (TO_CHAR(RELEASE_DATE, 'YYYY') = ${years[0]}`
        for (let i = 1; i < years.length; i++) {
            sqlgenre += ` or TO_CHAR(RELEASE_DATE, 'YYYY') = ${years[i]}`
        }
        sqlgenre += `)`
    }
    return (await database.execute(sql, [], database.options)).rows;
}
*/

async function getMoviesByYear(years) {
    if (years.length == 0) return console.log("no years found")

    let sql = `
        SELECT * 
        FROM "C##MOVIEDATABASE"."Movies" 
        WHERE TO_CHAR(RELEASE_DATE, 'YYYY') = ${years[0]}`
    for (let i = 1; i < years.length; i++) {
        sql += ` OR TO_CHAR(RELEASE_DATE, 'YYYY') = ${years[i]}`
    }
    return (await database.execute(sql, [], database.options)).rows
}

async function sortMoviesByRelease(){
    let sql = `
         SELECT *
        FROM "C##MOVIEDATABASE"."Movies"
        ORDER BY "Release_Date" DESC 
    `
    return (await database.execute(sql, [], database.options)).rows
}
async function sortTvseriesByRelease(){
    let sql = `
         SELECT *
        FROM "C##MOVIEDATABASE"."Tv_series"
        ORDER BY "Release_Date" DESC 
    `
    return (await database.execute(sql, [], database.options)).rows
}

async function getAllGenres() {
    let sql = `
        SELECT DISTINCT "Genre"
        FROM  "C##MOVIEDATABASE"."Show"
    `
    return (await database.execute(sql, [], database.options)).rows
}

async function getMoviesTitleandIDByOneGenre(genre) {
    let sql = `
        SELECT *
        FROM "C##MOVIEDATABASE"."Show"
        WHERE GENRE = '${genre}'
    `
    return (await database.execute(sql, [], database.options)).rows
}











/*async function updateMovieRating(anime_id) {
    let sql = `
    BEGIN
	    UPDATE_ANIME_RATING(:ANIME_ID);
    END;
    `
    return (await database.execute(sql, [anime_id], database.options)).rows
}*/



/*async function getCharactersOfAnime(anime_id) {
    let sql = `
        SELECT FIRST_NAME, LAST_NAME, PICTURE_ID, VOICE_ACTOR_ID,
        (SELECT V.FIRST_NAME||' '||V.LAST_NAME FROM VOICE_ACTOR V WHERE V.PERSONNEL_ID = C.VOICE_ACTOR_ID) AS VA_NAME
        FROM CHARACTER C
        WHERE ANIME_ID = :ANIME_ID
    `
    return (await database.execute(sql, [anime_id], database.options)).rows
}*/

/*async function getCharacterByName(anime_id, name) {
    let sql = `
        select
    `
    return (await database.execute(sql, [anime_id, first_name, last_name], database.options)).rows[0]
}*/


async function getNumberOfSeasons(Title,Release_date) {
    let sql = `
        SELECT Number_of_seasons
        FROM "C##MOVIEDATABASE"."Tv_series"
        WHERE Title=:Title and Release_date=:Release_date
    `
    return (await database.execute(sql, [anime_id], database.options)).rows[0]
}
async function getActorbyid(ssn)
{
    let sql=`
    SELECT *
    FROM "C##MOVIEDATABASE"."Actor"
    WHERE "SSN"=:ssn
    `
    return (await database.execute(sql, [ssn], database.options)).rows[0]
}
async function getDirectorbyid(ssn)
{
    let sql=`
    SELECT *
    FROM "C##MOVIEDATABASE"."Directors"
    WHERE "SSN"=:ssn
    `
    return (await database.execute(sql, [ssn], database.options)).rows[0]

}
async function getTopMovies()
{


}



module.exports = {
    sortTvseriesByRelease,
    getMoviesByID,
    getShowsByID,
    getMoviesByREGEX,
    getGenresById,
    getDirectorByID,
    getAllMoviesTitleAndID,
    getAllGenres,
    //getMoviesByGenreAndOrYear,
    getMoviesByYear,
    getMoviesTitleandIDByOneGenre,

    //getCharactersOfAnime,
    //getCharacterByName,
    getNumberOfSeasons,

    getRandomSeries,
    getRandomShow,
    sortMoviesByRelease,
    getAllActors,
    getAllDirectors,
    getActorbyid,
    getDirectorbyid,
    getAllTvSeriesTitleAndID
}