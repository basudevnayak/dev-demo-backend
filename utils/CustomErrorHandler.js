class CustomErrorHandler extends Error {
    constructor(status, msg) {
        super(msg);
        this.status = status;
        this.message = msg;
    }

    // Error handler methods for specific cases
    static alreadyExist(message) {
        return new CustomErrorHandler(409, message || 'This resource already exists.');
    }

    static wrongCredentials(message = 'Username or password is wrong!') {
        return new CustomErrorHandler(401, message);
    }

    static unAuthorized(message = 'Unauthorized access.') {
        return new CustomErrorHandler(401, message);
    }

    static notFound(message = '404 Not Found') {
        return new CustomErrorHandler(404, message);
    }

    static serverError(message = 'Internal server error') {
        return new CustomErrorHandler(500, message);
    }
}

export default CustomErrorHandler;
