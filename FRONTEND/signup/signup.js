const form = document.querySelector(".signup-form");


form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    if (username.length > 12) {
        alert("Username cannot be greater than 12");
        document.querySelector("#username").value = "";
        document.querySelector("#password").value = "";
        return;
    }

    if (password.length < 6) {
        alert("Password Length cannot be smaller than 6");
        document.querySelector("#username").value = "";
        document.querySelector("#password").value = "";
        return;
    }

    try {
        const response = await axios.post('http://localhost:3000/signup', {
            username: username,
            password: password
        });

        const { data, status } = response;
        if (status === 201) {
            alert(data.message);
        }
        form.style.display = "none";
        document.querySelector(".result-div").style.display = "block";
    } catch (error) {
        if (error.response) {
            if (error.response.status === 409) {
                alert('user with username already exists.');
            } else if (error.response.status === 400) {
                alert('Invalid input data.');
            } else {
                alert('Server error. Please try again later.');
            } 
            document.querySelector("#username").value = "";
            document.querySelector("#password").value = "";
        } else if (error.request) {
            alert("Failed to make a request. Please chack your network.");
            document.querySelector("#username").value = "";
            document.querySelector("#password").value = "";
        } else {
            alert("Some error occured " + error.message);
            document.querySelector("#username").value = "";
            document.querySelector("#password").value = "";
        }
    }
})