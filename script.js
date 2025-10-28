// ====== DATA STORAGE ======
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// ====== FORM SUBMIT ======
document.getElementById("expenseForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const category = document.getElementById("category").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);

  if (!category || isNaN(amount) || amount <= 0) {
    alert("Masukkan kategori dan jumlah yang valid!");
    return;
  }

  expenses.push({ category, amount });
  localStorage.setItem("expenses", JSON.stringify(expenses));

  document.getElementById("expenseForm").reset();
  renderList();
  renderCharts();
});

// ====== RENDER LIST ======
function renderList() {
  const list = document.getElementById("expenseList");
  list.innerHTML = "";
  expenses.forEach((e, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span><strong>${e.category}</strong> - Rp ${e.amount.toLocaleString()}</span>
      <button onclick="hapus(${i})">Hapus</button>
    `;
    list.appendChild(li);
  });
}

// ====== HAPUS ITEM ======
function hapus(index) {
  if (confirm("Yakin ingin menghapus data ini?")) {
    expenses.splice(index, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    renderList();
    renderCharts();
  }
}

// ====== GRAFIK ======
let barChart, pieChart;

function renderCharts() {
  const ctxBar = document.getElementById("barChart").getContext("2d");
  const ctxPie = document.getElementById("pieChart").getContext("2d");

  const grouped = {};
  expenses.forEach((e) => {
    grouped[e.category] = (grouped[e.category] || 0) + e.amount;
  });

  const labels = Object.keys(grouped);
  const data = Object.values(grouped);

  // Hapus grafik lama sebelum buat baru
  if (barChart) barChart.destroy();
  if (pieChart) pieChart.destroy();

  // Bar Chart
  barChart = new Chart(ctxBar, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Total Pengeluaran (Rp)",
          data,
          backgroundColor: "#0066cc80",
          borderColor: "#0066cc",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } },
    },
  });

  // Pie Chart
  pieChart = new Chart(ctxPie, {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ["#0066cc", "#ff9800", "#4caf50", "#f44336", "#9c27b0"],
        },
      ],
    },
    options: {
      responsive: true,
    },
  });
}

// ====== INISIALISASI ======
renderList();
renderCharts();
