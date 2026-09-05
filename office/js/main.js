import { drawOffice } from "./drawOffice.js";
import {
  loadStarterOfficeBundle,
  staffById,
} from "./loadOfficeData.js";

function showLoadError(message) {
  const title = document.querySelector(".office-title");

  if (!title) {
    return;
  }

  title.textContent = message;
}

function sizeCanvasToStage(canvas, stage) {
  const width = stage.clientWidth;
  const height = stage.clientHeight;
  const pixelRatio = window.devicePixelRatio || 1;

  canvas.width = Math.floor(width * pixelRatio);
  canvas.height = Math.floor(height * pixelRatio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const context = canvas.getContext("2d");
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

async function startOfficeShell() {
  const stage = document.getElementById("office-stage");
  const canvas = document.getElementById("office-canvas");

  if (!stage || !canvas) {
    throw new Error("Missing office stage or canvas");
  }

  const { office, staff } = await loadStarterOfficeBundle();
  const staffLookup = staffById(staff);
  const title = document.querySelector(".office-title");

  if (title && office.displayName) {
    title.textContent = `Warewolf · ${office.displayName}`;
  }

  function render() {
    sizeCanvasToStage(canvas, stage);
    drawOffice(
      canvas,
      office,
      staffLookup,
      stage.clientWidth,
      stage.clientHeight
    );
  }

  window.addEventListener("resize", render);
  render();
}

startOfficeShell().catch((error) => {
  console.error(error);
  showLoadError(
    "Could not load office data. Serve /office over HTTP."
  );
});
