import {
    STATUS_FREE,
    STATUS_DEALING,
    STATUS_DEALED,
    STATUS_DELETED,
    isValidArticleStatus
} from '../../shared/constants/ArticleStatus';
import TestCategory from './TestCategory';

export default class TestArticle {
    constructor(id, title, description) {
        this._id = id;
        this.title = title;
        this.description = description;
        this.status = STATUS_FREE;
        this.categories = [];
    }

    setOwner(user) {
        this.owner = user;
        return this;
    }

    setStatus(status) {
        if (!isValidArticleStatus(status)) {
            throw new Error(`${status} is not a valid ArticleStatus`);
        }

        this.status = status;
        return this;
    }

    setDealed() {
        return this.setStatus(STATUS_DEALED);
    }

    setDealing() {
        return this.setStatus(STATUS_DEALING);
    }

    setDeleted() {
        return this.setStatus(STATUS_DELETED);
    }

    setFree() {
        return this.setStatus(STATUS_FREE);
    }

    addCategory(id, name) {
        if (this.categories.find(c => c._id = id)) {
            throw new Error(`A category with the id ${id} is already assignedto this article`);
        }

        this.categories.push(new TestCategory(id, name));
        return this;
    }
}