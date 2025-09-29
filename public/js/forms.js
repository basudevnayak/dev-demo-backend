document.addEventListener("DOMContentLoaded", () => {
  const createForm = document.getElementById("createPolicyForm");
  const quickForm = document.getElementById("quickAddForm");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (createForm) {
    createForm.addEventListener("submit", e => {
      e.preventDefault();
      handleCreatePolicy();
    });
  }

  if (quickForm) {
    document.getElementById("saveQuickPolicy").addEventListener("click", handleQuickAdd);
  }

  if (loginForm) {
    loginForm.addEventListener("submit", e => {
      e.preventDefault();
      handleLogin();
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", e => {
      e.preventDefault();
      handleRegister();
    });
  }
});
