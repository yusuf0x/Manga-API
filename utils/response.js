const json = (res, data) => {
    res.json({
        status: true,
        length:data.length,
        data,
    });
};

const errorJson = (res, error, status = 500) => {
    res.status(status).json({
        status: false,
        error: `Something went wrong: ${error}`,
    });
};

module.exports = {
    json,
    errorJson
}
