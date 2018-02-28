export const domain = (() => {
    let domain = 'http://localhost:7001';

    if (window.location.href.indexOf('刘腊梅.我爱你') !== -1) {
        domain = 'https://xn--2brq06crqr.xn--6qq986b3xl/api';
    }
    return domain;
})();