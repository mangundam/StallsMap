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
	if (stall.name=="HBL投籃機"){
		el.classList.add("HBL");
	}
    el.addEventListener("click", (e) => {
      tooltip.innerHTML = `
        <strong>${stall.name}</strong><br>
        <b>班級：</b>${stall.class}<br>
        <b>類別：</b>${stall.type}<br>
        <b>內容：</b>${stall.items}
      `;
      //tooltip.style.left = `calc(${stall.x}% + 3%)`;
      //tooltip.style.top = `calc(${stall.y}% + 3%)`;
	  tooltip.style.left = stall.x + "%";
	  //tooltip.style.top = `calc(${stall.y}%-10%)`;
	  if (stall.name=="HBL投籃機"){
		tooltip.classList.add("HBLtooltip");
	  }
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
  // 啟用 GPS 持續更新
  startGPSWatch();
});
// ====== GPS 功能 ======
function startGPSWatch() {
  if (!navigator.geolocation) {
    alert("此裝置不支援 GPS 定位");
    return;
  }

  // 持續監看位置變化
  navigator.geolocation.watchPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      updateUserPosition(lat, lng);
    },
    (err) => {
      console.warn("定位錯誤:", err.message);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 1000,
      timeout: 10000,
    }
  );
}

// 將 GPS 轉換為地圖上的百分比位置
function updateUserPosition(lat, lng) {
  const userDot = document.getElementById("user-location");

  // 四個角的 GPS 座標
  const gps = {
    topLeft: { lat: 25.035162, lng: 121.524405 },
    topRight: { lat: 25.035162, lng: 121.524855 },
    bottomLeft: { lat: 25.034466, lng: 121.524102 },
    bottomRight: { lat: 25.034466, lng: 121.524647 },
  };

  // 將 GPS 轉為平面座標（簡化，視為線性投影）
  const xRatio = (lng - gps.bottomLeft.lng) / (gps.bottomRight.lng - gps.bottomLeft.lng);
  const yRatio = (lat - gps.bottomLeft.lat) / (gps.topLeft.lat - gps.bottomLeft.lat);

  // 套用旋轉補償（線性插值）
  const topLng = gps.topLeft.lng + (gps.topRight.lng - gps.topLeft.lng) * xRatio;
  const bottomLng = gps.bottomLeft.lng + (gps.bottomRight.lng - gps.bottomLeft.lng) * xRatio;
  const leftLat = gps.bottomLeft.lat + (gps.topLeft.lat - gps.bottomLeft.lat) * yRatio;
  const rightLat = gps.bottomRight.lat + (gps.topRight.lat - gps.bottomRight.lat) * yRatio;

  // X/Y 百分比
  const xPercent = ((lng - bottomLng) / (topLng - bottomLng)) * 100;
  const yPercent = (1 - ((lat - leftLat) / (rightLat - leftLat))) * 100;

  // 更新畫面
  userDot.style.left = `${xPercent}%`;
  userDot.style.top = `${yPercent}%`;
  userDot.style.display = "block";
}

// 單次顯示座標（可手動呼叫）
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