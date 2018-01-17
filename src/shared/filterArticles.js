const split = require('split-string-words');

function filterArticles(text, articles) {
    let tokens = split(text.toLowerCase()).filter(token => token.length > 0);

    if (tokens.length === 0) {
        return articles;
    }

    // Function created here so the Webpack Hot Dev Client doesn't warn about creating functions inside loops!
    const articleByTextFinder = (text, property, article) => {
        return article[property].toLowerCase().indexOf(text) >= 0;
    };
    const articleByCategoryFinder = (text, article) => articles.categories ? article.categories.some(category => category.name.toLowerCase() === text) : false;
    const resultFinder = (result, article) => {
        return article._id === result._id;
    };

    let foundArticles = [];

    let token;
    for(let i = 0, ii = tokens.length; i < ii; i++) {
        token = tokens[i];

        // search by title
        updateFoundArticles(articles.filter(articleByTextFinder.bind(this, token, 'title')), 3);

        // search by description
        updateFoundArticles(articles.filter(articleByTextFinder.bind(this, token, 'description')), 1);

        // search by category
        updateFoundArticles(articles.filter(articleByCategoryFinder.bind(this, token)), 2);
    }

    return foundArticles.sort((a, b) => b.weighting - a.weighting).map(a => a.article);

    // Helper function to collate the found articles and update the respective weightings
    // Directly modifies the "foundArticles" array - this is why the function is defined inside the calling function.
    function updateFoundArticles(searchResults, weighting) {
        let res, entry;
    
        // Function created here so the Webpack Hot Dev Client doesn't warn about creating functions inside loops!
    
        for(let i = 0, ii = searchResults.length; i < ii; i++) {
            res = searchResults[i];
    
            // look for record in foundArticles - if found update its weighting otherwise add new entry
            entry = foundArticles.find(resultFinder.bind(this, res));
            if (entry) {
                entry.weighting += weighting;
            } else {
                foundArticles.push({ _id: res._id, weighting: weighting, article: res });
            }
        }
    }
}

module.exports = filterArticles;
