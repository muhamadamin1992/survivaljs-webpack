export default (text = "Hello world") => {
    const element = document.createElement("div");

    element.className = "pure-button";
    element.innerHTML = text;

    element.onclick = () => import("./lazy")
        .then(lazy => {
            element.textContent = lazy.default;
        })
        .catch(err => {
            console.error(err);
<<<<<<< HEAD
        });
=======
        })
>>>>>>> 6226ea94227f05c85f5339f47b3ed5b2290cb335

    return element;
};