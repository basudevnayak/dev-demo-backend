document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".sidebar .nav-link");
  const sections = document.querySelectorAll(".content-section");
  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      sections.forEach(section => section.classList.add("d-none"));
      const targetSection = link.getAttribute("data-section");
      document.getElementById(targetSection + "-section").classList.remove("d-none");
      const form = document.getElementById("createPolicyForm");
      form.reset();
      if (targetSection === "policies") loadPoliciesTable();
      if (targetSection === "my-policies") loadMyPolicies();

      closeMobileSidebar();
    });
  });

  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  // sidebarToggle.addEventListener("click", () => {
  //   sidebar.classList.toggle("active");
  //   sidebarToggle.classList.toggle("show");
  //   sidebarToggle.classList.toggle("show");
  // });
  // overlay.addEventListener("click", closeMobileSidebar);
  // function closeMobileSidebar() {
  //   console.log(sidebar.classList)
  //   sidebar.classList.remove("show");
  //   // overlay.classList.remove("show");
  // }
});



const links = document.querySelectorAll('.sidebar .nav-link');

links.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault(); // stop page reload
    const section = link.getAttribute('data-section');

    // 🔹 Remove active class from all links
    links.forEach(l => l.classList.remove('active'));

    // 🔹 Add active class to clicked link
    link.classList.add('active');

    // 🔹 Show the corresponding section
    showSection(section);
  });
});

function showSection(section) {
  const token = localStorage.getItem('token');
  if (token == "" || token ==null) {
    window.location.href = '/';
  }
  document.querySelectorAll('.content-section').forEach(sec => {
    sec.style.display = "none";
  });
  const target = document.getElementById(section + "-section");
  if (target) {
    target.style.display = "block";
  }
}


document.getElementById('logoutBtn').addEventListener('click', async (e) => {
  e.preventDefault();
  try {
    const refreshToken = localStorage.getItem('token');
    const response = await fetch('/api/deleteUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (response.ok) {
      localStorage.removeItem('token');
      localStorage.removeItem('token');
      window.location.href = '/';
    } else {
      console.error('Logout failed:', await response.json());
      alert('Failed to log out. Please try again.');
    }
  } catch (error) {
    console.error('Error during logout:', error);
    alert('An error occurred during logout.');
  }
});
