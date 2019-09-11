const express = require('express')
const uuid = require('uuid/v4')
const logger = require('../logger')
const bookmarks  = require('../store')

const bookmarksRouter = express.Router()
const bodyParser = express.json()

bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.json(bookmarks);
  })
  .post(bodyParser, (req, res) => {
    const { title, url, description } = req.body;

    if (!title) {
        logger.error(`title is required`);
        return res
        .status(400)
        .send('Invalid data');
    }

    if(!url) {
      logger.error("url is required");
      return res
      .status(400)
      .send('Invalid data')
    }

    const id = uuid();

    const bookmark = {
        id,
        title,
        url,
        description
    };

    bookmarks.push(bookmark);

    logger.info(`bookmark with id ${id} created`);

    res
    .status(201)
    .location(`http://localhost:8000/bookmark/${id}`)
    .json(bookmark);
})

bookmarksRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
    const { id } = req.params;
    const bookmark= bookmarks.find(b => b.id == id);

    // make sure we found a bookmark
    if (!bookmark) {
        logger.error(`bookmark with id ${id} not found.`);
        return res
        .status(404)
        .send('bookmark Not Found');
    }

    res.json(bookmark);
    })
    .delete((req, res) => {
        const { id } = req.params;

        const bookmarksIndex = bookmarks.findIndex(i => i.id == id);

        bookmarks.splice(bookmarksIndex, 1);

        logger.info(`Bookmark with id ${id} deleted.`);
        res
            .status(204)
            .end();
})

module.exports = bookmarksRouter