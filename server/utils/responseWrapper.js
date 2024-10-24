const successResponse = (statusCode,result) => {
    return {
        status:'OK',
        statusCode,
        result
    }
}

const errorResponse =(statusCode,message) => {
    return {
        status:'ERROR',
        statusCode,
        message
    }
}

module.exports ={
    successResponse,
    errorResponse
}