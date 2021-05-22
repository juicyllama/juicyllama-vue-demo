export function stripHTML(string) {

    if (typeof (string) == 'undefined') {
        return '';
    }

    string = string.replace(/<iframe .*?>/g, "");
    string = string.replace(/<img .*?>/g, "");
    string = string.replace(/(<([^>]+)>)/gi, "");
    return string
}