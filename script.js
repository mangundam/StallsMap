document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector(".map-container");
  const stallsContainer = document.getElementById("stalls");
  const tooltip = document.getElementById("tooltip");
  const userDot = document.getElementById("user-location");
  
  const gpsBounds = {
    topLeft: { lat: 25.035162, lng: 121.524405 },
    topRight: { lat: 25.035162, lng: 121.524855 },
    bottomLeft: { lat: 25.034466, lng: 121.524102 },
    bottomRight: { lat: 25.034466, lng: 121.524647 },
  };
  
  // 載入攤位資料
  const response = await fetch("data/stalls.json");
  const stalls = await response.json();
  
  // 建立每個攤位按鈕
  stalls.forEach((stall) => {
    const el = document.createElement("div");
    el.classList.add("stall");
    el.style.left = stall.x + "%";
    el.style.top = stall.y + "%";
    el.title = stall.name;

    el.addEventListener("click", (e) => {
      tooltip.innerHTML = `
        <strong>${stall.name}</strong><br>
        <b>申請班級：</b>${stall.class}<br>
        <b>販賣類別：</b>${stall.type}<br>
        <b>販賣內容：</b>${stall.items}
      `;
      //tooltip.style.left = `calc(${stall.x}% + 3%)`;
      //tooltip.style.top = `calc(${stall.y}% + 3%)`;
	  //tooltip.style.left = `calc(40%)`;
      //tooltip.style.top = `calc(40%)`;
	  tooltip.style.left = stall.x + "%";
	  //tooltip.style.top = `calc(${stall.y}%-10%)`;
      tooltip.classList.remove("hidden");
    });

    stallsContainer.appendChild(el);
  });

  // 點擊地圖其他地方關閉浮動框
  container.addEventListener("click", (e) => {
    if (!e.target.classList.contains("stall")) {
      tooltip.classList.add("hidden");
    }
  });
});
// 顯示座標
function showLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        alert(`目前座標：\n緯度：${lat}\n經度：${lng}`);
        updateUserPosition(lat, lng);
      },
      (err) => {
        alert("無法取得定位：" + err.message);
      }
    );
  } else {
    alert("此裝置不支援GPS定位");
  }
}

// 將 GPS 轉換為地圖上的百分比位置
function updateUserPosition(lat, lng) {
  const userDot = document.getElementById("user-location");
  const map = document.getElementById("map");
  const bounds = {
    top: 25.035162,
    bottom: 25.034466,
    left: 121.524102,
    right: 121.524855,
  };

  // 緯度、經度轉換為百分比（簡化線性映射）
  const xPercent = ((lng - bounds.left) / (bounds.right - bounds.left)) * 100;
  const yPercent = ((bounds.top - lat) / (bounds.top - bounds.bottom)) * 100;

  userDot.style.left = `${xPercent}%`;
  userDot.style.top = `${yPercent}%`;
  userDot.style.display = "block";
}