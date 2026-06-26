document.getElementById("btnLogin").addEventListener("click", function () {
  let username = document.getElementById("username").value.trim();
  let password = document.getElementById("password").value.trim();
  let errorBox = document.getElementById("error");

  errorBox.innerText = "";

  if (!username) {
    errorBox.innerText = "Vui lòng nhập username!";
    return;
  }

  if (!password) {
    errorBox.innerText = "Vui lòng nhập password!";
    return;
  }

  fetch("index.php?controller=login&action=handleLogin", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `username=${encodeURIComponent(
      username
    )}&password=${encodeURIComponent(password)}`,
  })
    .then((res) => res.text())
    .then((data) => {
      data = data.trim();

      if (data === "ADMIN") {
        window.location.href = "index.php?controller=reports&action=index";
      } else if (data === "USER") {
        window.location.href = "index.php?controller=trangchu&action=index";
      } else {
        errorBox.innerText = data;
      }
    })
    .catch(() => {
      errorBox.innerText = "Không kết nối được server!";
    });
});
