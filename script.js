document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector(".map-container");
  const stallsContainer = document.getElementById("stalls");
  const tooltip = document.getElementById("tooltip");

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

  // GPS 定位
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      const userDot = document.getElementById("user-location");
      // 模擬放置在地圖底部中間
      userDot.style.left = "50%";
      userDot.style.top = "90%";
      userDot.style.display = "block";
    });
  }
});
function showLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        alert(`目前座標：\n緯度：${latitude}\n經度：${longitude}`);
      },
      (err) => {
        alert("無法取得定位：" + err.message);
      }
    );
  } else {
    alert("此裝置不支援GPS定位");
  }
}