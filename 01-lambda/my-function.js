exports.greet = (evt, context, callback) => {
    console.log("Hola a todos")

    callback(null, { message: "Function ran successfully" })

    /* return {
        statusCode: 200,
        body: "Hola mundo"
    } */
}