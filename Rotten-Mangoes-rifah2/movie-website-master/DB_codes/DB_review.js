var oracledb = require('oracledb');
oracledb.autoCommit=true;
const database = require('./database')

async function insertIntoTest(id) {
    let sql = `
        INSERT INTO TEST VALUES(:sid) RETURNING id INTO: ids 
    `
    const binds = {
        sid: id,
        ids: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
    }
    return (await database.execute(sql, binds, database.options)).outBinds
}

async function getAllReviewsOf(id) {
    let sql = `
        SELECT *
    FROM "C##MOVIE_DATABASE"."Review"
where "show_id"=:id
    `
    return (await database.execute(sql, [id], database.options)).rows
}
async function getAllReviewsFromTitle(title) {
    let sql = `
        SELECT *
    FROM "C##MOVIE_DATABASE"."Review"
where "Title"=:title
    `
    return (await database.execute(sql, [id], database.options)).rows
}
//gets all reviews where our user commented
async function getAllReviewsWithUserVotes(id, username) {
    let sql = `
        SELECT *
        FROM "C##MOVIE_DATABASE"."Review" NATURAL JOIN "C##MOVIE_DATABASE"."Voted"
        Where "show_id"=:id and "Username"=:username
        
    `
    return (await database.execute(sql, [id, username], database.options)).rows
}

async function getUserReview(username,id) {
    let sql = `
        SELECT * FROM "C##MOVIE_DATABASE"."Review"
        WHERE "Username"=:username and "show_id"=:id
    `
    return (await database.execute(sql, [username, id], database.options)).rows[0]
}


async function getAllUserReview(username) {
    let sql = `
        SELECT * FROM "C##MOVIE_DATABASE"."Review"
        WHERE "Username"=:username
    `
    return (await database.execute(sql, [username], database.options)).rows
}



//this function will enter new review into the DB and return the NEW REVIEW_ID
async function insertReview(reviewContent,username) {
    Id=(Math.random()*100)
    Id=Math.floor(Id)
    console.log("from database"+reviewContent)
    let sql = `
        INSERT INTO "C##MOVIE_DATABASE"."Review" ("Review_id","Date","Content", "Votes","Username") 
        VALUES(:ID,SYSDATE,:content,0,:username) 
        RETURNING "Review_id" INTO :retID
    `

    const binds = {
        content: reviewContent,
        ID:Id,
        username:username,
        retID: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
    }

    return (await database.execute(sql, binds, database.options)).outBinds.retID[0]
}

async function updateReview(review_id, content) {
    let sql = `
        UPDATE "C##MOVIE_DATABASE"."Review" SET "Content" = :CONTENT WHERE "Review_id" = :review_id
    `
    return (await database.execute(sql, [content, review_id], database.options))
}

//has problems
async function removeReviewFromReviewed(username, id) {
    let sql = `
        DELETE FROM "C##MOVIE_DATABASE"."REVIEW" 
            WHERE "Username" = :username AND "Review_id"=:id    
            `
    return (await database.execute(sql, [id], database.options))
}

async function removeReview(review_id) {
    let sql = `
        DELETE 
        FROM REVIEW
        WHERE REVIEW_ID = :review_id
    `
    return (await database.execute(sql, [review_id], database.options))
}
async function getReview(review_id) {
    let sql = `
        SELECT *
        FROM "C##MOVIE_DATABASE"."Review"
        WHERE "Review_id" = :review_id
    `
    return (await database.execute(sql, [review_id], database.options)).rows[0]
}

/*async function insertIntoReviewRelation(user, review_id) {
    let sql = `
        INSERT INTO REVIEWED(USERNAME, ANIME_ID, REVIEW_ID)
        VALUES(:USERNAME, :ANIME_ID, :REVIEW_ID)
    `
    return await database.execute(sql, [user, anime_id, review_id], database.options)
}*/


async function insertVote(username, review_id, comments) {
    let sql = `
        INSERT INTO VOTED( REVIEW_ID,USERNAME, COMMENTS)
        VALUES(:USERNAME, :REVIEW_ID, :COMMENTS)
    `
    return (await database.execute(sql, [username, review_id, comments], database.options)).rows
}

async function deleteVote(username, review_id) {
    let sql = `
        DELETE
        FROM VOTED
        WHERE USERNAME = :USERNAME AND REVIEW_ID = :REVIEW_ID
    `
    return (await database.execute(sql, [username, review_id], database.options)).rows
}

async function incrementVoteinReview(review_id) {
    const x='1'
    const name=review_id
    console.log("DB END")
    let sql = `
        UPDATE "C##MOVIE_DATABASE"."Review"
        SET "Votes" = :x
        WHERE "Review_id" = :name
    `
    return await database.execute(sql, [name,x], database.options)
}
async function incrementVote(review_id) {
    const x="eto pera kenno"
    const y="1"
    const z=review_id
    console.log("DB END")
    let sql = `
        UPDATE "C##MOVIE_DATABASE"."Review"
        SET "Votes"=:y
WHERE "Review_id"=:z
    `
    return await database.execute(sql, [y,z], database.options)
}


async function decrementVoteinReview(review_id) {
const x="0"
    let sql = `
        UPDATE "C##MOVIE_DATABASE"."Review"
        SET "Votes" = : x
        WHERE "Review_id" = :REVIEW_ID
    `
    return await database.execute(sql, [x,review_id], database.options)
}



module.exports = {
    insertIntoTest,
    insertReview,
    updateReview,
    removeReview,
    removeReviewFromReviewed,
    getAllReviewsOf,
    getAllReviewsWithUserVotes,
    getUserReview,
    getAllUserReview,
    //insertIntoReviewRelation,
    insertVote,
    deleteVote,
    incrementVoteinReview,
    decrementVoteinReview,
    getReview,
    incrementVote
}