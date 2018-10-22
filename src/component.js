export default (text = HELLO) => {
    const element = document.createElement("div");

    element.className = "pure-button";
    element.innerHTML = text;
    console.log(text);

    element.onclick = () => import("./lazy")
        .then(lazy => {
            element.textContent = lazy.default;
        })
        .catch(err => {
            console.error(err);
        });

    return element;
};