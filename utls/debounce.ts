function debounce(functn: any, wait: number) {
    let timer: any;
    return function(...args: any) {
        if (timer) {
            clearTimeout(timer);
        }
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const context = this;
        timer = setTimeout(() => {
            functn.apply(context, args);
        }, wait);
    };
}

export default debounce;
