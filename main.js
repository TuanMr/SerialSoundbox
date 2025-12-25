const log = (msg) => {
  document.getElementById("log").textContent += msg + "\n";
};

let transport;
let esptool;

document.getElementById("connect").onclick = async () => {
  try {
    transport = await navigator.serial.requestPort();
    await transport.open({ baudRate: 115200 });

    esptool = new ESPLoader(transport, 115200, log);
    await esptool.main();

    log("✅ Đã kết nối ESP32");
    document.getElementById("flash").disabled = false;
  } catch (e) {
    log("❌ Lỗi kết nối: " + e);
  }
};

document.getElementById("flash").onclick = async () => {
  const fileInput = document.getElementById("firmware");
  if (!fileInput.files.length) {
    alert("Chọn file .bin trước");
    return;
  }

  const file = fileInput.files[0];
  const buffer = await file.arrayBuffer();

  try {
    log("🧹 Erase flash...");
    await esptool.eraseFlash();

    log("⚡ Ghi firmware...");
    await esptool.writeFlash({
      0x1000: new Uint8Array(buffer)
    });

    log("🎉 Nạp firmware thành công!");
  } catch (e) {
    log("❌ Lỗi nạp: " + e);
  }
};
