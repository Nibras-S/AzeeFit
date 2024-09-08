const {constants} = require("../constants/errors")
const errorHandler = (err,req,res,next)=> {
const statusCode = res.statusCode ? res.statusCode : 500;
    switch (statusCode) {
        case constants.NOT_FOUND :
            res.json({title:"Not Found",message : err.message, stackTrace : err.stack});
            break;
        case constants.FORBIDDEN :
            res.json({title:"Forbidden",message : err.message, stackTrace : err.stack});
            break;
        case constants.UNAUTHORISED :
                res.json({title:"Unauthorised",message : err.message, stackTrace : err.stack});
                break;
        case constants.VALIDATION_ERROR :
                 res.json({title:"vaalidation error",message : err.message, stackTrace : err.stack});
                break;
        default:
            console.log("No error all set");
            break;
    }
};
module.exports= errorHandler;