const split = require('split-string-words');

function filterArticles(text, articles) {
    let tokens = split(text.toLowerCase()).filter(token => token.length > 0);

    if (tokens.length === 0) {
        return articles;
    }

    let foundArticles = [];

    function updateFoundArticles(searchResults, weighting) {
        let res, entry;
        for(let i = 0, ii = searchResults.length; i < ii; i++) {
            res = searchResults[i];

            // look for record in foundArticles - if found update its weighting otherwise add new entry
            entry = foundArticles.find(a => a._id === res._id);
            if (entry) {
                entry.weighting += weighting;
            } else {
                foundArticles.push({ _id: res._id, weighting: weighting, article: res });
            }
        }
    }

    let token;
    for(let i = 0, ii = tokens.length; i < ii; i++) {
        token = tokens[i];

        // search by title
        updateFoundArticles(articles.filter(a => a.title.toLowerCase().indexOf(token) >= 0), 3);

        // search by description
        updateFoundArticles(articles.filter(a => a.description.toLowerCase().indexOf(token) >= 0), 1);

        // search by category
        updateFoundArticles(articles.filter(a => a.categories.some(c => c.name.toLowerCase() === token)), 2);
    }

    return foundArticles.sort((a, b) => b.weighting - a.weighting).map(a => a.article);
}

module.exports = filterArticles;
