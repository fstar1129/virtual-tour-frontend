import Vue from 'vue';

Vue.filter('capitalize', value => {
    if (!value) return '';
    value = value.toString();
    return value.charAt(0).toUpperCase() + value.slice(1);
});

Vue.filter('nl2br', value => {
    return value.toString().replace(/(?:\r\n|\r|\n)/g, '<br />');
});

Vue.filter('minsec', s => {
    s = parseFloat(s);
    if (s == NaN) {
        return '0:00';
    }

    return (s - (s %= 60)) / 60 + (s >= 10 ? ':' : ':0') + Math.floor(s);
})
