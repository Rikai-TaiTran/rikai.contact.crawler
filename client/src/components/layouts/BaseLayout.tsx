// components/layouts/BaseLayout.tsx
import React from "react";

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="vi">
      <body>
        {children}
      </body>
    </html>
  );
};

export default BaseLayout;
