"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uploadEmptyField = (req, res, next) => {
    // const {title, description} = req.body;
    // if(!title || !description){
    //     const str= !title && !description? 'Description and title':
    //             !title? 'Title':
    //             !description? 'Description': '';
    //     return res.status(400).json({status: 'error', message: `${str} can't be empty`})
    // }
    next();
};
exports.default = uploadEmptyField;
