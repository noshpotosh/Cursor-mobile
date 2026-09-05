import {
  CANVAS_HEIGHT_PX,
  CANVAS_WIDTH_PX,
} from "./constants.js";
import { drawOffice } from "./drawOffice.js";
import {
  loadStarterOfficeBundle,
  staffById,
} from "./loadOfficeData.js";

function showLoadError(message) {
  const hud = document.querySelector(".hud");

  if (!hud) {
    return;
  }

  hud.textContent = message;
}

async function startOfficeShell() {
  const canvas = document.getElementById("office-canvas");

  if (!canvas) {
    throw new Error("Missing #office-canvas");
  }

  canvas.width = CANVAS_WIDTH_PX;
  canvas.height = CANVAS_HEIGHT_PX;

  const { office, staff } = await loadStarterOfficeBundle();
  const staffLookup = staffById(staff);

  drawOffice(canvas, office, staffLookup);
}

startOfficeShell().catch((error) => {
  console.error(error);
  showLoadError(
    "Could not load office data. Serve the office folder over HTTP."
  );
});
