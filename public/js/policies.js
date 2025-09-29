// function loadPoliciesTable() {
//   const tbody = document.getElementById("policiesTableBody");
//   tbody.innerHTML = "";
//   policies.forEach(policy => {
//     const row = document.createElement("tr");
//     const statusClass = policy.status === "Active" ? "bg-success" : policy.status === "Pending" ? "bg-warning" : "bg-danger";
//     row.innerHTML = `
//       <td>${policy.id}</td>
//       <td>${policy.holderName}</td>
//       <td>${policy.type}</td>
//       <td>${policy.premium.toLocaleString()}</td>
//       <td>${policy.company}</td>
//       <td><span class="badge ${statusClass}">${policy.status}</span></td>
//       <td>
//         <button class="btn btn-sm btn-primary me-1" onclick="viewPolicy('${policy.id}')"><i class="fas fa-eye"></i></button>
//         <button class="btn btn-sm btn-warning me-1" onclick="editPolicy('${policy.id}')"><i class="fas fa-edit"></i></button>
//         <button class="btn btn-sm btn-danger" onclick="deletePolicy('${policy.id}')"><i class="fas fa-trash"></i></button>
//       </td>
//     `;
//     tbody.appendChild(row);
//   });
// }
// loadPoliciesTable();
async function loadPoliciesTable() {
  const tbody = document.getElementById("policiesTableBody");
  const recentPoliciesTableBody = document.getElementById("recentPoliciesTableBody");
  const pendingPoliciesTableBody = document.getElementById("pendingPoliciesTableBody");
  tbody.innerHTML = "";
  recentPoliciesTableBody.innerHTML = "";
  pendingPoliciesTableBody.innerHTML = "";
  try {
    const res = await fetch("http://localhost:5000/api/policies", {
      method: "GET",
      credentials: "include", // ✅ important to send cookies
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch policies: " + res.status);
    }

    const data = await res.json();
    const policies = data.data || []; // API response { message, status, data }

    policies.forEach(policy => {
      // console.log("Policy:", policy);
      const row = document.createElement("tr");
      const statusClass =
        policy.status === "Active"
          ? "bg-success"
          : policy.status === "Pending"
            ? "bg-warning"
            : "bg-success";

      row.innerHTML = `
        <td>${policy.policyNumber}</td>
        <td>${policy.holderName}</td>
        <td>${policy.installmentFreq || "-"}</td>
        <td>${policy.planTerm?.toLocaleString() || 0}</td>
        <td>${policy.policyCompany}</td>
        <td><span class="badge ${statusClass}">${policy.status || "Active"}</span></td>
        <td>
          <button class="btn btn-sm btn-primary me-1" onclick="viewPolicy('${policy._id}')"><i class="fas fa-eye"></i></button>
          <button class="btn btn-sm btn-warning me-1" onclick="editPolicy('${policy._id}')"><i class="fas fa-edit"></i></button>
          <button class="btn btn-sm btn-danger" onclick="deletePolicy('${policy._id}')"><i class="fas fa-trash"></i></button>
        </td>
      `;
      tbody.appendChild(row);
    });


    const recentPolicies = policies.slice(-10).reverse(); // reverse if you want newest first
    recentPolicies.forEach(policy => {
      const rowRecent = document.createElement("tr");

      const statusClass =
        policy.status === "Active"
          ? "bg-success"
          : policy.status === "Pending"
            ? "bg-warning"
            : "bg-secondary"; // default for other statuses

      rowRecent.innerHTML = `
    <td>${policy.policyNumber}</td>
    <td>${policy.holderName}</td>
    <td>${policy.installmentFreq || "-"}</td>
    <td>${policy.planTerm?.toLocaleString() || 0}</td>
    <td>${policy.policyCompany}</td>
    <td><span class="badge ${statusClass}">${policy.status || "Active"}</span></td>
  `;
      recentPoliciesTableBody.appendChild(rowRecent);
    });





    // Render policies
    policies.forEach(policy => {
      const rowPending = document.createElement("tr");

      // Determine status class for styling
      let statusClass = "";
      if (policy.status === "Payment Due") statusClass = "status-pending";
      else if (policy.status === "Overdue") statusClass = "status-overdue";
      else statusClass = "status-active"; // default / active

      // Create row HTML
      rowPending.innerHTML = `
    <td>${policy.policyNumber}</td>
    <td>${policy.holderName}</td>
    <td>${policy.dueDate || "-"}</td>
    <td><span class="status-badge ${statusClass}">${policy.status}</span></td>
    
  `;
  // <td>
  //       ${policy.status === "Payment Due"
  //           ? `<button class="btn btn-success btn-sm">
  //               <i class="fas fa-check me-1"></i>Mark Paid
  //             </button>`
  //           : policy.status === "Overdue"
  //             ? `<button class="btn btn-danger btn-sm">
  //                 <i class="fas fa-envelope me-1"></i>Send Reminder
  //               </button>`
  //             : ""
  //         }
  //     </td>
      pendingPoliciesTableBody.appendChild(rowPending);
    });
  } catch (err) {
    console.error("Error loading policies:", err);
    recentPoliciesTableBody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Failed to load policies</td></tr>`;
  }
}


async function viewPolicy(id) {
  try {
    const res = await fetch(`http://localhost:5000/api/policies/${id}`, {
      method: "GET",
      credentials: "include"
    });
    const data = await res.json();
    if (res.ok) {
      const policy = data.data;
      // Populate form fields
      document.getElementById("policyNumber").value = policy.policyNumber;
      document.getElementById("holderName").value = policy.holderName;
      document.getElementById("agentName").value = policy.agentName;
      document.getElementById("policyCompany").value = policy.policyCompany;
      document.getElementById("createDate").value = policy.createDate?.substring(0, 10);
      document.getElementById("policyPremium").value = policy.policyPremium;
      document.getElementById("installmentFreq").value = policy.installmentFreq;
      document.getElementById("planTerm").value = policy.planTerm;
      document.getElementById("endDate").value = policy.endDate?.substring(0, 10);
      document.getElementById("userGmail").value = policy.userGmail;
      document.getElementById("update").value = id;
      goToSection("create-policy");
      // Save with PUT on submit
      // document.getElementById("createPolicyForm").onsubmit = async function (event) {
      //   event.preventDefault();
      //   const formData = new FormData(this);
      //   const policyData = Object.fromEntries(formData.entries());

      //   const updateRes = await fetch(`http://localhost:5000/api/policies/${id}`, {
      //     method: "PUT",
      //     credentials: "include",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify(policyData)
      //   });
      //   const updateData = await updateRes.json();
      //   if (updateRes.ok) {
      //     alert("✅ Policy updated successfully");
      //     loadPoliciesTable();
      //   } else {
      //     alert("❌ " + updateData.message);
      //   }
      // };
    } else {
      alert("❌ " + data.message);
    }
  } catch (err) {
    console.error("Edit policy error:", err);
  }
}

async function deletePolicy(id) {
  if (!confirm("Are you sure you want to delete this policy?")) return;

  try {
    const res = await fetch(`http://localhost:5000/api/policies/${id}`, {
      method: "DELETE",
      credentials: "include"
    });
    const data = await res.json();
    if (res.ok) {
      loadPoliciesTable()
      alert("✅ Policy deleted successfully");
      // loadPoliciesTable(); // refresh list
    } else {
      alert("❌ " + data.message);
    }
  } catch (err) {
    console.error("Delete policy error:", err);
  }
}
function goToSection(section) {
  const navLinks = document.querySelectorAll(".sidebar .nav-link");
  const sections = document.querySelectorAll(".content-section");
  navLinks.forEach(l => l.classList.remove("active"));
  const targetLink = document.querySelector(`.sidebar .nav-link[data-section="${section}"]`);
  if (targetLink) targetLink.classList.add("active");
  sections.forEach(sec => {
    sec.classList.add("d-none");
    sec.style.display = "none";
  });
  const targetSection = document.getElementById(section + "-section");
  if (targetSection) {
    targetSection.classList.remove("d-none");
    targetSection.style.display = "block"; // force block display
  }
}


async function editPolicy(id) {

  try {
    const res = await fetch(`http://localhost:5000/api/policies/${id}`, {
      method: "GET",
      credentials: "include"
    });
    const data = await res.json();
    if (res.ok) {
      const policy = data.data;
      // Populate form fields
      document.getElementById("policyNumber").value = policy.policyNumber;
      document.getElementById("holderName").value = policy.holderName;
      document.getElementById("agentName").value = policy.agentName;
      document.getElementById("policyCompany").value = policy.policyCompany;
      document.getElementById("createDate").value = policy.createDate?.substring(0, 10);
      document.getElementById("policyPremium").value = policy.policyPremium;
      document.getElementById("installmentFreq").value = policy.installmentFreq;
      document.getElementById("planTerm").value = policy.planTerm;
      document.getElementById("endDate").value = policy.endDate?.substring(0, 10);
      document.getElementById("userGmail").value = policy.userGmail;
      document.getElementById("update").value = id;
      goToSection("create-policy");
      // Save with PUT on submit
      // document.getElementById("createPolicyForm").onsubmit = async function (event) {
      //   event.preventDefault();
      //   const formData = new FormData(this);
      //   const policyData = Object.fromEntries(formData.entries());

      //   const updateRes = await fetch(`http://localhost:5000/api/policies/${id}`, {
      //     method: "PUT",
      //     credentials: "include",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify(policyData)
      //   });
      //   const updateData = await updateRes.json();
      //   if (updateRes.ok) {
      //     alert("✅ Policy updated successfully");
      //     loadPoliciesTable();
      //   } else {
      //     alert("❌ " + updateData.message);
      //   }
      // };
    } else {
      alert("❌ " + data.message);
    }
  } catch (err) {
    console.error("Edit policy error:", err);
  }
}
// load policies on page load
document.addEventListener("DOMContentLoaded", loadPoliciesTable);
function loadMyPolicies() {
  const container = document.getElementById("myPoliciesContainer");
  container.innerHTML = "";
  policies.forEach(policy => {
    const statusClass = policy.status === "Active" ? "success" : policy.status === "Pending" ? "warning" : "danger";
    container.innerHTML += `
      <div class="col-md-6 col-lg-4 mb-3">
        <div class="card h-100">
          <div class="card-header d-flex justify-content-between">
            <h6>${policy.id}</h6>
            <span class="badge bg-${statusClass}">${policy.status}</span>
          </div>
          <div class="card-body">
            <h5>${policy.holderName}</h5>
            <p><strong>Type:</strong> ${policy.type}<br>
               <strong>Company:</strong> ${policy.company}<br>
               <strong>Premium:</strong> ${policy.premium}<br>
               <strong>Due:</strong> ${formatDate(policy.dueDate)}</p>
          </div>
        </div>
      </div>
    `;
  });
}
loadMyPolicies();


// function handleCreatePolicy(event) {
//     event.preventDefault(); // prevent form refresh

//     const form = document.getElementById("createPolicyForm");
//     const formData = new FormData(form);

//     // Convert FormData to object
//     const policyData = Object.fromEntries(formData.entries());

//     console.log("Policy Data:", policyData);

//     // Example: send to backend
//     // fetch("/api/policies", {
//     //   method: "POST",
//     //   headers: { "Content-Type": "application/json" },
//     //   body: JSON.stringify(policyData),
//     // });
//   }


async function handleCreatePolicy(event) {
  event.preventDefault();
  const form = document.getElementById("createPolicyForm");
  const formData = new FormData(form);
  const policyData = Object.fromEntries(formData.entries());
  // console.log("Policy Data:", policyData);
  if (!form.reportValidity()) {
    return; // stops if invalid
  }
  try {
    var response = "";
    if (policyData.update != "") {
      response = await fetch(`http://localhost:5000/api/policies/${policyData.update}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(policyData)
      });
    }
    if (policyData.update == "") {
      response = await fetch("http://localhost:5000/api/policies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(policyData),
      });
    }

    if (!response.ok) {
      throw new Error("Failed to save policy");
    }

    const result = await response.json();
    alert("✅ Policy saved successfully!");
    // console.log("API Response:", result);

    // Optionally reset form
    form.reset();
    goToSection("policies");
  } catch (error) {
    console.error("❌ Error:", error);
    alert(error);
  }
}


// function handleQuickAdd() { /* ... reuse your existing code ... */ }
// function handleLogin() { /* ... reuse your existing code ... */ }
// function handleRegister() { /* ... reuse your existing code ... */ }
// function viewPolicy(id) { /* ... */ }
// function editPolicy(id) { /* ... */ }
// function deletePolicy(id) { /* ... */ }
