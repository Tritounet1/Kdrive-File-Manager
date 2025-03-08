export const checkConnection = async () => {

    await require('dns').resolve('www.google.com', function (err) {
        if (err) {
            return false;
        } else {
            return true;
        }
    });
    return true;
}
