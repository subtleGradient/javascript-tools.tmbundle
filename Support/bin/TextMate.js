
exports.href = function(path, line, column){
    return "txmt://open?url=file://" + path + '&line='+line + '&column='+column
}
