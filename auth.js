window.onload = function () {
  showLogin(); // Show login form by default when the page loads
};

function showLogin() {
  const formContainer = document.getElementById("form-container");

  // Clear the container content before inserting a new form
  formContainer.innerHTML = "";

  // Insert the login form
  formContainer.innerHTML = `
      <div class="form-box" id="login-box">
          <h2>Login</h2>
          <input type="text" id="Username" placeholder="Username" required>
          <input type="password" id="Password" placeholder="Password" required>
          <button onclick='login()'>Login</button>
          <p>Don't have an account? <a href="#" onclick="showauth()">Sign Up</a></p>
      </div>
  `;
}

function showauth() {
  const formContainer = document.getElementById("form-container");

  // Clear the container content before inserting a new form
  formContainer.innerHTML = "";

  // Insert the auth form
  formContainer.innerHTML = `
      <div class="form-box" id="auth-box">
          <h2>Sign Up</h2>
          <input type="text" id="auth-Username" placeholder="Username" required>
          <input type="email" id="auth-Email" placeholder="Email" required>
          <input type="password" id="auth-Password" placeholder="Password" required>
          <input type="password" id="auth-ConfirmPassword" placeholder="Confirm Password" required>
          <button onclick='auth()'>Sign Up</button>
          <p>Already have an account? <a href="#" onclick="showLogin()">Login</a></p>
      </div>
  `;
}

// Login function
function login() {
  const userID = document.getElementById("Username").value; // Get username from input
  const password = document.getElementById("Password").value; // Get password from input

  return new Promise((resolve, reject) => {
    new QWebChannel(qt.webChannelTransport, async function (channel) {
      let handler = channel.objects.handler;

      if (handler && typeof handler.login === "function") {
        try {
          console.log("Calling handler.login with:", userID, password);

          const result = await handler.login(userID, password);

          console.log("Result from handler.login:", result);

          if (result === "true") {
            // Redirect to index.html on successful login
            window.location.href = "index.html";
          }
        } catch (error) {
          console.error("Error during handler.login call:", error);
          alert("An error occurred during login. Please try again.");
          reject(error);
        }
      } else {
        const errorMsg =
          "Handler or handler.login is not defined or not a function.";
        console.error(errorMsg);
        alert(errorMsg);
        reject(new Error(errorMsg));
      }
    });
  });
}
function loginSuccess(empId, fullName) {
  console.warn();
  `Employee logged in: ID = ${empId}, Name = ${fullName}`;
  window.alert("Login Successful!");
  window.location.href = "index.html";
}

function auth() {
  const username = document.getElementById("auth-Username").value;
  const email = document.getElementById("auth-Email").value;
  const password = document.getElementById("auth-Password").value;
  const confirmPassword = document.getElementById("auth-ConfirmPassword").value;

  // You can add validation for password confirmation here

  // Call your backend auth logic here
  console.log("auth function called with:", username, email, password);
  // Perform fetch or another API call to sign up the user
}
