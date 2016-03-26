/**
 * This module reopens issues that are resolved as "Awaiting Response"
 * It only reopens when the issue was edited, or a comment was made by its author
 *
 * This file is part of ArisaJS
 */

"use strict";

var Module = require('../lib/module.class.js');
var log = require('../util/logger');


module.exports = class ModuleReopenAwaiting extends Module {
    constructor({config}) {
        super({config});
    }

    check({issue}) {

        return new Promise(function (resolve, reject) {
            let fields = issue.fields;
            let updated = new Date(fields.updated);
            let created = new Date(fields.resolutiondate);
            let creator = fields.reporter.name;

            if (fields.resolution !== null && (fields.resolution.name == 'Awaiting Response') && (updated - created) > 2000) {

                if (fields.comment.total > 0) {
                    let lastComment = fields.comment.comments[fields.comment.total - 1];
                    let commentAuthor = lastComment.author.name;
                    let commentDate = new Date(lastComment.created);

                    if (updated - commentDate < 2000 && (commentAuthor == creator)) issue.reopen();
                    else if (updated - commentDate > 2000) issue.reopen();
                }
            }
            resolve(null);
        });
    }
};