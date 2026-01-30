"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useImageStore } from "../model/useImageStore";
import { TextLayer } from "../model/types";
import { screenToRelativeCoords, relativeToScreenCoords } from "../lib/text-utils";

interface TextLayerOverlayProps {
  displayScale: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function TextLayerOverlay({ displayScale, containerRef }: TextLayerOverlayProps) {
  const {
    textLayers,
    selectedTextLayerId,
    selectTextLayer,
    updateTextLayer,
    currentSize,
    originalSize,
  } = useImageStore();

  const imageWidth = currentSize?.width || originalSize?.width || 0;
  const imageHeight = currentSize?.height || originalSize?.height || 0;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {textLayers.map((layer) => (
        <DraggableTextLayer
          key={layer.id}
          layer={layer}
          isSelected={layer.id === selectedTextLayerId}
          displayScale={displayScale}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
          containerRef={containerRef}
          onSelect={() => selectTextLayer(layer.id)}
          onUpdate={(updates) => updateTextLayer(layer.id, updates)}
        />
      ))}
    </div>
  );
}

interface DraggableTextLayerProps {
  layer: TextLayer;
  isSelected: boolean;
  displayScale: number;
  imageWidth: number;
  imageHeight: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onSelect: () => void;
  onUpdate: (updates: Partial<Omit<TextLayer, "id">>) => void;
}

function DraggableTextLayer({
  layer,
  isSelected,
  displayScale,
  imageWidth,
  imageHeight,
  containerRef,
  onSelect,
  onUpdate,
}: DraggableTextLayerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const screenPosition = relativeToScreenCoords(
    layer.x,
    layer.y,
    displayScale,
    imageWidth,
    imageHeight
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onSelect();

      const rect = elementRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left - rect.width / 2,
          y: e.clientY - rect.top - rect.height / 2,
        });
      }
      setIsDragging(true);
    },
    [onSelect]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const newPos = screenToRelativeCoords(
        e.clientX - dragOffset.x,
        e.clientY - dragOffset.y,
        rect,
        displayScale,
        imageWidth,
        imageHeight
      );

      onUpdate({ x: newPos.x, y: newPos.y });
    },
    [isDragging, containerRef, dragOffset, displayScale, imageWidth, imageHeight, onUpdate]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const fontStyle = layer.italic ? "italic" : "normal";
  const fontWeight = layer.bold ? "bold" : "normal";

  return (
    <div
      ref={elementRef}
      className={`absolute pointer-events-auto cursor-move select-none ${
        isSelected ? "ring-2 ring-primary ring-offset-2" : ""
      }`}
      style={{
        left: screenPosition.x,
        top: screenPosition.y,
        transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
        fontSize: layer.fontSize * displayScale,
        fontFamily: layer.fontFamily,
        fontStyle,
        fontWeight,
        color: layer.color,
        opacity: layer.opacity,
        textAlign: layer.alignment,
        whiteSpace: "pre-wrap",
        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
        zIndex: isSelected ? 10 : 1,
      }}
      onMouseDown={handleMouseDown}
    >
      {layer.text}
    </div>
  );
}
