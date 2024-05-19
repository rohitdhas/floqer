import React from "react";

type Props = {
  title: string;
  className?: string;
  children: React.ReactNode;
};

export default function Card(props: Props) {
  return (
    <div
      className={`${props.className} bg-white rounded-md shadow-md px-4 py-2 mt-2 flex-1`}
    >
      <h2 className="text-xl font-bold">{props.title}</h2>
      {props.children}
    </div>
  );
}
