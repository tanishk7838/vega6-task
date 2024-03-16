import React, { useEffect, useState } from "react";
import { fabric } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import "./Canvas.css";
export default function Canvas({ src }) {
  const { editor, onReady } = useFabricJSEditor();

  const history = [];
  const [color, setColor] = useState("#35363a");
  const [cropImage, setCropImage] = useState(true);

  useEffect(() => {
    if (!editor || !fabric) {
      return;
    }

    if (cropImage) {
      editor.canvas.__eventListeners = {};
      return;
    }

    if (!editor.canvas.__eventListeners["mouse:wheel"]) {
      editor.canvas.on("mouse:wheel", function (opt) {
        var delta = opt.e.deltaY;
        var zoom = editor.canvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        editor.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
      });
    }

    if (!editor.canvas.__eventListeners["mouse:down"]) {
      editor.canvas.on("mouse:down", function (opt) {
        var evt = opt.e;
        if (evt.ctrlKey === true) {
          this.isDragging = true;
          this.selection = false;
          this.lastPosX = evt.clientX;
          this.lastPosY = evt.clientY;
        }
      });
    }

    if (!editor.canvas.__eventListeners["mouse:move"]) {
      editor.canvas.on("mouse:move", function (opt) {
        if (this.isDragging) {
          var e = opt.e;
          var vpt = this.viewportTransform;
          vpt[4] += e.clientX - this.lastPosX;
          vpt[5] += e.clientY - this.lastPosY;
          this.requestRenderAll();
          this.lastPosX = e.clientX;
          this.lastPosY = e.clientY;
        }
      });
    }

    if (!editor.canvas.__eventListeners["mouse:up"]) {
      editor.canvas.on("mouse:up", function (opt) {
        this.setViewportTransform(this.viewportTransform);
        this.isDragging = false;
        this.selection = true;
      });
    }

    editor.canvas.renderAll();
  }, [editor]);

  const addBackground = () => {
    if (!editor || !fabric) {
      return;
    }

    fabric.Image.fromURL(`${src}`, (image) => {
      editor.canvas.setBackgroundImage(
        image,
        editor.canvas.renderAll.bind(editor.canvas)
      );
    });
  };

  useEffect(() => {
    if (!editor || !fabric) {
      return;
    }
    editor.canvas.setHeight(500);
    editor.canvas.setWidth(500);
    addBackground();
    editor.canvas.renderAll();
  }, [editor?.canvas.backgroundImage]);

  const toggleSize = () => {
    editor.canvas.freeDrawingBrush.width === 12
      ? (editor.canvas.freeDrawingBrush.width = 5)
      : (editor.canvas.freeDrawingBrush.width = 12);
  };

  useEffect(() => {
    if (!editor || !fabric) {
      return;
    }
    editor.canvas.freeDrawingBrush.color = color;
    editor.setStrokeColor(color);
  }, [color]);

  const toggleDraw = () => {
    editor.canvas.isDrawingMode = !editor.canvas.isDrawingMode;
  };
  const undo = () => {
    if (editor.canvas._objects.length > 0) {
      history.push(editor.canvas._objects.pop());
    }
    editor.canvas.renderAll();
  };
  const redo = () => {
    if (history.length > 0) {
      editor.canvas.add(history.pop());
    }
  };

  const clear = () => {
    editor.canvas._objects.splice(0, editor.canvas._objects.length);
    history.splice(0, history.length);
    editor.canvas.renderAll();
  };

  const removeSelectedObject = () => {
    editor.canvas.remove(editor.canvas.getActiveObject());
  };

  const onAddCircle = () => {
    editor.addCircle();
  };
  const onAddRectangle = () => {
    editor.addRectangle();
  };
  const addText = () => {
    editor.addText("inset text");
  };

  const onAddTriangle = () => {
    const triangle = new fabric.Triangle({
      width: 150,
      height: 100,
      fill: "",
      stroke: "black",
      strokeWidth: 3,
      cornerColor: "blue",
      angle: 0,
    });

    editor.canvas.add(triangle)
  };

  const onAddPolygon = () =>{
    const polygon = new fabric.Polygon([ 
      { x: 200, y: 10 }, 
      { x: 250, y: 50 }, 
      { x: 250, y: 180}, 
      { x: 150, y: 180}, 
      { x: 150, y: 50 }], { 
          fill: '' ,
          stroke: "black",
          strokeWidth: 3
      });
      editor.canvas.add(polygon)
  }

  const downloadSVG = (svgString) => {
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "my_canvas_image.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  };

  const download_img = () => {
    const svgString = editor.canvas.toSVG();
    downloadSVG(svgString);
  };

  return (
    <div className="App">
      <h1>Edit your image in canvas</h1>
      <div className="app-btn">
        <button onClick={onAddCircle}>Add circle</button>
        <button onClick={onAddRectangle} disabled={!cropImage}>
          Add Rectangle
        </button>
        <button onClick={onAddTriangle} disabled={!cropImage}>
          Add Triangle
        </button>
        <button onClick={onAddPolygon} disabled={!cropImage}>
          Add Polygon
        </button>
        <button onClick={addText} disabled={!cropImage}>
          Add Text
        </button>
        <button onClick={toggleDraw} disabled={!cropImage}>
          Toggle draw
        </button>
        <button onClick={clear} disabled={!cropImage}>
          Clear
        </button>
        <button onClick={undo} disabled={!cropImage}>
          Undo
        </button>
        <button onClick={redo} disabled={!cropImage}>
          Redo
        </button>
        <button onClick={toggleSize} disabled={!cropImage}>
          ToggleSize
        </button>
        <button onClick={removeSelectedObject} disabled={!cropImage}>
          Delete
        </button>
        <button onClick={(e) => setCropImage(!cropImage)}>Crop</button>
        <label disabled={!cropImage}>
          <input
            disabled={!cropImage}
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </label>
        <button onClick={download_img} disabled={!cropImage}>
          {" "}
          Download as svg
        </button>
      </div>
      <div
        style={{
          border: `3px ${!cropImage ? "dotted" : "solid"} Green`,
          width: "500px",
          height: "600px",
          marginTop: "-500px",
          marginLeft: "50px",
        }}
      >
        <FabricJSCanvas className="sample-canvas" onReady={onReady} />
      </div>
    </div>
  );
}
