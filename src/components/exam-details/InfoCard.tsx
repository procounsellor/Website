import React from 'react';

type Props = {
  title: string;
  children: React.ReactNode;
};

export function InfoCard({ title, children }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-bold text-[#343C6A]">{title}</h3>
      <div className="mt-2">
        {children}
      </div>
    </div>
  );
}