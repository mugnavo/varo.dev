export default (str: string) => {
    const regex =
        /<(?!<)\/?\b[a-z][a-z0-9]*\b[^>]*>|<\/\b[a-z][a-z0-9]*\b[^>]*>/gi;
    return str.replace(regex, (match) => {
        if (/<</g.test(match)) {
            return match.replace(/<|>/g, "");
        }
        return "";
    });
};
