"use client";
import { ReactElement, useState } from "react";
import Hachure from "../icons/Hachure";
import CrossHatch from "../icons/CrossHatch";
import Solid from "../icons/Solid";
import StrokeWidth from "../icons/StrokeWidth";
import StrokeStyle from "../icons/StrokeStyle";

interface DrawingStyles {
  strokeColor: string;
  backgroundColor: string;
  fillStyle: "hachure" | "cross" | "solid" | null;
  strokeWidth: "thin" | "medium" | "thick" | null;
  strokeStyle: "solid" | "dashed" | "dotted" | null;
}

export default function MainMenu({
  drawingStyles,
  setDrawingStyles,
}: {
  drawingStyles: DrawingStyles;
  setDrawingStyles: (style: DrawingStyles) => void;
}) {
  const colors: string[] = [
    "#e4e4e4",
    "#e03131",
    "#2f9e44",
    "#1971c2",
    "#f08c00",
  ];

  const backgroundColors: string[] = [
    "url(/transparent.png)",
    "#ffc9c9",
    "#b2f2bb",
    "#a5d8ff",
    "#ffec99",
  ];


  return (
    <div
      style={{
        position: "fixed",
        top: 90,
        left: 20,
      }}
      className="h-fit w-56 bg-[#232329] rounded-lg text-white"
    >
      <div className="px-5 py-5 space-y-3">
        <div className="flex flex-col gap-1.5">
          <span className="font-light text-sm">Stroke</span>
          <div className="flex gap-1">
            {colors.map((color, index) => (
              <ColorSquare
                color={color}
                key={index}
                active={drawingStyles.strokeColor === color}
                onClick={() => setDrawingStyles({...drawingStyles, strokeColor:color})}
              />
            ))}
            <div className="h-5 border-r border-gray-300"></div>
            <ColorSquare color="#fff" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-light text-sm">Background</span>
          <div className="flex gap-1">
            {backgroundColors.map((color, index) => (
              <ColorSquare
                color={color}
                key={index}
                active={drawingStyles.backgroundColor === color}
                onClick={() => setDrawingStyles({...drawingStyles, backgroundColor:color})}
              />
            ))}
            <div className="h-5 border-r border-gray-300"></div>
            <ColorSquare color="#fa5252" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-light text-sm">Fill</span>
          <div className="flex gap-1">
            <MenuSquare
              active={drawingStyles.fillStyle === "hachure"}
              onClick={() => setDrawingStyles({...drawingStyles, fillStyle:"hachure"})}
            >
              {<Hachure />}
            </MenuSquare>
            <MenuSquare
              active={drawingStyles.fillStyle === "cross"}
              onClick={() => setDrawingStyles({...drawingStyles, fillStyle:"cross"})}
            >
              {<CrossHatch />}
            </MenuSquare>
            <MenuSquare
              active={drawingStyles.fillStyle === "solid"}
              onClick={() => setDrawingStyles({...drawingStyles,fillStyle:"solid"})}
            >
              {<Solid />}
            </MenuSquare>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-light text-sm">Stoke Width</span>
          <div className="flex gap-1">
            <MenuSquare
              active={drawingStyles.strokeWidth === "thin"}
              onClick={() => setDrawingStyles({...drawingStyles, strokeWidth:"thin"})}
            >
              {<StrokeWidth stokeWidth={1.25} />}
            </MenuSquare>
            <MenuSquare
              active={drawingStyles.strokeWidth === "medium"}
              onClick={() => setDrawingStyles({...drawingStyles, strokeWidth:"medium"})}
            >
              {<StrokeWidth stokeWidth={2.5} />}
            </MenuSquare>
            <MenuSquare
              active={drawingStyles.strokeWidth === "thick"}
              onClick={() => setDrawingStyles({...drawingStyles,strokeWidth:"thick"})}
            >
              {<StrokeWidth stokeWidth={3.75} />}
            </MenuSquare>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-light text-sm">Stocke Style</span>
          <div className="flex gap-1">
            <MenuSquare
              active={drawingStyles.strokeStyle === "solid"}
              onClick={() => setDrawingStyles({...drawingStyles, strokeStyle:"solid"})}
            >
              {<StrokeStyle styleType="solid" />}
            </MenuSquare>
            <MenuSquare
              active={drawingStyles.strokeStyle === "dashed"}
              onClick={() => setDrawingStyles({...drawingStyles, strokeStyle:"dashed"})}
            >
              {<StrokeStyle styleType="dashed" />}
            </MenuSquare>
            <MenuSquare
              active={drawingStyles.strokeStyle === "dotted"}
              onClick={() => setDrawingStyles({...drawingStyles, strokeStyle:"dotted"})}
            >
              {<StrokeStyle styleType="dotted" />}
            </MenuSquare>
          </div>
        </div>
      </div>
    </div>
  );
}

function ColorSquare({
  color,
  onClick,
  active,
}: {
  color: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <div className={`${active ? "outline-1 " : ""} rounded-md p-0`}>
      <div
        style={{ background: color }}
        className={`w-6 h-6 rounded-md border cursor-pointer `}
        onClick={onClick}
      ></div>
    </div>
  );
}

function MenuSquare({
  children,
  active,
  onClick,
}: {
  children: ReactElement;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`w-6 h-6 bg-[#2e2d39] rounded-md p-0.5  flex justify-center items-center cursor-pointer ${active ? "bg-[#726dff]" : ""}`}
    >
      {children}
    </div>
  );
}
