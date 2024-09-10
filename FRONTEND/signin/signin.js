const form = document.querySelector(".signin-form");

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    try {
        const response = await axios.post('http://localhost:3000/signin', {
            username: username,
            password: password
        })
        const { data, status } = response;
        if (status === 200) {
            localStorage.setItem("token", data.token);
            alert("User signed in successfully!!");
            form.style.display = "none";
            document.querySelector(".result-div").style.display = "block";
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 401) {
                alert("Input invalid credentials");
            } else if (error.response.status === 500) {
                alert("Request cannot be completed due to internal server error");
            } else {
                alert("Cannot process request due to some error");
            }
        } else if (error.request) {
            alert("Failed to make a request. Please chack your network.");
            document.querySelector("#username").value = "";
            document.querySelector("#password").value = "";
        } else {
            alert("Some error occured : " + error.message);
            document.querySelector("#username").value = "";
            document.querySelector("#password").value = "";
        }
    }
})