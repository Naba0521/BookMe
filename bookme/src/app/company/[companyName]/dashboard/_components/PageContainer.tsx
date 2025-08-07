interface PageContainerProps {
  children: React.ReactNode;
}

export const PageContainer = ({ children }: PageContainerProps) => {
  return (
    <div className="w-full h-full min-h-[calc(100vh-80px)] bg-white rounded-xl shadow p-6">
      {children}
    </div>
  );
};
