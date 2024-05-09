class AppError {
    constructor(message,statusCode){
        this.message=message
        this.statusCode=statusCode
        this.status='Fail'
    }
    

}

module.exports = AppError