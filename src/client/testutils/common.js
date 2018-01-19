export const createDummyAction = () => {
    return {
        type: 'ANY_ACTION',
        payload: 'dummy payload'
    };
};

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const toBase26 = (num, len = 5) => {

    let chars = [];
    while(num !== 0) {
        chars.unshift(letters.charAt(num % 26));
        num = Math.floor(num / 26);
    }
    if (chars.length === 0) {
        chars.push('A');
    }
    while(chars.length < len) {
        chars.unshift('A');
    }
    return chars.join('');
}
